import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Поле prompt не указано' }, { status: 400 });
    }

    // Генерация текста героя (GPT-3.5)
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const text = completion.choices[0].message.content?.trim() || '';
    console.log('🦸‍♂️ Герой:\n', text);

    // Генерация картинки (DALL·E 2)
    const image = await openai.images.generate({
      prompt: 'A new unique superhero, dynamic pose, detailed costume, cinematic lighting',
      n: 1,
      size: '1024x1024',
    });

    const imageUrl = image.data[0].url;
    console.log('🖼️ Картинка:', imageUrl);

    return NextResponse.json({ text, imageUrl });
  } catch (err: any) {
    console.error('❌ Ошибка генерации:', err.message || err);
    return NextResponse.json({ error: 'Ошибка генерации' }, { status: 500 });
  }
}
