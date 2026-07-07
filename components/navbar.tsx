'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from './language-provider';
import { useTheme } from './theme-provider';
import { getAuthClient } from '../lib/supabase';
import { Button } from './ui/button';
import { Sun, Moon, Languages, LogOut, UserCheck } from 'lucide-react';
import { Language } from '../types';

export function Navbar() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [userName, setUserName] = useState('Citizen');
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const auth = getAuthClient();
      const { data: { user } } = await auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.name || user.email?.split('@')[0] || 'Citizen');
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    const auth = getAuthClient();
    await auth.signOut();
    router.push('/login');
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/80 backdrop-blur-md px-6">
      {/* Brand logo (visible on desktop) */}
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
          CivicAI
        </span>
        <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50">
          Beta v1.0
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Language selector */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Languages className="h-5 w-5" />
          </Button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg border border-border bg-card p-1 shadow-lg z-50">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`w-full text-left px-3 py-1.5 text-xs rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground ${language === 'en' ? 'bg-accent font-semibold text-primary' : ''}`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange('hi')}
                className={`w-full text-left px-3 py-1.5 text-xs rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground ${language === 'hi' ? 'bg-accent font-semibold text-primary' : ''}`}
              >
                हिन्दी (Hindi)
              </button>
              <button
                onClick={() => handleLanguageChange('es')}
                className={`w-full text-left px-3 py-1.5 text-xs rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground ${language === 'es' ? 'bg-accent font-semibold text-primary' : ''}`}
              >
                Español (Spanish)
              </button>
              <button
                onClick={() => handleLanguageChange('vi')}
                className={`w-full text-left px-3 py-1.5 text-xs rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground ${language === 'vi' ? 'bg-accent font-semibold text-primary' : ''}`}
              >
                Tiếng Việt
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-amber-400" />
          ) : (
            <Moon className="h-5 w-5 text-indigo-600" />
          )}
        </Button>

        {/* User Card */}
        <div className="flex items-center space-x-2 border-l border-border/80 pl-4">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-semibold text-foreground">{userName}</span>
            <span className="text-[10px] text-muted-foreground flex items-center justify-end">
              <UserCheck className="h-2.5 w-2.5 mr-1 text-emerald-500" /> Verified Citizen
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="text-zinc-500 hover:text-destructive hover:bg-destructive/5 cursor-pointer"
            title={t('signOut')}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
