"use client";
import React from 'react';
import { FiUser, FiMail, FiKey, FiActivity, FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import Link from 'next/link';
import { useAuthContext } from '../../lib/context';
import Image from 'next/image';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const authContext = useAuthContext();
  const router = useRouter();

  if (!authContext) return null;
  const { user } = authContext;

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-white p-6 relative overflow-hidden bg-black min-h-screen">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Nav */}
      <div className="absolute top-8 left-8 z-50">
           <IconButton 
            onClick={() => router.push('/')} 
            sx={{ 
                color: 'white', 
                bgcolor: 'white/10', 
                backdropFilter: 'blur(10px)',
                '&:hover': { bgcolor: 'white/20' } 
            }}
           >
             <FiArrowLeft />
           </IconButton>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                User Profile
            </h1>
            <p className="text-gray-400 font-medium italic">Welcome back to your Nexo command center.</p>
        </div>

        {/* Profile Card */}
        {user && (
          <div className="bg-white/5 backdrop-blur-2xl rounded-[40px] p-10 mb-10 border border-white/10 shadow-2xl flex flex-col items-center group transition-all duration-300 hover:border-white/20">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
                {user.photoURL ? (
                <Image
                    src={user.photoURL}
                    alt="User Profile"
                    width={120}
                    height={120}
                    className="rounded-full relative ring-4 ring-white/10 p-1 object-cover"
                />
                ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-5xl font-black relative border-4 border-white/10 shadow-lg">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                </div>
                )}
            </div>

            <div className="text-center w-full space-y-6">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight flex items-center justify-center gap-3">
                        <FiUser className="text-blue-400" />
                        {user.displayName || 'Anonymous User'}
                    </h2>
                    <div className="h-1 w-12 bg-blue-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-left">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 block">Email Address</label>
                        <div className="flex items-center gap-2 text-gray-200 font-medium">
                            <FiMail className="text-blue-400 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                        </div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-left">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 block">Account ID</label>
                        <div className="flex items-center gap-2 text-gray-500 font-mono text-xs">
                            <FiKey className="flex-shrink-0" />
                            <span className="truncate">{user.uid}</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat" passHref className="w-full sm:w-auto">
                <Button
                    variant="contained"
                    fullWidth
                    startIcon={<FiMessageSquare />}
                    sx={{ 
                        bgcolor: 'blue.600', 
                        color: 'white', 
                        px: 6, 
                        py: 2, 
                        fontWeight: 'bold',
                        borderRadius: '50px',
                        textTransform: 'none',
                        boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.4)',
                        '&:hover': { bgcolor: 'blue.700', transform: 'translateY(-2px)' }
                    }}
                >
                    Start Chatting
                </Button>
            </Link>
            <Link href="/dashboard/usage" passHref className="w-full sm:w-auto">
                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<FiActivity />}
                    sx={{ 
                        color: 'white', 
                        borderColor: 'white/20', 
                        px: 6, 
                        py: 2, 
                        fontWeight: 'bold',
                        borderRadius: '50px',
                        textTransform: 'none',
                        '&:hover': { borderColor: 'white', bgcolor: 'white/10', transform: 'translateY(-2px)' }
                    }}
                >
                    View Usage
                </Button>
            </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
