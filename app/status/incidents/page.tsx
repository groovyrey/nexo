"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  IconButton, 
  TextField, 
  InputAdornment, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel
} from '@mui/material';
import { 
  FiArrowLeft, 
  FiAlertCircle, 
  FiSearch,
  FiFilter,
  FiClock,
  FiCode,
  FiTerminal,
  FiActivity,
  FiChevronRight
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Incident } from '@/lib/incidents';

const IncidentLogsPage = () => {
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorCodeFilter, setErrorCodeFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const fetchIncidents = async () => {
    try {
        const response = await fetch('/api/incidents');
        if (response.ok) {
            const data = await response.json();
            if (data.incidents) {
                setIncidents(data.incidents);
            }
        }
    } catch (e) {
        console.error("Failed to fetch incidents", e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Derived filters
  const uniqueErrorCodes = useMemo(() => 
    ['all', ...Array.from(new Set(incidents.map(i => i.error_code)))],
    [incidents]
  );

  const uniqueMethods = useMemo(() => 
    ['all', ...Array.from(new Set(incidents.map(i => i.method)))],
    [incidents]
  );

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = 
        incident.error_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.method.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesErrorCode = errorCodeFilter === 'all' || incident.error_code === errorCodeFilter;
    const matchesMethod = methodFilter === 'all' || incident.method === methodFilter;

    return matchesSearch && matchesErrorCode && matchesMethod;
  });

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 relative overflow-hidden font-sans antialiased">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-red-600/[0.01] pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none"></div>

      <Box sx={{ maxWidth: 1200, mx: 'auto', position: 'relative', zIndex: 10, pt: 4, pb: 12 }}>
        
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
            <div className="flex items-center gap-6">
                <IconButton 
                    onClick={() => router.push('/status')} 
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
                    <h1 className="text-4xl font-black tracking-tight text-white mb-1">
                        Incident Logs
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">System Audit Logs</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="error-code-label" sx={{ color: 'gray', fontSize: '0.75rem' }}>Error Code</InputLabel>
                    <Select
                        labelId="error-code-label"
                        value={errorCodeFilter}
                        label="Error Code"
                        onChange={(e) => setErrorCodeFilter(e.target.value)}
                        sx={{
                            bgcolor: 'white/5',
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            '& fieldset': { border: '1px solid rgba(255,255,255,0.05)' },
                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                            '&.Mui-focused fieldset': { borderColor: 'red.500/50' },
                            '& .MuiSelect-icon': { color: 'gray' }
                        }}
                    >
                        {uniqueErrorCodes.map(code => (
                            <MenuItem key={code} value={code} sx={{ fontSize: '0.875rem' }}>{code.toUpperCase()}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="method-label" sx={{ color: 'gray', fontSize: '0.75rem' }}>Method</InputLabel>
                    <Select
                        labelId="method-label"
                        value={methodFilter}
                        label="Method"
                        onChange={(e) => setMethodFilter(e.target.value)}
                        sx={{
                            bgcolor: 'white/5',
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            '& fieldset': { border: '1px solid rgba(255,255,255,0.05)' },
                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                            '&.Mui-focused fieldset': { borderColor: 'red.500/50' },
                            '& .MuiSelect-icon': { color: 'gray' }
                        }}
                    >
                        {uniqueMethods.map(method => (
                            <MenuItem key={method} value={method} sx={{ fontSize: '0.875rem' }}>{method}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    size="small"
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FiSearch size={14} className="text-gray-500" />
                            </InputAdornment>
                        ),
                        sx: {
                            bgcolor: 'white/5',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '0.875rem',
                            '& fieldset': { border: '1px solid rgba(255,255,255,0.05)' },
                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                            '&.Mui-focused fieldset': { borderColor: 'red.500/50' },
                        }
                    }}
                    sx={{ width: { xs: '100%', md: '240px' } }}
                />
            </div>
          </div>
        </motion.header>

        <Paper
            elevation={0}
            sx={{
                bgcolor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '24px',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)'
            }}
        >
            <TableContainer sx={{ maxHeight: '70vh' }}>
                <Table stickyHeader aria-label="incident logs table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={headerStyle}><FiClock style={{ display: 'inline', marginRight: '8px' }} /> Timestamp</TableCell>
                            <TableCell sx={headerStyle}><FiCode style={{ display: 'inline', marginRight: '8px' }} /> Error Code</TableCell>
                            <TableCell sx={headerStyle}><FiActivity style={{ display: 'inline', marginRight: '8px' }} /> Method</TableCell>
                            <TableCell sx={headerStyle}><FiAlertCircle style={{ display: 'inline', marginRight: '8px' }} /> Message</TableCell>
                            <TableCell sx={{ ...headerStyle, width: '40px' }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <TableRow key={i}>
                                    {[...Array(5)].map((_, j) => (
                                        <TableCell key={j} sx={cellStyle}>
                                            <div className="h-4 bg-white/5 rounded animate-pulse w-full"></div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : filteredIncidents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} sx={{ ...cellStyle, py: 12, textAlign: 'center' }}>
                                    <FiAlertCircle size={40} className="mx-auto mb-4 text-gray-700" />
                                    <Typography sx={{ color: 'gray', fontWeight: 'bold' }}>No logs match your filters</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredIncidents.map((incident) => (
                                <TableRow 
                                    key={incident.id}
                                    sx={{ 
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
                                        transition: 'background-color 0.2s',
                                        borderBottom: '1px solid rgba(255,255,255,0.03)'
                                    }}
                                >
                                    <TableCell sx={cellStyle}>
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold">{new Date(incident.created_at).toLocaleDateString()}</span>
                                            <span className="text-[10px] text-gray-500 font-mono">{new Date(incident.created_at).toLocaleTimeString()}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell sx={cellStyle}>
                                        <Chip 
                                            label={incident.error_code} 
                                            size="small"
                                            sx={{ 
                                                bgcolor: 'red.900/20', 
                                                color: 'red.400', 
                                                fontSize: '10px',
                                                fontWeight: 'black',
                                                fontFamily: 'monospace',
                                                borderRadius: '4px',
                                                border: '1px solid rgba(248, 113, 113, 0.1)'
                                            }} 
                                        />
                                    </TableCell>
                                    <TableCell sx={cellStyle}>
                                        <span className="text-gray-300 font-medium">{incident.method}</span>
                                    </TableCell>
                                    <TableCell sx={{ ...cellStyle, maxWidth: '400px' }}>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: 'gray', 
                                                fontSize: '0.8rem',
                                                fontFamily: 'monospace',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 1,
                                                WebkitBoxOrient: 'vertical',
                                                '&:hover': { WebkitLineClamp: 'initial', color: 'gray' }
                                            }}
                                        >
                                            {incident.message}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={cellStyle}>
                                        <IconButton size="small" sx={{ color: 'gray' }}>
                                            <FiChevronRight size={14} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>

        <footer className="mt-20 flex flex-col items-center gap-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
            <p className="text-[10px] text-gray-700 uppercase tracking-[0.4em] font-black">Nexo Ops Dashboard • Real-time Auditing</p>
        </footer>
      </Box>

      <style jsx global>{`
        .MuiTableCell-stickyHeader {
            background-color: rgba(10, 10, 10, 0.95) !important;
            backdrop-filter: blur(10px);
        }
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.01);
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

const headerStyle = {
    color: 'gray',
    fontSize: '10px',
    fontWeight: 'black',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    py: 3,
    px: 4
};

const cellStyle = {
    color: 'white',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    py: 2,
    px: 4,
    fontSize: '0.875rem'
};

export default IncidentLogsPage;