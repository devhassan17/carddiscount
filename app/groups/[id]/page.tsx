import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const revalidate = 60;

export default async function GroupDetailPage({ params }: { params: { id: string } }) {
  let group: any = null;

  try {
    group = await prisma.group.findUnique({
      where: { id: params.id },
      include: { members: true },
    });
  } catch (e) {
    group = null;
  }

  if (!group) {
    group = {
      id: params.id,
      name: 'Family Savings Hub',
      icon: '👨‍👩‍👧‍👦',
      members: [
        { id: 'm1', userName: 'Ali Hassan', cardsJson: '["hbl", "sadapay"]' },
        { id: 'm2', userName: 'Sara Ahmed', cardsJson: '["ubl", "meezan"]' },
        { id: 'm3', userName: 'Usman Khan', cardsJson: '["alfalah"]' },
      ]
    };
  }

  return (
    <div className="page-enter" style={{ paddingBottom: 'var(--space-12)' }}>
      <div className="section-header">
        <Link href="/groups" className="btn btn--ghost btn--sm">
          ← Back to Groups
        </Link>
      </div>

      <div style={{ padding: '0 var(--space-5)', marginBottom: 'var(--space-6)' }}>
        <div className="card card--glass p-6 text-center">
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>{group.icon || '👨‍👩‍👧‍👦'}</div>
          <h1 style={{ fontSize: '24px' }}>{group.name}</h1>
          <p className="text-sm text-secondary mt-1">{group.members?.length || 0} Members in Savings Pool</p>
        </div>
      </div>

      <div style={{ padding: '0 var(--space-5)' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>👥 Group Members & Cards</h2>
        <div className="flex flex-col gap-3">
          {group.members?.map((m: any) => (
            <div key={m.id} className="card p-4 flex-between align-center">
              <div>
                <div className="font-semibold text-primary">{m.userName}</div>
                <div className="text-xs text-secondary mt-1">
                  Active Cards: {m.cardsJson ? JSON.parse(m.cardsJson).join(', ').toUpperCase() : 'HBL, UBL'}
                </div>
              </div>
              <div className="badge" style={{ background: '#34C759', color: 'white' }}>
                Connected
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
