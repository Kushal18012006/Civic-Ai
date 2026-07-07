'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './language-provider';
import { LayoutDashboard, Compass, Star, FileCheck2, AlertOctagon, ClipboardList } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const menuItems = [
    { name: t('dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('explorer'), href: '/services', icon: Compass },
    { name: t('recommendation'), href: '/recommend', icon: Star },
    { name: t('documents'), href: '/document-check', icon: FileCheck2 },
    { name: t('reportIssue'), href: '/report-issue', icon: AlertOctagon },
    { name: t('tracker'), href: '/complaints', icon: ClipboardList }
  ];

  return (
    <aside className="w-full md:w-64 border-r border-border bg-card shrink-0">
      {/* Sidebar Items */}
      <nav className="flex flex-row md:flex-col p-4 md:space-y-1 gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={twMerge(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap md:whitespace-normal",
                isActive
                  ? "bg-primary text-primary-foreground shadow shadow-primary/10"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
