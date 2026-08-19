import { prisma } from '@/lib/prisma';
import DealCard from '@/components/DealCard';
import Link from 'next/link';
import { fallbackCategories, fallbackBanks, fallbackDeals } from '@/lib/fallbackData';

export const revalidate = 60; // Pre-render statically at build time & revalidate every 60s

interface DealsPageProps {
  searchParams: {
    category?: string;
    bank?: string;
    city?: string;
    tier?: string;
    bogo?: string;
    search?: string;
  };
}

export default async function DealsPage({ searchParams }: DealsPageProps) {
  let categories: any[] = [];
  let banks: any[] = [];
  let allDeals: any[] = [];

  try {
    categories = await prisma.category.findMany();
  } catch (e) {
    categories = [];
  }
  if (!categories || categories.length === 0) categories = fallbackCategories;

  try {
    banks = await prisma.bank.findMany();
  } catch (e) {
    banks = [];
  }
  if (!banks || banks.length === 0) banks = fallbackBanks;

  try {
    allDeals = await prisma.deal.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    allDeals = [];
  }
  if (!allDeals || allDeals.length === 0) allDeals = fallbackDeals;

  const activeCat = searchParams.category;
  const activeBank = searchParams.bank;
  const activeCity = searchParams.city;
  const activeBogo = searchParams.bogo === 'true';
  const searchQuery = searchParams.search?.toLowerCase();

  if (activeCat) {
    allDeals = allDeals.filter(d => d.category === activeCat);
  }

  if (activeBank) {
    allDeals = allDeals.filter(d => {
      try {
        const bArr: string[] = JSON.parse(d.banksJson);
        return bArr.includes(activeBank);
      } catch {
        return false;
      }
    });
  }

  if (activeCity) {
    allDeals = allDeals.filter(d => {
      try {
        const cArr: string[] = JSON.parse(d.citiesJson);
        return cArr.includes(activeCity);
      } catch {
        return true;
      }
    });
  }

  if (activeBogo) {
    allDeals = allDeals.filter(d => d.discountType === 'bogo');
  }

  if (searchQuery) {
    allDeals = allDeals.filter(
      d =>
        d.merchant.toLowerCase().includes(searchQuery) ||
        d.description.toLowerCase().includes(searchQuery)
    );
  }

  return (
    <div className="page-enter" style={{ paddingBottom: 'var(--space-12)' }}>
      <div className="section-header">
        <h1 className="app-header__title" style={{ fontSize: '24px' }}>
          Deals Catalog ({allDeals.length})
        </h1>
        {(activeCat || activeBank || activeCity || activeBogo) && (
          <Link href="/deals" className="btn btn--ghost btn--sm">
            Clear Filters ✕
          </Link>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="deals-page__filter-scroll mb-3">
        <Link
          href="/deals"
          className={`chip ${!activeCat ? 'active' : ''}`}
        >
          All Categories
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/deals?category=${c.id}${activeBank ? `&bank=${activeBank}` : ''}`}
            className={`chip ${activeCat === c.id ? 'active' : ''}`}
          >
            {c.emoji} {c.name}
          </Link>
        ))}
      </div>

      {/* Bank Filter Chips */}
      <div className="deals-page__filter-scroll mb-4">
        <Link
          href={`/deals${activeCat ? `?category=${activeCat}` : ''}`}
          className={`chip ${!activeBank ? 'active' : ''}`}
        >
          All Banks
        </Link>
        {banks.slice(0, 10).map((b) => (
          <Link
            key={b.id}
            href={`/deals?bank=${b.id}${activeCat ? `&category=${activeCat}` : ''}`}
            className={`chip ${activeBank === b.id ? 'active' : ''}`}
          >
            💳 {b.name}
          </Link>
        ))}
      </div>

      {/* Deals Grid */}
      {allDeals.length > 0 ? (
        <div className="deals-page__grid stagger-in">
          {allDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state__icon">🔍</div>
          <div className="empty-state__title">No Deals Found</div>
          <div className="empty-state__text">
            Try adjusting your filters or search query to explore more bank discounts.
          </div>
          <Link href="/deals" className="btn btn--primary btn--pill">
            Reset Filters
          </Link>
        </div>
      )}
    </div>
  );
}
