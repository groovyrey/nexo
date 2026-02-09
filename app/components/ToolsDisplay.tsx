'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import * as FiIcons from 'react-icons/fi';

interface Tool {
  name: string;
  description: string;
  icon: string;
}

interface ToolsDisplayProps {
  toolsList: Tool[];
}

export default function ToolsDisplay({ toolsList }: ToolsDisplayProps) {
  return (
    <section className="py-24 px-4 md:px-8 bg-black relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <Typography 
            variant="h3" 
            component="h3" 
            className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500"
          >
            Nexo's Capabilities
          </Typography>
          <Typography variant="body1" className="text-gray-400 max-w-2xl mx-auto text-lg">
            Empowering your conversations with a suite of advanced tools designed for efficiency and intelligence.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolsList.map((tool, index) => {
            const IconComponent = (FiIcons as any)[tool.icon] || FiIcons.FiTool;
            return (
              <div 
                key={index}
                className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400/20 to-indigo-500/20 flex items-center justify-center mb-6 group-hover:from-blue-400/30 group-hover:to-indigo-500/30 transition-colors">
                  <IconComponent className="text-blue-400 text-2xl group-hover:scale-110 transition-transform" />
                </div>

                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {tool.name}
                </h4>
                
                <p className="text-gray-400 leading-relaxed text-sm">
                  {tool.description}
                </p>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
