"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ChatMessage from './components/ChatMessage';
import { useAuthContext } from '@/lib/context';
import { getConversation, writeMessage } from '@/lib/realtimedb';

const ChatPage = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const [messages, setMessages] = useState<{ role: string; content: string; timestamp: number }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationId = "default"; // Using a single conversation for simplicity

  useEffect(() => {
    if (user === null) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      getConversation(user.uid, conversationId, (messages) => {
        setMessages(messages);
      });
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || !user) return;

    const newMessage = { role: 'user', content: input, timestamp: Date.now() };
    writeMessage(user.uid, conversationId, newMessage);
    
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
      const botMessageContent = data.choices[0].message.content;
      
      const botMessage = { role: 'model', content: botMessageContent, timestamp: Date.now() };
      writeMessage(user.uid, conversationId, botMessage);

    } catch (error: any) {
      console.error('API call error:', error);
      let errorMessage = 'Error: Could not get a response from Nexo. Please check your network or try again later.';
      if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      const systemMessage = { role: 'system', content: errorMessage, timestamp: Date.now() };
      writeMessage(user.uid, conversationId, systemMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 py-3 px-4 bg-white/10 backdrop-blur-md flex items-center justify-between border-b border-white/20">
        <button onClick={() => router.back()} className="text-gray-300 hover:text-white transition-colors duration-200 ease-in-out p-2 rounded-full hover:bg-white/20">
          <FiArrowLeft className="text-xl" />
        </button>
        <div className="flex items-center space-x-3">
          <Image src="/nexo.png" width={32} height={32} alt="Nexo Logo" className="rounded-full ring-2 ring-white/30" />
          <h1 className="text-lg font-semibold text-white">Nexo AI</h1>
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
            <div className="flex justify-start items-start gap-3 animate-fade-in-up">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                <Image src="/nexo.png" alt="Nexo AI" width={32} height={32} />
              </div>
              <div className="relative p-4 max-w-[80%] bg-white/10 text-gray-100 border border-white/20 rounded-tl-xl rounded-br-xl rounded-tr-md rounded-bl-md">
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
          <div className="relative">
            <input
              type="text"
              className="w-full p-4 pr-12 rounded-full bg-white/20 border border-transparent text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 transition-all duration-200"
              placeholder="Message Nexo..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !loading) {
                  handleSendMessage();
                }
              }}
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-cyan-500 hover:bg-cyan-400 text-white p-2 rounded-full flex items-center justify-center transition-all duration-200 disabled:bg-cyan-700 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <FiSend className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;