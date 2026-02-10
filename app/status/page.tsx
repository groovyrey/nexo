"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, LinearProgress, IconButton, Tooltip, Grid, Avatar } from '@mui/material';
import { 
  FiArrowLeft, 
  FiActivity, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiServer, 
  FiDatabase, 
  FiShield, 
  FiGlobe,
  FiRefreshCw,
  FiInfo
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const StatusCard = ({ 
  title, 
  status, 
  latency, 
  icon, 
  description,
  color
}: { 
  title: string; 
  status: 'operational' | 'degraded' | 'outage' | 'loading'; 
  latency?: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}) => {
  const isStatusLoading = status === 'loading';
  const displayColor = isStatusLoading ? 'blue' : color;
  const displayStatus = isStatusLoading ? 'checking...' : status;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          bgcolor: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '32px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.04)',
            borderColor: `${displayColor}40`,
          }
        }}
      >
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${displayColor}-500/10 blur-[60px] pointer-events-none`}></div>
        
        <div className="flex items-center justify-between mb-6">
          <div className={`p-3 rounded-2xl bg-${displayColor}-500/10 text-${displayColor}-400`}>
            {icon}
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-${displayColor}-500 ${isStatusLoading ? 'animate-pulse' : ''}`}></div>
            <span className={`text-[10px] uppercase tracking-[0.2em] font-black text-${displayColor}-400`}>
                {displayStatus}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed flex-grow">{description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
            <span className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Latency</span>
            <span className="text-xs font-mono text-gray-400">{latency || '--'}</span>
        </div>
      </Paper>
    </motion.div>
  );
};

import { Incident } from '@/lib/incidents';

type ServiceStatusType = 'operational' | 'degraded' | 'outage' | 'loading';

interface ServiceInfo {
  status: ServiceStatusType;
  latency: string;
}

const StatusPage = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [currentMonthIncidents, setCurrentMonthIncidents] = useState(0);
  const [services, setServices] = useState<Record<string, ServiceInfo>>({
    nexoEngine: { status: 'loading', latency: '--' },
    firebaseDb: { status: 'loading', latency: '--' },
    searchApi: { status: 'loading', latency: '--' },
    authService: { status: 'loading', latency: '--' },
    cdnEdge: { status: 'operational', latency: '8ms' },
    apiGateway: { status: 'operational', latency: '14ms' },
  });

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        const data = await response.json();
        setServices(prev => ({
          ...prev,
          nexoEngine: data.services.nexoEngine as ServiceInfo,
          firebaseDb: data.services.firebaseDb as ServiceInfo,
          searchApi: data.services.searchApi as ServiceInfo,
          authService: data.services.authService as ServiceInfo,
        }));
        setLastCheck(new Date());
      }
    } catch (error) {
      console.error("Failed to fetch status:", error);
    }
  };

  const fetchIncidents = async () => {
    try {
        const response = await fetch('/api/incidents');
        if (response.ok) {
            const data = await response.json();
            if (data.incidents) {
                setIncidents(data.incidents);
                setCurrentMonthIncidents(data.currentMonthCount || 0);
            }
        } else {
             // If fetch fails (maybe table doesn't exist), try to init table once
             await fetch('/api/incidents', { method: 'POST' });
        }
    } catch (e) {
        console.error("Failed to fetch incidents", e);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchIncidents();
    const interval = setInterval(() => {
        fetchStatus();
        fetchIncidents();
    }, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStatus(), fetchIncidents()]);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // ... rest of component ...


  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getOverallStatus = () => {
    const statuses = Object.values(services).map(s => s.status);
    if (statuses.includes('outage')) return { label: 'System Outage', color: 'red' as const };
    if (statuses.includes('degraded')) return { label: 'Degraded Performance', color: 'orange' as const };
    if (statuses.includes('loading')) return { label: 'Checking Systems...', color: 'blue' as const };
    return { label: 'All systems operational', color: 'green' as const };
  };

  const overall = getOverallStatus();

  return (
    <div className="min-h-screen bg-black text-white p-6 relative overflow-hidden font-sans antialiased">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-600/[0.02] pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <Box sx={{ maxWidth: 1000, mx: 'auto', position: 'relative', zIndex: 10, pt: 8, pb: 12 }}>
        
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-16"
        >
          <div className="flex items-center gap-6">
            <IconButton 
                onClick={() => router.back()} 
                sx={{ 
                    color: 'white', 
                    bgcolor: 'white/5', 
                    p: 2,
                    border: '1px solid rgba(255,255,255,0.05)',
                    '&:hover': { bgcolor: 'white/10', transform: 'translateX(-4px)' },
                    transition: 'all 0.3s'
                }}
            >
              <FiArrowLeft size={20} />
            </IconButton>
            <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-1">
                    System Status
                </h1>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-${overall.color}-500 ${overall.color === 'blue' ? 'animate-pulse' : ''}`}></div>
                    <p className="text-gray-500 text-sm font-medium">{overall.label} as of {lastCheck.toLocaleTimeString()}</p>
                </div>
            </div>
          </div>

          <Tooltip title="Refresh Status">
            <IconButton 
                onClick={handleRefresh}
                sx={{ 
                    color: 'white', 
                    bgcolor: 'blue.600', 
                    p: 2,
                    '&:hover': { bgcolor: 'blue.700' },
                    animation: refreshing ? 'spin 1s linear infinite' : 'none'
                }}
            >
                <FiRefreshCw size={20} />
            </IconButton>
          </Tooltip>
        </motion.header>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          <StatusCard 
            title="Nexo Engine"
            status={services.nexoEngine.status}
            latency={services.nexoEngine.latency}
            color={(services.nexoEngine.status as string) === 'operational' ? 'blue' : (services.nexoEngine.status as string) === 'degraded' ? 'orange' : 'red'}
            icon={<FiActivity size={24} />}
            description="The core AI intelligence layer responsible for generating responses and processing intent."
          />
          <StatusCard 
            title="Firebase DB"
            status={services.firebaseDb.status}
            latency={services.firebaseDb.latency}
            color={(services.firebaseDb.status as string) === 'operational' ? 'indigo' : (services.firebaseDb.status as string) === 'degraded' ? 'orange' : 'red'}
            icon={<FiDatabase size={24} />}
            description="Real-time message history and user metadata persistence layer."
          />
          <StatusCard 
            title="Search API"
            status={services.searchApi.status}
            latency={services.searchApi.latency}
            color={(services.searchApi.status as string) === 'operational' ? 'emerald' : 'orange'}
            icon={<FiGlobe size={24} />}
            description="External connectivity for live web search and real-time information gathering."
          />
          <StatusCard 
            title="Auth Service"
            status={services.authService.status}
            latency={services.authService.latency}
            color={(services.authService.status as string) === 'operational' ? 'purple' : 'orange'}
            icon={<FiShield size={24} />}
            description="Secure user authentication and session management protocols."
          />
          <StatusCard 
            title="CDN Edge"
            status={services.cdnEdge.status}
            latency={services.cdnEdge.latency}
            color="cyan"
            icon={<FiServer size={24} />}
            description="Global content delivery network ensuring low-latency asset serving."
          />
          <StatusCard 
            title="API Gateway"
            status={services.apiGateway.status}
            latency={services.apiGateway.latency}
            color="orange"
            icon={<FiRefreshCw size={24} />}
            description="Request routing and load balancing for high-traffic chat sessions."
          />
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
        >
            <Paper
                id="incidents"
                elevation={0}
                sx={{
                    p: 4,
                    bgcolor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '40px',
                    mb: 8,
                    scrollMarginTop: '2rem'
                }}
            >
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Avatar sx={{ bgcolor: 'red.900/20', color: 'red.400' }}>
                            <FiAlertCircle size={20} />
                        </Avatar>
                        <div>
                            <h4 className="text-lg font-bold">Recent Incidents</h4>
                            <p className="text-gray-500 text-sm">Real-time error logs from critical systems</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => router.push('/status/incidents')}
                        className="text-xs font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
                    >
                        View All
                    </button>
                </div>

                <div className="space-y-4">
                    {incidents.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <FiCheckCircle size={40} className="mx-auto mb-4 text-green-500/50" />
                            <p>No active incidents reported.</p>
                        </div>
                    ) : (
                        incidents.map((incident) => (
                            <div key={incident.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-mono text-red-400 bg-red-900/20 px-2 py-1 rounded">{incident.error_code}</span>
                                    <span className="text-xs text-gray-500">{new Date(incident.created_at).toLocaleString()}</span>
                                </div>
                                <h5 className="text-sm font-bold text-gray-300 mb-1">{incident.method}</h5>
                                <p className="text-sm text-gray-400 font-mono break-all">{incident.message}</p>
                            </div>
                        ))
                    )}
                </div>
            </Paper>

            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    bgcolor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '40px',
                    mb: 8
                }}
            >
                <div className="flex items-center gap-4 mb-8">
                    <Avatar sx={{ bgcolor: 'blue.600/20', color: 'blue.400' }}>
                        <FiInfo size={20} />
                    </Avatar>
                    <div>
                        <h4 className="text-lg font-bold">Uptime History</h4>
                        <p className="text-gray-500 text-sm">System availability over the last 30 days</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {[
                        { label: 'February 2026', uptime: currentMonthIncidents > 0 ? '99.95%' : '100%', incidents: currentMonthIncidents },
                        { label: 'January 2026', uptime: '99.98%', incidents: 1 },
                        { label: 'December 2025', uptime: '100%', incidents: 0 },
                    ].map((month, idx) => (
                        <div key={idx} className="flex flex-col gap-2 group cursor-default">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 font-bold group-hover:text-white transition-colors">{month.label}</span>
                                <div className="flex items-center gap-4">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${month.incidents > 0 ? 'text-orange-500' : 'text-gray-600'}`}>
                                        {month.incidents} {month.incidents === 1 ? 'Incident' : 'Incidents'}
                                    </span>
                                    <span className="text-blue-400 font-black text-sm">{month.uptime}</span>
                                </div>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: month.uptime }}
                                    transition={{ duration: 1, delay: idx * 0.2 }}
                                    className={`h-full rounded-full ${month.incidents > 0 ? 'bg-gradient-to-r from-blue-500 to-orange-500' : 'bg-blue-500'}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </Paper>


        </motion.div>

        <footer className="mt-20 text-center">
            <p className="text-[10px] text-gray-700 uppercase tracking-[0.4em] font-black mb-4">Nexo Infrastructure • v0.1.0</p>
            <div className="flex justify-center gap-8 text-gray-500 text-xs font-bold uppercase tracking-widest">
                <a href="/status/incidents" className="hover:text-blue-400 transition-colors">Incident Logs</a>
                <a href="#" className="hover:text-blue-400 transition-colors">API Docs</a>
                <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
            </div>
        </footer>
      </Box>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.01);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default StatusPage;