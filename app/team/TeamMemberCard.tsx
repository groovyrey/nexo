// app/team/TeamMemberCard.tsx
import React from 'react';
import Image from 'next/image';
import { motion, useTransform, MotionValue } from 'framer-motion';
import * as FiIcons from 'react-icons/fi'; // Import all Feather Icons

interface TeamMember {
  name: string;
  profilePhotoUrl: string;
  role: string;
  icon: React.ReactElement; // Should be a ReactElement, not just string
  roleColor: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
  x: MotionValue<number>;
  ITEM_TOTAL_WIDTH: number;
  ITEM_WIDTH: number;
  viewportWidth: number;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, index, x, ITEM_TOTAL_WIDTH, ITEM_WIDTH, viewportWidth }) => {
  const itemXOffset = index * ITEM_TOTAL_WIDTH;
  const centerAlignedX = (viewportWidth / 2) - (itemXOffset + (ITEM_WIDTH / 2));

  const scale = useTransform(
    x,
    [
      centerAlignedX - (ITEM_TOTAL_WIDTH),
      centerAlignedX,
      centerAlignedX + (ITEM_TOTAL_WIDTH),
    ],
    [0.8, 1, 0.8]
  );

  const shadow = useTransform(
    scale,
    [0.8, 1],
    ["0px 0px 10px rgba(0, 0, 0, 0.3)", "0px 0px 30px rgba(0, 0, 0, 0.7)"]
  );

  return (
    <motion.div
      key={index}
      style={{ scale, boxShadow: shadow }}
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
};

export default TeamMemberCard;
