"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { FiCode, FiMonitor, FiServer, FiFigma, FiCheckSquare, FiBook, FiDatabase, FiSearch, FiEdit3 } from 'react-icons/fi';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const TeamPage = () => {
  const carousel = useRef(null);
  const [carouselWidth, setCarouselWidth] = useState(0);

  useEffect(() => {
    if (carousel.current) {
      const scrollW = carousel.current.scrollWidth;
      const offsetW = carousel.current.offsetWidth;
      const calculatedWidth = scrollW - offsetW;
      setCarouselWidth(calculatedWidth + 16);
    }
  }, []);

  const ITEM_WIDTH = 300; // From min-w-[300px]
  const ITEM_MARGIN = 16; // From mr-4
  const ITEM_TOTAL_WIDTH = ITEM_WIDTH + ITEM_MARGIN;

  const x = useMotionValue(0);
  const teamMembers = [
    {
      name: "Alexander G. Pinapit",
      profilePhotoUrl: "",
      role: "Quality Assurance",
      icon: <FiCheckSquare className="text-xl" />,
      roleColor: "text-red-400"
    },
    {
      name: "Jedrick Neil C. Borbon",
      profilePhotoUrl: "",
      role: "Backend Developer",
      icon: <FiServer className="text-xl" />,
      roleColor: "text-yellow-400"
    },
    {
      name: "Reymart P. Centeno",
      profilePhotoUrl: "",
      role: "Lead Programmer",
      icon: <FiCode className="text-xl" />,
      roleColor: "text-blue-400"
    },
    {
      name: "Jullyver M Riopay Jr.",
      profilePhotoUrl: "",
      role: "Technical Writer",
      icon: <FiEdit3 className="text-xl" />,
      roleColor: "text-cyan-400"
    },
    {
      name: "Terrence Q. Roxas",
      profilePhotoUrl: "",
      role: "Researcher",
      icon: <FiSearch className="text-xl" />,
      roleColor: "text-orange-400"
    },
    {
      name: "Jasper D. Fernandez",
      profilePhotoUrl: "",
      role: "Data Scientist",
      icon: <FiDatabase className="text-xl" />,
      roleColor: "text-pink-400"
    },
    {
      name: "Regie T. Conde",
      profilePhotoUrl: "",
      role: "UI/UX Designer",
      icon: <FiFigma className="text-xl" />,
      roleColor: "text-purple-400"
    },
    {
      name: "Einjehl Dhenmar A. Ganzagan",
      profilePhotoUrl: "",
      role: "Frontend Developer",
      icon: <FiMonitor className="text-xl" />,
      roleColor: "text-green-400"
    },
    {
      name: "Eljay Lolito Oblino Jr.",
      profilePhotoUrl: "",
      role: "Documentation Specialist",
      icon: <FiBook className="text-xl" />,
      roleColor: "text-indigo-400"
    }
  ];

  return (
      <div
        className="flex flex-col items-center justify-center min-h-screen text-white"
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
          <motion.div ref={carousel} className="carousel cursor-grab overflow-hidden rounded-2xl carousel-fading-edge">
            <motion.div
              style={{ x }}
              drag="x"
              dragConstraints={{ right: 0, left: -carouselWidth }}
              className="inner-carousel flex"
            >
              {teamMembers.map((member, index) => {
                const itemXOffset = index * ITEM_TOTAL_WIDTH;
                // Calculate the x position of the inner-carousel that would center this item in the viewport
                const centerAlignedX = (carousel.current?.offsetWidth / 2 || 0) - (itemXOffset + (ITEM_WIDTH / 2));

                const scale = useTransform(
                  x, // The MotionValue from the draggable inner-carousel
                  [
                    centerAlignedX - (ITEM_TOTAL_WIDTH), // When item is ITEM_TOTAL_WIDTH to the left of center, scale down
                    centerAlignedX,                     // When item is centered, full scale
                    centerAlignedX + (ITEM_TOTAL_WIDTH),  // When item is ITEM_TOTAL_WIDTH to the right of center, scale down
                  ],
                  [0.8, 1, 0.8] // Output scale range
                );

                const shadow = useTransform(
                  scale, // Use scale as input MotionValue
                  [0.8, 1], // Input scale range
                  ["0px 0px 10px rgba(0, 0, 0, 0.3)", "0px 0px 30px rgba(0, 0, 0, 0.7)"] // Output shadow range
                );

                return (
                  <motion.div
                    key={index}
                    style={{ scale, boxShadow: shadow }} // Apply both scale and boxShadow
                    className="item min-w-[300px] bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl p-6 flex flex-col items-center text-center hover:scale-105 mr-4"
                  >
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
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
  );
};

export default TeamPage;
