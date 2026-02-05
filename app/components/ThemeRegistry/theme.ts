'use client';
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'dark', // Explicitly set dark mode
    primary: {
      main: '#4f46e5',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    text: {
      primary: '#ffffff', // White text for primary
      secondary: '#b0b0b0', // Light grey text for secondary
      disabled: '#808080', // Grey text for disabled
    },
  },
  components: {

    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#111111 !important',
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'cta' },
          style: {
            color: 'white',
            padding: '12px 28px', // px-7 py-3
            borderRadius: '9999px', // rounded-full
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
            transition: 'all 0.2s ease-in-out', // transition-all transform
            '&:hover': {
              boxShadow: '0 20px 25px -5px rgba(79, 70, 229, 0.5), 0 8px 10px -6px rgba(79, 70, 229, 0.5)', // hover:shadow-indigo-500/50
              transform: 'scale(1.05)', // hover:scale-105
              backgroundColor: '#4f46e5', // Keep background color on hover
            },
          },
        },
        {
          props: { variant: 'gradient' },
          style: {
            background: 'linear-gradient(to right, #06b6d4, #2563eb)', // Tailwind's from-cyan-500 to-blue-600
            color: 'white',
            padding: '12px 24px',
            borderRadius: '9999px', // rounded-full
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
            '&:hover': {
              boxShadow: '0 20px 25px -5px rgba(6, 182, 212, 0.5), 0 8px 10px -6px rgba(6, 182, 212, 0.5)', // hover:shadow-cyan-500/50
              transform: 'scale(1.05)',
              transition: 'all 0.3s ease-in-out',
              background: 'linear-gradient(to right, #0891b2, #1d4ed8)', // Darker gradient on hover
            },
            fontSize: '1rem', // font-semibold for similar size
          },
        },
      ],
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
