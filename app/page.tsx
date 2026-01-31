"use client";

import Image from "next/image";
import { FiArrowRight, FiTwitter, FiLinkedin, FiGithub, FiLogOut, FiLogIn } from "react-icons/fi";
import { useAuthContext } from "@/lib/context";
import { signInWithGoogle, signOutWithGoogle } from "@/lib/auth";
import LoggedInHomepage from "./components/LoggedInHomepage";
import Link from 'next/link';

export default function Home() {
  const { user } = useAuthContext();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black to-gray-950 text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 p-4 bg-white/10 backdrop-blur-lg">
        <nav className="px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src="/nexo.png" width={48} height={48} alt="Nexo Logo" />
          </div>
          <div>
            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={signOutWithGoogle}
                  className="bg-red-500/80 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-400 transition-colors flex items-center"
                >
                  <FiLogOut className="mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="bg-cyan-500/80 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-cyan-400 transition-colors flex items-center"
              >
                <FiLogIn className="mr-2" />
                Sign in with Google
              </button>
            )}
          </div>
        </nav>
      </header>

      {user ? (
        <LoggedInHomepage />
      ) : (
        <>
          {/* Main Content */}
          <main className="flex-grow px-4 md:px-8 flex flex-col items-center justify-center text-center">
            <div className="relative w-40 h-40 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-2xl"></div>
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
                <button
                  onClick={signInWithGoogle}
                  className="group flex items-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-7 py-3 rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
                >
                  <span className="font-semibold">Start Chatting with Nexo</span>
                  <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </div>
          </main>

          {/* Features Section */}
          <section className="py-24 px-4 md:px-8 bg-gray-950">
            <div className="text-center">
              <h3 className="text-4xl font-bold mb-16">Why Nexo?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="flex flex-col items-center p-6 rounded-xl transition-all hover:bg-white/5">
                  <div className="relative w-20 h-20 mb-5 flex items-center justify-center bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full">
                    <Image src="/file.svg" width={40} height={40} alt="File" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Intelligent Conversations</h4>
                  <p className="text-gray-300 text-sm">Engage in natural and intelligent discussions with our advanced AI.</p>
                </div>
                <div className="flex flex-col items-center p-6 rounded-xl transition-all hover:bg-white/5">
                  <div className="relative w-20 h-20 mb-5 flex items-center justify-center bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-full">
                    <Image src="/window.svg" width={40} height={40} alt="Window" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Seamless Integration</h4>
                  <p className="text-gray-300 text-sm">Easily integrate Nexo into your existing workflows and platforms.</p>
                </div>
                <div className="flex flex-col items-center p-6 rounded-xl transition-all hover:bg-white/5">
                  <div className="relative w-20 h-20 mb-5 flex items-center justify-center bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full">
                    <Image src="/next.svg" width={40} height={40} alt="Next.js" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Personalized Assistance</h4>
                  <p className="text-gray-300 text-sm">Nexo learns and adapts to provide tailored support just for you.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 md:px-8">
              <div className="text-center">
                <h3 className="text-4xl font-bold mb-4">Ready to Dive In?</h3>
                <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                  Experience the power of AI-driven conversations. Get started with Nexo today!
                </p>
                <Link href="/chat" passHref>
                  <button
                    onClick={signInWithGoogle}
                    className="group flex items-center mx-auto bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-7 py-3 rounded-full shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
                  >
                    <span className="font-semibold">Try Nexo AI Now</span>
                    <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </div>
            </section>

            {/* Footer */}
            <footer className="p-8 mt-16 border-t border-white/10">
              <div className="px-4 md:px-8 text-center text-gray-400 text-sm">
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