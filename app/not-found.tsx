'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 -translate-x-1/2 w-[300px] h-[300px] bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 select-none">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-[-2rem] md:mt-[-4rem]"
        >
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
            Lost in the Nexo Void?
          </h2>
          <p className="text-gray-400 max-w-md mx-auto mb-10 text-sm md:text-base leading-relaxed">
            The page you are looking for has been moved, deleted, or never existed in this dimension. Let's get you back on track.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/"
            className="group flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full transition-all hover:bg-blue-500 hover:text-white active:scale-95"
          >
            <HomeIcon fontSize="small" />
            Return Home
          </Link>
          
          <Link
            href="/chat"
            className="group flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-full backdrop-blur-sm transition-all hover:bg-white/10 active:scale-95"
          >
            <ArrowBackIcon fontSize="small" />
            Go to Chat
          </Link>
        </motion.div>
      </div>

      {/* Floating Particle Effect (Simple) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              opacity: Math.random()
            }}
            animate={{ 
              y: [null, '-20%'],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </div>
  );
}
