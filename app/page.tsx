'use client';

import { useState } from 'react';

export default function Home() {
  const [answers, setAnswers] = useState<AnswersType>({
    role: '',
    power: '',
    universe: '',
    personality: '',
    gender: '',
  });
  

  const [hero, setHero] = useState('');
  const [img, setImg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  type AnswersType = {
    role: string;
    power: string;
    universe: string;
    personality: string;
    gender: string;
  };

  type Hero = {
    id: string; // уникальный id для удаления и отображения
    name: string;
    description: string;
    imageUrl: string;
  };
  

  const generatePrompt = (answers: AnswersType) => {
    return `
  Ты — креативный писатель комиксов. На основе данных ниже придумай уникального супергероя, связанного с темой скорости. Не используй шаблонные или абстрактные силы.
  
  1. 🔥 Тема героя: ${answers.role} (в данном случае — "что-то прикольное со скоростью")
  2. 🌍 Вселенная: ${answers.universe}
  3. 🧠 Характер: ${answers.personality}
  4. ⚧ Гендер: ${answers.gender}
  
  🎯 Опиши:
  - Уникальное имя героя (не повторяй известных персонажей Marvel или DC)
  - Его суперспособности, связанные именно с темой "скорости"
  - Предысторию (как он получил свои силы, какие испытания прошёл)
  - Его костюм и внешний вид
  - С каким злом он борется
  
  Формат ответа:
  Имя:
  Способности:
  Предыстория:
  Костюм:
  Внешний вид:
  Миссия:
  
  Ответь на русском языке.
  `;
  };
  
  

  const generateHero = async () => {
    setLoading(true);
    setHero('');
    setImg('');

    const prompt = generatePrompt(answers);

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setHero(data.text);
    setImg(data.imageUrl);
    setLoading(false);
  };

   const [collection, setCollection] = useState<Hero[]>([]);

  const saveHeroToCollection = () => {
    const currentCollection = JSON.parse(localStorage.getItem('heroCollection') || '[]');
    const newHero = {
      name: hero,
      image: img,
      date: new Date().toISOString(),
    };

    const updated = [...currentCollection, newHero];
    localStorage.setItem('heroCollection', JSON.stringify(updated));
    setCollection(updated); // чтобы обновить отображение сразу
  };
  

  return (
    <section id='generate'>
      <main className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white flex flex-col items-center justify-center gap-6 p-4">
        <h1 className="text-3xl font-bold">⚡ Стань автором своего супергероя</h1>

        <div className="flex flex-col gap-4 max-w-md w-full">
        <input
        type="text"
        placeholder="Герой или злодей?"
        className="bg-white/10 backdrop-blur-md placeholder-white/70 text-white border border-white/30 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
          <input name="power" placeholder="Какая суперспособность?" onChange={handleChange} className="bg-white/10 backdrop-blur-md placeholder-white/70 text-white border border-white/30 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select name="universe" onChange={handleChange} className="bg-white/10 backdrop-blur-md text-white border border-white/30 rounded-md px-4 py-2 w-full mt-4">
            <option className="bg-gray-900 text-white" value="">Выбери вселенную</option>
            <option className="bg-gray-900 text-white" value="Marvel">Marvel</option>
            <option className="bg-gray-900 text-white" value="DC">DC</option>
            <option className="bg-gray-900 text-white" value="Собственная">Собственная</option>
          </select>
          <input name="personality" placeholder="Опиши характер героя" onChange={handleChange} className="bg-white/10 backdrop-blur-md placeholder-white/70 text-white border border-white/30 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="gender" placeholder="Пол героя" onChange={handleChange} className="bg-white/10 backdrop-blur-md placeholder-white/70 text-white border border-white/30 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <button
          onClick={generateHero}
          className="bg-blue-600 px-6 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          {loading ? 'Генерируется...' : 'Создать героя'}
        </button>

        {img && <img src={img} alt="Hero" className="w-64 h-64 rounded-xl" />}
        {hero && <pre className="max-w-xl whitespace-pre-wrap text-left">{hero}</pre>}

        {hero && (
          <button
            onClick={saveHeroToCollection}
            className="bg-green-600 px-4 py-2 rounded-xl hover:bg-green-700 transition"
          >
            💾 Сохранить героя
          </button>
        )}
      </main>
    </section>
  );
}
