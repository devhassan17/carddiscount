import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const revalidate = 0;

export default async function GroupsPage() {
  const groups = await prisma.group.findMany({
    include: { members: true },
    orderBy: { createdAt: 'desc' },
  });

  const allDeals = await prisma.deal.findMany();

  return (
    <div className="page-enter" style={{ paddingBottom: 'var(--space-12)' }}>
      <div className="section-header">
        <h1 className="app-header__title" style={{ fontSize: '24px' }}>
          Social Savings Groups ({groups.length})
        </h1>
      </div>

      <div style={{ padding: '0 var(--space-5)', marginBottom: 'var(--space-4)' }}>
        <div className="card card--glass p-4">
          <div className="flex gap-3 align-center">
            <div style={{ fontSize: '32px' }}>👥</div>
            <div>
              <div className="font-semibold text-primary">Pool Cards With Friends</div>
              <div className="text-xs text-secondary mt-1">
                Combine your bank cards with family & colleagues to unlock maximum group discounts!
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 var(--space-5)' }} className="flex flex-col gap-3 stagger-in">
        {groups.map((group) => {
          let pooledCardsCount = 0;
          group.members.forEach((m) => {
            try {
              const cardsArr = JSON.parse(m.cardsJson);
              pooledCardsCount += cardsArr.length;
            } catch {}
          });

          return (
            <Link key={group.id} href={`/groups/${group.id}`} className="group-card">
              <div className="group-card__icon" style={{ backgroundColor: group.color }}>
                {group.icon}
              </div>
              <div className="group-card__info">
                <div className="group-card__name">{group.name}</div>
                <div className="group-card__members">
                  {group.members.length} Members • {pooledCardsCount} Pooled Cards
                </div>
              </div>
              <div className="group-card__deals-count">View Deals ➔</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
