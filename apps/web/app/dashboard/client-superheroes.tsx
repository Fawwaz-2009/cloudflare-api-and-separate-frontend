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

  if (error) return <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-md text-sm">Error: {error.message}</div>;

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={newHeroName}
          onChange={(e) => setNewHeroName(e.target.value)}
          placeholder="Enter superhero name"
          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 mb-2"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !newHeroName.trim()}
          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Adding..." : "Add Hero"}
        </button>
      </form>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
        </div>
      ) : superheroes.length === 0 ? (
        <div className="text-center py-4 text-slate-500 text-sm">No superheroes found. Add your first one!</div>
      ) : (
        <ul className="space-y-1 bg-white border border-slate-200 rounded-md overflow-hidden">
          {superheroes.map((hero) => (
            <li key={hero.id} className="px-4 py-3 border-b border-slate-200 last:border-0">
              <div className="font-medium">{hero.name}</div>
              <div className="text-xs text-slate-500">Added on {new Date(hero.createdAt).toLocaleDateString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
