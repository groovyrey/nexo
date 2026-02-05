"use client";

import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, LinearProgress, Chip, Alert } from '@mui/material';
import { FiMonitor, FiDollarSign, FiClock, FiCalendar, FiMessageSquare, FiCpu, FiDatabase, FiBarChart2 } from 'react-icons/fi'; // Importing icons
import { useAuthContext } from '@/lib/context';
import { getConversationList } from '@/lib/realtimedb';

const UsagePage = () => {


  const { user, loading } = useAuthContext();
  const [conversationCount, setConversationCount] = useState<number>(0);
  const MAX_CONVERSATIONS = 5;

  useEffect(() => {
    if (!loading && user) {
      const unsubscribe = getConversationList(user.uid, (conversations) => {
        setConversationCount(conversations.length);
      });
      return () => unsubscribe();
    }
  }, [user, loading]);

  return (
    <Box sx={{ p: 4, color: 'white', maxWidth: 800, mx: 'auto' }}>

      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
        <FiMonitor style={{ verticalAlign: 'middle', marginRight: '10px' }} />
        Your Usage Overview
      </Typography>

      <Paper elevation={3} sx={{ bgcolor: '#2a2a2a', p: 3, borderRadius: '12px', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ color: 'white' }}>
            Conversation Usage
          </Typography>
          <Chip label={`${conversationCount} / ${MAX_CONVERSATIONS}`} color="primary" size="small" />
        </Box>
        <LinearProgress
          variant="determinate"
          value={(conversationCount / MAX_CONVERSATIONS) * 100}
          sx={{ height: 10, borderRadius: 5, bgcolor: '#555' }}
        />
        <Typography variant="body2" sx={{ mt: 1, color: 'gray' }}>
          Conversations used this period.
        </Typography>
      </Paper>





      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4, color: 'gray' }}>
        Usage data is updated periodically. Final billing may vary.
      </Typography>
    </Box>
  );
};

export default UsagePage;
