import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const revalidate = 0;

export default async function NotificationsPage() {
  const user = await prisma.user.findFirst({
    where: { email: 'user@cardsaver.pk' },
    include: { notifications: true },
  });

  const notifications = user?.notifications || [];

  return (
    <div className="page-enter" style={{ paddingBottom: 'var(--space-12)' }}>
      <div className="section-header">
        <h1 className="app-header__title" style={{ fontSize: '24px' }}>
          Notifications ({notifications.length})
        </h1>
        <Link href="/" className="btn btn--ghost btn--sm">
          Back ←
        </Link>
      </div>

      <div style={{ padding: '0 var(--space-5)' }} className="flex flex-col gap-3 stagger-in">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <Link
              key={n.id}
              href={n.link || '/deals'}
              className="card card--glass p-4"
              style={{ display: 'block' }}
            >
              <div className="font-semibold text-primary mb-1">{n.title}</div>
              <div className="text-sm text-secondary mb-2">{n.message}</div>
              <div className="text-xs text-tertiary">
                {new Date(n.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">🔔</div>
            <div className="empty-state__title">No Notifications Yet</div>
            <div className="empty-state__text">
              We will notify you when new deals for your cards become available.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
