"use client";

import React from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, Divider, ListItemIcon, Grid, Chip, Alert } from '@mui/material';
import { FiMonitor, FiDollarSign, FiClock, FiCalendar, FiMessageSquare, FiCpu, FiDatabase, FiBarChart2 } from 'react-icons/fi'; // Importing icons

const UsagePage = () => {
  // Placeholder data for usage
  const usageData = {
    currentPeriod: "February 2026",
    messagesSent: 150,
    apiCalls: 230,
    dataProcessedGB: 0.5,
    lastReset: "February 1, 2026",
    nextReset: "March 1, 2026",
    plan: "Free Tier",
    costEstimate: "$0.00",
  };

  return (
    <Box sx={{ p: 4, color: 'white', maxWidth: 800, mx: 'auto' }}>
      <Alert severity="info" sx={{ mb: 4, bgcolor: '#333', color: 'white', '& .MuiAlert-icon': { color: 'white' } }}>
        <Typography variant="body1">
          This usage data is currently hardcoded placeholder data for demonstration purposes.
        </Typography>
      </Alert>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
        <FiMonitor style={{ verticalAlign: 'middle', marginRight: '10px' }} />
        Your Usage Overview
      </Typography>

      <Paper elevation={3} sx={{ bgcolor: '#2a2a2a', p: 3, borderRadius: '12px', mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
          Current Billing Period: {usageData.currentPeriod}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: '#333', borderRadius: '8px' }}>
              <FiMessageSquare color="lightblue" style={{ marginRight: '8px' }} />
              <Typography variant="body2">Messages Sent:</Typography>
              <Chip label={usageData.messagesSent} color="primary" size="small" sx={{ ml: 1 }} />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: '#333', borderRadius: '8px' }}>
              <FiCpu color="lightgreen" style={{ marginRight: '8px' }} />
              <Typography variant="body2">API Calls Made:</Typography>
              <Chip label={usageData.apiCalls} color="success" size="small" sx={{ ml: 1 }} />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: '#333', borderRadius: '8px' }}>
              <FiDatabase color="orange" style={{ marginRight: '8px' }} />
              <Typography variant="body2">Data Processed:</Typography>
              <Chip label={`${usageData.dataProcessedGB} GB`} color="warning" size="small" sx={{ ml: 1 }} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ bgcolor: '#2a2a2a', p: 3, borderRadius: '12px', mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
          Billing Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: '#333', borderRadius: '8px' }}>
              <FiCalendar color="gold" style={{ marginRight: '8px' }} />
              <Typography variant="body2">Last Reset:</Typography>
              <Chip label={usageData.lastReset} size="small" sx={{ ml: 1, bgcolor: 'rgba(255,215,0,0.2)' }} />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: '#333', borderRadius: '8px' }}>
              <FiClock color="pink" style={{ marginRight: '8px' }} />
              <Typography variant="body2">Next Reset:</Typography>
              <Chip label={usageData.nextReset} size="small" sx={{ ml: 1, bgcolor: 'rgba(255,192,203,0.2)' }} />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: '#333', borderRadius: '8px' }}>
              <FiDollarSign color="lime" style={{ marginRight: '8px' }} />
              <Typography variant="body2">Current Plan:</Typography>
              <Chip label={usageData.plan} color="success" size="small" sx={{ ml: 1 }} />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: '#333', borderRadius: '8px' }}>
              <FiBarChart2 color="cyan" style={{ marginRight: '8px' }} />
              <Typography variant="body2">Estimated Cost:</Typography>
              <Chip label={usageData.costEstimate} color="info" size="small" sx={{ ml: 1 }} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4, color: 'gray' }}>
        Usage data is updated periodically. Final billing may vary.
      </Typography>
    </Box>
  );
};

export default UsagePage;
