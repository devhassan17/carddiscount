import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const revalidate = 60;

export default async function MerchantPage({ params }: { params: { name: string } }) {
  const decodedName = decodeURIComponent(params.name);
  let merchant: any = null;

  try {
    merchant = await prisma.merchant.findFirst({
      where: {
        name: {
          contains: decodedName,
        },
      },
    });
  } catch (e) {
    merchant = null;
  }

  if (!merchant) {
    merchant = {
      name: decodedName || 'Kababjees',
      logo: '/assets/images/kababjees_logo.png',
      banner: '/assets/images/category_restaurants.png',
      description: `${decodedName} offers exclusive discounts across Pakistan partner bank cards!`,
      rating: 4.2,
      reviewCount: 88,
      branchesCount: 4,
      dealsCount: 24,
      phone: '021 111 666 111',
      menuJson: JSON.stringify([
        { name: 'Special Item Package 1', price: 'PKR 1,450', category: 'Popular', image: '🍗' },
        { name: 'Special Item Package 2', price: 'PKR 2,200', category: 'Popular', image: '🍲' },
      ]),
      reviewsJson: JSON.stringify([
        { user: 'Ali Hassan', rating: 5, date: '1 day ago', comment: 'Great discount and food quality! Used HBL card.' }
      ]),
      branchesJson: JSON.stringify([
        { name: 'Main Branch Outlet', address: 'Main Commercial Avenue, DHA, Karachi', phone: '021 111 666 111' }
      ])
    };
  }

  const menu = merchant.menuJson ? JSON.parse(merchant.menuJson) : [];
  const reviews = merchant.reviewsJson ? JSON.parse(merchant.reviewsJson) : [];
  const branches = merchant.branchesJson ? JSON.parse(merchant.branchesJson) : [];

  return (
    <div className="page-enter" style={{ paddingBottom: 'var(--space-12)' }}>
      <div
        className="hero-banner-card"
        style={{
          backgroundImage: `url('${merchant.banner || '/assets/images/category_restaurants.png'}')`,
          height: '240px',
          borderRadius: 0,
        }}
      >
        <div className="hero-banner-card__overlay flex-between align-end" style={{ borderRadius: 0 }}>
          <div>
            <Link href="/" className="btn btn--ghost btn--sm text-white mb-2" style={{ padding: 0 }}>
              ← Back to App
            </Link>
            <h1 style={{ color: 'white', fontSize: '26px' }}>{merchant.name}</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>⭐ {merchant.rating} ({merchant.reviewCount} Reviews) • {merchant.branchesCount} Branches</p>
          </div>
        </div>
      </div>

      <div style={{ padding: 'var(--space-5)' }}>
        <div className="card card--glass p-4 mb-5">
          <p className="text-sm text-secondary">{merchant.description}</p>
        </div>

        {menu.length > 0 && (
          <div className="mb-6">
            <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>🍽️ Outlet Menu Highlights</h2>
            <div className="grid gap-3">
              {menu.map((item: any, idx: number) => (
                <div key={idx} className="card p-3 flex-between align-center">
                  <div className="flex gap-3 align-center">
                    <div style={{ fontSize: '24px' }}>{item.image || '🍲'}</div>
                    <div>
                      <div className="font-semibold text-primary">{item.name}</div>
                      <div className="text-xs text-secondary">{item.category}</div>
                    </div>
                  </div>
                  <div className="font-bold text-accent">{item.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {branches.length > 0 && (
          <div className="mb-6">
            <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>📍 Locations & Branches</h2>
            {branches.map((b: any, idx: number) => (
              <div key={idx} className="card p-4 mb-2">
                <div className="font-semibold text-primary">{b.name}</div>
                <div className="text-xs text-secondary mt-1">{b.address}</div>
                <div className="text-xs text-accent mt-2">📞 {b.phone}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
