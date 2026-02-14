'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiAlertCircle, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import Button from '@mui/material/Button';

function DisabledContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reason, setReason] = useState(searchParams.get('reason') || "This feature is temporarily unavailable.");
  const page = searchParams.get('page');
  const returnTo = searchParams.get('returnTo');

  useEffect(() => {
    const checkStatus = async () => {
      if (!page) return;
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        
        const isDisabled = data.disabledPages?.some((p: any) => {
           const normalizedP = p.page.replace(/^\//, '');
           const normalizedTarget = page.replace(/^\//, '');
           return normalizedP === normalizedTarget;
        });

        if (!isDisabled) {
          router.replace(returnTo || '/');
        }
        
        const pageData = data.disabledPages?.find((p: any) => p.page.replace(/^\//, '') === page.replace(/^\//, ''));
        if (pageData?.reason) {
          setReason(pageData.reason);
        }
      } catch (err) {
        console.error('Failed to check status:', err);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    window.addEventListener('focus', checkStatus);
    return () => {
        clearInterval(interval);
        window.removeEventListener('focus', checkStatus);
    };
  }, [router, page, returnTo]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] text-white flex flex-col items-center justify-center py-12 px-6 text-center overflow-y-auto">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.1]" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #f59e0b 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="flex flex-col items-center gap-6">
            <div className="relative group">
                <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-3xl"></div>
                <div className="relative w-20 h-20 transition-transform duration-700 hover:scale-110">
                    <Image 
                      src="/nexo.png" 
                      fill
                      className="object-contain grayscale opacity-50" 
                      alt="Nexo AI Logo" 
                    />
                </div>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
                <FiAlertCircle className="text-orange-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">Feature Paused</span>
            </div>
        </div>

        <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                LIMITED <span className="text-orange-500">.</span>
            </h1>
            <p className="text-lg text-gray-400 font-light max-w-lg mx-auto leading-relaxed">
                {reason}
            </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button 
                onClick={() => router.push('/')}
                startIcon={<FiArrowLeft />}
                sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.1)',
                    px: 4,
                    py: 1.5,
                    borderRadius: '50px',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' }
                }}
                variant="outlined"
            >
                Back to Home
            </Button>
            <Button 
                onClick={() => window.location.reload()}
                startIcon={<FiRefreshCw />}
                sx={{ 
                    bgcolor: 'orange.600', 
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: '50px',
                    '&:hover': { bgcolor: 'orange.700' }
                }}
                variant="contained"
            >
                Check Again
            </Button>
        </div>
      </div>
    </div>
  );
}

export default function DisabledPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-black" />}>
      <DisabledContent />
    </Suspense>
  );
}
