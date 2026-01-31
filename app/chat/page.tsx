"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiArrowLeft } from 'react-icons/fi'; // Import FiArrowLeft for back button
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import Image for the logo
import ReactMarkdown from 'react-markdown';
import ChatMessage from './components/ChatMessage';
import { useAuthContext } from '@/lib/context'; // Import useAuthContext

const ChatPage = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Redirect if user is not logged in
  useEffect(() => {
    if (user === null) {
      router.push('/');
    }
  }, [user, router]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // If user is not yet determined, or not logged in, render nothing or a loading state



  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const newMessage = { role: 'user', content: input };
    const allMessages = [...messages, newMessage]; // Include new message immediately
    setMessages(allMessages);
    setInput('');
    setLoading(true); // Start loading

    try {
      const response = await fetch('/api/gemini', {
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
      // The API route returns an object with choices[0].message.content
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
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-black text-white font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 py-3 px-4 bg-gray-900/90 backdrop-blur-md flex items-center justify-between shadow-lg border-b border-gray-700">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition-colors duration-200 ease-in-out p-2 -ml-2 rounded-full hover:bg-gray-700/50">
          <FiArrowLeft className="text-2xl" />
        </button>
        <div className="flex items-center space-x-3">
          <Image src="/nexo.png" width={40} height={40} alt="Nexo Logo" className="rounded-full shadow-lg" />
          <h1 className="text-xl font-semibold text-white">Nexo AI</h1>
        </div>
        <div className="w-10 h-10 -mr-2"></div> {/* Spacer for balance, matching button size */}
      </header>

      {/* Chat Interface */}
      <div className="flex-grow flex flex-col w-full max-w-4xl mx-auto bg-gray-800/60 rounded-xl shadow-2xl overflow-hidden my-6 border border-gray-700">
        {/* Messages Display */}
        <div className="flex-grow p-4 overflow-y-auto custom-scrollbar flex flex-col">
          {messages.length === 0 ? (
            <div className="text-gray-400 text-center py-10 flex-grow flex items-center justify-center">
              Start a conversation with Nexo! Type your message below.
            </div>
          ) : (
            messages.map((msg, index) => (
              <ChatMessage key={index} msg={msg} isUser={msg.role === 'user'} />
            ))
          )}
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="relative p-3 rounded-xl rounded-bl-sm bg-gray-700 shadow-md">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <p className="text-sm text-gray-100">Nexo is typing...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Element to scroll to */}
        </div>

        {/* Input Area */}
        <div className="flex p-4 border-t border-gray-700 bg-gray-800/80 gap-3">
          <input
            type="text"
            className="flex-grow p-3.5 rounded-full bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all duration-200 text-sm"
            placeholder="Type your message..."
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
            className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full flex items-center justify-center transition-all duration-200 disabled:bg-blue-800 disabled:cursor-not-allowed transform hover:scale-105"
            disabled={loading}
          >
            <FiSend className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;