"use client";

import { useEffect, useState } from "react";

interface Superhero {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function ClientSuperheroes() {
  const [superheroes, setSuperheroes] = useState<Superhero[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/super-heroes`)
      .then((res) => res.json())
      .then((data) => setSuperheroes(data))
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="p-4">Loading superheroes...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Client-side Fetched Superheroes</h2>
      <ul className="space-y-2">
        {superheroes.map((hero) => (
          <li key={hero.id} className="p-2 border border-gray-800 rounded">
            {hero.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
