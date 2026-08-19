import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
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

    return NextResponse.json({
      success: true,
      settings: {
        adminPassword: settings.adminPassword,
        smtpHost: settings.smtpHost,
        smtpPort: settings.smtpPort,
        smtpUser: settings.smtpUser,
        smtpPass: settings.smtpPass,
        smtpFrom: settings.smtpFrom,
        smtpEnabled: settings.smtpEnabled,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adminPassword, smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom, smtpEnabled } = body;

    const updated = await prisma.adminSettings.upsert({
      where: { id: 'admin_settings' },
      update: {
        ...(adminPassword && { adminPassword }),
        ...(smtpHost !== undefined && { smtpHost }),
        ...(smtpPort !== undefined && { smtpPort: Number(smtpPort) }),
        ...(smtpUser !== undefined && { smtpUser }),
        ...(smtpPass !== undefined && { smtpPass }),
        ...(smtpFrom !== undefined && { smtpFrom }),
        ...(smtpEnabled !== undefined && { smtpEnabled: Boolean(smtpEnabled) }),
      },
      create: {
        id: 'admin_settings',
        adminPassword: adminPassword || 'Qwerty123!@#',
        smtpHost: smtpHost || '',
        smtpPort: Number(smtpPort) || 587,
        smtpUser: smtpUser || '',
        smtpPass: smtpPass || '',
        smtpFrom: smtpFrom || '',
        smtpEnabled: Boolean(smtpEnabled),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin settings & SMTP configuration updated successfully!',
      settings: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
