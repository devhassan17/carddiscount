import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const revalidate = 0;

export default async function WalletPage() {
  const user = await prisma.user.findFirst({
    where: { email: 'user@cardsaver.pk' },
    include: { cards: true },
  });

  const banks = await prisma.bank.findMany();
  const userCards = user?.cards || [];

  const allDeals = await prisma.deal.findMany();
  const userBankIds = userCards.map(c => c.bank);

  const matchingDeals = allDeals.filter(deal => {
    try {
      const bArr: string[] = JSON.parse(deal.banksJson);
      return bArr.some(b => userBankIds.includes(b));
    } catch {
      return false;
    }
  });

  return (
    <div className="page-enter" style={{ paddingBottom: 'var(--space-12)' }}>
      <div className="section-header">
        <h1 className="app-header__title" style={{ fontSize: '24px' }}>
          My Card Wallet ({userCards.length})
        </h1>
      </div>

      {/* Wallet Metric Cards */}
      <div className="wallet-page__stats">
        <div className="stat-card">
          <div className="stat-card__value">{userCards.length}</div>
          <div className="stat-card__label">Active Cards</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value" style={{ color: 'var(--accent-green)' }}>
            {matchingDeals.length}
          </div>
          <div className="stat-card__label">Matching Deals</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value" style={{ color: 'var(--accent-blue)' }}>
            30+
          </div>
          <div className="stat-card__label">Supported Banks</div>
        </div>
      </div>

      {/* Cards List */}
      <div className="wallet-page__cards">
        {userCards.length > 0 ? (
          userCards.map((c) => (
            <div key={c.id} className="wallet-page__card-wrapper stagger-in">
              <div className={`bank-card bank-card--${c.bank}`}>
                <div className="bank-card__header">
                  <div className="bank-card__bank-name">{c.bankName}</div>
                  <div className="bank-card__chip" />
                </div>
                <div className="bank-card__number">•••• •••• •••• {c.last4}</div>
                <div className="bank-card__footer">
                  <div>
                    <div className="bank-card__name">ALI HASSAN</div>
                    <span className="card-tier-badge" style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}>
                      {c.tier}
                    </span>
                  </div>
                  <div className="bank-card__type">{c.type}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">💳</div>
            <div className="empty-state__title">Your Wallet is Empty</div>
            <div className="empty-state__text">
              Add your Pakistani bank credit or debit cards (HBL, UBL, Meezan, SadaPay, NayaPay, Easypaisa) to unlock exclusive savings!
            </div>
          </div>
        )}
      </div>

      {/* Supported Banks Quick Selector */}
      <div className="section-header">
        <div className="section-header__title">Available Bank Partners</div>
      </div>
      <div className="scroll-h stagger-in mb-6">
        {banks.map((b) => (
          <Link
            key={b.id}
            href={`/deals?bank=${b.id}`}
            className="chip active"
            style={{ backgroundColor: b.color, color: 'white' }}
          >
            {b.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
