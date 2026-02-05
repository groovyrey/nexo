"use client";
import React from 'react';
import { FiUser, FiMail, FiKey, FiActivity } from 'react-icons/fi';
import Link from 'next/link';
import { useAuthContext } from '../../lib/context';
import Image from 'next/image';
import Button from '@mui/material/Button';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const DashboardPage = () => {
  const authContext = useAuthContext();

  // If authContext is null, it means the user session is not yet loaded or user is not logged in.
  // This component likely expects a logged-in user.
  if (!authContext) {
    return null; // Or return a loading spinner if desired
  }

  const { user } = authContext;

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
          variant="gradient"
          endIcon={<ArrowRightIcon />}
        >
          Start Chatting with Nexo
        </Button>
        {/* Link to Usage Page */}
        <Button
          component={Link} // Use the Next.js Link component
          href="/dashboard/usage"     // Pass href directly to the Button
          variant="gradient"
          endIcon={<FiActivity />} // Using FiActivity for usage page
          sx={{ mt: 2 }} // Add some top margin for spacing
        >
          View Usage
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;