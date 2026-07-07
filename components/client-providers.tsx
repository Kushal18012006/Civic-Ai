'use client';

import React from 'react';
import { ThemeProvider } from './theme-provider';
import { LanguageProvider } from './language-provider';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}
