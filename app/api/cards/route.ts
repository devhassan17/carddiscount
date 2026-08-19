import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'user@cardsaver.pk';

    const user = await prisma.user.findUnique({
      where: { email },
      include: { cards: true }
    });

    return NextResponse.json({
      success: true,
      cards: user?.cards || []
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email = 'user@cardsaver.pk', bank, bankName, type, tier = 'Classic', last4 = '4321' } = body;

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, name: 'Ali Hassan', city: 'Karachi' }
      });
    }

    const newCard = await prisma.card.create({
      data: {
        userId: user.id,
        bank,
        bankName,
        type,
        tier,
        last4,
      }
    });

    return NextResponse.json({ success: true, card: newCard });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cardId = searchParams.get('id');

    if (!cardId) {
      return NextResponse.json({ success: false, error: 'Card ID required' }, { status: 400 });
    }

    await prisma.card.delete({ where: { id: cardId } });

    return NextResponse.json({ success: true, message: 'Card removed' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
