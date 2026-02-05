"use client";

import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, LinearProgress, Chip, Card, CardContent, Tabs, Tab } from '@mui/material';
import { FiMonitor, FiDollarSign, FiClock, FiCalendar, FiMessageSquare, FiCpu, FiDatabase, FiBarChart2 } from 'react-icons/fi'; // Importing icons
import { useAuthContext } from '@/lib/context';
import { getConversationList, getMessageStats, MessageStats, ConversationMetadata } from '@/lib/realtimedb';
import { formatTimeAgo } from '@/lib/timeUtils';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const UsagePage = () => {


  const { user, loading } = useAuthContext();
  const [conversationCount, setConversationCount] = useState<number>(0);
  const [messageStats, setMessageStats] = useState<MessageStats>({
    totalMessages: 0,
    mostMessagesConvo: null,
    leastMessagesConvo: null,
    allConversationsStats: [],
  });
  const [latestConversation, setLatestConversation] = useState<ConversationMetadata | null>(null);
  const [dailyConversationData, setDailyConversationData] = useState<{ date: string; conversations: number }[]>([]);

  const MAX_CONVERSATIONS = 5;
  const MAX_TOTAL_MESSAGES = 100;
  const MAX_CONVOS_FOR_GRAPH = 5; // Display top 5 conversations in the graph

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!loading && user) {
      const unsubscribe = getConversationList(user.uid, (conversations) => {
        setConversationCount(conversations.length);
        if (conversations.length > 0) {
          setLatestConversation(conversations[0]); // The list is sorted by most recent first
        } else {
          setLatestConversation(null);
        }
      });

      const fetchMessageStats = async () => {
        const stats = await getMessageStats(user.uid);
        setMessageStats(stats);
      };
      fetchMessageStats();

      return () => {
        unsubscribe();
      };
    }
  }, [user, loading]);

  useEffect(() => {
    if (messageStats.allConversationsStats.length > 0) {
      const dailyCounts: { [key: string]: number } = {};
      messageStats.allConversationsStats.forEach(convo => {
        const date = new Date(convo.timestamp).toISOString().split('T')[0]; // YYYY-MM-DD
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
      });

      const sortedDates = Object.keys(dailyCounts).sort();
      const processedData = sortedDates.map(date => ({
        date,
        conversations: dailyCounts[date],
      }));
      setDailyConversationData(processedData);
    }
  }, [messageStats.allConversationsStats]);

  return (
    <Box sx={{ p: 4, color: 'white', maxWidth: 800, mx: 'auto' }}>

      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
        <FiMonitor style={{ verticalAlign: 'middle', marginRight: '10px' }} />
        Your Usage Overview
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={value} onChange={handleChange} aria-label="Usage tabs" indicatorColor="primary" textColor="inherit">
          <Tab label="Convos" />
          <Tab label="Messages" />
          <Tab label="Graphs" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <Card elevation={3} sx={{ bgcolor: '#2a2a2a', borderRadius: '12px', mb: 4 }}>
          <CardContent>
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
          </CardContent>
        </Card>

        {latestConversation && (
          <Card elevation={3} sx={{ bgcolor: '#2a2a2a', borderRadius: '12px', mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Latest Conversation
                </Typography>
                <Chip label={formatTimeAgo(latestConversation.timestamp)} color="info" size="small" />
              </Box>
              <Typography variant="body2" sx={{ mt: 1, color: 'gray' }}>
                "{latestConversation.title}"
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'lightgray', fontStyle: 'italic' }}>
                "{latestConversation.lastMessageSnippet}"
              </Typography>
            </CardContent>
          </Card>
        )}
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Card elevation={3} sx={{ bgcolor: '#2a2a2a', borderRadius: '12px', mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'white' }}>
                Total Messages
              </Typography>
              <Chip label={`${messageStats.totalMessages} / ${MAX_TOTAL_MESSAGES}`} color="primary" size="small" />
            </Box>
            <LinearProgress
              variant="determinate"
              value={(messageStats.totalMessages / MAX_TOTAL_MESSAGES) * 100}
              sx={{ height: 10, borderRadius: 5, bgcolor: '#555' }}
            />
            <Typography variant="body2" sx={{ mt: 1, color: 'gray' }}>
              {`${messageStats.totalMessages} / ${MAX_TOTAL_MESSAGES} messages sent this period.`}
            </Typography>
          </CardContent>
        </Card>

        {messageStats.mostMessagesConvo && (
          <Card elevation={3} sx={{ bgcolor: '#2a2a2a', borderRadius: '12px', mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Most Active Conversation
                </Typography>
                <Chip label={`${messageStats.mostMessagesConvo.messageCount} messages`} color="secondary" size="small" />
              </Box>
              <Typography variant="body2" sx={{ mt: 1, color: 'gray' }}>
                "{messageStats.mostMessagesConvo.title}"
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'lightgray', fontStyle: 'italic' }}>
                "{messageStats.mostMessagesConvo.lastMessageSnippet}"
              </Typography>
            </CardContent>
          </Card>
        )}

        {messageStats.leastMessagesConvo && (
          <Card elevation={3} sx={{ bgcolor: '#2a2a2a', borderRadius: '12px', mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Least Active Conversation
                </Typography>
                <Chip label={`${messageStats.leastMessagesConvo.messageCount} messages`} color="secondary" size="small" />
              </Box>
              <Typography variant="body2" sx={{ mt: 1, color: 'gray' }}>
                "{messageStats.leastMessagesConvo.title}"
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'lightgray', fontStyle: 'italic' }}>
                "{messageStats.leastMessagesConvo.lastMessageSnippet}"
              </Typography>
            </CardContent>
          </Card>
        )}
      </TabPanel>

      <TabPanel value={value} index={2}>
        {messageStats.allConversationsStats.length > 0 && (
          <Card elevation={3} sx={{ bgcolor: '#2a2a2a', borderRadius: '12px', mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Top Conversations by Messages
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={messageStats.allConversationsStats.slice(0, MAX_CONVOS_FOR_GRAPH).map(convo => ({
                    name: convo.title.length > 20 ? convo.title.substring(0, 17) + "..." : convo.title,
                    "Message Count": convo.messageCount
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                    contentStyle={{ backgroundColor: '#333', borderColor: '#555', color: 'white' }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Legend />
                  <Bar dataKey="Message Count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
                        <Typography variant="body2" sx={{ mt: 1, color: 'gray' }}>
                          Top {MAX_CONVOS_FOR_GRAPH} conversations by number of messages.
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
              
                  {dailyConversationData.length > 0 && (
                    <Card elevation={3} sx={{ bgcolor: '#2a2a2a', borderRadius: '12px', mb: 4 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                          Conversations Created Over Time
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart
                            data={dailyConversationData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="date" stroke="#999" />
                            <YAxis stroke="#999" />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#333', borderColor: '#555', color: 'white' }}
                              itemStyle={{ color: 'white' }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="conversations" stroke="#82ca9d" activeDot={{ r: 8 }} />
                          </LineChart>
                        </ResponsiveContainer>
                        <Typography variant="body2" sx={{ mt: 1, color: 'gray' }}>
                          Number of conversations created each day.
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                    </TabPanel>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4, color: 'gray' }}>
        Usage data is updated periodically. Final billing may vary.
      </Typography>
    </Box>
  );
};

export default UsagePage;
