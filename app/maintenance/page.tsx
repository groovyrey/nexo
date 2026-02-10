import React from 'react';
import { FiAlertTriangle, FiClock, FiSettings, FiActivity } from 'react-icons/fi';
import Image from 'next/image';

export default function MaintenancePage() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center overflow-hidden">
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
                Nexo is upgrading its neural architecture. We are temporarily offline for essential core infrastructure maintenance.
            </p>
        </div>

        {/* Status Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4">
            {[
                { icon: <FiClock />, label: "ETA", value: "90 Minutes", color: "text-blue-400" },
                { icon: <FiActivity />, label: "Progress", value: "84% Sync", color: "text-emerald-400" },
                { icon: <FiSettings />, label: "Task", value: "Model Re-indexing", color: "text-amber-400" }
            ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                    <div className={`${stat.color} text-xl mb-1`}>{stat.icon}</div>
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</span>
                    <span className="text-sm font-medium text-white">{stat.value}</span>
                </div>
            ))}
        </div>

        {/* Footer info */}
        <div className="pt-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs text-gray-600 font-mono uppercase tracking-widest bg-black/40 px-4 py-2 rounded-lg border border-white/5">
                <FiAlertTriangle className="text-amber-500/50" />
                Global Killswitch: <span className="text-red-900 font-bold">ACTIVE</span>
            </div>
            <p className="text-[10px] text-gray-800 uppercase tracking-[0.8em] font-medium">
                Autonomous Infrastructure Protection
            </p>
        </div>
      </div>
    </div>
  );
}
