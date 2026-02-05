import type { Metadata } from "next";
import { Open_Sans, Fira_Code } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

import SessionWrapper from './components/SessionWrapper'; // Import the new SessionWrapper component
import ThemeRegistry from './components/ThemeRegistry/ThemeRegistry';
import Navbar from './components/Navbar'; // Import the new Navbar component
import BreadcrumbsComponent from './components/BreadcrumbsComponent'; // Import the new BreadcrumbsComponent
import { Breadcrumbs, Link as MuiLink, Typography } from '@mui/material'; // Import MUI components for breadcrumbs
import { usePathname } from 'next/navigation'; // Import usePathname for dynamic breadcrumbs

export const metadata: Metadata = {
  title: "Nexo - Your AI Chatbot Assistant",
  description: "Your AI Chatbot Assistant",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openSans.variable} ${firaCode.variable} antialiased flex flex-col min-h-screen overflow-y-scroll`}
      >
        <ThemeRegistry options={{ key: 'mui' }}>
          <AuthProvider>
            <div className="flex flex-col flex-grow">
              <Navbar />
              <BreadcrumbsComponent />
              <div className="flex-grow min-h-[calc(100vh - 112px)]">
                <SessionWrapper>{children}</SessionWrapper>
              </div>
            </div>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
