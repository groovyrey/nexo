import { database } from "./firebase";
import { ref, set, onValue, push, query, limitToLast, get, remove, orderByChild, child } from "firebase/database";

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
};

// A function to get all messages from a conversation and listen for new ones
export const getConversation = (userId: string, conversationId:string, callback: (messages: { role: string; content: string; timestamp: number }[]) => void) => {
  const messagesRef = query(ref(database, `conversations/${userId}/${conversationId}/messages`), limitToLast(20));
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const messages = data ? Object.values(data) as { role: string; content: string; timestamp: number }[] : [];
    callback(messages);
  });
};
