'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import * as FiIcons from 'react-icons/fi'; // Import all Feather Icons

interface Tool {
  name: string;
  description: string;
  icon: string; // Name of the Feather Icon to use
}

interface ToolsDisplayProps {
  toolsList: Tool[];
}

export default function ToolsDisplay({ toolsList }: ToolsDisplayProps) {
  return (
    <section className="py-24 px-4 md:px-8 bg-black">
      <div className="text-center max-w-6xl mx-auto">
        <Typography variant="h3" component="h3" className="text-4xl font-bold mb-16 text-white">
          Nexo's Capabilities
        </Typography>
        <Card className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg">
          <CardContent>
            <List>
              {toolsList.map((tool, index) => {
                const IconComponent = (FiIcons as any)[tool.icon] || FiIcons.FiTool; // Fallback to FiTool
                return (
                  <ListItem key={index} className="py-4 border-b border-gray-700 last:border-b-0">
                    <ListItemIcon>
                      <IconComponent className="text-blue-400 text-2xl" />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="h6" className="text-white font-semibold">{tool.name}</Typography>}
                      secondary={<Typography variant="body2" className="text-gray-400">{tool.description}</Typography>}
                    />
                  </ListItem>
                );
              })}
            </List>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
