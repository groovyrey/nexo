"use client";

import React from 'react';
import Image from 'next/image';
import { FiCode, FiMonitor, FiServer, FiFigma, FiCheckSquare, FiBook, FiDatabase, FiSearch, FiEdit3 } from 'react-icons/fi';

const TeamPage = () => {
  const teamMembers = [
    {
      name: "Reymart P. Centeno",
      profilePhotoUrl: "",
      role: "Lead Programmer",
      icon: <FiCode className="text-xl" />,
      roleColor: "text-blue-400"
    },
    {
      name: "Einjehl Dhenmar Ganzagan",
      profilePhotoUrl: "",
      role: "Frontend Developer",
      icon: <FiMonitor className="text-xl" />,
      roleColor: "text-green-400"
    },
    {
      name: "Jedrick Borbon",
      profilePhotoUrl: "",
      role: "Backend Developer",
      icon: <FiServer className="text-xl" />,
      roleColor: "text-yellow-400"
    },
    {
      name: "Regie Conde",
      profilePhotoUrl: "",
      role: "UI/UX Designer",
      icon: <FiFigma className="text-xl" />,
      roleColor: "text-purple-400"
    },
    {
      name: "Alexander Pinapit",
      profilePhotoUrl: "",
      role: "Quality Assurance",
      icon: <FiCheckSquare className="text-xl" />,
      roleColor: "text-red-400"
    },
    {
      name: "Eljay Oblino",
      profilePhotoUrl: "",
      role: "Documentation Specialist",
      icon: <FiBook className="text-xl" />,
      roleColor: "text-indigo-400"
    },
    {
      name: "Jasper Fernandez",
      profilePhotoUrl: "",
      role: "Data Scientist",
      icon: <FiDatabase className="text-xl" />,
      roleColor: "text-pink-400"
    },
    {
      name: "Terrence Roxas",
      profilePhotoUrl: "",
      role: "Researcher",
      icon: <FiSearch className="text-xl" />,
      roleColor: "text-orange-400"
    },
    {
      name: "Jullyver Riopay",
      profilePhotoUrl: "",
      role: "Technical Writer",
      icon: <FiEdit3 className="text-xl" />,
      roleColor: "text-cyan-400"
    }
  ];

  return (
      <div
        className="flex flex-col items-center justify-center min-h-screen text-white animated-gradient"
      >
        <Image
          src="/nexo.png"
          alt="Nexo AI Logo"
          width={200}
          height={200}
          className="mb-6 rounded-full"
        />
        <h1 className="text-5xl font-bold mb-4 text-white">Nexo AI Team</h1>
        <p className="text-lg mb-8 text-gray-300 text-center">A BSIS-2A Group Project for Science, Technology, and Society (MST2)</p>

        <div className="w-full max-w-5xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-white/20">
                <Image
                  src={member.profilePhotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff&size=128`}
                  alt={`${member.name}'s profile`}
                  width={96}
                  height={96}
                  className="rounded-full mb-4 ring-4 ring-white/20"
                />
                <h2 className="text-2xl font-semibold text-white mt-2">{member.name}</h2>
                <p className={`${member.roleColor} font-medium flex items-center justify-center gap-2`}>
                  {member.icon}{member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default TeamPage;
