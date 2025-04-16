import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Поле prompt не указано' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 300,
    });

    const text = completion.choices[0].message.content?.trim();
    if (!text) {
      return NextResponse.json({ error: 'Не удалось сгенерировать описание' }, { status: 500 });
    }

    return NextResponse.json({ text });
  } catch (err: any) {
    console.error('❌ Ошибка генерации текста:', err.message || err);
    return NextResponse.json({ error: 'Ошибка генерации текста' }, { status: 500 });
  }
}
