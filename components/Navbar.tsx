import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black bg-opacity-80 text-white shadow-md p-4 flex justify-between items-center px-6">
      <h1 className="text-xl font-bold">Superhero Generator</h1>
      <div className="space-x-4">
        <Link href="#home">
          <Button variant="ghost" className="text-white hover:text-blue-400">
            Главная
          </Button>
        </Link>
        <Link href="#generate">
          <Button variant="ghost" className="text-white hover:text-blue-400">
            Генерация
          </Button>
        </Link>
        <Link href="#about">
          <Button variant="ghost" className="text-white hover:text-blue-400">
            О проекте
          </Button>
        </Link>
      </div>
    </nav>
  );
}