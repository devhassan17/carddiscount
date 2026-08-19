import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const revalidate = 60;

export default async function GroupsPage() {
  let groups: any[] = [];

  try {
    groups = await prisma.group.findMany({
      include: { members: true },
    });
  } catch (e) {
    groups = [];
  }

  if (!groups || groups.length === 0) {
    groups = [
      {
        id: 'g1',
        name: 'Family Savings Hub',
        icon: '👨‍👩‍👧‍👦',
        color: 'rgba(0, 122, 255, 0.12)',
        members: [
          { id: 'm1', userName: 'Ali Hassan', cardsJson: '["hbl", "sadapay"]' },
          { id: 'm2', userName: 'Sara Ahmed', cardsJson: '["ubl", "meezan"]' },
          { id: 'm3', userName: 'Usman Khan', cardsJson: '["alfalah"]' },
        ]
      },
      {
        id: 'g2',
        name: 'Office Foodies Club',
        icon: '🍔',
        color: 'rgba(255, 149, 0, 0.12)',
        members: [
          { id: 'm4', userName: 'Ali Hassan', cardsJson: '["hbl", "sadapay"]' },
          { id: 'm5', userName: 'Zainab Fatima', cardsJson: '["nayapay"]' },
        ]
      }
    ];
  }

  return (
    <div className="page-enter" style={{ paddingBottom: 'var(--space-12)' }}>
      <div className="section-header">
        <h1 className="app-header__title" style={{ fontSize: '24px' }}>
          👨‍👩‍👧‍👦 Savings Groups ({groups.length})
        </h1>
      </div>

      <div style={{ padding: '0 var(--space-5)', marginBottom: 'var(--space-6)' }} className="flex flex-col gap-4">
        {groups.map((group: any) => (
          <Link key={group.id} href={`/groups/${group.id}`}>
            <div className="card card--glass p-5" style={{ cursor: 'pointer' }}>
              <div className="flex-between align-center mb-3">
                <div className="flex gap-3 align-center">
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '16px',
                      background: group.color || 'rgba(0,122,255,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                    }}
                  >
                    {group.icon || '👨‍👩‍👧‍👦'}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '18px' }}>{group.name}</h2>
                    <div className="text-xs text-secondary">{group.members?.length || 0} Members Connected</div>
                  </div>
                </div>
                <div className="section-header__action">View Pool ➔</div>
              </div>

              <div className="flex align-center gap-2 mt-2">
                <div className="text-xs text-secondary">Card Pool:</div>
                <div className="flex gap-1 flex-wrap">
                  <span className="badge" style={{ background: '#00833D', color: 'white' }}>HBL</span>
                  <span className="badge" style={{ background: '#E31837', color: 'white' }}>UBL</span>
                  <span className="badge" style={{ background: '#00594C', color: 'white' }}>Meezan</span>
                  <span className="badge" style={{ background: '#1ED760', color: 'black' }}>SadaPay</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
