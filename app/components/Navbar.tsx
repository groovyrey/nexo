"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { FiLogIn, FiLogOut, FiMessageSquare, FiLayout } from "react-icons/fi";
import { useAuthContext } from "@/lib/context";
import { signInWithGoogle, signOutWithGoogle } from "@/lib/auth";
import { useNotification } from "@/lib/notification"; // Import useNotification

const Navbar = () => {
  const router = useRouter();
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
    <AppBar position="static" sx={{ bgcolor: '#1a1a1a', borderBottom: '1px solid rgba(68, 68, 68, 0.7)' }}>
      <Toolbar>
                {/* Left section: Logo and Title */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                  <Image src="/nexo.png" width={32} height={32} alt="Nexo Logo" />
                  <Typography variant="h6" component="div" sx={{ ml: 1, color: 'white', display: { xs: 'none', sm: 'block' } }}>
                    Nexo AI
                  </Typography>
                </Box>          
                  {/* Right section: Auth buttons and Conversations button (Desktop) and Mobile Menu Icon */}
                  <Box sx={{ display: { xs: 0, sm: 2 }, alignItems: 'center', gap: { xs: 0, sm: 2 } }}> {/* Gap is 0 for xs to keep icon close */}
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      edge="end" // Align to the end
                      onClick={handleDrawerToggle}
                      sx={{ mr: { xs: 0, sm: -2 }, display: { sm: 'none' } }} // Show only on xs screens, adjust margin for proper spacing
                    >
                      <MenuIcon />
                    </IconButton>
                    {/* Desktop navigation */}
                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
                      {user ? (
                        // Logged-in state (Desktop)
                        <>
                          <Button
                            variant="text"
                            color="inherit"
                            onClick={handleNavigateToConversations}
                            sx={{
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.1)', // Subtle hover background
                              },
                            }}
                          >
                            <FiLayout className="mr-1" />
                            Dashboard
                          </Button>
                          <Button
                            variant="text"
                            color="inherit"
                            onClick={() => {
                              router.push('/chat');
                            }}
                            sx={{
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.1)', // Subtle hover background
                              },
                            }}
                          >
                            <FiMessageSquare className="mr-1" />
                            Chat
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={async () => {
                              try {
                                await signOutWithGoogle();
                                showNotification("Signed out successfully!", "success");
                              } catch (error) {
                                console.error("Sign Out Error:", error);
                                showNotification("Failed to sign out. Please try again.", "error");
                              }
                            }}
                            sx={{
                              color: 'white',
                              display: 'flex', alignItems: 'center', minWidth: 0,
                            }}
                          >
                            <FiLogOut className="mr-1" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        // Logged-out state (Desktop)
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={async () => {
                            try {
                              await signInWithGoogle();
                              showNotification("Signed in successfully!", "success");
                            } catch (error) {
                              console.error("Sign In Error:", error);
                              showNotification("Failed to sign in. Please try again.", "error");
                            }
                          }}
                          sx={{
                            color: 'white',
                            display: 'flex', alignItems: 'center', minWidth: 0
                          }}
                        >
                          <FiLogIn className="mr-1" />
                          Sign in with Google
                        </Button>
                      )}
                    </Box> {/* Closing for desktop navigation Box */}
                  </Box> {/* Closing for auth buttons and mobile menu Box */}
                </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250, 
            bgcolor: 'rgba(26, 26, 26, 0.8)', // Semi-transparent background
            color: 'white',
            backdropFilter: 'blur(5px)', // Blur effect
          },
        }}
      >
        <Box
          sx={{ width: 250, p: 2 }}
          role="presentation"
          onClick={handleDrawerToggle}
          onKeyDown={handleDrawerToggle}
        >
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid rgba(68, 68, 68, 0.7)' }}>
            {user ? (
              <>
                <Avatar
                  src={user.photoURL || undefined}
                  alt={user.displayName || "User Avatar"}
                  sx={{ width: 64, height: 64, mb: 1 }}
                >{user.displayName ? user.displayName.charAt(0) : 'U'}</Avatar>
                <Typography variant="h6" component="div" sx={{ color: 'white' }}>
                  {user.displayName || "User"}
                </Typography>
                <Typography variant="body2" sx={{ color: 'lightgray' }}>
                  {user.email}
                </Typography>
              </>
            ) : (
              <>
                <Avatar sx={{ width: 64, height: 64, mb: 1 }}>G</Avatar>
                <Typography variant="h6" component="div" sx={{ color: 'white' }}>
                  Guest
                </Typography>
              </>
            )}
          </Box>
          <List>
            {user && (
              <>
                            <ListItem disablePadding sx={{ my: 1 }}>
                              <ListItemButton
                                onClick={() => {
                                  router.push('/dashboard');
                                  setDrawerOpen(false);
                                }}
                                sx={{ borderRadius: '8px', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
                              >
                                <ListItemIcon sx={{ color: 'white' }}>
                                  <FiLayout />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" />
                              </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding sx={{ my: 1 }}>
                              <ListItemButton
                                onClick={() => {
                                  router.push('/chat');
                                  setDrawerOpen(false);
                                }}
                                sx={{ borderRadius: '8px', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
                              >
                                <ListItemIcon sx={{ color: 'white' }}>
                                  <FiMessageSquare />
                                </ListItemIcon>
                                <ListItemText primary="Chat" />
                              </ListItemButton>
                            </ListItem>
              </>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Divider sx={{ my: 1, bgcolor: 'rgba(68, 68, 68, 0.7)' }} />
            {user ? (
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={async () => {
                    try {
                      await signOutWithGoogle();
                      showNotification("Signed out successfully!", "success");
                    } catch (error) {
                      console.error("Sign Out Error:", error);
                      showNotification("Failed to sign out. Please try again.", "error");
                    }
                  }}
                  sx={{ borderRadius: '8px', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    <FiLogOut />
                  </ListItemIcon>
                  <ListItemText primary="Sign Out" />
                </ListItemButton>
              </ListItem>
            ) : (
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={async () => {
                    try {
                      await signInWithGoogle();
                      showNotification("Signed in successfully!", "success");
                    } catch (error) {
                      console.error("Sign In Error:", error);
                      showNotification("Failed to sign in. Please try again.", "error");
                    }
                  }}
                  sx={{ borderRadius: '8px', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    <FiLogIn />
                  </ListItemIcon>
                  <ListItemText primary="Sign in with Google" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
