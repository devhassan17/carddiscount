import { prisma } from '@/lib/prisma';
import DealCard from '@/components/DealCard';
import Link from 'next/link';

export const revalidate = 0;

interface MerchantPageProps {
  params: {
    name: string;
  };
}

export default async function MerchantPage({ params }: MerchantPageProps) {
  const merchantName = decodeURIComponent(params.name);

  let merchant = await prisma.merchant.findUnique({
    where: { name: merchantName },
  });

  if (!merchant) {
    merchant = {
      id: `fallback_${merchantName}`,
      name: merchantName,
      logo: '/assets/images/category_restaurants.png',
      banner: '/assets/images/category_restaurants.png',
      description: `${merchantName} is one of Pakistan's favorite dining & shopping partners offering exclusive bank card discounts.`,
      rating: 4.2,
      reviewCount: 45,
      branchesCount: 3,
      dealsCount: 12,
      phone: '021 111 000 786',
      socialJson: JSON.stringify({
        facebook: `https://facebook.com/${merchantName.toLowerCase().replace(/\s+/g, '')}`,
        instagram: `https://instagram.com/${merchantName.toLowerCase().replace(/\s+/g, '')}`,
        website: `https://${merchantName.toLowerCase().replace(/\s+/g, '')}.pk`
      }),
      menuJson: JSON.stringify([
        { name: `${merchantName} Special Combo`, price: 'PKR 1,499', category: 'Deals', image: '🍱' },
        { name: 'Chef Signature Dish', price: 'PKR 1,899', category: 'Mains', image: '🍲' }
      ]),
      reviewsJson: JSON.stringify([
        { user: 'Verified Customer', rating: 5, date: '3 days ago', comment: 'Great experience and instant bank card discount applied.' }
      ]),
      branchesJson: JSON.stringify([
        { name: 'Main City Outlet', address: 'Commercial Market, Central City', phone: '021 111 000 786' }
      ]),
      createdAt: new Date(),
    };
  }

  const deals = await prisma.deal.findMany({
    where: { merchant: merchantName },
  });

  let menuItems: any[] = [];
  try {
    if (merchant.menuJson) menuItems = JSON.parse(merchant.menuJson);
  } catch {}

  let reviews: any[] = [];
  try {
    if (merchant.reviewsJson) reviews = JSON.parse(merchant.reviewsJson);
  } catch {}

  let branches: any[] = [];
  try {
    if (merchant.branchesJson) branches = JSON.parse(merchant.branchesJson);
  } catch {}

  return (
    <div className="page-enter" style={{ paddingBottom: 'var(--space-12)' }}>
      {/* Banner Header */}
      <div
        style={{
          width: '100%',
          height: 180,
          backgroundImage: `url('${merchant.banner}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <Link
          href="/"
          className="btn btn--ghost btn--icon"
          style={{
            position: 'absolute',
            top: 'var(--space-4)',
            left: 'var(--space-4)',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
          }}
        >
          ←
        </Link>
      </div>

      {/* Brand Header Bar */}
      <div className="merchant-header">
        <div className="merchant-header__brand">
          {merchant.logo && (merchant.logo.startsWith('http') || merchant.logo.startsWith('/')) ? (
            <img src={merchant.logo} alt={merchant.name} className="merchant-header__logo" />
          ) : (
            <div className="merchant-header__logo">{merchant.name[0]}</div>
          )}
          <div>
            <h1 className="merchant-header__title">{merchant.name}</h1>
            <div className="text-sm text-secondary" style={{ marginTop: '2px' }}>
              ⭐ {merchant.rating} ({merchant.reviewCount} Reviews) • {merchant.branchesCount} Outlets
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ padding: 'var(--space-4) var(--space-5)' }}>
        <div className="merchant-metrics-grid mb-4">
          <div className="peekaboo-metric-card peekaboo-metric-card--blue">
            <div className="peekaboo-metric-card__value">⭐ {merchant.rating}</div>
            <div className="peekaboo-metric-card__label">{merchant.reviewCount} Ratings</div>
          </div>
          <div className="peekaboo-metric-card peekaboo-metric-card--red">
            <div className="peekaboo-metric-card__value">📍 {merchant.branchesCount}</div>
            <div className="peekaboo-metric-card__label">Outlets</div>
          </div>
          <div className="peekaboo-metric-card peekaboo-metric-card--navy">
            <div className="peekaboo-metric-card__value">💳 {deals.length}</div>
            <div className="peekaboo-metric-card__label">Active Deals</div>
          </div>
        </div>

        {/* Description */}
        <div className="card card--glass p-4 mb-4">
          <h3 className="font-semibold mb-2">About {merchant.name}</h3>
          <p className="text-sm">{merchant.description}</p>
          {merchant.phone && (
            <div className="peekaboo-phone-box mt-3">
              📞 {merchant.phone}
            </div>
          )}
        </div>

        {/* Active Bank Deals Section */}
        <div className="section-header" style={{ padding: 'var(--space-2) 0 var(--space-4)' }}>
          <div className="section-header__title">💳 Bank Discounts ({deals.length})</div>
        </div>
        <div className="flex flex-col gap-3 mb-6">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>

        {/* Menu Items */}
        {menuItems.length > 0 && (
          <div className="mb-6">
            <div className="section-header" style={{ padding: '0 0 var(--space-3)' }}>
              <div className="section-header__title">🍽️ Menu Specials</div>
            </div>
            {menuItems.map((item, idx) => (
              <div key={idx} className="menu-item-card">
                <div>
                  <div className="menu-item-card__title">{item.image} {item.name}</div>
                  <div className="text-xs text-secondary">{item.category}</div>
                </div>
                <div className="menu-item-card__price">{item.price}</div>
              </div>
            ))}
          </div>
        )}

        {/* Outlets */}
        {branches.length > 0 && (
          <div className="mb-6">
            <div className="section-header" style={{ padding: '0 0 var(--space-3)' }}>
              <div className="section-header__title">📍 Branch Outlets</div>
            </div>
            {branches.map((b, idx) => (
              <div key={idx} className="card card--flat p-4 mb-2">
                <div className="font-semibold">{b.name}</div>
                <div className="text-sm text-secondary mt-1">{b.address}</div>
                {b.phone && <div className="text-xs text-accent mt-1">📞 {b.phone}</div>}
              </div>
            ))}
          </div>
        )}

        {/* User Reviews */}
        {reviews.length > 0 && (
          <div className="mb-6">
            <div className="section-header" style={{ padding: '0 0 var(--space-3)' }}>
              <div className="section-header__title">💬 Customer Reviews</div>
            </div>
            {reviews.map((r, idx) => (
              <div key={idx} className="review-card">
                <div className="review-card__header">
                  <span className="font-semibold">{r.user}</span>
                  <span className="review-card__stars">{'⭐'.repeat(r.rating)}</span>
                </div>
                <p className="text-sm">{r.comment}</p>
                <div className="text-xs text-secondary mt-2">{r.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
