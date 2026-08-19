import { prisma } from '@/lib/prisma';
import DealCard from '@/components/DealCard';
import Link from 'next/link';

export const revalidate = 0;

interface GroupDetailPageProps {
  params: {
    id: string;
  };
}

export default async function GroupDetailPage({ params }: GroupDetailPageProps) {
  const group = await prisma.group.findUnique({
    where: { id: params.id },
    include: { members: true },
  });

  if (!group) {
    return (
      <div className="empty-state">
        <div className="empty-state__title">Group Not Found</div>
        <Link href="/groups" className="btn btn--primary btn--pill mt-4">
          Back to Groups
        </Link>
      </div>
    );
  }

  const allDeals = await prisma.deal.findMany();

  // Aggregate all bank IDs across group members
  const groupBankIds: string[] = [];
  group.members.forEach((m) => {
    try {
      const cardsArr = JSON.parse(m.cardsJson);
      cardsArr.forEach((c: any) => {
        if (c.bank && !groupBankIds.includes(c.bank)) {
          groupBankIds.push(c.bank);
        }
      });
    } catch {}
  });

  const matchingDeals = allDeals.filter((deal) => {
    try {
      const bArr: string[] = JSON.parse(deal.banksJson);
      return bArr.some((b) => groupBankIds.includes(b));
    } catch {
      return false;
    }
  });

  return (
    <div className="page-enter" style={{ paddingBottom: 'var(--space-12)' }}>
      <div className="group-detail__header">
        <Link href="/groups" className="btn btn--ghost btn--sm mb-2" style={{ display: 'inline-block' }}>
          ← Back to Groups
        </Link>
        <div className="group-detail__icon" style={{ backgroundColor: group.color }}>
          {group.icon}
        </div>
        <h1>{group.name}</h1>
        <p className="text-sm mt-1">{group.members.length} Members • {groupBankIds.length} Pooled Banks</p>
      </div>

      {/* Members Grid */}
      <div className="section-header">
        <div className="section-header__title">👥 Group Members ({group.members.length})</div>
      </div>
      <div className="group-detail__members-grid mb-6">
        {group.members.map((m) => (
          <div key={m.id} className="group-detail__member">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #007AFF, #AF52DE)' }}>
              {m.userName[0]}
            </div>
            <div className="group-detail__member-name">{m.userName}</div>
          </div>
        ))}
      </div>

      {/* Pooled Matching Deals */}
      <div className="section-header">
        <div className="section-header__title">🎉 Group Pooled Deals ({matchingDeals.length})</div>
      </div>
      <div className="deals-page__grid stagger-in">
        {matchingDeals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}
