import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DealCard from '@/components/DealCard';
import { fallbackCategories, fallbackBanks, fallbackDeals } from '@/lib/fallbackData';

export const revalidate = 60; // Pre-render statically at build time & revalidate every 60s

export default async function HomePage() {
  let categories: any[] = [];
  let banks: any[] = [];
  let allDeals: any[] = [];
  let userCards: any[] = [];

  try {
    categories = await prisma.category.findMany();
  } catch (e) {
    console.error('Prisma categories error:', e);
  }
  if (!categories || categories.length === 0) categories = fallbackCategories;

  try {
    banks = await prisma.bank.findMany({ take: 16 });
  } catch (e) {
    console.error('Prisma banks error:', e);
  }
  if (!banks || banks.length === 0) banks = fallbackBanks;

  try {
    allDeals = await prisma.deal.findMany({ orderBy: { createdAt: 'desc' }, take: 30 });
  } catch (e) {
    console.error('Prisma deals error:', e);
  }
  if (!allDeals || allDeals.length === 0) allDeals = fallbackDeals;

  try {
    const user = await prisma.user.findFirst({
      where: { email: 'user@cardsaver.pk' },
      include: { cards: true }
    });
    userCards = user?.cards || [];
  } catch (e) {
    userCards = [];
  }

  const trendingDeals = allDeals.filter(d => d.trending);
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
    <div className="page-enter">
      {/* Featured Partner Hero Showcase (Kababjees) */}
      <div style={{ padding: 'var(--space-3) var(--space-5)' }}>
        <Link href="/merchant/Kababjees">
          <div
            className="hero-banner-card"
            style={{
              backgroundImage: `url('/assets/images/category_restaurants.png')`,
              cursor: 'pointer',
            }}
          >
            <div className="hero-banner-card__overlay">
              <div className="flex-between align-center" style={{ marginBottom: 'var(--space-2)' }}>
                <div className="badge" style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', color: 'white' }}>
                  🔥 Featured Partner
                </div>
                <span style={{ color: 'white', fontSize: '13px', fontWeight: 'bold' }}>⭐ 3.8 (113 Reviews)</span>
              </div>
              <h2 style={{ color: 'white', fontSize: 'var(--text-2xl)', fontWeight: 800, textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                Kababjees BBQ & Handi
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
                20% OFF on HBL, UBL & SadaPay • View Menu, Outlets & Reviews ➔
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* 🏷️ 10 Peekaboo Categories Carousel */}
      <div className="section-header">
        <div className="section-header__title">Explore Categories ({categories.length})</div>
        <Link href="/deals" className="section-header__action">See all →</Link>
      </div>
      <div className="peekaboo-cat-scroll stagger-in">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/deals?category=${cat.id}`}
            className="peekaboo-cat-card"
          >
            <img src={cat.image} className="peekaboo-cat-card__image" alt={cat.name} />
            <div className="peekaboo-cat-card__body">
              <div className="peekaboo-cat-card__title">
                {cat.emoji} {cat.name}
              </div>
              <div className="peekaboo-cat-card__places">{cat.placesCount}</div>
              <div className="peekaboo-cat-card__deals">{cat.dealsCount}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* 🏦 Partner Banks Grid */}
      <div className="section-header">
        <div className="section-header__title">Partner Banks & EMIs ({banks.length})</div>
        <Link href="/wallet" className="section-header__action">Add Card +</Link>
      </div>
      <div className="bank-partner-grid stagger-in">
        {banks.map((b) => (
          <Link
            key={b.id}
            href={`/deals?bank=${b.id}`}
            className="bank-partner-card"
          >
            <div className="bank-partner-card__icon" style={{ backgroundColor: b.color }}>
              {b.name.slice(0, 3).toUpperCase()}
            </div>
            <div className="bank-partner-card__name">{b.fullName}</div>
          </Link>
        ))}
      </div>

      {/* 💳 Matching Deals for User Wallet */}
      {userCards.length > 0 && matchingDeals.length > 0 ? (
        <>
          <div className="section-header">
            <div className="section-header__title">💳 Deals Matching Your Wallet ({matchingDeals.length})</div>
            <Link href="/deals" className="section-header__action">See all →</Link>
          </div>
          <div className="deals-scroll stagger-in mb-6">
            {matchingDeals.slice(0, 8).map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </>
      ) : (
        <div style={{ padding: '0 var(--space-5)', marginBottom: 'var(--space-4)' }}>
          <div className="card card--glass" style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: 'var(--space-2)' }}>💳</div>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Add Your Bank Cards</h3>
            <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
              Add SadaPay, NayaPay, HBL, UBL or Meezan to unlock personalized discounts!
            </p>
            <Link href="/wallet" className="btn btn--primary btn--pill btn--sm">
              + Add Card to Wallet
            </Link>
          </div>
        </div>
      )}

      {/* 🔥 Trending Discounts */}
      <div className="section-header">
        <div className="section-header__title">🔥 Trending Discounts ({allDeals.length} Total)</div>
        <Link href="/deals" className="section-header__action">See catalog →</Link>
      </div>
      <div className="deals-scroll stagger-in mb-8">
        {(trendingDeals.length > 0 ? trendingDeals : allDeals).slice(0, 10).map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}
