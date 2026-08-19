import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const bank = searchParams.get('bank');
    const tier = searchParams.get('tier');
    const city = searchParams.get('city');
    const search = searchParams.get('search');
    const bogo = searchParams.get('bogo');
    const featured = searchParams.get('featured');
    const trending = searchParams.get('trending');

    let deals = await prisma.deal.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (category) {
      deals = deals.filter(d => d.category === category);
    }

    if (bank) {
      deals = deals.filter(d => {
        try {
          const banksArr: string[] = JSON.parse(d.banksJson);
          return banksArr.includes(bank);
        } catch {
          return false;
        }
      });
    }

    if (tier) {
      deals = deals.filter(d => {
        try {
          const tiersArr: string[] = JSON.parse(d.tiersJson);
          return tiersArr.includes(tier);
        } catch {
          return true;
        }
      });
    }

    if (city) {
      deals = deals.filter(d => {
        try {
          const citiesArr: string[] = JSON.parse(d.citiesJson);
          return citiesArr.includes(city);
        } catch {
          return true;
        }
      });
    }

    if (bogo === 'true') {
      deals = deals.filter(d => d.discountType === 'bogo');
    }

    if (featured === 'true') {
      deals = deals.filter(d => d.featured);
    }

    if (trending === 'true') {
      deals = deals.filter(d => d.trending);
    }

    if (search) {
      const q = search.toLowerCase();
      deals = deals.filter(
        d =>
          d.merchant.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, count: deals.length, deals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
