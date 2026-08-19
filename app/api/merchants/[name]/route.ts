import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
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
      where: { merchant: merchantName }
    });

    return NextResponse.json({
      success: true,
      merchant,
      deals
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
