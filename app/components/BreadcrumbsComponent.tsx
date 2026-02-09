"use client"; // This directive marks it as a Client Component

import React from 'react';
import { Breadcrumbs, Link as MuiLink, Typography, Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import Link from 'next/link'; // Next.js Link for navigation

const BreadcrumbsComponent = () => {
  const pathname = usePathname();
  const pathnames = pathname.split('/').filter((x) => x);

  return (
    <Box 
      sx={{ 
        px: { xs: 2, sm: 4 }, 
        py: 1, 
        bgcolor: 'rgba(17, 17, 17, 0.6)', 
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        display: pathname === '/' ? 'none' : 'block' // Hide on home page
      }}
    >
      <Breadcrumbs 
        aria-label="breadcrumb" 
        separator={<Typography sx={{ color: 'rgba(255,255,255,0.3)', mx: 0.5 }}>/</Typography>}
        sx={{ 
          '& .MuiBreadcrumbs-ol': { alignItems: 'center' }
        }}
      >
        <MuiLink 
          component={Link} 
          href="/" 
          underline="none"
          sx={{ 
            color: 'rgba(255,255,255,0.6)', 
            transition: 'color 0.2s',
            '&:hover': { color: 'white' },
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>Home</Typography>
        </MuiLink>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          return last ? (
            <Typography 
              key={to} 
              variant="body2"
              sx={{ 
                color: 'primary.main', 
                fontWeight: 600,
                letterSpacing: '0.01em'
              }}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Typography>
          ) : (
            <MuiLink 
              component={Link} 
              href={to} 
              key={to} 
              underline="none"
              sx={{ 
                color: 'rgba(255,255,255,0.6)', 
                transition: 'color 0.2s',
                '&:hover': { color: 'white' }
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Typography>
            </MuiLink>
          );
        })}
      </Breadcrumbs>
    </Box>

  );
};

export default BreadcrumbsComponent;
