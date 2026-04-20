import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '8586010366:AAGujpSKgr8OHJQNAwWpCv6SvIkQaBaBRt0';
    const chatId = process.env.TELEGRAM_DB_CHANNEL_ID || '1003755766987';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Standard Fetch API ကို သုံးတာက Serverless မှာ ပိုပြီး Error ကင်းပါတယ်
    const tgFormData = new FormData();
    tgFormData.append('chat_id', chatId);
    tgFormData.append('document', file); // File object ကို တိုက်ရိုက်ထည့်လို့ရပါတယ်

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendDocument`,
      {
        method: 'POST',
        body: tgFormData,
      }
    );

    const result = await response.json();

    if (!result.ok) {
      throw new Error(result.description || "Telegram API Error");
    }

    return NextResponse.json({ 
      success: true, 
      file_id: result.result.document.file_id,
      message_id: result.result.message_id 
    });

  } catch (error: any) {
    console.error("Upload Error:", error.message);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
