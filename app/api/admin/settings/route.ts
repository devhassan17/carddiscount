import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

let memorySettings = {
  adminPassword: 'Qwerty123!@#',
  smtpHost: '',
  smtpPort: 587,
  smtpUser: '',
  smtpPass: '',
  smtpFrom: '',
  smtpEnabled: false,
};

export async function GET() {
  try {
    let settings = memorySettings;

    try {
      const dbSettings = await prisma.adminSettings.findUnique({
        where: { id: 'admin_settings' },
      });
      if (dbSettings) {
        settings = {
          adminPassword: dbSettings.adminPassword,
          smtpHost: dbSettings.smtpHost,
          smtpPort: dbSettings.smtpPort,
          smtpUser: dbSettings.smtpUser,
          smtpPass: dbSettings.smtpPass,
          smtpFrom: dbSettings.smtpFrom,
          smtpEnabled: dbSettings.smtpEnabled,
        };
        memorySettings = settings;
      }
    } catch (dbErr) {
      console.warn('Using memory fallback for admin settings GET:', dbErr);
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adminPassword, smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom, smtpEnabled } = body;

    if (adminPassword) memorySettings.adminPassword = adminPassword;
    if (smtpHost !== undefined) memorySettings.smtpHost = smtpHost;
    if (smtpPort !== undefined) memorySettings.smtpPort = Number(smtpPort);
    if (smtpUser !== undefined) memorySettings.smtpUser = smtpUser;
    if (smtpPass !== undefined) memorySettings.smtpPass = smtpPass;
    if (smtpFrom !== undefined) memorySettings.smtpFrom = smtpFrom;
    if (smtpEnabled !== undefined) memorySettings.smtpEnabled = Boolean(smtpEnabled);

    try {
      await prisma.adminSettings.upsert({
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
    } catch (dbErr) {
      console.warn('Memory updated for admin settings POST:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Admin settings & SMTP configuration updated successfully!',
      settings: memorySettings,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
