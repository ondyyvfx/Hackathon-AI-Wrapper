import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
    try {
      const { universe } = await req.json();
  
      console.log("Получен universe:", universe); // debug log
  
      if (!process.env.OPENAI_API_KEY) {
        console.error("❌ API ключ не найден");
        return NextResponse.json({ error: "API ключ не найден" }, { status: 500 });
      }
  
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Сгенерируй уникального супергероя во вселенной ${universe}. Назови имя, способности, предысторию.`,
          },
        ],
      });
  
      const text = completion.choices[0].message.content;
      console.log("GPT ответ:", text); // debug log
  
      const image = await openai.images.generate({
        prompt: `A superhero from the ${universe} universe. Realistic art.`,
        n: 1,
        size: "512x512",
      });
  
      const imageUrl = image.data[0].url;
      console.log("URL картинки:", imageUrl); 
  
      return NextResponse.json({ text, imageUrl });
    } catch (err: any) {
      console.error("❌ Ошибка генерации:", err);
      return NextResponse.json({ error: "Ошибка генерации" }, { status: 500 });
    }
  }
  