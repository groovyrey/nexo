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

import ThemeRegistry from './components/ThemeRegistry/ThemeRegistry';
import Navbar from './components/Navbar'; // Import the new Navbar component

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
        className={`${openSans.variable} ${firaCode.variable} antialiased`}
      >
        <ThemeRegistry options={{ key: 'mui' }}>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
