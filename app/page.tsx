"use client";

import Image from "next/image";
import { FiArrowRight, FiTwitter, FiLinkedin, FiGithub, FiLogOut, FiLogIn, FiUser, FiMessageSquare, FiLayers } from "react-icons/fi";
import { useAuthContext } from "@/lib/context";
import { signInWithGoogle, signOutWithGoogle } from "@/lib/auth";
import LoggedInHomepage from "./components/LoggedInHomepage";
import Link from 'next/link';

export default function Home() {
  const { user } = useAuthContext();

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 py-3 px-4 bg-black/50 backdrop-blur-lg flex items-center justify-between border-b border-gray-800">
        <nav className="px-4 md:px-8 flex justify-between items-center w-full">
          <div className="flex items-center space-x-2">
            <Image src="/nexo.png" width={32} height={32} alt="Nexo Logo" />
          </div>
          <div>
            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={signOutWithGoogle}
                  className="bg-red-600/80 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-500 transition-colors flex items-center"
                >
                  <FiLogOut className="mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="bg-indigo-600/80 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-500 transition-colors flex items-center"
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
                <button
                  onClick={signInWithGoogle}
                  className="group flex items-center bg-indigo-600 text-white px-7 py-3 rounded-full shadow-lg hover:shadow-indigo-500/50 transition-all transform hover:scale-105"
                >
                  <span className="font-semibold">Start Chatting with Nexo</span>
                  <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </button>
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
                  <button
                    onClick={signInWithGoogle}
                    className="group flex items-center mx-auto bg-indigo-600 text-white px-7 py-3 rounded-full shadow-lg hover:shadow-indigo-500/50 transition-all transform hover:scale-105"
                  >
                    <span className="font-semibold">Try Nexo AI Now</span>
                    <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </button>
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