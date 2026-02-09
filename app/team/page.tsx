"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { FiCode, FiMonitor, FiServer, FiFigma, FiCheckSquare, FiBook, FiDatabase, FiSearch, FiEdit3, FiArrowLeft } from 'react-icons/fi';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/navigation';

const TeamPage = () => {
  const router = useRouter();
  const carousel = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);

  useEffect(() => {
    if (carousel.current) {
      const scrollW = carousel.current.scrollWidth;
      const offsetW = carousel.current.offsetWidth;
      const calculatedWidth = scrollW - offsetW;
      setCarouselWidth(calculatedWidth + 16);
    }
  }, []);

  const ITEM_WIDTH = 320; 
  const ITEM_MARGIN = 24; 
  const ITEM_TOTAL_WIDTH = ITEM_WIDTH + ITEM_MARGIN;

  const x = useMotionValue(0);
  const teamMembers = [
    {
      name: "Alexander G. Pinapit",
      profilePhotoUrl: "",
      role: "Quality Assurance",
      icon: <FiCheckSquare className="text-xl" />,
      roleColor: "text-red-400",
      glow: "shadow-red-500/20"
    },
    {
      name: "Jedrick Neil C. Borbon",
      profilePhotoUrl: "",
      role: "Backend Developer",
      icon: <FiServer className="text-xl" />,
      roleColor: "text-yellow-400",
      glow: "shadow-yellow-500/20"
    },
    {
      name: "Reymart P. Centeno",
      profilePhotoUrl: "",
      role: "Lead Programmer",
      icon: <FiCode className="text-xl" />,
      roleColor: "text-blue-400",
      glow: "shadow-blue-500/20"
    },
    {
      name: "Jullyver M Riopay Jr.",
      profilePhotoUrl: "",
      role: "Technical Writer",
      icon: <FiEdit3 className="text-xl" />,
      roleColor: "text-cyan-400",
      glow: "shadow-cyan-500/20"
    },
    {
      name: "Terrence Q. Roxas",
      profilePhotoUrl: "",
      role: "Researcher",
      icon: <FiSearch className="text-xl" />,
      roleColor: "text-orange-400",
      glow: "shadow-orange-500/20"
    },
    {
      name: "Jasper D. Fernandez",
      profilePhotoUrl: "",
      role: "Data Scientist",
      icon: <FiDatabase className="text-xl" />,
      roleColor: "text-pink-400",
      glow: "shadow-pink-500/20"
    },
    {
      name: "Regie T. Conde",
      profilePhotoUrl: "",
      role: "UI/UX Designer",
      icon: <FiFigma className="text-xl" />,
      roleColor: "text-purple-400",
      glow: "shadow-purple-500/20"
    },
    {
      name: "Einjehl Dhenmar A. Ganzagan",
      profilePhotoUrl: "",
      role: "Frontend Developer",
      icon: <FiMonitor className="text-xl" />,
      roleColor: "text-green-400",
      glow: "shadow-green-500/20"
    },
    {
      name: "Eljay Lolito Oblino Jr.",
      profilePhotoUrl: "",
      role: "Documentation Specialist",
      icon: <FiBook className="text-xl" />,
      roleColor: "text-indigo-400",
      glow: "shadow-indigo-500/20"
    }
  ];

  return (
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden font-sans antialiased">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header/Nav */}
        <div className="absolute top-8 left-8 z-50">
           <IconButton 
            onClick={() => router.push('/')} 
            sx={{ 
                color: 'white', 
                bgcolor: 'white/10', 
                backdropFilter: 'blur(10px)',
                '&:hover': { bgcolor: 'white/20' } 
            }}
           >
             <FiArrowLeft />
           </IconButton>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 flex flex-col items-center mb-16 px-4"
        >
            <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
                <Image
                    src="/nexo.png"
                    alt="Nexo AI Logo"
                    layout="fill"
                    objectFit="contain"
                    className="relative"
                />
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                Nexo AI Team
            </h1>
            <p className="text-xl text-gray-400 text-center max-w-2xl font-medium">
                The brilliant minds behind Nexo AI. A BSIS-2A Group Project for Science, Technology, and Society (MST2).
            </p>
        </motion.div>

        <div className="w-full relative z-10">
          <motion.div ref={carousel} className="carousel cursor-grab overflow-hidden py-10">
            <motion.div
              style={{ x }}
              drag="x"
              dragConstraints={{ right: 0, left: -carouselWidth }}
              className="inner-carousel flex px-[10%]"
            >
              {teamMembers.map((member, index) => {
                const itemXOffset = index * ITEM_TOTAL_WIDTH;
                const viewportWidth = carousel.current?.offsetWidth || 0;
                const centerAlignedX = (viewportWidth / 2) - (itemXOffset + (ITEM_WIDTH / 2));

                const scale = useTransform(
                  x,
                  [
                    centerAlignedX - (ITEM_TOTAL_WIDTH),
                    centerAlignedX,
                    centerAlignedX + (ITEM_TOTAL_WIDTH),
                  ],
                  [0.85, 1, 0.85]
                );

                const opacity = useTransform(
                  scale,
                  [0.85, 1],
                  [0.4, 1]
                );

                return (
                  <motion.div
                    key={index}
                    style={{ scale, opacity }}
                    className={`item min-w-[320px] h-[450px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-10 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-white/20 mr-6 shadow-2xl ${member.glow}`}
                  >
                    <div className="relative w-32 h-32 mb-8">
                        <div className={`absolute inset-0 bg-current opacity-20 rounded-full blur-xl ${member.roleColor}`}></div>
                        <Image
                          src={member.profilePhotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff&size=256`}
                          alt={`${member.name}'s profile`}
                          layout="fill"
                          className="rounded-full relative object-cover ring-2 ring-white/10"
                        />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">{member.name}</h2>
                    
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 ${member.roleColor}`}>
                      {member.icon}
                      <span className="text-sm font-bold uppercase tracking-widest">{member.role}</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 flex gap-2">
            {[...Array(3)].map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === 1 ? 'w-8 bg-blue-500' : 'w-2 bg-white/20'}`}></div>
            ))}
        </div>
      </div>
  );
};

export default TeamPage;
