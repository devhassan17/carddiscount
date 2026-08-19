import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { fallbackBanks } from '@/lib/fallbackData';
import BankBadge from '@/components/BankBadge';

export const revalidate = 60;

export default async function WalletPage() {
  let user: any = null;
  let allBanks: any[] = [];

  try {
    user = await prisma.user.findFirst({
      where: { email: 'user@cardsaver.pk' },
      include: { cards: true }
    });
  } catch (e) {
    user = null;
  }

  try {
    allBanks = await prisma.bank.findMany();
  } catch (e) {
    allBanks = [];
  }
  if (!allBanks || allBanks.length === 0) allBanks = fallbackBanks;

  const cards = user?.cards || [
    { id: 'c1', bank: 'hbl', bankName: 'Habib Bank Limited', type: 'Credit Card', tier: 'Gold', last4: '8821', isDefault: true },
    { id: 'c2', bank: 'sadapay', bankName: 'SadaPay', type: 'Debit Card', tier: 'Classic', last4: '1042', isDefault: false },
    { id: 'c3', bank: 'meezan', bankName: 'Meezan Bank', type: 'Debit Card', tier: 'Titanium', last4: '5590', isDefault: false }
  ];

  return (
    <div className="page-enter" style={{ paddingBottom: 'var(--space-12)' }}>
      <div className="section-header">
        <h1 className="app-header__title" style={{ fontSize: '24px' }}>
          💳 Card Wallet ({cards.length})
        </h1>
        <Link href="/deals" className="btn btn--ghost btn--sm">
          Browse Deals ➔
        </Link>
      </div>

      {/* User Added Cards Stack */}
      <div style={{ padding: '0 var(--space-5)', marginBottom: 'var(--space-6)' }} className="flex flex-col gap-4">
        {cards.map((card: any) => (
          <div key={card.id} className={`bank-card bank-card--${card.bank}`}>
            <div className="flex-between align-center">
              <BankBadge bankId={card.bank} size="md" />
              <div className="text-xs font-bold uppercase" style={{ opacity: 0.9 }}>
                {card.type} • {card.tier}
              </div>
            </div>

            <div style={{ margin: 'var(--space-4) 0' }}>
              <div className="text-xs" style={{ opacity: 0.8, letterSpacing: '1px' }}>CARD NUMBER</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '3px' }}>
                •••• •••• •••• {card.last4}
              </div>
            </div>

            <div className="flex-between align-center">
              <div>
                <div className="text-xs" style={{ opacity: 0.8 }}>CARDHOLDER</div>
                <div className="font-semibold text-sm">{user?.name || 'Ali Hassan'}</div>
              </div>
              {card.isDefault && (
                <div className="badge" style={{ background: 'rgba(255,255,255,0.3)', color: 'white' }}>
                  ⭐ Primary Card
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Bank Card Section */}
      <div style={{ padding: '0 var(--space-5)' }}>
        <div className="card card--glass p-5">
          <h2 style={{ fontSize: '18px', marginBottom: 'var(--space-2)' }}>
            ➕ Select & Add Partner Card
          </h2>
          <p className="text-sm text-secondary mb-4">
            Select a bank or digital wallet to instantly unlock personalized deals!
          </p>

          <div className="flex flex-wrap gap-2">
            {allBanks.map((b: any) => (
              <span
                key={b.id}
                className="chip active"
                style={{ background: b.color, color: 'white', cursor: 'pointer', padding: '8px 12px' }}
              >
                💳 {b.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
