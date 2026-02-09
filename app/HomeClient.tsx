'use client';

import { useAuthContext } from "@/lib/context";
import { signInWithGoogle } from "@/lib/auth";
import Link from 'next/link';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { FiArrowRight, FiMessageSquare, FiLayers, FiUser, FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';
import ToolsDisplay from './components/ToolsDisplay'; // Import ToolsDisplay
import { userFriendlyTools } from '../lib/userFriendlyTools'; // Import userFriendlyTools

export default function HomeClient() {
  const authContext = useAuthContext();
  const user = authContext ? authContext.user : null;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans antialiased overflow-x-hidden">
        {/* Hero Section */}
        <main className="relative flex-grow px-4 md:px-8 flex flex-col items-center justify-center text-center py-32 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none"></div>
          
          <div className="relative w-44 h-44 mb-10 animate-pulse-slow">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full blur-3xl opacity-40"></div>
            <Image src="/nexo.png" layout="fill" objectFit="contain" alt="Nexo Logo" className="relative drop-shadow-2xl" />
          </div>
          
          <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">
            Nexo AI
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl leading-relaxed font-medium">
            Your next-generation intelligent assistant for seamless and efficient digital conversations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/chat" passHref>
              <Button
                variant="cta"
                color="primary"
                onClick={user ? undefined : signInWithGoogle}
                sx={{
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    borderRadius: '50px',
                    boxShadow: '0 10px 30px -10px rgba(59, 130, 246, 0.5)',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 15px 35px -10px rgba(59, 130, 246, 0.6)',
                    }
                }}
              >
                <span className="font-bold">Start Chatting</span>
                <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </main>

        {/* Features Section */}
        <section className="py-32 px-4 md:px-8 border-y border-white/5 bg-gradient-to-b from-black via-gray-900/20 to-black">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h3 className="text-4xl font-bold mb-4">The Nexo Experience</h3>
              <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group p-10 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all duration-300">
                <div className="w-16 h-16 mb-8 flex items-center justify-center bg-indigo-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                  <FiMessageSquare className="text-indigo-400 text-3xl" />
                </div>
                <h4 className="text-2xl font-bold mb-4">Intelligent</h4>
                <p className="text-gray-400 leading-relaxed">Engage in natural, context-aware discussions powered by state-of-the-art models.</p>
              </div>
              
              <div className="group p-10 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all duration-300">
                <div className="w-16 h-16 mb-8 flex items-center justify-center bg-pink-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                  <FiLayers className="text-pink-400 text-3xl" />
                </div>
                <h4 className="text-2xl font-bold mb-4">Versatile</h4>
                <p className="text-gray-400 leading-relaxed">From web searching to data processing, Nexo adapts to your specific needs.</p>
              </div>

              <div className="group p-10 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all duration-300">
                <div className="w-16 h-16 mb-8 flex items-center justify-center bg-yellow-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                  <FiUser className="text-yellow-400 text-3xl" />
                </div>
                <h4 className="text-2xl font-bold mb-4">Personalized</h4>
                <p className="text-gray-400 leading-relaxed">A tailored experience that learns from your preferences over time.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Display Section */}
        <ToolsDisplay toolsList={userFriendlyTools} />

        {/* CTA Section */}
        <section className="py-32 px-4 md:px-8">
          <div className="max-w-5xl mx-auto rounded-[40px] p-12 md:p-20 bg-gradient-to-br from-blue-600 to-indigo-800 text-center relative overflow-hidden shadow-2xl">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl font-black mb-6 text-white">Ready for the Future?</h3>
              <p className="text-blue-100 mb-12 max-w-xl mx-auto text-lg md:text-xl opacity-90">
                Join thousands of users who are already augmenting their productivity with Nexo AI.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/chat" passHref>
                  <Button
                    variant="contained"
                    onClick={user ? undefined : signInWithGoogle}
                    sx={{ 
                        bgcolor: 'white', 
                        color: '#1e40af', // Explicit dark blue for visibility
                        px: 6, 
                        py: 2, 
                        fontWeight: 'bold',
                        borderRadius: '50px',
                        '&:hover': { bgcolor: 'blue.50' }
                    }}
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/team" passHref>
                  <Button
                    variant="outlined"
                    sx={{ 
                        color: 'white', 
                        borderColor: 'white/30', 
                        px: 6, 
                        py: 2, 
                        borderRadius: '50px',
                        '&:hover': { borderColor: 'white', bgcolor: 'white/10' }
                    }}
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="p-12 border-t border-white/5 bg-black">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-gray-500 text-sm order-2 md:order-1 text-center md:text-left">
              <p>&copy; 2026 Nexo AI. Built for the modern web.</p>
              <div className="mt-4 flex gap-6 justify-center md:justify-start">
                <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
              </div>
            </div>

            <div className="flex gap-6 order-1 md:order-2">
              <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-gray-400 hover:text-white"><FiTwitter size={20} /></a>
              <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-gray-400 hover:text-white"><FiLinkedin size={20} /></a>
              <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-gray-400 hover:text-white"><FiGithub size={20} /></a>
            </div>
          </div>
        </footer>
    </div>
  );
}
