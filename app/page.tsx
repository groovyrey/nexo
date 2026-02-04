"use client";

import Image from "next/image";
import { FiArrowRight, FiTwitter, FiLinkedin, FiGithub, FiUser, FiMessageSquare, FiLayers } from "react-icons/fi";
import { useAuthContext } from "@/lib/context";
import { signInWithGoogle, signOutWithGoogle } from "@/lib/auth";
import LoggedInHomepage from "./components/LoggedInHomepage";
import Link from 'next/link';
import Button from '@mui/material/Button';

export default function Home() {
  const authContext = useAuthContext();
  const user = authContext ? authContext.user : null;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans antialiased">


      {user ? (
        <LoggedInHomepage />
      ) : (
        <>
          {/* Main Content */}
          <main className="flex-grow px-4 md:px-8 flex flex-col items-center justify-center text-center py-20">
            <div className="relative w-40 h-40 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full blur-2xl opacity-60"></div>
              <Image src="/nexo.png" layout="fill" objectFit="contain" alt="Nexo Logo" className="relative" />
            </div>
            <h2 className="text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Your AI Chatbot Assistant
            </h2>
            <p className="text-lg text-gray-200 mb-8 max-w-2xl leading-relaxed">
              Nexo provides intelligent and personalized assistance, making conversations seamless and efficient.
            </p>

            <div>
              <Link href="/chat" passHref>
                <Button
                  onClick={user ? undefined : signInWithGoogle}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#4f46e5', // bg-indigo-600
                    color: 'white',
                    padding: '12px 28px', // px-7 py-3
                    borderRadius: '9999px', // rounded-full
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
                    transition: 'all 0.2s ease-in-out', // transition-all transform
                    '&:hover': {
                      boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.5), 0 8px 10px -6px rgba(99, 102, 241, 0.5)', // hover:shadow-indigo-500/50
                      transform: 'scale(1.05)', // hover:scale-105
                      backgroundColor: '#4f46e5', // Keep background color on hover
                    },
                  }}
                >
                  <span className="font-semibold">Start Chatting with Nexo</span>
                  <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </main>

          {/* Features Section */}
          <section className="py-24 px-4 md:px-8 bg-black">
            <div className="text-center max-w-6xl mx-auto">
              <h3 className="text-4xl font-bold mb-16">Why Nexo?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center p-6 rounded-xl transition-all hover:bg-gray-900/60 border border-gray-800">
                  <div className="relative w-20 h-20 mb-5 flex items-center justify-center bg-gradient-to-br from-indigo-400/20 to-blue-500/20 rounded-full">
                    <FiMessageSquare className="text-white text-4xl" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Intelligent Conversations</h4>
                  <p className="text-gray-400 text-sm">Engage in natural and intelligent discussions with our advanced AI.</p>
                </div>
                <div className="flex flex-col items-center p-6 rounded-xl transition-all hover:bg-gray-900/60 border border-gray-800">
                  <div className="relative w-20 h-20 mb-5 flex items-center justify-center bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-full">
                    <FiLayers className="text-white text-4xl" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Adaptable Workflows</h4>
                  <p className="text-gray-400 text-sm">Nexo seamlessly adapts to your needs, enhancing various tasks with ease.</p>
                </div>
                <div className="flex flex-col items-center p-6 rounded-xl transition-all hover:bg-gray-900/60 border border-gray-800">
                  <div className="relative w-20 h-20 mb-5 flex items-center justify-center bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full">
                    <FiUser className="text-white text-4xl" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Personalized Assistance</h4>
                  <p className="text-gray-400 text-sm">Nexo learns and adapts to provide tailored support just for you.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 md:px-8 bg-black">
              <div className="text-center max-w-4xl mx-auto">
                <h3 className="text-4xl font-bold mb-4">Ready to Dive In?</h3>
                <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                  Experience the power of AI-driven conversations. Get started with Nexo today!
                </p>
                <Link href="/chat" passHref>
                  <Button
                    onClick={user ? undefined : signInWithGoogle}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      margin: '0 auto', // mx-auto
                      backgroundColor: '#4f46e5', // bg-indigo-600
                      color: 'white',
                      padding: '12px 28px', // px-7 py-3
                      borderRadius: '9999px', // rounded-full
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
                      transition: 'all 0.2s ease-in-out', // transition-all transform
                      '&:hover': {
                        boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.5), 0 8px 10px -6px rgba(99, 102, 241, 0.5)', // hover:shadow-indigo-500/50
                        transform: 'scale(1.05)', // hover:scale-105
                        backgroundColor: '#4f46e5', // Keep background color on hover
                      },
                    }}
                  >
                    <span className="font-semibold">Try Nexo AI Now</span>
                    <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </section>

            {/* Footer */}
            <footer className="p-8 mt-16 border-t border-gray-800 bg-black">
              <div className="px-4 md:px-8 text-center text-gray-500 text-sm">
                <p className="mb-4">
                  <Link href="/disclaimer" className="text-blue-400 hover:underline">
                    Read Important Disclaimer
                  </Link>
                </p>
                <p>&copy; 2026 Nexo. All rights reserved.</p>
                <div className="flex justify-center space-x-6 mt-4">
                  <a href="#" className="hover:text-gray-300"><FiTwitter /></a>
                  <a href="#" className="hover:text-gray-300"><FiLinkedin /></a>
                  <a href="#" className="hover:text-gray-300"><FiGithub /></a>
                </div>
              </div>
            </footer>
          </>
        )}
      </div>
    );
}