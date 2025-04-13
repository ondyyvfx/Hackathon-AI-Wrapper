'use client';

import { useEffect, useState } from 'react';
import { HeroCard } from '@/components/HeroCard';

export default function HeroCollection() {
  const [collection, setCollection] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('heroCollection') || '[]');
    setCollection(saved);
  }, []);

  const handleDelete = (index: number) => {
    const updated = [...collection];
    updated.splice(index, 1);
    setCollection(updated);
    localStorage.setItem('heroCollection', JSON.stringify(updated));
  };

  return (
    <section
      id="collection"
      className="bg-gradient-to-b from-black via-gray-900 to-black text-white py-12 px-4 min-h-screen flex flex-col items-center"
    >
      <h2 className="text-4xl font-bold mb-8 text-center">🧿 Моя коллекция героев</h2>

      {collection.length === 0 ? (
        <p className="text-lg text-gray-400">Пока нет сохранённых героев</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {collection.map((hero, index) => (
            <HeroCard key={index} hero={hero} index={index} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
