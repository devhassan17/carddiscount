'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  userName?: string;
  unreadCount?: number;
}

export default function Header({ userName = 'Ali Hassan', unreadCount = 2 }: HeaderProps) {
  const router = useRouter();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 17) return 'Good Afternoon 🌤️';
    if (hour < 21) return 'Good Evening 🌅';
    return 'Good Night 🌙';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="app-header">
      <div className="flex gap-3" style={{ alignItems: 'center' }}>
        <Link href="/profile">
          <div
            className="avatar avatar--sm"
            style={{ background: 'linear-gradient(135deg, #007AFF, #5856D6)', cursor: 'pointer' }}
          >
            {getInitials(userName)}
          </div>
        </Link>
        <div>
          <div className="text-xs text-secondary">{getGreeting()}</div>
          <div className="font-semibold">{userName.split(' ')[0]}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="app-header__icon-btn"
          onClick={() => router.push('/search')}
          aria-label="Search"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </button>

        <button
          className="app-header__icon-btn"
          onClick={() => router.push('/notifications')}
          aria-label="Notifications"
          style={{ position: 'relative' }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          {unreadCount > 0 && (
            <span
              className="badge"
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
