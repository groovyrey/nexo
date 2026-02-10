'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FiLock, FiArrowRight, FiShield } from 'react-icons/fi';

export default function LockedPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Use replace to avoid going back to the locked page with the back button
        window.location.replace('/');
      } else {
        setError('Access Denied: Invalid Security Key');
      }
    } catch (err) {
      setError('System Error: Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] text-white flex flex-col items-center justify-center py-12 px-6 text-center overflow-y-auto">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.1]" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ef4444 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-6">
            <div className="relative group">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl group-hover:bg-red-500/40 transition-colors duration-500"></div>
                <div className="relative w-20 h-20 transition-transform duration-700 hover:scale-110">
                    <Image 
                      src="/nexo.png" 
                      fill
                      className="object-contain grayscale contrast-125" 
                      alt="Nexo AI Logo" 
                      priority
                    />
                </div>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full">
                <FiShield className="text-red-500 text-xs" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500">Secure Access Only</span>
            </div>
        </div>

        {/* Form Section */}
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tighter">LOCKED <span className="text-red-500">.</span></h1>
                <p className="text-gray-400 text-sm font-light">Unauthorized access restricted. Please enter security key.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-red-500 transition-colors">
                        <FiLock />
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Security Key"
                        required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                    />
                </div>
                
                {error && (
                    <p className="text-red-500 text-xs font-bold uppercase tracking-widest animate-shake">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all disabled:opacity-50 group"
                >
                    {loading ? 'VERIFYING...' : 'AUTHORIZE ACCESS'}
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}
