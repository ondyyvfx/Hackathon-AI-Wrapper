"use client";
import { Button } from "@/components/ui/button";

export default function HeroSection() {

    const scrollToGenerate = () => {
        const section = document.getElementById("generate");
        section?.scrollIntoView({ behavior: "smooth" });
      };
      
  return (
    <section
      id="home"
      className="h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-black to-gray-900 text-white px-4"
    >
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
        Создай своего супергероя
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
        Используй силу искусственного интеллекта, чтобы сгенерировать уникального героя из вселенной Marvel или DC.
      </p>
      <a href="#generate">
        <Button onClick={scrollToGenerate} className="text-lg px-6 py-4">Начать</Button>
      </a>
    </section>
  );
}
