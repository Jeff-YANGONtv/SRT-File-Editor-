import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    // Environment Variables ထဲကနေ ဆွဲယူမယ်
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_DB_CHANNEL_ID;

    if (!file || !botToken || !chatId) {
      return NextResponse.json({ error: 'Missing Credentials' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const tgFormData = new FormData();
    tgFormData.append('chat_id', chatId);
    tgFormData.append('document', new Blob([buffer]), file.name);

    // Telegram Bot API သို့ ဖိုင်ပို့ခြင်း
    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendDocument`,
      tgFormData
    );

    return NextResponse.json({ success: true, file_url: response.data.result.document.file_id });
  } catch (error: any) {
    console.error("Upload Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}