import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const revalidate = 0;

export default async function ProfilePage() {
  const user = await prisma.user.findFirst({
    where: { email: 'user@cardsaver.pk' },
    include: { cards: true, notifications: true },
  });

  return (
    <div className="page-enter" style={{ paddingBottom: 'var(--space-12)' }}>
      <div className="profile-header">
        <div className="profile-header__avatar" style={{ background: 'linear-gradient(135deg, #007AFF, #5856D6)' }}>
          AH
        </div>
        <div className="profile-header__name">{user?.name || 'Ali Hassan'}</div>
        <div className="profile-header__email">{user?.email || 'user@cardsaver.pk'}</div>
        <div className="badge" style={{ marginTop: '8px', background: '#34C759', color: 'white' }}>
          📍 {user?.city || 'Karachi'}
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-card__value">{user?.cards.length || 0}</div>
          <div className="stat-card__label">Wallet Cards</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value" style={{ color: 'var(--accent-blue)' }}>
            {user?.notifications.length || 0}
          </div>
          <div className="stat-card__label">Alerts</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value" style={{ color: 'var(--accent-purple)' }}>
            30+
          </div>
          <div className="stat-card__label">Partner Banks</div>
        </div>
      </div>

      {/* Settings List */}
      <div className="list-group">
        <div className="list-group__header">Account & Preferences</div>
        <Link href="/wallet" className="list-cell">
          <div style={{ fontSize: '20px' }}>💳</div>
          <div className="list-cell__content">
            <div className="list-cell__title font-semibold">Manage Bank Cards</div>
            <div className="list-cell__subtitle">Add or edit your cards</div>
          </div>
          <div className="text-secondary">➔</div>
        </Link>

        <Link href="/notifications" className="list-cell">
          <div style={{ fontSize: '20px' }}>🔔</div>
          <div className="list-cell__content">
            <div className="list-cell__title font-semibold">Notification Center</div>
            <div className="list-cell__subtitle">Deal alerts & card updates</div>
          </div>
          <div className="text-secondary">➔</div>
        </Link>
      </div>

      {/* Admin Management Section */}
      <div className="list-group">
        <div className="list-group__header">CardSaver Admin</div>
        <Link href="/admin" className="list-cell">
          <div style={{ fontSize: '20px' }}>⚙️</div>
          <div className="list-cell__content">
            <div className="list-cell__title font-semibold" style={{ color: 'var(--accent-blue)' }}>
              Admin Management Portal
            </div>
            <div className="list-cell__subtitle">Live deal scraper & deal analytics</div>
          </div>
          <div className="text-secondary">➔</div>
        </Link>
      </div>
    </div>
  );
}
