import React from 'react';
import { FiUser, FiMail, FiKey } from 'react-icons/fi';
import Link from 'next/link';
import { useAuthContext } from '../../lib/context';
import Image from 'next/image';
import Button from '@mui/material/Button'; // New import
import ArrowRightIcon from '@mui/icons-material/ArrowRight'; // New import

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
        <Button
          component={Link} // Use the Next.js Link component
          href="/chat/default"     // Pass href directly to the Button
          variant="contained"
          endIcon={<ArrowRightIcon />}
          sx={{
            background: 'linear-gradient(to right, #06b6d4, #2563eb)', // Tailwind's from-cyan-500 to-blue-600
            color: 'white',
            px: 3, // Tailwind's px-7 is roughly px:3 in MUI default spacing
            py: 1.5, // Tailwind's py-3 is roughly py:1.5
            borderRadius: '9999px', // rounded-full
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
            '&:hover': {
              boxShadow: '0 20px 25px -5px rgba(6, 182, 212, 0.5), 0 8px 10px -6px rgba(6, 182, 212, 0.5)', // hover:shadow-cyan-500/50
              transform: 'scale(1.05)',
              transition: 'all 0.3s ease-in-out',
              background: 'linear-gradient(to right, #0891b2, #1d4ed8)', // Darker gradient on hover
            },
            fontSize: '1rem', // font-semibold for similar size
          }}
        >
          Start Chatting with Nexo
        </Button>
      </div>
    </div>
  );
};

export default LoggedInHomepage;
