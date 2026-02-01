import React from 'react';
import { FiSmile, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import { useAuthContext } from '../../lib/context';
import Image from 'next/image';

const LoggedInHomepage = () => {
  const { user } = useAuthContext();

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-white text-center p-4">
      {/* Profile Card */}
      {user && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 max-w-sm w-full flex flex-col items-center">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt="User Profile"
              width={96}
              height={96}
              className="rounded-full mb-4 ring-2 ring-blue-500"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-700 flex items-center justify-center text-3xl font-bold mb-4">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
            </div>
          )}
          <h2 className="text-3xl font-bold mb-2 text-white">{user.displayName || 'User'}</h2>
          <p className="text-blue-300 text-lg mb-1">{user.email}</p>
          <p className="text-gray-400 text-sm">UID: {user.uid}</p>
        </div>
      )}

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
