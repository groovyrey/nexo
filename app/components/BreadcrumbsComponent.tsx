"use client"; // This directive marks it as a Client Component

import React from 'react';
import { Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import Link from 'next/link'; // Next.js Link for navigation

const BreadcrumbsComponent = () => {
  const pathname = usePathname();
  const pathnames = pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ padding: '8px 16px', bgcolor: '#1a1a1a', borderBottom: '1px solid rgba(68, 68, 68, 0.7)', color: 'inherit' }}>
      <MuiLink component={Link} href="/" passHref sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}>
        <Typography color="white">Home</Typography>
      </MuiLink>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return last ? (
          <Typography color="white" key={to} sx={{ fontWeight: 'bold' }}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Typography>
        ) : (
          <MuiLink component={Link} href={to} key={to} passHref sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}>
            <Typography color="white">
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Typography>
          </MuiLink>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbsComponent;
