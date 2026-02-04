import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { FiUser } from 'react-icons/fi';
import Image from 'next/image';
import ButtonBase from '@mui/material/ButtonBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // New import
import IconButton from '@mui/material/IconButton'; // Ensure IconButton is imported if not already
import { User } from '@/lib/context'; // Import User interface

interface ChatMessageProps {
  msg: {
    role: string;
    content: string;
    timestamp?: number;
  };
  isUser: boolean;
  user: User | null; // It's better to use a more specific type for user
}

const MarkdownRenderer = ({ content }: { content: string }) => (
  <ReactMarkdown
    className="prose prose-invert max-w-none"
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeRaw, rehypeHighlight]}
    components={{
      a: ({ node, ...props }) => (
        <a
          {...props}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-300 hover:underline"
        />
      ),
      p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
      li: ({ node, ...props }) => <li className="mb-1 last:mb-0" {...props} />,
      code: ({node, className, children, ...props}) => {
        const match = /language-(\w+)/.exec(className || '')
        return match ? (
          <div className="bg-gray-900 rounded-md my-2">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
              <span className="text-gray-400 text-xs">{match[1]}</span>
            </div>
                              <pre className="p-4 overflow-x-auto font-mono !whitespace-pre">
                                <code className={`!bg-transparent text-sm ${className}`} {...props}>
                                  {children}
                                </code>
                              </pre>
                            </div>
                          ) : (
                            <code className="bg-gray-700 rounded-md px-1.5 py-1 text-xs font-mono" {...props}>
                              {children}
                            </code>
                          )
                        },      table: ({node, ...props}) => <div className="overflow-x-auto my-4"><table className="min-w-full divide-y divide-gray-700" {...props} /></div>,
      thead: ({node, ...props}) => <thead className="bg-white/10" {...props} />,
      th: ({node, ...props}) => <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" {...props} />,
      tbody: ({node, ...props}) => <tbody className="bg-white/5 divide-y divide-gray-700" {...props} />,
      tr: ({node, ...props}) => <tr className="hover:bg-white/10" {...props} />,
      td: ({node, ...props}) => <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200" {...props} />,
      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-cyan-500/50 bg-white/5 p-4 my-4" {...props} />,
      h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4 text-white border-b-2 border-cyan-500/50 pb-2" {...props} />,
      h2: ({node, ...props}) => <h2 className="text-2xl font-bold mb-4 text-white border-b border-cyan-500/50 pb-2" {...props} />,
      h3: ({node, ...props}) => <h3 className="text-xl font-bold mb-3 text-white" {...props} />,
      h4: ({node, ...props}) => <h4 className="text-lg font-semibold mb-3 text-white" {...props} />,
      h5: ({node, ...props}) => <h5 className="text-base font-semibold mb-2 text-white" {...props} />,
      h6: ({node, ...props}) => <h6 className="text-sm font-semibold mb-2 text-white" {...props} />,
      hr: ({node, ...props}) => <hr className="my-6 border-cyan-500/50" {...props} />,
      img: ({node, ...props}) => <img className="rounded-lg shadow-lg my-4" {...props} />,
      details: ({node, ...props}) => <details className="bg-white/5 rounded-lg border border-white/20 p-4 my-2" {...props} />,
      summary: ({node, ...props}) => <summary className="font-semibold text-cyan-200 cursor-pointer hover:text-cyan-100" {...props} />,
    }}
  >
    {content}
  </ReactMarkdown>
);

const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ msg, isUser, user }) => {
  const bubbleBg = isUser ? 'bg-cyan-500/30' : ''; // Keep current user bg
  const bubbleText = isUser ? 'text-white' : 'text-gray-100';
  const bubbleBorder = isUser ? '' : ''; // Remove user border
  const bubbleShape = isUser ? 'rounded-lg' : ''; // Simplify user shape

  const [menuOpenState, setMenuOpenState] = useState(false); // Changed to boolean
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Reverted to HTMLElement | null
  const [copiedText, setCopiedText] = useState(false);

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
    setAnchorEl(event.currentTarget); // Anchor the menu to the IconButton
    setMenuOpenState(true);
  };

  const handleClose = () => {
    setMenuOpenState(false);
    setAnchorEl(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopiedText(true);
    handleClose();
  };

  if (!isUser) {
    return (
      <div className="flex flex-col items-start gap-2 animate-fade-in-up mb-4 w-full">
        <div className="flex justify-between items-center w-full"> {/* New flex container */}
          <div className="flex items-center gap-2"> {/* Existing profile and name */}
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
              <Image src="/nexo.png" alt="Nexo AI" width={32} height={32} />
            </div>
            <span className="font-bold text-gray-200">Nexo AI</span>
          </div>
          <IconButton
            size="small"
            onClick={handleMoreVertClick} // New handler
            sx={{ color: 'white' }}
          >
            <MoreVertIcon />
          </IconButton>
        </div>
        <ButtonBase
          component="div"
          sx={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            borderRadius: '0.5rem', // rounded-lg
            p: 1.5, // p-3
            cursor: 'pointer',
          }}
          // onClick={handleClick} // Removed
          // {...longPressEventHandlers} // Removed
        >
          <div className="w-full text-gray-100">
            <MarkdownRenderer content={msg.content} />
            {msg.timestamp && (
              <div className="text-xs mt-2 text-left text-gray-400">
                {formatTimestamp(msg.timestamp)}
              </div>
            )}
          </div>
        </ButtonBase>
        <Menu
            anchorEl={anchorEl} // Anchor to the IconButton
            open={menuOpenState}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            PaperProps={{ // Apply styling to the Menu's paper component
              sx: {
                bgcolor: 'rgba(30, 30, 30, 0.9)', // Dark background
                color: 'white',
              }
            }}
            anchorOrigin={{
              vertical: 'bottom', // Menu's top aligns with anchor's bottom
              horizontal: 'right', // Menu's right aligns with anchor's right
            }}
            transformOrigin={{
              vertical: 'top', // Menu's top aligns with its own top
              horizontal: 'right', // Menu's right aligns with its own right
            }}
          >
            <MenuItem onClick={handleCopy} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}>
              <ListItemIcon>
                <ContentCopyIcon fontSize="small" sx={{ color: 'white' }} />
              </ListItemIcon>
              {copiedText ? 'Copied!' : 'Copy'}
            </MenuItem>
            {msg.timestamp && (
              <MenuItem disabled sx={{ opacity: 0.8, '&:hover': { bgcolor: 'transparent' } }}>
                <Typography variant="caption" color="inherit">
                  {formatTimestamp(msg.timestamp)}
                </Typography>
              </MenuItem>
            )}
          </Menu>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 justify-end animate-fade-in-up">
      <div
        className={`relative p-3 max-w-[75%] ${bubbleBg} ${bubbleText} ${bubbleBorder} ${bubbleShape} font-sans`}
      >
        <MarkdownRenderer content={msg.content} />
        {msg.timestamp && (
          <div className="text-xs mt-2 text-right text-gray-400">
            {formatTimestamp(msg.timestamp)}
          </div>
        )}
      </div>
      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
        {user?.photoURL ? (
          <Image
            src={user.photoURL}
            alt="User Profile"
            width={32}
            height={32}
          />
        ) : (
          <FiUser className="text-white" />
        )}
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;