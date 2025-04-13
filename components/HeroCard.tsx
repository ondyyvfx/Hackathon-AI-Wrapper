type Hero = {
    name: string;
    image: string;
    date: string;
  };
  
  export const HeroCard = ({
    hero,
    onDelete,
    index,
  }: {
    hero: Hero;
    onDelete: (index: number) => void;
    index: number;
  }) => {
    return (
      <div className="bg-gray-800 rounded-2xl shadow-xl p-5 w-72 flex flex-col items-center text-center relative transition hover:scale-105 duration-300">
        <img
          src={hero.image}
          alt={hero.name}
          className="rounded-xl w-full h-48 object-cover mb-4 border-2 border-white"
        />
        <p className="text-white whitespace-pre-wrap text-sm mb-2">{hero.name}</p>
        <span className="text-gray-400 text-xs">Сохранён: {new Date(hero.date).toLocaleString()}</span>
  
        <button
          onClick={() => onDelete(index)}
          className="absolute top-2 right-2 bg-red-600 text-xs px-2 py-1 rounded hover:bg-red-700 transition"
        >
          ❌
        </button>
      </div>
    );
  };
  