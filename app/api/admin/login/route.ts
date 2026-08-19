import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    let settings = await prisma.adminSettings.findUnique({
      where: { id: 'admin_settings' },
    });

    if (!settings) {
      settings = await prisma.adminSettings.create({
        data: {
          id: 'admin_settings',
          adminPassword: 'Qwerty123!@#',
        },
      });
    }

    if (password === settings.adminPassword) {
      const response = NextResponse.json({ success: true, message: 'Authenticated successfully' });
      response.cookies.set('admin_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid admin password' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
