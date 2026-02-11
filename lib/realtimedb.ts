import { database } from "./firebase";
import { ref, set, onValue, push, query, limitToLast, get, remove, orderByChild, child, update } from "firebase/database"; // Added update
import { logIncident } from "./incidents";

export interface ConversationMetadata {
  id: string; // The conversation ID (key of the node)
  title: string;
  lastMessageSnippet: string;
  timestamp: number;
  firstMessageId?: string; // Optional: ID of the first user message, used to set the conversation title
  isSpeakEnabled?: boolean;
  modernize?: boolean;
  voiceLanguage?: string;
  temperature?: number;
  textSize?: string;
}

export const createConversation = async (
  userId: string,
  initialTitle: string,
  conversationId?: string // New optional parameter
): Promise<string> => {
  try {
    const conversationsRef = ref(database, `conversations/${userId}`);
    let finalConversationId: string;
    let newConversationNodeRef;

    if (conversationId) {
      newConversationNodeRef = child(conversationsRef, conversationId);
      finalConversationId = conversationId;
    } else {
      newConversationNodeRef = push(conversationsRef);
      finalConversationId = newConversationNodeRef.key!;
    }

    // Check if conversation already exists (only if a specific ID is provided)
    if (conversationId) {
      const existingConvo = await get(newConversationNodeRef);
      if (existingConvo.exists()) {
        // If it exists, don't re-create metadata, just ensure messages node exists
        await set(child(newConversationNodeRef, 'messages'), {});
        return finalConversationId;
      }
    }

    // Initialize metadata directly under the new conversationId node
    await set(newConversationNodeRef, {
      title: initialTitle,
      lastMessageSnippet: "",
      timestamp: Date.now(),
      firstMessageId: null, // Initialize firstMessageId to null
      isSpeakEnabled: false,
      modernize: true,
      voiceLanguage: 'en-US',
      temperature: 0.7,
      textSize: 'medium',
    });

    // Also create an empty 'messages' sub-node to ensure path exists for later messages
    await set(child(newConversationNodeRef, 'messages'), {}); // Use child instead of ref directly on conversationsRef

    return finalConversationId;
  } catch (error: any) {
    await logIncident('DB_CREATE_CONVO_ERROR', 'createConversation', error.message);
    throw error;
  }
};

export const getConversationList = (userId: string, callback: (conversations: ConversationMetadata[]) => void): (() => void) => {
  const conversationsRef = ref(database, `conversations/${userId}`);
  return onValue(conversationsRef, (snapshot) => {
    const data = snapshot.val();
    const conversations: ConversationMetadata[] = [];
    if (data) {
      Object.keys(data).forEach(conversationId => {
        const convoData = data[conversationId];
        // Ensure it has metadata properties (e.g., if only 'messages' sub-node exists from a malformed entry)
        // If convoData exists but has no title, assume it's an "Untitled Conversation"
        // This handles cases where only 'messages' sub-node exists for old or malformed entries
        conversations.push({
          id: conversationId,
          title: convoData?.title || "Untitled Conversation", // Provide a default title
          lastMessageSnippet: convoData?.lastMessageSnippet || "", // Default to empty string if missing
          timestamp: convoData?.timestamp || 0, // Default to 0 or a suitable default if missing
        });
      });
    }
    conversations.sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp for most recent first
    callback(conversations);
  });
};


// A function to write a new message to a conversation
export const writeMessage = async (userId: string, conversationId: string, message: { role: string; content: string; timestamp?: number }) => {
  try {
    const messagesRef = ref(database, `conversations/${userId}/${conversationId}/messages`);
    
    // Ensure content is a string, default to empty string if undefined or null
    const safeContent = message.content === undefined || message.content === null ? "" : String(message.content);
    
    const messageWithTimestamp = { ...message, content: safeContent, timestamp: Date.now() };

    // Push the new message
    const newMessageRef = push(messagesRef);
    await set(newMessageRef, messageWithTimestamp);

    // Update conversation metadata (directly on the conversationId node)
    const conversationNodeRef = ref(database, `conversations/${userId}/${conversationId}`);

    // Fetch current conversation metadata to check if title needs to be set
    const conversationSnapshot = await get(conversationNodeRef);
    const currentConversationMetadata = conversationSnapshot.val();

    console.log("writeMessage: message.role:", message.role);
    console.log("writeMessage: currentConversationMetadata.firstMessageId:", currentConversationMetadata?.firstMessageId);

    const updates: { [key: string]: any } = {
      lastMessageSnippet: message.content.substring(0, 100) + (message.content.length > 100 ? "..." : ""), // First 100 chars
      timestamp: Date.now(),
    };

    // If this is the first user message and the title hasn't been set yet (firstMessageId is null)
    if (message.role === 'user' && (!currentConversationMetadata || currentConversationMetadata.firstMessageId === null)) {
      updates.title = message.content.substring(0, 50) + (message.content.length > 50 ? "..." : ""); // Use first 50 chars as title
      updates.firstMessageId = newMessageRef.key; // Store the key of this message as the first message
      console.log("writeMessage: Updating title and firstMessageId:", updates);
    }

    await update(conversationNodeRef, updates);
  } catch (error: any) {
    await logIncident('DB_WRITE_MESSAGE_ERROR', 'writeMessage', error.message);
    throw error;
  }
};

// A function to get all messages from a conversation and listen for new ones
export const getConversation = (userId: string, conversationId:string, callback: (messages: { role: string; content: string; timestamp: number }[]) => void): (() => void) => {
  const messagesRef = query(ref(database, `conversations/${userId}/${conversationId}/messages`), orderByChild('timestamp'));
  return onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const messages = data ? Object.values(data) as { role: string; content: string; timestamp: number }[] : [];
    callback(messages);
  });
};

export const writeMemoryToConversation = async (userId: string, conversationId: string, content: string) => {
  const consolidatedMemoryRef = ref(database, `conversations/${userId}/${conversationId}/consolidatedMemory`);
  await set(consolidatedMemoryRef, content); // Store the entire string
  return `Memory updated. Current memory content: "${content}"`;
};

export const retrieveConsolidatedMemory = async (userId: string, conversationId: string): Promise<string | null> => {
  const consolidatedMemoryRef = ref(database, `conversations/${userId}/${conversationId}/consolidatedMemory`);
  const snapshot = await get(consolidatedMemoryRef);
  const memoryContent = snapshot.val();
  return memoryContent ? String(memoryContent) : null;
};

export const deleteConversation = async (userId: string, conversationId: string) => {
  const conversationNodeRef = ref(database, `conversations/${userId}/${conversationId}`);
  await remove(conversationNodeRef);
};

export const getConversationMetadata = (userId: string, conversationId: string, callback: (metadata: ConversationMetadata) => void): (() => void) => {
  const conversationNodeRef = ref(database, `conversations/${userId}/${conversationId}`);
  return onValue(conversationNodeRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback({
        id: conversationId,
        title: data.title || "Untitled Conversation",
        lastMessageSnippet: data.lastMessageSnippet || "",
        timestamp: data.timestamp || 0,
        firstMessageId: data.firstMessageId || null,
        isSpeakEnabled: data.isSpeakEnabled !== undefined ? data.isSpeakEnabled : false,
        modernize: data.modernize !== undefined ? data.modernize : true,
        voiceLanguage: data.voiceLanguage || 'en-US',
        temperature: data.temperature !== undefined ? data.temperature : 0.7,
        textSize: data.textSize || 'medium',
      });
    }
  });
};
export const updateConversationTitle = async (userId: string, conversationId: string, newTitle: string) => {
  const conversationNodeRef = ref(database, `conversations/${userId}/${conversationId}`);
  await update(conversationNodeRef, {
    title: newTitle,
  });
};

export const updateConversationSpeakStatus = async (userId: string, conversationId: string, isSpeakEnabled: boolean) => {
  const conversationNodeRef = ref(database, `conversations/${userId}/${conversationId}`);
  await update(conversationNodeRef, {
    isSpeakEnabled: isSpeakEnabled,
  });
};

export const updateConversationModernize = async (userId: string, conversationId: string, modernize: boolean) => {
  const conversationNodeRef = ref(database, `conversations/${userId}/${conversationId}`);
  await update(conversationNodeRef, { modernize });
};

export const updateConversationVoiceLanguage = async (userId: string, conversationId: string, voiceLanguage: string) => {
  const conversationNodeRef = ref(database, `conversations/${userId}/${conversationId}`);
  await update(conversationNodeRef, { voiceLanguage });
};

export const updateConversationTemperature = async (userId: string, conversationId: string, temperature: number) => {
  const conversationNodeRef = ref(database, `conversations/${userId}/${conversationId}`);
  await update(conversationNodeRef, { temperature });
};

export const updateConversationTextSize = async (userId: string, conversationId: string, textSize: string) => {
  const conversationNodeRef = ref(database, `conversations/${userId}/${conversationId}`);
  await update(conversationNodeRef, { textSize });
};

export interface ConversationStats {
  id: string;
  title: string;
  messageCount: number;
  lastMessageSnippet: string;
  timestamp: number;
}

export interface MessageStats {
  totalMessages: number;
  mostMessagesConvo: { title: string; messageCount: number; lastMessageSnippet: string; timestamp: number } | null;
  leastMessagesConvo: { title: string; messageCount: number; lastMessageSnippet: string; timestamp: number } | null;
  allConversationsStats: ConversationStats[]; // New field for the graph
}

export const getMessageStats = async (userId: string): Promise<MessageStats> => {
  const conversationsRef = ref(database, `conversations/${userId}`);
  const conversationsSnapshot = await get(conversationsRef);
  const conversationsData = conversationsSnapshot.val();

  if (!conversationsData) {
    return {
      totalMessages: 0,
      mostMessagesConvo: null,
      leastMessagesConvo: null,
      allConversationsStats: [],
    };
  }

  let totalMessages = 0;
  let mostMessagesConvo: { title: string; messageCount: number; lastMessageSnippet: string; timestamp: number } | null = null;
  let leastMessagesConvo: { title: string; messageCount: number; lastMessageSnippet: string; timestamp: number } | null = null;
  const allConversationsStats: ConversationStats[] = [];

  for (const conversationId of Object.keys(conversationsData)) {
    const messagesRef = ref(database, `conversations/${userId}/${conversationId}/messages`);
    const messagesSnapshot = await get(messagesRef);
    const messagesData = messagesSnapshot.val();
    const currentConvoMessageCount = messagesData ? Object.keys(messagesData).length : 0;
    const conversationTitle = conversationsData[conversationId]?.title || "Untitled Conversation";
    const conversationLastMessageSnippet = conversationsData[conversationId]?.lastMessageSnippet || "No messages yet.";
    const conversationTimestamp = conversationsData[conversationId]?.timestamp || 0;

    totalMessages += currentConvoMessageCount;

    const currentConvoStats: ConversationStats = {
      id: conversationId,
      title: conversationTitle,
      messageCount: currentConvoMessageCount,
      lastMessageSnippet: conversationLastMessageSnippet,
      timestamp: conversationTimestamp,
    };
    allConversationsStats.push(currentConvoStats);


    if (!mostMessagesConvo || currentConvoMessageCount > mostMessagesConvo.messageCount) {
      mostMessagesConvo = {
        title: conversationTitle,
        messageCount: currentConvoMessageCount,
        lastMessageSnippet: conversationLastMessageSnippet,
        timestamp: conversationTimestamp,
      };
    }

    if (!leastMessagesConvo || currentConvoMessageCount < leastMessagesConvo.messageCount) {
      leastMessagesConvo = {
        title: conversationTitle,
        messageCount: currentConvoMessageCount,
        lastMessageSnippet: conversationLastMessageSnippet,
        timestamp: conversationTimestamp,
      };
    }
  }

  allConversationsStats.sort((a, b) => b.messageCount - a.messageCount); // Sort by message count descending

  return { totalMessages, mostMessagesConvo, leastMessagesConvo, allConversationsStats };
};