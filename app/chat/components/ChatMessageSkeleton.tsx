"use client";

import React from 'react';
import { motion } from 'framer-motion';

const ChatMessageSkeleton = ({ isUser = false }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-4 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <motion.div 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className={`w-10 h-10 rounded-2xl flex-shrink-0 ${isUser ? 'bg-indigo-600/30' : 'bg-gray-800'}`}
      />
      
      <div className={`flex flex-col gap-2 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
          className={`h-12 w-48 rounded-2xl ${isUser ? 'bg-indigo-600/20' : 'bg-gray-800/60'}`} 
        />
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          className={`h-4 w-32 rounded-lg ${isUser ? 'bg-indigo-600/10' : 'bg-gray-800/40'}`} 
        />
      </div>
    </motion.div>
  );
};

export default ChatMessageSkeleton;



