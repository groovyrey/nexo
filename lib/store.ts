import { create } from 'zustand';

export interface ChatMessageType {
  role: string;
  content: string;
  timestamp: number;
  toolUsed?: string | null;
  toolOutput?: any;
}

interface ChatState {
  messagesToDisplayCount: number;
  allMessagesFromDB: ChatMessageType[];
  messages: ChatMessageType[];
  conversationTitle: string;
  input: string;
  loading: boolean;
  isSpeakEnabled: boolean;
  
  // Actions
  setMessagesToDisplayCount: (count: number | ((prev: number) => number)) => void;
  setAllMessagesFromDB: (messages: ChatMessageType[]) => void;
  setMessages: (messages: ChatMessageType[]) => void;
  setConversationTitle: (title: string) => void;
  setInput: (input: string | ((prev: string) => string)) => void;
  setLoading: (loading: boolean) => void;
  setIsSpeakEnabled: (enabled: boolean) => void;
  resetChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messagesToDisplayCount: 20,
  allMessagesFromDB: [],
  messages: [],
  conversationTitle: 'Loading...',
  input: '',
  loading: false,
  isSpeakEnabled: false,

  setMessagesToDisplayCount: (count) => 
    set((state) => ({ 
      messagesToDisplayCount: typeof count === 'function' ? count(state.messagesToDisplayCount) : count 
    })),
  setAllMessagesFromDB: (messages) => set({ allMessagesFromDB: messages }),
  setMessages: (messages) => set({ messages }),
  setConversationTitle: (title) => set({ conversationTitle: title }),
  setInput: (input) => 
    set((state) => ({ 
      input: typeof input === 'function' ? input(state.input) : input 
    })),
  setLoading: (loading) => set({ loading }),
  setIsSpeakEnabled: (enabled) => set({ isSpeakEnabled: enabled }),
  resetChat: () => set({
    messagesToDisplayCount: 20,
    allMessagesFromDB: [],
    messages: [],
    conversationTitle: 'Loading...',
    input: '',
    loading: false,
    isSpeakEnabled: false,
  }),
}));
