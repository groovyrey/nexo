"use client";

import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, LinearProgress, Chip, Card, CardContent, Tabs, Tab, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import MessageIcon from '@mui/icons-material/Message';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PollIcon from '@mui/icons-material/Poll';
import MonitorIcon from '@mui/icons-material/Monitor';
import { useAuthContext } from '@/lib/context';
import { getConversationList, getMessageStats, MessageStats, ConversationMetadata } from '@/lib/realtimedb';
import { formatTimeAgo } from '@/lib/timeUtils';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      <AnimatePresence mode="wait">
        {value === index && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ py: 4 }}>{children}</Box>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const UsagePage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();
  const [conversationCount, setConversationCount] = useState<number>(0);
  const [latestConversation, setLatestConversation] = useState<ConversationMetadata | null>(null);
  const [dailyConversationData, setDailyConversationData] = useState<{ date: string; conversations: number }[]>([]);

  const { data: messageStats, isLoading: statsLoading } = useQuery({
    queryKey: ['messageStats', user?.uid],
    queryFn: () => getMessageStats(user!.uid),
    enabled: !!user,
  });

  const MAX_CONVERSATIONS = 5;
  const MAX_CONVOS_FOR_GRAPH = 5;
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!authLoading && user) {
      const unsubscribe = getConversationList(user.uid, (conversations) => {
        setConversationCount(conversations.length);
        if (conversations.length > 0) setLatestConversation(conversations[0]);
      });
      return () => unsubscribe();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (messageStats?.allConversationsStats && messageStats.allConversationsStats.length > 0) {
      const dailyCounts: { [key: string]: number } = {};
      messageStats.allConversationsStats.forEach(convo => {
        const date = new Date(convo.timestamp).toISOString().split('T')[0];
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
      });
      const sortedDates = Object.keys(dailyCounts).sort();
      setDailyConversationData(sortedDates.map(date => ({ date, conversations: dailyCounts[date] })));
    }
  }, [messageStats]);

  if (authLoading || statsLoading || !messageStats) {
      return (
          <div className="min-h-screen bg-black flex items-center justify-center">
              <LinearProgress sx={{ width: '200px', borderRadius: 1 }} />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 relative overflow-hidden font-sans antialiased">
      {/* Background Decor */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <Box sx={{ maxWidth: 900, mx: 'auto', position: 'relative', zIndex: 10 }}>
        <header className="flex items-center justify-between mb-12">
            <IconButton onClick={() => router.back()} sx={{ color: 'white', bgcolor: 'white/5', '&:hover': { bgcolor: 'white/10' } }}>
                <ArrowBackIcon />
            </IconButton>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
                <ShowChartIcon sx={{ color: 'blue.500' }} />
                Usage Analytics
            </h1>
            <div className="w-10"></div>
        </header>

        <Paper 
            elevation={0}
            sx={{ 
                bgcolor: 'rgba(255,255,255,0.03)', 
                backdropFilter: 'blur(20px)',
                borderRadius: '32px', 
                border: '1px solid rgba(255,255,255,0.08)',
                overflow: 'hidden'
            }}
        >
            <Tabs 
                value={value} 
                onChange={(e, v) => setValue(v)} 
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{ 
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    '& .MuiTabs-flexContainer': {
                      justifyContent: { sm: 'space-around' }
                    },
                    '& .MuiTab-root': { 
                      color: 'gray', 
                      fontWeight: 'bold', 
                      py: { xs: 2, md: 3 }, 
                      minWidth: { xs: 120, sm: 160 },
                      transition: 'all 0.3s' 
                    },
                    '& .Mui-selected': { color: 'white !important' },
                    '& .MuiTabs-indicator': { height: 4, borderRadius: '4px 4px 0 0', bgcolor: 'blue.600' }
                }}
            >
                <Tab label="Conversations" icon={<MessageIcon />} iconPosition="start" />
                <Tab label="Messages" icon={<PollIcon />} iconPosition="start" />
                <Tab label="Trends" icon={<TrendingUpIcon />} iconPosition="start" />
            </Tabs>

            <Box sx={{ p: { xs: 2, md: 6 } }}>
                <TabPanel value={value} index={0}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 rounded-[32px] bg-white/5 border border-white/5 flex flex-col justify-between">
                            <div>
                                <Typography variant="overline" sx={{ color: 'gray', fontWeight: 'bold', tracking: '0.2em' }}>Quota Usage</Typography>
                                <Typography variant="h3" sx={{ fontWeight: 'black', my: 2 }}>{conversationCount} / {MAX_CONVERSATIONS}</Typography>
                            </div>
                            <Box sx={{ mt: 2 }}>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={(conversationCount / MAX_CONVERSATIONS) * 100} 
                                    sx={{ height: 12, borderRadius: 6, bgcolor: 'white/5', '& .MuiLinearProgress-bar': { borderRadius: 6, bgcolor: 'blue.600' } }}
                                />
                                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'gray' }}>Active conversations this cycle</Typography>
                            </Box>
                        </div>

                        {latestConversation && (
                            <div className="p-8 rounded-[32px] bg-white/5 border border-white/5">
                                <Typography variant="overline" sx={{ color: 'gray', fontWeight: 'bold', tracking: '0.2em' }}>Latest Activity</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }} noWrap>{latestConversation.title}</Typography>
                                <Typography variant="body2" sx={{ color: 'gray', fontStyle: 'italic', mb: 3 }} noWrap>"{latestConversation.lastMessageSnippet}"</Typography>
                                <Chip 
                                    label={formatTimeAgo(latestConversation.timestamp)} 
                                    sx={{ bgcolor: 'white/5', color: 'blue.400', fontWeight: 'bold', border: '1px solid rgba(59,130,246,0.2)' }} 
                                />
                            </div>
                        )}
                    </div>
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="p-8 rounded-[32px] bg-white/5 border border-white/5 text-center">
                            <Typography variant="overline" sx={{ color: 'gray', fontWeight: 'bold', tracking: '0.2em' }}>Total Processed</Typography>
                            <Typography variant="h2" sx={{ fontWeight: 'black', my: 2, color: 'blue.400' }}>{messageStats.totalMessages}</Typography>
                            <Typography variant="body2" sx={{ color: 'gray' }}>Messages sent across all sessions</Typography>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {messageStats.mostMessagesConvo && (
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                                    <Typography variant="caption" sx={{ color: 'gray', fontWeight: 'bold' }}>Most Active</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>{messageStats.mostMessagesConvo.title}</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 'black', mt: 1, color: 'green.400' }}>{messageStats.mostMessagesConvo.messageCount} msgs</Typography>
                                </div>
                            )}
                            {messageStats.leastMessagesConvo && (
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                                    <Typography variant="caption" sx={{ color: 'gray', fontWeight: 'bold' }}>Least Active</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>{messageStats.leastMessagesConvo.title}</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 'black', mt: 1, color: 'orange.400' }}>{messageStats.leastMessagesConvo.messageCount} msgs</Typography>
                                </div>
                            )}
                        </div>
                    </div>
                </TabPanel>

                <TabPanel value={value} index={2}>
                    <div className="space-y-8">
                        {messageStats.allConversationsStats.length > 0 && (
                            <div className="p-6 rounded-[32px] bg-white/2 border border-white/5">
                                <Typography variant="subtitle2" sx={{ mb: 4, fontWeight: 'bold', color: 'gray' }}>Message Distribution (Top 5)</Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={messageStats.allConversationsStats.slice(0, MAX_CONVOS_FOR_GRAPH).map(c => ({
                                        name: c.title.substring(0, 10) + (c.title.length > 10 ? '...' : ''),
                                        count: c.messageCount
                                    }))}>
                                        <XAxis dataKey="name" stroke="#444" fontSize={10} />
                                        <YAxis stroke="#444" fontSize={10} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                            itemStyle={{ color: '#3b82f6' }}
                                        />
                                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {dailyConversationData.length > 0 && (
                            <div className="p-6 rounded-[32px] bg-white/2 border border-white/5">
                                <Typography variant="subtitle2" sx={{ mb: 4, fontWeight: 'bold', color: 'gray' }}>Creation Velocity</Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={dailyConversationData}>
                                        <XAxis dataKey="date" stroke="#444" fontSize={10} />
                                        <YAxis stroke="#444" fontSize={10} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                            itemStyle={{ color: '#10b981' }}
                                        />
                                        <Line type="monotone" dataKey="conversations" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </TabPanel>
            </Box>
        </Paper>

        <p className="text-center text-[10px] text-gray-600 mt-12 uppercase tracking-[0.3em] font-bold">Nexo AI Usage Analytics</p>
      </Box>
    </div>
  );
};

export default UsagePage;
