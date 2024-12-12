'use client'

import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { BlockchainProvider } from "@/components/BlockchainProvider";
import { PostUpdater } from '@/components/PostUpdater';
import Header from "@/components/header";
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import SolanaProvider from '@/components/SolanaProvider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children, session, ...props }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const styles = `
      ::-webkit-scrollbar { width: 9px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #222; border-radius: 6px; }
      ::-webkit-scrollbar-thumb:hover { background: #333; }
      scrollbar-width: thin;
      scrollbar-color: #222 transparent;
    `;

    const styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    return () => {
      // Cleanup the style tag on component unmount
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SolanaProvider>
              <BlockchainProvider>
                <PostUpdater>
                  <Header />
                  {mounted && children}
                </PostUpdater>
              </BlockchainProvider>
            </SolanaProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
