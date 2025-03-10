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
  const [newHeroName, setNewHeroName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSuperheroes = () => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/super-heroes`)
      .then((res) => res.json())
      .then((data) => setSuperheroes(data))
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchSuperheroes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeroName.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/super-heroes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newHeroName }),
      });

      if (!res.ok) {
        throw new Error("Failed to create superhero");
      }

      // Refresh the list
      fetchSuperheroes();
      // Clear the input
      setNewHeroName("");
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Client-side Fetched Superheroes</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newHeroName}
            onChange={(e) => setNewHeroName(e.target.value)}
            placeholder="Enter superhero name"
            className="flex-1 px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newHeroName.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding..." : "Add Hero"}
          </button>
        </div>
      </form>

      {isLoading ? (
        <div>Loading superheroes...</div>
      ) : (
        <ul className="space-y-2">
          {superheroes.map((hero) => (
            <li key={hero.id} className="p-2 border border-gray-800 rounded">
              {hero.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
