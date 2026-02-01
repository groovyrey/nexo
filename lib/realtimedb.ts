import { database } from "./firebase";
import { ref, set, onValue, push, query, limitToLast } from "firebase/database";

// A function to write a new message to a conversation
export const writeMessage = (userId: string, conversationId: string, message: { role: string; content: string; timestamp: number }) => {
  const messagesRef = ref(database, `conversations/${userId}/${conversationId}/messages`);
  const newMessageRef = push(messagesRef);
  set(newMessageRef, { ...message, timestamp: Date.now() });
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
