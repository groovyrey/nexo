"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/lib/context';
import { getConversationList, createConversation, deleteConversation, updateConversationTitle, ConversationMetadata } from '@/lib/realtimedb';
import Image from 'next/image';

import ConversationSkeleton from '../components/ConversationSkeleton';

// MUI Imports
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Paper } from '@mui/material';
import { useNotification } from "@/lib/notification";
import { motion, AnimatePresence } from 'framer-motion';

const ConversationsPage = () => {
  const authContext = useAuthContext();
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const [defaultConversationCreated, setDefaultConversationCreated] = useState(false);

  if (!authContext) {
    return (
      <div className="flex flex-col h-screen bg-black text-white font-sans antialiased">
        <div className="flex-grow flex flex-col w-full max-w-4xl mx-auto overflow-hidden">
          <List className="flex-grow overflow-y-auto custom-scrollbar">
            {[...Array(4)].map((_, i) => <ConversationSkeleton key={i} />)}
          </List>
        </div>
      </div>
    );
  }

  const { user } = authContext;

  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [renameConversationId, setRenameConversationId] = useState('');
  const [renameConversationTitle, setRenameConversationTitle] = useState('');
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [deleteConversationId, setDeleteConversationId] = useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, conversationId: string) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(conversationId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
  };

  const handleCreateNewConversation = useCallback(async (idToCreate?: string, shouldRedirect: boolean = true) => {
    if (!user) return;
    if (conversations.length >= 5 && idToCreate !== "default") {
      showNotification("You have reached the maximum limit of 5 conversations.", "warning");
      return;
    }
    try {
      const newConversationId = await createConversation(user.uid, idToCreate === "default" ? "Default Chat" : "New Chat", idToCreate);
      if (shouldRedirect) {
        router.push(`/chat/${newConversationId}`);
      }
    } catch (error) {
      console.error("Error creating new conversation:", error);
    }
  }, [user, router, conversations]);

  const handleOpenRenameDialog = useCallback((convoId: string, currentTitle: string) => {
    handleMenuClose();
    setRenameConversationId(convoId);
    setRenameConversationTitle(currentTitle);
    setOpenRenameDialog(true);
  }, []);

  const handleCloseRenameDialog = useCallback(() => {
    setOpenRenameDialog(false);
    setRenameConversationId('');
    setRenameConversationTitle('');
  }, []);

  const handleRenameConversation = useCallback(async () => {
    if (!user || !renameConversationId || !renameConversationTitle.trim()) return;
    try {
      await updateConversationTitle(user.uid, renameConversationId, renameConversationTitle.trim());
      handleCloseRenameDialog();
    } catch (error) {
      console.error("Error renaming conversation:", error);
    }
  }, [user, renameConversationId, renameConversationTitle, handleCloseRenameDialog]);

  const handleOpenDeleteConfirmDialog = useCallback((convoId: string) => {
    handleMenuClose();
    setDeleteConversationId(convoId);
    setOpenDeleteConfirmDialog(true);
  }, []);

  const handleCloseDeleteConfirmDialog = useCallback(() => {
    setOpenDeleteConfirmDialog(false);
    setDeleteConversationId('');
  }, []);

  const handleConfirmDeleteConversation = useCallback(async () => {
    if (!user || !deleteConversationId) return;
    if (deleteConversationId === "default") {
        showNotification("The default conversation cannot be deleted.", "error");
        handleCloseDeleteConfirmDialog();
        return;
    }
    try {
      await deleteConversation(user.uid, deleteConversationId);
      handleCloseDeleteConfirmDialog();
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  }, [user, deleteConversationId, handleCloseDeleteConfirmDialog]);

  useEffect(() => {
    if (user === null) router.push('/');
  }, [user, router]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (user) {
      unsubscribe = getConversationList(user.uid, (convos) => {
        setConversations(convos);
        setLoading(false);
        if (convos.length === 0 && !defaultConversationCreated) {
          handleCreateNewConversation("default", true);
          setDefaultConversationCreated(true);
        } else if (convos.length > 0 && !convos.some(convo => convo.id === "default")) {
            handleCreateNewConversation("default", false);
        }
      });
    }
    return () => unsubscribe?.();
  }, [user, handleCreateNewConversation, defaultConversationCreated]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans antialiased overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="sticky top-0 z-50 py-4 px-6 bg-white/5 backdrop-blur-xl flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
            <IconButton onClick={() => router.push('/')} color="inherit" sx={{ bgcolor: 'white/5', '&:hover': { bgcolor: 'white/10' } }}>
                <ArrowBackIcon />
            </IconButton>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Your Chats</h1>
        </div>
        <Button 
            variant="contained" 
            onClick={() => handleCreateNewConversation(undefined, true)}
            startIcon={<AddIcon />}
            sx={{ 
                bgcolor: 'blue.600', 
                borderRadius: '50px',
                textTransform: 'none',
                fontWeight: 'bold',
                px: 3,
                boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                '&:hover': { bgcolor: 'blue.700', boxShadow: '0 6px 20px rgba(0,118,255,0.23)' }
            }}
        >
            New Chat
        </Button>
      </header>

      <div className="flex-grow flex flex-col w-full max-w-4xl mx-auto overflow-hidden relative z-10 px-4 py-6">
        {loading ? (
             <List className="space-y-4">
                {[...Array(4)].map((_, i) => <ConversationSkeleton key={i} />)}
             </List>
        ) : conversations.length === 0 ? (
          <Box className="flex-grow flex flex-col items-center justify-center text-gray-500 text-center">
            <div className="w-20 h-20 mb-4 bg-white/5 rounded-full flex items-center justify-center">
                <AddIcon sx={{ fontSize: 40 }} />
            </div>
            <Typography variant="h6">No conversations yet.</Typography>
            <Typography variant="body2">Start a new one to begin chatting with Nexo!</Typography>
          </Box>
        ) : (
          <List className="space-y-3 overflow-y-auto custom-scrollbar pr-2">
            <AnimatePresence>
                {conversations.map((convo) => (
                    <motion.div
                        key={convo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.06)',
                                    borderColor: 'rgba(255, 255, 255, 0.15)',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            <ListItem
                                disablePadding
                                secondaryAction={
                                    <div className="flex items-center gap-2">
                                        <Typography variant="caption" sx={{ color: 'gray' }}>
                                            {formatTimestamp(convo.timestamp)}
                                        </Typography>
                                        <IconButton
                                            onClick={(e) => handleMenuClick(e, convo.id)}
                                            sx={{ color: 'gray', '&:hover': { color: 'white' } }}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </div>
                                }
                            >
                                <Link href={`/chat/${convo.id}`} className="flex items-center p-4 w-full group">
                                    <ListItemAvatar>
                                        <Avatar sx={{
                                            bgcolor: 'blue.600',
                                            fontWeight: 'bold',
                                            width: 50,
                                            height: 50,
                                            fontSize: '1.2rem',
                                            boxShadow: '0 0 20px rgba(37, 99, 235, 0.2)'
                                        }}>
                                            {convo.title ? convo.title.charAt(0).toUpperCase() : '?'}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'white' }}>
                                                {convo.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'gray',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    maxWidth: '200px'
                                                }}
                                            >
                                                {convo.lastMessageSnippet || "No messages yet."}
                                            </Typography>
                                        }
                                        sx={{ ml: 2 }}
                                    />
                                </Link>
                            </ListItem>
                        </Paper>
                    </motion.div>
                ))}
            </AnimatePresence>
          </List>
        )}
      </div>

      {/* Menus and Dialogs */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
            sx: {
                bgcolor: '#121212',
                color: 'white',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                mt: 1,
                minWidth: 150
            }
        }}
      >
        <MenuItem onClick={() => handleOpenRenameDialog(openMenuId!, conversations.find(c => c.id === openMenuId)?.title || '')}>
            <ListItemIcon><EditIcon fontSize="small" sx={{ color: 'white' }} /></ListItemIcon>
            Rename
        </MenuItem>
        <MenuItem 
            onClick={() => handleOpenDeleteConfirmDialog(openMenuId!)}
            sx={{ color: 'error.main' }}
        >
            <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
            Delete
        </MenuItem>
      </Menu>

      <Dialog open={openRenameDialog} onClose={handleCloseRenameDialog} PaperProps={{ sx: { bgcolor: '#121212', color: 'white', borderRadius: '24px', p: 1 } }}>
            <DialogTitle sx={{ fontWeight: 'bold' }}>Rename Chat</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="New Title"
                    fullWidth
                    variant="outlined"
                    value={renameConversationTitle}
                    onChange={(e) => setRenameConversationTitle(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)', borderRadius: '12px' },
                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        },
                        '& .MuiInputLabel-root': { color: 'gray' }
                    }}
                />
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleCloseRenameDialog} sx={{ color: 'white' }}>Cancel</Button>
                <Button onClick={handleRenameConversation} variant="contained" sx={{ bgcolor: 'blue.600', borderRadius: '50px' }}>Save Changes</Button>
            </DialogActions>
        </Dialog>

        <Dialog open={openDeleteConfirmDialog} onClose={handleCloseDeleteConfirmDialog} PaperProps={{ sx: { bgcolor: '#121212', color: 'white', borderRadius: '24px', p: 1 } }}>
            <DialogTitle sx={{ fontWeight: 'bold' }}>Delete Chat?</DialogTitle>
            <DialogContent>
                <Typography sx={{ color: 'gray' }}>This will permanently remove this conversation. This action cannot be undone.</Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleCloseDeleteConfirmDialog} sx={{ color: 'white' }}>Cancel</Button>
                <Button onClick={handleConfirmDeleteConversation} variant="contained" color="error" sx={{ borderRadius: '50px' }}>Delete Permanently</Button>
            </DialogActions>
        </Dialog>
    </div>
  );
};

export default ConversationsPage;
