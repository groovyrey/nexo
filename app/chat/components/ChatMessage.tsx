import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import PersonIcon from '@mui/icons-material/Person';
import Image from 'next/image';
import ButtonBase from '@mui/material/ButtonBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Divider from '@mui/material/Divider';
import MuiLink from '@mui/material/Link'; // Ensure MuiLink is imported

import BuildIcon from '@mui/icons-material/Build'; // New import
import SearchIcon from '@mui/icons-material/Search'; // New import for webSearch
import MemoryIcon from '@mui/icons-material/Memory'; // New import for retrieve/writeMemory
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'; // New import for listTools
import CloudIcon from '@mui/icons-material/Cloud'; // New import for getWeather
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LanguageIcon from '@mui/icons-material/Language';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import OpacityIcon from '@mui/icons-material/Opacity';
import AirIcon from '@mui/icons-material/Air';
import ThermostatIcon from '@mui/icons-material/Thermostat';

import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ShareIcon from '@mui/icons-material/Share';

import { User } from '@/lib/context'; // Import User interface

// Update ChatMessageProps interface
interface ChatMessageProps {
  msg: {
    role: string;
    content: string;
    timestamp?: number;
    toolUsed?: string | null; // Added toolUsed
    toolOutput?: any; // Added toolOutput
  };
  isUser: boolean;
  user: User | null;
  modernize?: boolean;
  textSize?: 'small' | 'medium' | 'large';
  voiceLanguage?: string;
}

const FetchUrlDisplay = ({ data }: { data: any }) => {
  if (!data || data.error) return null;

  let info = data;
  if (typeof data === 'string') {
    try {
      info = JSON.parse(data);
    } catch (e) {
      return null;
    }
  }

  if (info.error) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        my: 2,
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        color: 'white',
        width: '100%',
        maxWidth: '500px',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        cursor: 'pointer',
        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
      }}
      onClick={() => window.open(info.url, '_blank')}
    >
      <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 1.5, borderRadius: '12px' }}>
        <LanguageIcon sx={{ fontSize: 32, color: 'emerald.400' }} />
      </Box>
      <Box sx={{ overflow: 'hidden' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {info.title}
        </Typography>
        <Typography variant="caption" sx={{ color: 'grey.400', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {info.url}
        </Typography>
      </Box>
    </Paper>
  );
};

const DateDisplay = ({ date }: { date: string }) => {
  if (!date) return null;

  // Expected format: "Monday, February 9, 2026" or similar from Intl
  const parts = date.split(', ');
  const weekday = parts[0];
  const fullDate = parts.slice(1).join(', ');

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        my: 2,
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        color: 'white',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}
    >
      <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 1.5, borderRadius: '12px' }}>
        <CalendarMonthIcon sx={{ fontSize: 40, color: 'pink' }} />
      </Box>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>{weekday}</Typography>
        <Typography variant="body1" sx={{ color: 'grey.300' }}>{fullDate}</Typography>
      </Box>
    </Paper>
  );
};

const WeatherDisplay = ({ data }: { data: any }) => {
  if (!data || data.error) return null;

  // Sometimes toolOutput is a stringified JSON
  let weather = data;
  if (typeof data === 'string') {
    try {
      weather = JSON.parse(data);
    } catch (e) {
      return null;
    }
  }

  if (weather.error) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        my: 2,
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        color: 'white',
        width: '100%',
        maxWidth: '400px',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{weather.location}</Typography>
          <Typography variant="body2" sx={{ color: 'cyan.200' }}>{weather.condition}</Typography>
        </Box>
        <CloudIcon sx={{ fontSize: 48, color: 'cyan.300' }} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <ThermostatIcon sx={{ color: 'orange' }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{weather.tempC}°C</Typography>
          <Typography variant="caption">Temp</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <OpacityIcon sx={{ color: 'lightskyblue' }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{weather.humidity}%</Typography>
          <Typography variant="caption">Humidity</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <AirIcon sx={{ color: 'lightgrey' }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{weather.windSpeed}</Typography>
          <Typography variant="caption">km/h</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const MarkdownRenderer = ({ content }: { content: string }) => {
  // Helper to copy code to clipboard
  const handleCopyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
  }, []);

  return (
    <ReactMarkdown
      className="prose prose-invert max-w-none"
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
      components={{
        a: ({ node, ...props }) => (
          <MuiLink
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#38bdf8', // sky-400
              textDecoration: 'none',
              borderBottom: '1px solid transparent',
              transition: 'all 0.2s ease-in-out',
              fontWeight: 500,
              '&:hover': {
                color: '#7dd3fc', // sky-300
                borderBottomColor: '#7dd3fc',
                textShadow: '0 0 8px rgba(56, 189, 248, 0.4)',
              }
            }}
          />
        ),
        p: ({ node, ...props }) => (
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 2, 
              lineHeight: 1.7, 
              color: 'rgba(255, 255, 255, 0.9)',
              '&:last-child': { mb: 0 },
              overflowWrap: 'break-word' 
            }} 
            {...props} 
          />
        ),
        ul: ({ node, ...props }) => (
          <Box component="ul" sx={{ pl: 2, mb: 2, listStyleType: 'none' }} {...props} />
        ),
        ol: ({ node, ...props }) => (
          <Box component="ol" sx={{ pl: 2, mb: 2, listStyleType: 'none', counterReset: 'item' }} {...props} />
        ),
        li: ({ node, ...props }) => {
           // Actually, simpler to just use CSS counters for ordered lists or a dot for unordered.
           // Since ReactMarkdown renders ul/ol separately, we can't easily know strictly here without context, 
           // but we can default to a style that works for both or rely on the parent styling.
           // For safely, let's use a simple dot for UL and rely on browser for OL but styled.
           return (
            <Box component="li" sx={{ 
              mb: 1, 
              display: 'flex', 
              alignItems: 'flex-start',
              gap: 1.5,
              '&:last-child': { mb: 0 } 
            }}>
              <Box sx={{ 
                mt: 0.8,
                minWidth: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', // blue-500 to cyan-500
                boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)'
              }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6 }} {...props} />
            </Box>
          );
        },
        code: ({node, className, children, ...props}) => {
          const match = /language-(\w+)/.exec(className || '');
          const isInline = !match && !String(children).includes('\n');
          const codeString = String(children).replace(/\n$/, '');

          if (isInline) {
            return (
              <Typography
                component="code"
                sx={{
                  bgcolor: 'rgba(56, 189, 248, 0.1)', // sky-500/10
                  color: '#7dd3fc', // sky-300
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '6px',
                  px: 0.8,
                  py: 0.2,
                  fontSize: '0.85em',
                  fontFamily: '"Fira Code", monospace',
                  fontWeight: 500,
                  boxShadow: '0 0 10px rgba(56, 189, 248, 0.05) inset'
                }}
                {...props}
              >
                {children}
              </Typography>
            );
          }

          return (
            <Paper 
              elevation={0} 
              sx={{ 
                bgcolor: '#0f1117', // Very dark blue/gray
                borderRadius: '16px', 
                my: 3, 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                overflow: 'hidden',
                boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)' 
              }}
            >
              {/* Code Header */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                px: 2.5, 
                py: 1.5, 
                bgcolor: 'rgba(255, 255, 255, 0.03)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Box sx={{ w: 3, h: 3, borderRadius: '50%', bgcolor: '#ef4444', opacity: 0.8 }} /> {/* Red */}
                  <Box sx={{ w: 3, h: 3, borderRadius: '50%', bgcolor: '#eab308', opacity: 0.8 }} /> {/* Yellow */}
                  <Box sx={{ w: 3, h: 3, borderRadius: '50%', bgcolor: '#22c55e', opacity: 0.8 }} /> {/* Green */}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="caption" sx={{ color: 'grey.500', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {match ? match[1] : 'text'}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => handleCopyCode(codeString)}
                    sx={{ 
                      color: 'grey.500', 
                      p: 0.5,
                      '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' } 
                    }}
                  >
                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              </Box>
              
              <Box sx={{ position: 'relative' }}>
                <pre style={{ 
                  padding: '20px', 
                  margin: 0, 
                  overflowX: 'auto', 
                  fontFamily: '"Fira Code", monospace', 
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  background: 'transparent'
                }}>
                  <code 
                    className={className} 
                    style={{ background: 'transparent' }} 
                    {...props}
                  >
                    {children}
                  </code>
                </pre>
              </Box>
            </Paper>
          );
        },
        table: ({node, ...props}) => (
          <TableContainer 
            component={Paper} 
            sx={{ 
              my: 4, 
              bgcolor: 'rgba(255, 255, 255, 0.02)', 
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
            }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table" {...props} />
          </TableContainer>
        ),
        thead: ({node, ...props}) => (
          <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }} {...props} />
        ),
        th: ({node, align, ...props}) => (
          <TableCell
            align="left"
            sx={{
              px: 3,
              py: 2,
              textAlign: 'left',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'cyan.100', // Matches theme accent
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            {...props}
          />
        ),
        tbody: ({node, ...props}) => <TableBody sx={{ '& .MuiTableRow-root:last-child td': { borderBottom: 0 } }} {...props} />,
        tr: ({node, ...props}) => (
          <TableRow 
            sx={{ 
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              transition: 'background-color 0.2s',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' } 
            }} 
            {...props} 
          />
        ),
        td: ({node, align, ...props}) => (
          <TableCell align="left" sx={{ px: 3, py: 2, fontSize: '0.9rem', color: 'grey.300', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }} {...props} />
        ),
        blockquote: ({node, ...props}) => (
          <Box 
            component="blockquote" 
            sx={{ 
              position: 'relative',
              borderLeft: '4px solid transparent',
              borderImage: 'linear-gradient(to bottom, #3b82f6, #06b6d4) 1',
              bgcolor: 'rgba(30, 41, 59, 0.4)', // slate-800/40
              borderRadius: '0 12px 12px 0',
              p: 3,
              my: 3,
              fontStyle: 'italic',
              color: 'grey.300'
            }} 
            {...props} 
          />
        ),
        h1: ({node, ...props}) => (
          <Typography 
            variant="h3" 
            component="h1"
            sx={{ 
              fontWeight: 800, 
              mb: 3, 
              mt: 4,
              background: 'linear-gradient(to right, #ffffff, #94a3b8)', // white to slate-400
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
              '&:first-of-type': { mt: 0 }
            }} 
            {...props} 
          />
        ),
        h2: ({node, ...props}) => (
          <Typography 
            variant="h4" 
            component="h2"
            sx={{ 
              fontWeight: 700, 
              mb: 2.5, 
              mt: 3.5, 
              color: 'white',
              letterSpacing: '-0.01em',
              display: 'flex',
              alignItems: 'center',
              '&:after': {
                content: '""',
                flex: 1,
                height: '1px',
                ml: 3,
                background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.5) 0%, transparent 100%)'
              }
            }} 
            {...props} 
          />
        ),
        h3: ({node, ...props}) => (
          <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 2, mt: 3, color: 'cyan.50' }} {...props} />
        ),
        h4: ({node, ...props}) => (
          <Typography variant="h6" component="h4" sx={{ fontWeight: 600, mb: 1.5, mt: 2.5, color: 'blue.100' }} {...props} />
        ),
        h5: ({node, ...props}) => <Typography variant="subtitle1" component="h5" sx={{ fontWeight: 600, mb: 1, mt: 2, color: 'grey.200' }} {...props} />,
        h6: ({node, ...props}) => <Typography variant="overline" component="h6" sx={{ fontWeight: 700, mb: 1, mt: 2, color: 'grey.400', letterSpacing: '0.1em' }} {...props} />,
        hr: ({node, ...props}) => (
          <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)', borderStyle: 'dashed' }} {...props} />
        ),
        img: ({node, width, height, src, alt, ...restProps}) => {
          const imgWidth = typeof width === 'string' ? parseInt(width, 10) : (width || 800);
          const imgHeight = typeof height === 'string' ? parseInt(height, 10) : (height || 450);
          const imgSrc = typeof src === 'string' ? src : '';
          const imgAlt = typeof alt === 'string' ? alt : '';

          return (
            <Box sx={{ my: 3, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
              <Image
                layout="responsive"
                width={imgWidth}
                height={imgHeight}
                src={imgSrc}
                alt={imgAlt}
                objectFit="contain"
                {...restProps}
              />
            </Box>
          );
        },
        details: ({node, ...props}) => (
          <details 
            className="group"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.03)', 
              borderRadius: '12px', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              padding: '16px', 
              margin: '16px 0' 
            }} 
            {...props} 
          />
        ),
        summary: ({node, ...props}) => (
          <summary 
            style={{ 
              fontWeight: 600, 
              color: '#38bdf8', 
              cursor: 'pointer',
              listStyle: 'none',
              outline: 'none'
            }} 
            {...props} 
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ msg, isUser, user, modernize = true, textSize = 'medium', voiceLanguage = 'en-US' }) => {
  const bubbleBg = isUser ? (modernize ? 'bg-blue-600/40 border border-blue-500/30' : 'bg-cyan-500/30') : '';
  const bubbleText = isUser ? 'text-white' : 'text-gray-100';
  const bubbleBorder = isUser ? '' : '';
  
  const fontSizeClass = textSize === 'small' ? 'text-sm' : textSize === 'large' ? 'text-lg' : 'text-base';

  const [menuOpenState, setMenuOpenState] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp || isNaN(timestamp)) {
      return '';
    }
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  const handleMoreVertClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpenState(true);
  };

  const handleClose = () => {
    setMenuOpenState(false);
    setAnchorEl(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
    handleClose();
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean up text: remove markdown artifacts for smoother reading
    const cleanText = msg.content
      .replace(/[*_#`]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = voiceLanguage || 'en-US';
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Try to find a high-quality "Google" or "Microsoft" or "Natural" voice for the selected language
    const langCode = (voiceLanguage || 'en-US').split('-')[0];
    const preferredVoice = voices.find(v => 
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium')) && 
      v.lang.startsWith(langCode)
    ) || voices.find(v => v.lang.startsWith(langCode));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    handleClose();
  };

  const renderMenu = () => (
    <Menu
      anchorEl={anchorEl}
      open={menuOpenState}
      onClose={handleClose}
      MenuListProps={{ sx: { py: 1 } }}
      PaperProps={{
        sx: {
          bgcolor: 'rgba(20, 20, 20, 0.85)',
          backdropFilter: 'blur(16px)',
          color: 'white',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          minWidth: '180px',
        }
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem onClick={handleCopy} sx={{ py: 1.5, px: 2, gap: 1.5, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}>
        <ListItemIcon sx={{ minWidth: 'auto !important' }}>
          <ContentCopyIcon fontSize="small" sx={{ color: 'cyan.400' }} />
        </ListItemIcon>
        <Typography variant="body2">{copiedText ? 'Copied!' : 'Copy Text'}</Typography>
      </MenuItem>
      <MenuItem onClick={handleSpeak} sx={{ py: 1.5, px: 2, gap: 1.5, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}>
        <ListItemIcon sx={{ minWidth: 'auto !important' }}>
          {isSpeaking ? <VolumeOffIcon fontSize="small" sx={{ color: 'orange' }} /> : <VolumeUpIcon fontSize="small" sx={{ color: 'orange' }} />}
        </ListItemIcon>
        <Typography variant="body2">{isSpeaking ? 'Stop Speaking' : 'Read Aloud'}</Typography>
      </MenuItem>
      <MenuItem 
        onClick={() => {
          if (navigator.share) {
            navigator.share({ title: isUser ? 'My Message' : 'Nexo AI Message', text: msg.content }).catch(console.error);
          } else {
            handleCopy();
          }
          handleClose();
        }}
        sx={{ py: 1.5, px: 2, gap: 1.5, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
      >
        <ListItemIcon sx={{ minWidth: 'auto !important' }}>
          <ShareIcon fontSize="small" sx={{ color: 'purple.400' }} />
        </ListItemIcon>
        <Typography variant="body2">Share Content</Typography>
      </MenuItem>
      <Divider sx={{ my: 0.5, borderColor: 'rgba(255, 255, 255, 0.05)' }} />
      {msg.timestamp && (
        <Box sx={{ px: 2, py: 1, opacity: 0.5 }}>
          <Typography variant="caption" sx={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isUser ? 'Sent' : 'Received'} at {formatTimestamp(msg.timestamp)}
          </Typography>
        </Box>
      )}
    </Menu>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {!isUser ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px',
            animation: 'fade-in-up 0.3s ease-out',
            marginBottom: '16px',
            width: '100%',
          }}
        >
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                <Image src="/nexo.png" alt="Nexo AI" width={32} height={32} />
              </div>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'rgb(229, 231, 235)' }}>Nexo</Typography>
              {msg.toolUsed && (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, p: 0.5, borderRadius: '4px', bgcolor: 'rgba(255,255,255,0.1)' }}>
                  {msg.toolUsed === 'webSearch' && <SearchIcon fontSize="small" sx={{ color: 'cyan.400', mr: 0.5 }} />}
                  {(msg.toolUsed === 'writeMemory' || msg.toolUsed === 'retrieveMemory') && <MemoryIcon fontSize="small" sx={{ color: 'purple.400', mr: 0.5 }} />}
                  {msg.toolUsed === 'listTools' && <FormatListBulletedIcon fontSize="small" sx={{ color: 'green.400', mr: 0.5 }} />}
                  {msg.toolUsed === 'getWeather' && <CloudIcon fontSize="small" sx={{ color: 'lightblue.400', mr: 0.5 }} />}
                  {!(msg.toolUsed === 'webSearch' || msg.toolUsed === 'writeMemory' || msg.toolUsed === 'retrieveMemory' || msg.toolUsed === 'listTools' || msg.toolUsed === 'getWeather') && <BuildIcon fontSize="small" sx={{ color: 'grey.400', mr: 0.5 }} />}
                  <Typography variant="caption" sx={{ color: 'grey.300', fontSize: '0.7rem' }}>
                    {msg.toolUsed}
                  </Typography>
                </Box>
              )}
            </div>
            <IconButton
              size="small"
              onClick={handleMoreVertClick}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.5)',
                '&:hover': { 
                  color: 'white', 
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'rotate(90deg)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </div>
          <Box sx={{ display: 'block', width: '100%', textAlign: 'left' }}>
            <div className={`w-full text-gray-100 p-3 ${fontSizeClass}`}>
              {msg.toolUsed === 'getWeather' && msg.toolOutput && <WeatherDisplay data={msg.toolOutput} />}
              {msg.toolUsed === 'getCurrentDate' && msg.toolOutput && <DateDisplay date={msg.toolOutput} />}
              {msg.toolUsed === 'fetchUrl' && msg.toolOutput && <FetchUrlDisplay data={msg.toolOutput} />}
              <MarkdownRenderer content={msg.content} />
              {msg.timestamp && (
                <Typography variant="caption" sx={{ fontSize: '0.75rem', marginTop: '8px', textAlign: 'left', color: 'rgb(156, 163, 175)' }}>
                  {formatTimestamp(msg.timestamp)}
                </Typography>
              )}
            </div>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            justifyContent: 'flex-end',
            animation: 'fade-in-up 0.3s ease-out',
            marginBottom: '16px',
          }}
        >
          <div className="flex flex-col items-end gap-1 max-w-[75%]">
            <div className={`relative rounded-2xl ${bubbleBg} ${bubbleText} ${bubbleBorder} font-sans shadow-lg overflow-hidden`}>
              <div className={`p-3 ${fontSizeClass}`}>
                <MarkdownRenderer content={msg.content} />
                {msg.timestamp && (
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', marginTop: '8px', display: 'block', textAlign: 'right', color: 'rgba(255,255,255,0.5)' }}>
                    {formatTimestamp(msg.timestamp)}
                  </Typography>
                )}
              </div>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center overflow-hidden border border-white/10 shadow-md mt-1">
            {user?.photoURL ? (
              <Image src={user.photoURL} alt="User Profile" width={32} height={32} />
            ) : (
              <PersonIcon className="text-white" />
            )}
          </div>
        </Box>
      )}
      {renderMenu()}
    </Box>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;