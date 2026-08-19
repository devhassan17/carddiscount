'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // Settings State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // SMTP State
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpFrom, setSmtpFrom] = useState('');
  const [smtpEnabled, setSmtpEnabled] = useState(false);

  const [activeTab, setActiveTab] = useState<'scraper' | 'security' | 'smtp'>('scraper');
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSmtpHost(data.settings.smtpHost || '');
        setSmtpPort(data.settings.smtpPort || 587);
        setSmtpUser(data.settings.smtpUser || '');
        setSmtpPass(data.settings.smtpPass || '');
        setSmtpFrom(data.settings.smtpFrom || '');
        setSmtpEnabled(Boolean(data.settings.smtpEnabled));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        setStatusMessage({ text: 'Unlocked Admin Access!', type: 'success' });
      } else {
        setAuthError(data.error || 'Incorrect Admin Password');
      }
    } catch (err: any) {
      setAuthError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage({ text: '', type: '' });

    if (!newPassword) {
      setStatusMessage({ text: 'New password cannot be empty.', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({ text: 'New password and confirm password do not match.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword: newPassword }),
      });
      const data = await res.json();

      if (data.success) {
        setStatusMessage({ text: 'Admin Password updated successfully!', type: 'success' });
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setStatusMessage({ text: data.error || 'Failed to update password', type: 'error' });
      }
    } catch (err: any) {
      setStatusMessage({ text: 'Error updating settings.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSmtpSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage({ text: '', type: '' });
    setLoading(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          smtpHost,
          smtpPort,
          smtpUser,
          smtpPass,
          smtpFrom,
          smtpEnabled,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setStatusMessage({ text: 'SMTP Email Configuration saved successfully!', type: 'success' });
      } else {
        setStatusMessage({ text: data.error || 'Failed to save SMTP config', type: 'error' });
      }
    } catch (err: any) {
      setStatusMessage({ text: 'Error saving SMTP configuration.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRunScraper = async () => {
    setLoading(true);
    setStatusMessage({ text: 'Running live scraper engine...', type: 'info' });

    try {
      const res = await fetch('/api/admin/scrape', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        setStatusMessage({
          text: `🎉 ${data.message}`,
          type: 'success',
        });
      } else {
        setStatusMessage({ text: data.error || 'Scraper failed', type: 'error' });
      }
    } catch (err: any) {
      setStatusMessage({ text: 'Scraper failed to execute.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 🔒 Password Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="page-enter flex-center" style={{ minHeight: '80vh', padding: 'var(--space-6)' }}>
        <div className="card card--glass p-6" style={{ width: '100%', maxWidth: '400px' }}>
          <div className="text-center mb-6">
            <div style={{ fontSize: '48px', marginBottom: 'var(--space-2)' }}>🔒</div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Admin Protection</h1>
            <p className="text-sm text-secondary mt-1">
              Enter admin password to access portal settings
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="input-group">
              <label>Admin Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                autoFocus
              />
            </div>

            {authError && (
              <div className="badge" style={{ background: '#FF3B30', color: 'white', padding: '8px', borderRadius: '8px', display: 'block', textAlign: 'center' }}>
                {authError}
              </div>
            )}

            <button type="submit" className="btn btn--primary btn--full btn--pill" disabled={loading}>
              {loading ? 'Authenticating...' : 'Unlock Admin Portal ➔'}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link href="/profile" className="text-sm text-secondary">
              ← Return to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ paddingBottom: 'var(--space-12)' }}>
      <div className="section-header">
        <h1 className="app-header__title" style={{ fontSize: '24px' }}>
          ⚙️ Admin Management Portal
        </h1>
        <button className="btn btn--ghost btn--sm" onClick={() => setIsAuthenticated(false)}>
          Lock Portal 🔒
        </button>
      </div>

      {/* Admin Nav Tabs */}
      <div className="peekaboo-nav-tabs mb-4">
        <button
          className={`peekaboo-tab ${activeTab === 'scraper' ? 'active' : ''}`}
          onClick={() => setActiveTab('scraper')}
        >
          🕷️ Deal Scraper Engine
        </button>
        <button
          className={`peekaboo-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          🔑 Security & Password
        </button>
        <button
          className={`peekaboo-tab ${activeTab === 'smtp' ? 'active' : ''}`}
          onClick={() => setActiveTab('smtp')}
        >
          ✉️ SMTP Email Config
        </button>
      </div>

      {/* Status Feedback Banner */}
      {statusMessage.text && (
        <div style={{ padding: '0 var(--space-5)', marginBottom: 'var(--space-4)' }}>
          <div
            className="card p-4"
            style={{
              background: statusMessage.type === 'success' ? 'rgba(52, 199, 89, 0.15)' : statusMessage.type === 'error' ? 'rgba(255, 59, 48, 0.15)' : 'rgba(0, 122, 255, 0.15)',
              borderColor: statusMessage.type === 'success' ? '#34C759' : statusMessage.type === 'error' ? '#FF3B30' : '#007AFF',
              borderWidth: 1,
            }}
          >
            <div className="font-semibold text-primary">{statusMessage.text}</div>
          </div>
        </div>
      )}

      {/* Tab 1: Scraper Engine */}
      {activeTab === 'scraper' && (
        <div style={{ padding: '0 var(--space-5)' }}>
          <div className="admin-card">
            <h2 style={{ fontSize: '20px', marginBottom: 'var(--space-2)' }}>
              🕷️ Peekaboo Guru Live Scraper
            </h2>
            <p className="text-sm text-secondary mb-4">
              Scrapes live RSS feed from <code className="text-accent">https://peekaboo.guru/rss</code> and ingests thousands of bank discounts across Restaurants, Medical Labs, Electronics, and Lifestyle brands.
            </p>

            <button
              className="btn btn--primary btn--pill btn--full"
              onClick={handleRunScraper}
              disabled={loading}
            >
              {loading ? 'Running Thousands-Deal Ingestion Engine...' : '🚀 Run Live Scraper Engine'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Security & Password Change */}
      {activeTab === 'security' && (
        <div style={{ padding: '0 var(--space-5)' }}>
          <div className="card card--glass p-5">
            <h2 style={{ fontSize: '20px', marginBottom: 'var(--space-2)' }}>
              🔑 Admin Password Settings
            </h2>
            <p className="text-sm text-secondary mb-4">
              Change your Admin Portal access password anytime.
            </p>

            <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
              <div className="input-group">
                <label>New Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Enter new password..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Confirm new password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn--primary btn--pill" disabled={loading}>
                {loading ? 'Saving...' : 'Update Admin Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: SMTP Email Configuration */}
      {activeTab === 'smtp' && (
        <div style={{ padding: '0 var(--space-5)' }}>
          <div className="card card--glass p-5">
            <h2 style={{ fontSize: '20px', marginBottom: 'var(--space-2)' }}>
              ✉️ SMTP Email Server Settings
            </h2>
            <p className="text-sm text-secondary mb-4">
              Configure SMTP credentials for sending email notifications when users invite friends to groups.
            </p>

            <form onSubmit={handleSmtpSave} className="flex flex-col gap-4">
              <div className="input-group">
                <label>SMTP Host</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="smtp.gmail.com"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>SMTP Port</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="587"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(Number(e.target.value))}
                />
              </div>

              <div className="input-group">
                <label>SMTP Username / Email</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="admin@cardsaver.pk"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>SMTP Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={smtpPass}
                  onChange={(e) => setSmtpPass(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Sender Email (From Header)</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="noreply@cardsaver.pk"
                  value={smtpFrom}
                  onChange={(e) => setSmtpFrom(e.target.value)}
                />
              </div>

              <div className="flex gap-2 align-center mt-2">
                <input
                  type="checkbox"
                  id="smtpEnabled"
                  checked={smtpEnabled}
                  onChange={(e) => setSmtpEnabled(e.target.checked)}
                  style={{ width: '20px', height: '20px' }}
                />
                <label htmlFor="smtpEnabled" className="font-semibold text-primary">
                  Enable Email Notifications for Friend Invites
                </label>
              </div>

              <button type="submit" className="btn btn--primary btn--pill mt-4" disabled={loading}>
                {loading ? 'Saving Settings...' : 'Save SMTP Configuration'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
