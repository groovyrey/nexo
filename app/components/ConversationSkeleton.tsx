"use client";

import React from 'react';
import { ListItem, ListItemAvatar, ListItemText, Skeleton, Box } from '@mui/material';

const ConversationSkeleton = () => {
  return (
    <ListItem
      sx={{
        borderRadius: '16px',
        bgcolor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        mb: 1.5,
        mx: 1,
        width: 'calc(100% - 16px)',
        height: '80px',
        px: 2,
        '&:hover': {
          bgcolor: 'rgba(255, 255, 255, 0.04)',
        }
      }}
    >
      <ListItemAvatar>
        <Skeleton 
          variant="circular" 
          width={48} 
          height={48} 
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)' }} 
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Skeleton 
            variant="text" 
            width={'60%'} 
            height={24} 
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', borderRadius: 1 }} 
          />
        }
        secondary={
          <Skeleton 
            variant="text" 
            width={'40%'} 
            height={20} 
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)', borderRadius: 1, mt: 0.5 }} 
          />
        }
      />
    </ListItem>
  );
};

export default ConversationSkeleton;

