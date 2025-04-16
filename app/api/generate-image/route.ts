import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    if (!description) {
      return NextResponse.json({ error: 'Поле description не указано' }, { status: 400 });
    }

    const translate = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a translator that turns Russian superhero or villain descriptions into short English prompts for cartoon image generation.`,
        },
        {
          role: 'user',
          content: `Translate this into a vivid English prompt for a cartoon image:\n\n${description}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 150,
    });

    const translatedPrompt = translate.choices[0].message.content?.trim();
    if (!translatedPrompt) {
      return NextResponse.json({ error: 'Ошибка при переводе' }, { status: 500 });
    }

    const image = await openai.images.generate({
      prompt: `${translatedPrompt}, cartoon style, comic book illustration, vibrant colors, full body, dynamic pose, white background`,
      n: 1,
      size: '512x512',
    });

    const imageUrl = image.data[0]?.url;
    if (!imageUrl) {
      return NextResponse.json({ error: 'Не удалось сгенерировать изображение' }, { status: 500 });
    }

    return NextResponse.json({ imageUrl });
  } catch (err: any) {
    console.error('❌ Ошибка генерации изображения:', err.message || err);
    return NextResponse.json({ error: 'Ошибка генерации изображения' }, { status: 500 });
  }
}
