import React from 'react';
import { FiSmile, FiArrowRight } from 'react-icons/fi'; // Import FiArrowRight for the link
import Link from 'next/link'; // Import Link for navigation

const LoggedInHomepage = () => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-white text-center p-4">
      {/* Welcome Section */}
      <div className="text-center p-4 mb-8">
        <FiSmile className="text-6xl text-yellow-400 mb-6 animate-bounce-slow mx-auto" />
        <h1 className="text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          Welcome Back!
        </h1>
        <p className="text-xl text-gray-300 max-w-md leading-relaxed mb-8">
          You're successfully logged in and ready to explore Nexo.
        </p>
        {/* Link to Chat Page */}
        <Link href="/chat" passHref>
          <button className="group flex items-center mx-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-7 py-3 rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105">
            <span className="font-semibold">Start Chatting with Nexo</span>
            <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LoggedInHomepage;
