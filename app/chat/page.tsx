"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ChatMessage from './components/ChatMessage';
import { useAuthContext } from '@/lib/context';

const ChatPage = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user === null) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const newMessage = { role: 'user', content: input };
    const allMessages = [...messages, newMessage];
    setMessages(allMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/nexo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error from Gemini API');
      }

      const data = await response.json();
      const botMessageContent = data.choices[0].message.content;

      setMessages((prevMessages) => [...prevMessages, { role: 'model', content: botMessageContent }]);
    } catch (error: any) {
      console.error('API call error:', error);
      let errorMessage = 'Error: Could not get a response from Nexo. Please check your network or try again later.';
      if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'system', content: errorMessage },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 py-3 px-4 bg-black/50 backdrop-blur-lg flex items-center justify-between border-b border-gray-800">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition-colors duration-200 ease-in-out p-2 rounded-full hover:bg-gray-800/60">
          <FiArrowLeft className="text-xl" />
        </button>
        <div className="flex items-center space-x-3">
          <Image src="/nexo.png" width={32} height={32} alt="Nexo Logo" className="rounded-full" />
          <h1 className="text-lg font-semibold text-white">Nexo AI</h1>
        </div>
        <div className="w-10 h-10"></div>
      </header>

      {/* Chat Interface */}
      <div className="flex-grow flex flex-col w-full max-w-4xl mx-auto overflow-hidden">
        {/* Messages Display */}
        <div className="flex-grow p-4 space-y-4 overflow-y-auto custom-scrollbar">
          {messages.length === 0 ? (
            <div className="text-gray-500 text-center py-10">
              Start a conversation with Nexo!
            </div>
          ) : (
            messages.map((msg, index) => (
              <ChatMessage key={index} msg={msg} isUser={msg.role === 'user'} />
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="relative p-3 rounded-lg bg-gray-800">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <p className="text-sm text-gray-300">Nexo is thinking...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/50 backdrop-blur-lg border-t border-gray-800">
          <div className="relative">
            <input
              type="text"
              className="w-full p-4 pr-12 rounded-full bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 transition-all duration-200"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-full flex items-center justify-center transition-all duration-200 disabled:bg-indigo-800 disabled:cursor-not-allowed"
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