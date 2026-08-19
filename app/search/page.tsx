import { prisma } from '@/lib/prisma';
import DealCard from '@/components/DealCard';
import Link from 'next/link';

export const revalidate = 0;

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.toLowerCase() || '';

  let results: any[] = [];
  if (query) {
    const deals = await prisma.deal.findMany();
    results = deals.filter(
      d =>
        d.merchant.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query) ||
        d.category.toLowerCase().includes(query)
    );
  }

  return (
    <div className="page-enter" style={{ paddingBottom: 'var(--space-12)' }}>
      <div className="section-header">
        <h1 className="app-header__title" style={{ fontSize: '24px' }}>
          Search Deals & Brands
        </h1>
        <Link href="/" className="btn btn--ghost btn--sm">
          Cancel
        </Link>
      </div>

      <div style={{ padding: '0 var(--space-5)', marginBottom: 'var(--space-4)' }}>
        <form action="/search" method="GET" className="search-bar">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search Kababjees, HBL, Pizza, SadaPay..."
            autoFocus
          />
          <button type="submit" className="btn btn--primary btn--sm">
            Search
          </button>
        </form>
      </div>

      {query && (
        <div className="section-header">
          <div className="section-header__title">
            Results for &ldquo;{query}&rdquo; ({results.length})
          </div>
        </div>
      )}

      <div className="deals-page__grid stagger-in">
        {results.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>

      {!query && (
        <div className="empty-state">
          <div className="empty-state__icon">🔍</div>
          <div className="empty-state__title">Search Pakistani Card Deals</div>
          <div className="empty-state__text">
            Type any merchant name (e.g. Kababjees), bank name (e.g. HBL, SadaPay), or food item.
          </div>
        </div>
      )}
    </div>
  );
}
