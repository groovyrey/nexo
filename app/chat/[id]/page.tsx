"use client";
import React, { useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import ChatMessage from '../components/ChatMessage';
import { useAuthContext } from '@/lib/context';
import { useChatStore, ChatMessageType } from '@/lib/store';
import { getConversation, writeMessage, getConversationMetadata, createConversation, updateConversationSpeakStatus } from '@/lib/realtimedb';
import { database } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ButtonBase from '@mui/material/ButtonBase';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const ChatPage = () => {
  const authContext = useAuthContext();
  const router = useRouter();
  const { id: conversationId } = useParams();

  const { data: locationData } = useQuery({
    queryKey: ['location'],
    queryFn: async () => {
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) throw new Error('Failed to fetch location');
      return res.json();
    },
    staleTime: Infinity,
  });

  const {
    messagesToDisplayCount,
    setMessagesToDisplayCount,
    allMessagesFromDB,
    setAllMessagesFromDB,
    messages,
    setMessages,
    conversationTitle,
    setConversationTitle,
    input,
    setInput,
    loading,
    setLoading,
    toolStatus,
    setToolStatus,
    isSpeakEnabled,
    setIsSpeakEnabled,
    resetChat
  } = useChatStore();

  if (!authContext) return null;
  const { user } = authContext;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSpokenTimestampRef = useRef<number>(0);

  const speak = (text: string) => {
    if (!isSpeakEnabled || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    
    // Clean up text: remove markdown artifacts for smoother reading
    const cleanText = text
      .replace(/[*_#`]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Try to find a high-quality "Google" or "Microsoft" or "Natural" voice
    const preferredVoice = voices.find(v => 
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium')) && 
      v.lang.startsWith('en')
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Adjust parameters for a more human-like rhythm
    utterance.rate = 1.0;  // Slightly slower/standard rate
    utterance.pitch = 1.0; // Standard pitch
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isSpeakEnabled && allMessagesFromDB.length > 0) {
      const lastMessage = allMessagesFromDB[allMessagesFromDB.length - 1];
      if (lastMessage.role === 'model' && lastMessage.timestamp > lastSpokenTimestampRef.current) {
        if (Date.now() - lastMessage.timestamp < 5000) {
          speak(lastMessage.content);
          lastSpokenTimestampRef.current = lastMessage.timestamp;
        }
      }
    }
  }, [allMessagesFromDB, isSpeakEnabled]);

  useEffect(() => {
    return () => {
      resetChat();
      if (typeof window !== 'undefined') window.speechSynthesis.cancel();
    };
  }, [resetChat]);

  useEffect(() => {
    if (user === null) {
      router.push('/');
      return;
    }
    if (!user || !conversationId) return;

    const conversationNodeRef = ref(database, `conversations/${user.uid}/${conversationId as string}`);
    let unsubscribeMessages: (() => void) | undefined;
    let unsubscribeMetadata: (() => void) | undefined;

    const checkAndCreateConversation = async () => {
      try {
        const snapshot = await get(conversationNodeRef);
        if (!snapshot.exists()) {
          await createConversation(user.uid, "Default", conversationId as string);
        }
        unsubscribeMessages = getConversation(user.uid, conversationId as string, (allFetchedMessages) => {
          setAllMessagesFromDB(allFetchedMessages);
          setMessages(allFetchedMessages.slice(-messagesToDisplayCount));
        });
        unsubscribeMetadata = getConversationMetadata(user.uid, conversationId as string, (metadata) => {
          setConversationTitle(metadata.title);
          if (metadata.isSpeakEnabled !== undefined) {
            setIsSpeakEnabled(metadata.isSpeakEnabled);
          }
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };
    checkAndCreateConversation();
    return () => {
      unsubscribeMessages?.();
      unsubscribeMetadata?.();
    };
  }, [user, conversationId, router, messagesToDisplayCount, setAllMessagesFromDB, setMessages, setConversationTitle]);

  useEffect(() => {
    setMessages(allMessagesFromDB.slice(-messagesToDisplayCount));
  }, [allMessagesFromDB, messagesToDisplayCount]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [input]);

  const handleSendMessage = async () => {
    if (typeof input !== 'string' || input.trim() === '' || !user || !conversationId) return;

    if (typeof window !== 'undefined') window.speechSynthesis.cancel();

    const newMessage: ChatMessageType = { role: 'user', content: input.trim(), timestamp: Date.now() };
    writeMessage(user.uid, conversationId as string, newMessage);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/nexo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...allMessagesFromDB, newMessage].slice(-50), 
          userName: user.displayName || user.email || user.uid, 
          userId: user.uid, 
          conversationId,
          userLocation: locationData ? `${locationData.city}, ${locationData.country_name}` : null,
          userLocale: typeof window !== 'undefined' ? navigator.language : 'en-US'
        }),
      });
      
      if (!response.ok) throw new Error('Failed to get response from Nexo');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        
        // Process SSE events
        const lines = chunkValue.split('\n');
        let currentEvent = '';

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.replace('event: ', '').trim();
          } else if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            try {
              const data = JSON.parse(dataStr);
              
              if (currentEvent === 'status') {
                setToolStatus(data);
              } else if (currentEvent === 'result') {
                const botMessage: ChatMessageType = { 
                  role: 'model', 
                  content: data.response, 
                  timestamp: Date.now(), 
                  toolUsed: data.toolUsed || null,
                  toolOutput: data.toolOutput !== undefined ? data.toolOutput : null 
                }; 
                writeMessage(user.uid, conversationId as string, botMessage);
              } else if (currentEvent === 'error') {
                toast.error(data);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('API Error:', error);
      toast.error('Failed to get response from Nexo. Please try again.');
    } finally {
      setLoading(false);
      setToolStatus(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans antialiased relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-600/5 blur-[120px] pointer-events-none"></div>

      <header className="sticky top-0 z-50 py-4 px-6 bg-white/5 backdrop-blur-xl flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
            <IconButton onClick={() => router.push('/chat')} color="inherit" sx={{ bgcolor: 'white/5', '&:hover': { bgcolor: 'white/10' } }}>
                <ArrowBackIcon />
            </IconButton>
            <div className="flex flex-col">
                <h1 className="text-lg font-bold leading-tight">{conversationTitle}</h1>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Nexo Online</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <ButtonBase 
                onClick={() => {
                    const newState = !isSpeakEnabled;
                    setIsSpeakEnabled(newState);
                    if (user) {
                        updateConversationSpeakStatus(user.uid, conversationId as string, newState);
                    }
                    if (!newState && typeof window !== 'undefined') {
                        window.speechSynthesis.cancel();
                    }
                }} 
                sx={{ 
                    bgcolor: isSpeakEnabled ? 'rgba(37, 99, 235, 0.15)' : 'white/5',
                    border: '1px solid',
                    borderColor: isSpeakEnabled ? 'rgba(59, 130, 246, 0.4)' : 'white/10',
                    color: isSpeakEnabled ? '#60a5fa' : '#6b7280',
                    px: 2,
                    py: 0.75,
                    borderRadius: '50px',
                    gap: 1,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { 
                        bgcolor: isSpeakEnabled ? 'rgba(37, 99, 235, 0.25)' : 'white/10',
                        borderColor: isSpeakEnabled ? 'rgba(59, 130, 246, 0.6)' : 'white/20',
                    }
                }}
            >
                {isSpeakEnabled ? (
                    <div className="flex items-center gap-1.5">
                        <VolumeUpIcon sx={{ fontSize: 18 }} />
                        <span className="text-[10px] font-black uppercase tracking-wider">Voice On</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 opacity-60">
                        <VolumeOffIcon sx={{ fontSize: 18 }} />
                        <span className="text-[10px] font-black uppercase tracking-wider">Voice Off</span>
                    </div>
                )}
            </ButtonBase>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                <Image src="/nexo.png" alt="Nexo" width={24} height={24} />
            </div>
        </div>
      </header>

      <div className="flex-grow flex flex-col w-full max-w-4xl mx-auto overflow-hidden relative z-10">
        <div className="flex-grow p-4 md:p-6 overflow-y-auto custom-scrollbar flex flex-col space-y-6">
          {allMessagesFromDB.length > messagesToDisplayCount && (
            <div className="flex justify-center py-2">
              <ButtonBase
                onClick={() => setMessagesToDisplayCount(prev => prev + 20)}
                sx={{
                  bgcolor: 'white/5',
                  color: 'gray',
                  px: 3,
                  py: 1,
                  borderRadius: '50px',
                  fontSize: '0.75rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'white/10', color: 'white' }
                }}
              >
                Load previous messages
              </ButtonBase>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChatMessage msg={msg} isUser={msg.role === 'user'} user={user} />
                </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-start gap-3 mb-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/20">
                  <Image src="/nexo.png" alt="Nexo" width={20} height={20} className="animate-pulse" />
                </div>
                <span className="text-sm font-bold text-blue-400">{toolStatus || "Nexo is processing..."}</span>
              </div>
              <div className="ml-11 flex gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 md:p-6 bg-gradient-to-t from-black via-black to-transparent">
          <div className="relative flex flex-col max-w-3xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[28px] p-2 transition-all focus-within:border-blue-500/50 focus-within:bg-white/[0.08] shadow-2xl">
            <div className="flex items-end gap-3">
              <textarea
                ref={textareaRef}
                rows={1}
                className="w-full p-3 pl-4 bg-transparent text-white focus:outline-none placeholder-gray-500 resize-none min-h-[48px] max-h-[160px] text-sm md:text-base"
                placeholder="Ask Nexo anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                  }
                }}
                disabled={loading}
              ></textarea>
              <div className="flex items-center gap-1 mb-0.5 mr-0.5">
                <IconButton
                  onClick={() => handleSendMessage()}
                  disabled={loading || typeof input !== 'string' || !input.trim()}
                  sx={{
                    bgcolor: 'white/5',
                    color: (typeof input === 'string' && input.trim()) ? '#2563eb' : 'gray',
                    width: 44,
                    height: 44,
                    transition: 'all 0.2s',
                    '&:hover': { 
                      bgcolor: 'white/10', 
                      transform: (typeof input === 'string' && input.trim()) ? 'scale(1.05)' : 'none',
                      color: (typeof input === 'string' && input.trim()) ? '#3b82f6' : 'gray'
                    },
                    '&.Mui-disabled': { bgcolor: 'white/5', color: 'gray' }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SendIcon sx={{ fontSize: 20 }} />
                  )}
                </IconButton>
              </div>
            </div>
          </div>
          <p className="text-center text-[10px] text-gray-600 mt-4 uppercase tracking-[0.2em] font-bold">Powered by Nexo Intelligence • Academic Project</p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
