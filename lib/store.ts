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
  toolStatus: string | null;
  isSpeakEnabled: boolean;
  useLocalAI: boolean;
  localAIModel: string;
  
  // Actions
  setMessagesToDisplayCount: (count: number | ((prev: number) => number)) => void;
  setAllMessagesFromDB: (messages: ChatMessageType[]) => void;
  setMessages: (messages: ChatMessageType[]) => void;
  setConversationTitle: (title: string) => void;
  setInput: (input: string | ((prev: string) => string)) => void;
  setLoading: (loading: boolean) => void;
  setToolStatus: (status: string | null) => void;
  setIsSpeakEnabled: (enabled: boolean) => void;
  setUseLocalAI: (useLocal: boolean) => void;
  setLocalAIModel: (model: string) => void;
  resetChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messagesToDisplayCount: 20,
  allMessagesFromDB: [],
  messages: [],
  conversationTitle: 'Loading...',
  input: '',
  loading: false,
  toolStatus: null,
  isSpeakEnabled: false,
  useLocalAI: false,
  localAIModel: "Phi-3-mini-4k-instruct-q4f16_1-MLC",

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
  setToolStatus: (status) => set({ toolStatus: status }),
  setIsSpeakEnabled: (enabled) => set({ isSpeakEnabled: enabled }),
  setUseLocalAI: (useLocal) => set({ useLocalAI: useLocal }),
  setLocalAIModel: (model) => set({ localAIModel: model }),
  resetChat: () => set((state) => ({
    messagesToDisplayCount: 20,
    allMessagesFromDB: [],
    messages: [],
    conversationTitle: 'Loading...',
    input: '',
    loading: false,
    toolStatus: null,
    isSpeakEnabled: state.isSpeakEnabled,
    useLocalAI: state.useLocalAI,
    localAIModel: state.localAIModel,
  })),
}));
