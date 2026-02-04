"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/lib/context';
import { getConversationList, createConversation, deleteConversation, updateConversationTitle, ConversationMetadata } from '@/lib/realtimedb';
import Image from 'next/image';

// MUI Imports
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete'; // New import
import MoreVertIcon from '@mui/icons-material/MoreVert'; // New import
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import EditIcon from '@mui/icons-material/Edit'; // New import for Edit icon
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import for the back button
import { Fab, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const ConversationsPage = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [renameConversationId, setRenameConversationId] = useState('');
  const [renameConversationTitle, setRenameConversationTitle] = useState('');

  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false); // New state for delete confirmation dialog
  const [deleteConversationId, setDeleteConversationId] = useState(''); // New state to hold ID of convo to delete

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null); // To track which conversation's menu is open

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
    try {
      const newConversationId = await createConversation(user.uid, idToCreate === "default" ? "Default Chat" : "New Chat", idToCreate);
      if (shouldRedirect) {
        router.push(`/chat/${newConversationId}`);
      }
    } catch (error) {
      console.error("Error creating new conversation:", error);
    }
  }, [user, router]); // Dependencies for useCallback

  const handleOpenRenameDialog = useCallback((convoId: string, currentTitle: string) => {
    handleMenuClose(); // Close the MoreVert menu
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
    if (!user || !renameConversationId || !renameConversationTitle.trim()) {
      alert("Conversation ID or new title is missing.");
      return;
    }
    try {
      await updateConversationTitle(user.uid, renameConversationId, renameConversationTitle.trim());
      handleCloseRenameDialog();
    } catch (error) {
      console.error("Error renaming conversation:", error);
      alert("Failed to rename conversation.");
    }
  }, [user, renameConversationId, renameConversationTitle, handleCloseRenameDialog]);

  const handleOpenDeleteConfirmDialog = useCallback((convoId: string) => {
    handleMenuClose(); // Close the MoreVert menu
    setDeleteConversationId(convoId);
    setOpenDeleteConfirmDialog(true);
  }, []);

  const handleCloseDeleteConfirmDialog = useCallback(() => {
    setOpenDeleteConfirmDialog(false);
    setDeleteConversationId('');
  }, []);

  const handleConfirmDeleteConversation = useCallback(async () => {
    if (!user || !deleteConversationId) {
      alert("Conversation ID is missing for deletion.");
      return;
    }
    if (deleteConversationId === "default") {
        alert("The default conversation cannot be deleted.");
        handleCloseDeleteConfirmDialog();
        return;
    }
    try {
      await deleteConversation(user.uid, deleteConversationId);
      handleCloseDeleteConfirmDialog();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      alert("Failed to delete conversation.");
    }
  }, [user, deleteConversationId, handleCloseDeleteConfirmDialog]);

  const handleDeleteConversation = useCallback((convoId: string) => {
    if (!user) return;
    // Removed the "default" convo check here, moved to handleConfirmDeleteConversation
    handleOpenDeleteConfirmDialog(convoId);
  }, [user, handleOpenDeleteConfirmDialog]); // Depend on user and the new handler

  useEffect(() => {
    if (user === null) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (user) {
      unsubscribe = getConversationList(user.uid, (convos) => {
        setConversations(convos);
        setLoading(false);
        // If no conversations exist, create a default one with fixed ID "default"
        if (convos.length === 0) {
          handleCreateNewConversation("default", false); // Create default, but DO NOT redirect immediately
        }
      });
    }
    return () => {
      if (unsubscribe) {
        unsubscribe(); // Cleanup the listener
      }
    };
  }, [user, handleCreateNewConversation]); // Depend on user and handleCreateNewConversation



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


  if (!user || loading) {
    return (
      <div className="flex flex-col h-screen bg-black text-white font-sans antialiased items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mb-4">
          <Image src="/nexo.png" alt="Loading" width={32} height={32} />
        </div>
        <span className="text-gray-300">Loading conversations...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans antialiased">
      <header className="sticky top-0 z-50 py-3 px-4 bg-white/10 backdrop-blur-md flex items-center justify-between border-b border-white/20">
        <IconButton onClick={() => router.push('/')} color="inherit" aria-label="back to home" sx={{ color: 'white', '&:hover': { bgcolor: 'white/20' } }}>
          <ArrowBackIcon />
        </IconButton>
        <h1 className="text-lg font-semibold text-white">Your Conversations</h1>
        <IconButton color="primary" onClick={() => handleCreateNewConversation(undefined, true)} aria-label="new conversation">
            <AddIcon sx={{ color: 'white' }} />
        </IconButton>
      </header>

      <div className="flex-grow flex flex-col w-full max-w-4xl mx-auto overflow-hidden">
        {conversations.length === 0 ? (
          <Box className="flex-grow flex items-center justify-center text-gray-500 text-center p-4">
            <Typography variant="h6" color="inherit">
                No conversations yet. Start a new one!
            </Typography>
          </Box>
        ) : (
          <List className="flex-grow overflow-y-auto custom-scrollbar p-4">
            {conversations.map((convo) => (
              <ListItem
                key={convo.id}
                disablePadding
                secondaryAction={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="caption" color="lightgray" sx={{ mr: 1, whiteSpace: 'nowrap' }}>
                      {formatTimestamp(convo.timestamp)}
                    </Typography>
                    <IconButton
                      edge="end"
                      aria-label="more"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent Link from triggering
                        handleMenuClick(e, convo.id);
                      }}
                      sx={{ color: 'lightgray', '&:hover': { color: 'white' } }} // Apply hover here
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={openMenuId === convo.id}
                      onClose={handleMenuClose}
                      MenuListProps={{
                        'aria-labelledby': 'more-button',
                      }}
                       PaperProps={{
                        sx: {
                          bgcolor: 'rgba(30, 30, 30, 0.9)',
                          color: 'white',
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
                      <MenuItem
                        onClick={() => handleOpenRenameDialog(convo.id, convo.title)}
                        sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
                        disabled={convo.id === "default"} // Disable if default conversation
                      >
                        <ListItemIcon>
                          <EditIcon fontSize="small" sx={{ color: 'white' }} />
                        </ListItemIcon>
                        Rename
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleDeleteConversation(convo.id);
                          handleMenuClose();
                        }}
                        sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
                        disabled={convo.id === "default"} // Disable if default conversation
                      >
                        <ListItemIcon>
                          <DeleteIcon fontSize="small" sx={{ color: 'white' }} />
                        </ListItemIcon>
                        Delete
                      </MenuItem>
                    </Menu>
                  </div>
                }
                sx={{
                    mb: 2,
                    pl: 3, // Increase padding-left to give more space from the left edge
                    borderRadius: '1rem', // More consistent rounding
                    bgcolor: 'rgba(33, 33, 33, 0.8)', // Darker grey with transparency
                    '&:hover': {
                        bgcolor: 'rgba(50, 50, 50, 0.9)', // Slightly lighter dark grey for hover
                    },
                    border: '1px solid rgba(68, 68, 68, 0.7)', // Darker, more subtle border
                }}
              >
                <Link href={`/chat/${convo.id}`} passHref style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', paddingRight: '16px' }}>
                  <ListItemAvatar>
                    <Avatar sx={{
                        bgcolor: 'rgba(6, 182, 212, 0.7)', // Slightly darker cyan
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                    }}>
                      {convo.title ? convo.title.charAt(0).toUpperCase() : '?'} {/* Use first letter of title */}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="body1" color="white" noWrap>{convo.title}</Typography>}
                    secondary={
                      <Typography
                        variant="body2"
                        color="lightgray"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block', // Required for text-overflow to work
                          maxWidth: '50%', // Explicitly constrain the width of the snippet text
                        }}
                      >
                        {convo.lastMessageSnippet || "No messages yet."}
                      </Typography>
                    }
                    sx={{ color: 'white', ml: 2, flexShrink: 1, minWidth: 0 }}
                  />
                </Link>
              </ListItem>
            ))}
          </List>
        )}
        <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
            <Fab color="primary" aria-label="add" onClick={() => handleCreateNewConversation(undefined, true)}>
                <AddIcon />
            </Fab>
        </Box>
      </div>
        <Dialog open={openRenameDialog} onClose={handleCloseRenameDialog} PaperProps={{ sx: { bgcolor: 'rgba(30, 30, 30, 0.9)', color: 'white' } }}>
            <DialogTitle sx={{ color: 'white' }}>Rename Conversation</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="New Conversation Title"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={renameConversationTitle}
                    onChange={(e) => setRenameConversationTitle(e.target.value)}
                    sx={{
                        '& .MuiInputBase-input': { color: 'white' }, // Text color
                        '& .MuiInputLabel-root': { color: 'gray' }, // Label color
                        '& .MuiInput-underline:before': { borderBottomColor: 'gray' }, // Underline color
                        '& .MuiInput-underline:after': { borderBottomColor: 'cyan' }, // Focused underline color
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseRenameDialog} sx={{ color: 'white' }}>Cancel</Button>
                <Button onClick={handleRenameConversation} sx={{ color: 'cyan' }}>Rename</Button>
            </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteConfirmDialog} onClose={handleCloseDeleteConfirmDialog} PaperProps={{ sx: { bgcolor: 'rgba(30, 30, 30, 0.9)', color: 'white' } }}>
            <DialogTitle sx={{ color: 'white' }}>Confirm Delete</DialogTitle>
            <DialogContent>
                <Typography sx={{ color: 'white' }}>
                    Are you sure you want to delete this conversation? This action cannot be undone.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDeleteConfirmDialog} sx={{ color: 'white' }}>Cancel</Button>
                <Button onClick={handleConfirmDeleteConversation} sx={{ color: 'red' }}>Delete</Button>
            </DialogActions>
        </Dialog>
    </div>
  );
};

export default ConversationsPage;
