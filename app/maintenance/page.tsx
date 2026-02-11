'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function MaintenancePage() {
  const [reason, setReason] = useState("Nexo is upgrading its neural architecture. We are temporarily offline for essential core infrastructure maintenance.");
  const router = useRouter();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        if (data.status !== 'maintenance') {
          router.replace('/');
        }
        
        if (data.reason) {
          setReason(data.reason);
        }
      } catch (err) {
        console.error('Failed to check status:', err);
      }
    };

    checkStatus();
    window.addEventListener('focus', checkStatus);
    return () => window.removeEventListener('focus', checkStatus);
  }, [router]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] text-white flex flex-col items-center justify-center py-12 px-6 text-center overflow-y-auto">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.15]" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        {/* Animated Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-3xl w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Brand/Logo Section */}
        <div className="flex flex-col items-center gap-6">
            <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-3xl group-hover:bg-blue-500/50 transition-colors duration-500"></div>
                <div className="relative w-24 h-24 md:w-32 md:h-32 transition-transform duration-700 hover:scale-110">
                    <Image 
                      src="/nexo.png" 
                      fill
                      className="object-contain brightness-110" 
                      alt="Nexo AI Logo" 
                      priority
                    />
                </div>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">Core Systems Offline</span>
            </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                OFFLINE <span className="text-blue-500">.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 font-light max-w-xl mx-auto leading-relaxed">
                {reason}
            </p>
        </div>
      </div>
    </div>
  );
}
