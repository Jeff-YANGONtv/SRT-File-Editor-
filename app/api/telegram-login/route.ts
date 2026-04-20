import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { initData, userId, username, firstName } = await req.json();

    if (!initData || !userId) {
      return NextResponse.json(
        { error: 'Missing authentication data' },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const hash = crypto
      .createHmac('sha256', botToken)
      .update(initData)
      .digest('hex');

    const session = crypto.randomBytes(16).toString('hex');

    return NextResponse.json({
      success: true,
      session,
      user: { id: userId, username, firstName }
    });
  } catch (error: any) {
    console.error('Telegram login error:', error);
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
