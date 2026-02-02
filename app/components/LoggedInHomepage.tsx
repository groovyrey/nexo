import React from 'react';
import { FiArrowRight, FiUser, FiMail, FiKey } from 'react-icons/fi';
import Link from 'next/link';
import { useAuthContext } from '../../lib/context';
import Image from 'next/image';

const LoggedInHomepage = () => {
  const { user } = useAuthContext();

  return (
    <div className="flex-grow flex flex-col items-center justify-start text-white text-center p-4">
      {/* Profile Card */}
      {user && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 mb-8 max-w-md w-full flex flex-col items-center border border-white/20">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt="User Profile"
              width={128}
              height={128}
              className="rounded-full mb-6 ring-4 ring-white/20"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-blue-500/80 flex items-center justify-center text-5xl font-bold mb-6 ring-4 ring-white/20">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-2 text-white flex items-center justify-center">
              <FiUser className="mr-3 text-cyan-300" />
              {user.displayName || 'User'}
            </h2>
            <p className="text-cyan-200 text-lg mb-4 flex items-center justify-center">
              <FiMail className="mr-3 text-cyan-300" />
              {user.email}
            </p>
            <p className="text-gray-400 text-sm flex items-center justify-center">
              <FiKey className="mr-3 text-gray-500" />
              UID: {user.uid}
            </p>
          </div>
        </div>
      )}

      <div className="text-center p-4 mb-8">
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
