import { database } from "./firebase";
import { ref, set, onValue, push, query, limitToLast, get, remove, orderByChild, child, update } from "firebase/database"; // Added update

export interface ConversationMetadata {
  id: string; // The conversation ID (key of the node)
  title: string;
  lastMessageSnippet: string;
  timestamp: number;
  firstMessageId?: string; // Optional: ID of the first user message, used to set the conversation title
}

export const createConversation = async (
  userId: string,
  initialTitle: string,
  conversationId?: string // New optional parameter
): Promise<string> => {
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
  });

  // Also create an empty 'messages' sub-node to ensure path exists for later messages
  await set(child(newConversationNodeRef, 'messages'), {}); // Use child instead of ref directly on conversationsRef

  return finalConversationId;
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
  const messagesRef = ref(database, `conversations/${userId}/${conversationId}/messages`);
  const messageWithTimestamp = { ...message, timestamp: Date.now() };

  // Get current messages to check count and identify oldest if needed
  const snapshot = await get(query(messagesRef, orderByChild('timestamp')));
  const currentMessages: { key: string; timestamp: number }[] = [];
  snapshot.forEach((childSnapshot) => {
    currentMessages.push({ key: childSnapshot.key as string, ...childSnapshot.val() });
  });

  // If there are already 20 or more messages, remove the oldest one
  if (currentMessages.length >= 20) {
    currentMessages.sort((a, b) => a.timestamp - b.timestamp); // Ensure sorted by timestamp
    const oldestMessageKey = currentMessages[0].key;
    await remove(child(messagesRef, oldestMessageKey));
  }

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
};

// A function to get all messages from a conversation and listen for new ones
export const getConversation = (userId: string, conversationId:string, callback: (messages: { role: string; content: string; timestamp: number }[]) => void): (() => void) => {
  const messagesRef = query(ref(database, `conversations/${userId}/${conversationId}/messages`), limitToLast(20));
  return onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const messages = data ? Object.values(data) as { role: string; content: string; timestamp: number }[] : [];
    callback(messages);
  });
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