'use client';
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
  components: {

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999, // Super rounded corners for all buttons
          textTransform: 'none', // Prevent uppercase transformation
          fontWeight: 600, // Make text a bit bolder
        },
        contained: {
          boxShadow: 'none', // Remove default shadow for a flatter design
          '&:hover': {
            boxShadow: 'none', // No shadow on hover either
            opacity: 0.9, // Slight opacity change on hover
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)', // Subtle background on hover
          },
        },
        sizeMedium: {
          padding: '8px 20px',
          fontSize: '0.875rem',
        },
        sizeLarge: {
          padding: '10px 24px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.75rem',
        },
      },
    },
  },
});

export default theme;
