import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const revalidate = 60;

export default async function ProfilePage() {
  let user: any = null;

  try {
    user = await prisma.user.findFirst({
      where: { email: 'user@cardsaver.pk' },
      include: { cards: true, notifications: true }
    });
  } catch (e) {
    user = null;
  }

  const profileUser = user || {
    name: 'Ali Hassan',
    email: 'user@cardsaver.pk',
    city: 'Karachi',
    cards: [
      { id: '1', bank: 'hbl', bankName: 'Habib Bank Limited' },
      { id: '2', bank: 'sadapay', bankName: 'SadaPay' }
    ]
  };

  return (
    <div className="page-enter" style={{ paddingBottom: 'var(--space-12)' }}>
      <div className="section-header">
        <h1 className="app-header__title" style={{ fontSize: '24px' }}>
          👤 My Account
        </h1>
      </div>

      <div style={{ padding: '0 var(--space-5)', marginBottom: 'var(--space-6)' }}>
        <div className="card card--glass p-6 text-center">
          <div
            className="avatar"
            style={{
              width: 72,
              height: 72,
              margin: '0 auto var(--space-3)',
              background: 'linear-gradient(135deg, #007AFF, #5856D6)',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            AH
          </div>
          <h2 style={{ fontSize: '22px' }}>{profileUser.name}</h2>
          <p className="text-sm text-secondary" style={{ marginTop: '2px' }}>{profileUser.email}</p>
          <div className="badge" style={{ marginTop: '8px', background: 'rgba(0,122,255,0.12)', color: '#007AFF' }}>
            📍 {profileUser.city} Resident
          </div>
        </div>
      </div>

      <div style={{ padding: '0 var(--space-5)' }} className="flex flex-col gap-3">
        <Link href="/wallet">
          <div className="card p-4 flex-between align-center" style={{ cursor: 'pointer' }}>
            <div className="flex gap-3 align-center">
              <div style={{ fontSize: '20px' }}>💳</div>
              <div>
                <div className="font-semibold text-primary">My Bank Cards</div>
                <div className="text-xs text-secondary">{profileUser.cards?.length || 2} Cards Linked</div>
              </div>
            </div>
            <div className="text-secondary">➔</div>
          </div>
        </Link>

        <Link href="/groups">
          <div className="card p-4 flex-between align-center" style={{ cursor: 'pointer' }}>
            <div className="flex gap-3 align-center">
              <div style={{ fontSize: '20px' }}>👨‍👩‍👧‍👦</div>
              <div>
                <div className="font-semibold text-primary">Savings Groups</div>
                <div className="text-xs text-secondary">Family & Office Pools</div>
              </div>
            </div>
            <div className="text-secondary">➔</div>
          </div>
        </Link>

        <Link href="/admin">
          <div className="card p-4 flex-between align-center" style={{ cursor: 'pointer', background: 'rgba(0, 122, 255, 0.08)' }}>
            <div className="flex gap-3 align-center">
              <div style={{ fontSize: '20px' }}>⚙️</div>
              <div>
                <div className="font-semibold text-primary">Admin Portal</div>
                <div className="text-xs text-secondary">Locked with password Qwerty123!@#</div>
              </div>
            </div>
            <div className="section-header__action">Unlock 🔒</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
