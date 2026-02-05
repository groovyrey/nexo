"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FiSend } from 'react-icons/fi'; // FiArrowLeft is no longer needed
import { useRouter, useParams } from 'next/navigation'; // Added useParams
import Image from 'next/image';
import ChatMessage from '../components/ChatMessage';
import { useAuthContext } from '@/lib/context';
import { getConversation, writeMessage, getConversationMetadata } from '@/lib/realtimedb';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ChatPage = () => {
  const authContext = useAuthContext();
  const router = useRouter();
  const { id: conversationId } = useParams(); // Get conversationId from URL params

  // If authContext is null, it means the user session is not yet loaded or user is not logged in.
  // The useEffect below will handle redirection if user is null.
  // For now, we can return null or a loading state to prevent destructuring 'user' from a null object.
  if (!authContext) {
    // console.warn("Auth context is null, waiting for user session or redirection.");
    return null; // Or return a loading spinner
  }

  const { user } = authContext;

  const [messages, setMessages] = useState<{ role: string; content: string; timestamp: number }[]>([]);
  const [conversationTitle, setConversationTitle] = useState('Loading...'); // New state for conversation title
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (user === null) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (user && conversationId) { // Ensure conversationId is available
      unsubscribe = getConversation(user.uid, conversationId as string, (messages) => {
        setMessages(messages);
      });
    }
    return () => {
      if (unsubscribe) {
        unsubscribe(); // Cleanup the listener
      }
    };
  }, [user, conversationId]); // Depend on conversationId

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (user && conversationId) {
      unsubscribe = getConversationMetadata(user.uid, conversationId as string, (metadata) => {
        setConversationTitle(metadata.title);
      });
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, conversationId]); // Depend on user and conversationId

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'; // Set to scrollHeight
    }
  }, [input]); // Recalculate height when input changes


  const handleSendMessage = async () => {
    if (input.trim() === '' || !user || !conversationId) return; // Ensure conversationId is available

    const newMessage = { role: 'user', content: input, timestamp: Date.now() };
    writeMessage(user.uid, conversationId as string, newMessage);
    
    setInput('');
    setLoading(true);

    try {
      const allMessages = [...messages.slice(-19), newMessage];
      const response = await fetch('/api/nexo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: allMessages, userName: user.displayName || user.email || user.uid }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error from Gemini API');
      }

      const data = await response.json();
      const botMessageContent = data.response;
      
      const botMessage = { role: 'model', content: botMessageContent, timestamp: Date.now() };
      writeMessage(user.uid, conversationId as string, botMessage);

    } catch (error: unknown) {
      console.error('API call error:', error);
      let errorMessage = 'Error: Could not get a response from Nexo. Please check your network or try again later.';
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      const systemMessage = { role: 'system', content: errorMessage, timestamp: Date.now() };
      writeMessage(user.uid, conversationId as string, systemMessage);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 py-3 px-4 bg-white/10 backdrop-blur-md flex items-center justify-between border-b border-white/20">
        <IconButton onClick={() => router.push('/chat')} color="inherit" aria-label="back" sx={{ color: 'white', '&:hover': { bgcolor: 'white/20' } }}>
          <ArrowBackIcon />
        </IconButton>
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-semibold text-white">{conversationTitle}</h1>
        </div>
        <div className="w-10 h-10"></div>
      </header>

      {/* Chat Interface */}
      <div className="flex-grow flex flex-col w-full max-w-4xl mx-auto overflow-hidden">
        {/* Messages Display */}
        <div
          className="flex-grow p-4 space-y-4 overflow-y-auto custom-scrollbar"
        >
          {messages.length === 0 ? (
            <div className="text-gray-500 text-center py-10">
              Start a conversation with Nexo!
            </div>
          ) : (
            messages.map((msg, index) => (
              <ChatMessage key={index} msg={msg} isUser={msg.role === 'user'} user={user} />
            ))
          )}
          {loading && (
            <div className="flex flex-col items-start gap-2 animate-fade-in-up mb-4 w-full">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  <Image src="/nexo.png" alt="Nexo AI" width={32} height={32} />
                </div>
                <span className="font-bold text-gray-200">Nexo AI</span>
              </div>
              <div className="w-full text-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-cyan-400"></div>
                  <span className="text-gray-300">Nexo is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/10 backdrop-blur-md border-t border-white/20">
          <div className="flex items-center gap-2">
            <textarea
              ref={textareaRef}
              rows={1}
              className="w-full p-3 pl-4 rounded-lg bg-white/20 border border-transparent text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 transition-all duration-200 resize-none min-h-[50px] max-h-[160px] overflow-y-auto"
              placeholder="Message Nexo..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onInput={(e) => {
                e.currentTarget.style.height = 'auto';
                e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
              }}
              disabled={loading}
            ></textarea>
            <IconButton
              color="primary"
              aria-label="send message"
              onClick={handleSendMessage}
              disabled={loading}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                width: 48,
                height: 48,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '&.Mui-disabled': {
                    bgcolor: 'action.disabledBackground',
                    color: 'action.disabled',
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;