"use client";

import React from 'react';
import { ListItem, ListItemAvatar, ListItemText, Skeleton, Box } from '@mui/material';

const ConversationSkeleton = () => {
  return (
    <ListItem
      sx={{
        borderRadius: '0',
        bgcolor: 'rgba(33, 33, 33, 0.8)',
        borderBottom: '1px solid rgba(68, 68, 68, 0.7)',
        pl: 2,
        height: '72px', // Approximate height of a conversation item
      }}
    >
      <ListItemAvatar>
        <Skeleton variant="circular" width={40} height={40} />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton variant="text" width={'80%'} />}
        secondary={<Skeleton variant="text" width={'50%'} />}
      />
    </ListItem>
  );
};

export default ConversationSkeleton;
