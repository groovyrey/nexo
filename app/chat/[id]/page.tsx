"use client";
import React, { useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import ChatMessage from '../components/ChatMessage';
import { useAuthContext } from '@/lib/context';
import { useChatStore, ChatMessageType } from '@/lib/store';
import { getConversation, writeMessage, getConversationMetadata, createConversation } from '@/lib/realtimedb';
import { database } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ButtonBase from '@mui/material/ButtonBase';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSpeechRecognition } from '@/lib/hooks/use-speech-recognition';

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
    isSpeakEnabled,
    setIsSpeakEnabled,
    resetChat
  } = useChatStore();

  if (!authContext) return null;
  const { user } = authContext;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSpokenTimestampRef = useRef<number>(0);
  const lastProcessedRef = useRef<{ text: string, time: number }>({ text: '', time: 0 });

  const speak = (text: string) => {
    if (!isSpeakEnabled || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
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

  const handleSpeechResult = useCallback((transcript: string, isFinal: boolean) => {
    if (isFinal) {
      const newPart = transcript.trim();
      if (!newPart) return;

      const now = Date.now();
      const lastProcessed = lastProcessedRef.current;
      
      // If we got the exact same text within 800ms, it's likely a duplicate event from the browser
      if (newPart.toLowerCase() === lastProcessed.text.toLowerCase() && now - lastProcessed.time < 800) {
        return;
      }
      
      lastProcessedRef.current = { text: newPart, time: now };
      
      setInput(prev => {
        const current = (typeof prev === 'string' ? prev : '').trim();
        const currentLower = current.toLowerCase();
        const newPartLower = newPart.toLowerCase();

        // 1. If current is empty, just set it to newPart
        if (!current) return newPart;

        // 2. Check if newPart is already at the end of the current input (exact or fuzzy match)
        if (currentLower.endsWith(newPartLower)) {
           // If it's a very recent duplicate (within 2s), ignore it
           if (now - lastProcessed.time < 2000) return prev;
        }

        // 3. Handle accumulated transcript (some mobile browsers return full transcript instead of delta)
        // If newPart starts with current, it's likely an accumulation
        if (newPartLower.startsWith(currentLower) && newPartLower.length > currentLower.length) {
            return newPart;
        }

        // 4. Otherwise, append with a space
        return current + ' ' + newPart;
      });
    }
  }, [setInput]);

  const { isListening, startListening, stopListening, hasSupport } = useSpeechRecognition({
    onResult: handleSpeechResult
  });

  const handleSendMessage = async () => {
    if (typeof input !== 'string' || input.trim() === '' || !user || !conversationId) return;

    if (isListening) stopListening();
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

      const data = await response.json();
      const botMessage: ChatMessageType = { 
        role: 'model', 
        content: data.response, 
        timestamp: Date.now(), 
        toolUsed: data.toolUsed || null,
        toolOutput: data.toolOutput !== undefined ? data.toolOutput : null 
      }; 
      writeMessage(user.uid, conversationId as string, botMessage);
    } catch (error) {
      console.error('API Error:', error);
      toast.error('Failed to get response from Nexo. Please try again.');
    } finally {
      setLoading(false);
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
        <div className="flex items-center gap-2">
            <IconButton 
                onClick={() => {
                    const newState = !isSpeakEnabled;
                    setIsSpeakEnabled(newState);
                    if (!newState && typeof window !== 'undefined') {
                        window.speechSynthesis.cancel();
                    }
                }} 
                color="inherit" 
                sx={{ bgcolor: isSpeakEnabled ? 'rgba(37, 99, 235, 0.2)' : 'white/5', '&:hover': { bgcolor: isSpeakEnabled ? 'rgba(37, 99, 235, 0.3)' : 'white/10' } }}
            >
                {isSpeakEnabled ? <VolumeUpIcon sx={{ color: '#60a5fa' }} /> : <VolumeOffIcon sx={{ color: '#6b7280' }} />}
            </IconButton>
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
                <span className="text-sm font-bold text-blue-400">Nexo is processing...</span>
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
                {hasSupport && (
                  <IconButton
                    onClick={isListening ? stopListening : startListening}
                    disabled={loading}
                    sx={{
                      bgcolor: isListening ? 'rgba(239, 68, 68, 0.2)' : 'white/5',
                      color: isListening ? '#ef4444' : 'white',
                      width: 44,
                      height: 44,
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: isListening ? 'rgba(239, 68, 68, 0.3)' : 'white/10', transform: 'scale(1.05)' },
                    }}
                  >
                    {isListening ? <MicIcon sx={{ fontSize: 20 }} /> : <MicOffIcon sx={{ fontSize: 20, color: '#6b7280' }} />}
                  </IconButton>
                )}
                <IconButton
                  onClick={() => handleSendMessage()}
                  disabled={loading || typeof input !== 'string' || !input.trim()}
                  sx={{
                    bgcolor: (typeof input === 'string' && input.trim()) ? '#2563eb' : 'white/5',
                    color: 'white',
                    width: 44,
                    height: 44,
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#1d4ed8', transform: 'scale(1.05)' },
                    '&.Mui-disabled': { bgcolor: 'white/5', color: 'gray' }
                  }}
                >
                  <SendIcon sx={{ fontSize: 20 }} />
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
