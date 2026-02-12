"use client";
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from "next/image";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MessageIcon from '@mui/icons-material/Message';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CodeIcon from '@mui/icons-material/Code';
import { useAuthContext } from "@/lib/context";
import { signInWithGoogle, signOutWithGoogle } from "@/lib/auth";
import { useNotification } from "@/lib/notification"; // Import useNotification

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const authContext = useAuthContext(); // Get authContext from AuthContext
  const { showNotification } = useNotification(); // Use the notification hook
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // If authContext is null, user session is not yet loaded.
  // In Navbar, we don't necessarily want to return null,
  // as the Navbar should still render to allow sign-in.
  // We'll treat user as null in this case.
  const user = authContext ? authContext.user : null;


  const handleNavigateToConversations = () => {
    router.push('/dashboard');
    setDrawerOpen(false); // Close drawer after navigation
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        top: 0,
        zIndex: 1100,
        bgcolor: 'rgba(17, 17, 17, 0.8)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
        {/* Left section: Logo and Title */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            '&:hover': { opacity: 0.8 }
          }} 
          onClick={() => router.push('/')}
        >
          <Image src="/nexo.png" width={36} height={36} alt="Nexo Logo" />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              ml: 1.5, 
              color: 'white', 
              fontWeight: 700,
              letterSpacing: '-0.02em',
              display: { xs: 'none', sm: 'block' } 
            }}
          >
            Nexo AI
          </Typography>
        </Box>          

        {/* Desktop navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          <Button
            variant="text"
            color="inherit"
            onClick={() => router.push('/docs')}
            sx={{
              px: 2,
              color: pathname === '/docs' ? 'primary.main' : 'white',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
            }}
          >
            Docs
          </Button>
          {user ? (
            <>
              <Button
                variant="text"
                color="inherit"
                onClick={() => router.push('/dashboard')}
                startIcon={<DashboardIcon sx={{ fontSize: 18 }} />}
                sx={{
                  px: 2,
                  color: pathname === '/dashboard' ? 'primary.main' : 'white',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
                }}
              >
                Dashboard
              </Button>
              <Button
                variant="text"
                color="inherit"
                onClick={() => router.push('/chat')}
                startIcon={<MessageIcon sx={{ fontSize: 18 }} />}
                sx={{
                  px: 2,
                  color: pathname === '/chat' ? 'primary.main' : 'white',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
                }}
              >
                Chat
              </Button>
              <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                  src={user.photoURL || undefined} 
                  sx={{ width: 32, height: 32, border: '2px solid rgba(255,255,255,0.1)' }}
                >
                  {user.displayName?.charAt(0)}
                </Avatar>
                <Button
                  variant="outlined"
                  size="small"
                  color="inherit"
                  onClick={async () => {
                    try {
                      await signOutWithGoogle();
                      showNotification("Signed out successfully!", "success");
                    } catch (error) {
                      showNotification("Failed to sign out.", "error");
                    }
                  }}
                  sx={{ borderColor: 'rgba(255,255,255,0.2)', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}
                >
                  Sign Out
                </Button>
              </Box>
            </>
          ) : (
            <Button
              variant="gradient"
              onClick={async () => {
                try {
                  await signInWithGoogle();
                  showNotification("Signed in successfully!", "success");
                } catch (error) {
                  showNotification("Failed to sign in.", "error");
                }
              }}
              startIcon={<LoginIcon />}
            >
              Sign in with Google
            </Button>
          )}
        </Box>

        {/* Mobile menu toggle */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'rgba(17, 17, 17, 0.95)',
            backdropFilter: 'blur(16px)',
            backgroundImage: 'none',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Image src="/nexo.png" width={32} height={32} alt="Nexo Logo" />
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'white' }}>Nexo AI</Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                <Avatar src={user.photoURL || undefined} sx={{ width: 48, height: 48, flexShrink: 0 }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography 
                    variant="subtitle1" 
                    noWrap
                    sx={{ fontWeight: 600, color: 'white', lineHeight: 1.2 }}
                  >
                    {user.displayName}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    noWrap
                    sx={{ color: 'text.secondary', display: 'block' }}
                  >
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3, textAlign: 'center' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Guest Session</Typography>
              </Box>
            )}
          </Box>

          <List sx={{ flexGrow: 1, '& .MuiListItemButton-root': { borderRadius: 2, mb: 1 } }}>
            {user && (
              <>
                <ListItemButton 
                  onClick={() => { router.push('/dashboard'); setDrawerOpen(false); }}
                  selected={pathname === '/dashboard'}
                  sx={{ '&.Mui-selected': { bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } } }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><DashboardIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                  <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItemButton>
                
                <ListItemButton 
                  onClick={() => { router.push('/dashboard/usage'); setDrawerOpen(false); }}
                  selected={pathname === '/dashboard/usage'}
                  sx={{ ml: 2, '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><ShowChartIcon sx={{ fontSize: 18 }} /></ListItemIcon>
                  <ListItemText primary="Usage Stats" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>

                <ListItemButton 
                  onClick={() => { router.push('/chat'); setDrawerOpen(false); }}
                  selected={pathname === '/chat'}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><MessageIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                  <ListItemText primary="Chat" primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItemButton>
              </>
            )}
            <ListItemButton 
              onClick={() => { router.push('/docs'); setDrawerOpen(false); }}
              selected={pathname === '/docs'}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><CodeIcon sx={{ fontSize: 20 }} /></ListItemIcon>
              <ListItemText primary="Documentation" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
            <ListItemButton 
              onClick={() => { router.push('/status'); setDrawerOpen(false); }}
              selected={pathname === '/status'}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><ShowChartIcon sx={{ fontSize: 20 }} /></ListItemIcon>
              <ListItemText primary="System Status" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
          </List>

          <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {user ? (
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={async () => {
                  await signOutWithGoogle();
                  setDrawerOpen(false);
                }}
                sx={{ borderRadius: 2 }}
              >
                Sign Out
              </Button>
            ) : (
              <Button
                fullWidth
                variant="gradient"
                onClick={async () => {
                  await signInWithGoogle();
                  setDrawerOpen(false);
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </AppBar>

  );
};

export default Navbar;
