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

    // Генерация текста (герой или злодей)
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
    console.log('🦸 Герой/Злодей:\n', text);

    if (!text) {
      return NextResponse.json({ error: 'Не удалось сгенерировать описание героя/злодея' }, { status: 500 });
    }

    // Переводим описание в запрос для изображения
    const translate = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a translator that turns Russian superhero or villain descriptions into short English prompts for cartoon image generation. Focus on appearance, costume, pose, and vibe. Format it as a vivid cartoon prompt for DALL·E.`,
        },
        {
          role: 'user',
          content: `Translate this into a vivid English prompt for a cartoon image:\n\n${text}`,
        },
      ],
    });

    const translatedPrompt = translate.choices[0].message.content?.trim();
    if (!translatedPrompt) {
      return NextResponse.json({ error: 'Ошибка при переводе описания для картинки' }, { status: 500 });
    }

    // Генерация изображения
    const image = await openai.images.generate({
      prompt: `${translatedPrompt}, cartoon style, comic book illustration, vibrant colors, full body, dynamic pose, white background`,
      n: 1,
      size: '1024x1024',
    });

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
