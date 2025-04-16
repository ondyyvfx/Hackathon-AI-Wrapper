import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Поле prompt не указано' }, { status: 400 });
    }

    // 🔹 Генерация текста (герой/злодей)
    const completion = await withTimeout(
      openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 300, // ⏱️ ограничение
      }),
      60000
    );

    const text = completion.choices[0].message.content?.trim() || '';
    if (!text) {
      return NextResponse.json({ error: 'Не удалось сгенерировать описание героя/злодея' }, { status: 500 });
    }

    // 🔹 Переводим описание в prompt для DALL·E
    const translate = await withTimeout(
      openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a translator that turns Russian superhero or villain descriptions into short English prompts for cartoon image generation.`,
          },
          {
            role: 'user',
            content: `Translate this into a vivid English prompt for a cartoon image:\n\n${text}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 150,
      }),
      60000
    );

    const translatedPrompt = translate.choices[0].message.content?.trim();
    if (!translatedPrompt) {
      return NextResponse.json({ error: 'Ошибка при переводе описания для картинки' }, { status: 500 });
    }

    // 🔹 Генерация изображения (уменьшаем размер!)
    const image = await withTimeout(
      openai.images.generate({
        prompt: `${translatedPrompt}, cartoon style, comic book illustration, vibrant colors, full body, dynamic pose, white background`,
        n: 1,
        size: '512x512', // 🔥 быстрее!
      }),
      60000
    );

    const imageUrl = image.data[0]?.url;
    if (!imageUrl) {
      return NextResponse.json({ error: 'Не удалось сгенерировать изображение' }, { status: 500 });
    }

    return NextResponse.json({ text, imageUrl });

  } catch (err: any) {
    console.error('❌ Ошибка генерации:', err.message || err);
    return NextResponse.json({ error: 'Ошибка генерации. Пожалуйста, попробуйте позже.' }, { status: 500 });
  }
}
