import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      include: { members: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, groups });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, icon = '👨‍👩‍👧‍👦', color = 'rgba(0, 122, 255, 0.12)', email = 'user@cardsaver.pk' } = body;

    let user = await prisma.user.findUnique({
      where: { email },
      include: { cards: true }
    });

    if (!user) {
      user = await prisma.user.create({
        data: { email, name: 'Ali Hassan', city: 'Karachi' },
        include: { cards: true }
      });
    }

    const newGroup = await prisma.group.create({
      data: {
        name,
        icon,
        color,
        members: {
          create: [
            {
              userId: user.id,
              userName: user.name,
              cardsJson: JSON.stringify(user.cards || [])
            }
          ]
        }
      },
      include: { members: true }
    });

    return NextResponse.json({ success: true, group: newGroup });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
