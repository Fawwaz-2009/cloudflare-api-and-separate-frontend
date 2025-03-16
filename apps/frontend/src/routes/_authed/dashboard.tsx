import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { useState, useEffect } from "react";
import { authClient } from "~/lib/auth";

interface Superhero {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const addSuperhero = createServerFn()
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }
    const name = data.get("name") as string;

    if (!name?.trim()) {
      throw new Error("Name is required");
    }

    return { name };
  })
  .handler(async ({ data }) => {
    const { name } = data;

    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/super-heroes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      throw new Error("Failed to create superhero");
    }

    return res.json();
  });

const getSuperheroes = createServerFn().handler(async () => {
  const request = getWebRequest();
  const session = await authClient.getSession({
    fetchOptions: {
      headers: request?.headers,
    },
  });
  if (!session.data) {
    throw new Error("Not authenticated");
  }
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/super-heroes`);
  return res.json();
});

export const Route = createFileRoute("/_authed/dashboard")({
  component: Home,
  loader: async ({ context }) => {
    const superheroes = (await getSuperheroes()) as Superhero[];
    return { superheroes, session: context.session?.session };
  },
});

function Home() {
  const { superheroes, session } = Route.useLoaderData();
  const router = useRouter();

  return (
    <div className="z-10 w-full max-w-5xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Hi {session?.user.email} to the Superheroes Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Server Side Fetching */}
        <div className="p-4 border border-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Server-side Fetched Superheroes</h2>

          <form
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const response = await addSuperhero({ data: formData });
              router.invalidate();
              (event.target as HTMLFormElement).reset();
              console.log(response);
            }}
            className="mb-6"
          >
            <div className="flex gap-2">
              <input
                type="text"
                name="name"
                placeholder="Enter superhero name"
                className="flex-1 px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Add Hero
              </button>
            </div>
          </form>

          <ul className="space-y-2">
            {superheroes.map((hero) => (
              <li key={hero.id} className="p-2 border border-gray-800 rounded">
                {hero.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Client Side Fetching */}
        <div className="border border-gray-800 rounded-lg">
          <ClientSuperheroes />
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4 text-center">Key Differences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-4 border border-gray-800 rounded-lg">
            <h3 className="font-bold mb-2">Server-side Implementation</h3>
            <ul className="list-disc pl-4 space-y-2">
              <li>Uses Next.js Server Actions</li>
              <li>No client-side state management</li>
              <li>Automatic page revalidation</li>
              <li>Progressive enhancement - works without JS</li>
            </ul>
          </div>
          <div className="p-4 border border-gray-800 rounded-lg">
            <h3 className="font-bold mb-2">Client-side Implementation</h3>
            <ul className="list-disc pl-4 space-y-2">
              <li>Uses client-side fetch API</li>
              <li>Manages loading and error states</li>
              <li>Immediate UI feedback</li>
              <li>Requires JavaScript</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClientSuperheroes() {
  const [superheroes, setSuperheroes] = useState<Superhero[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newHeroName, setNewHeroName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSuperheroes = () => {
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_SERVER_URL}/super-heroes`)
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
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/super-heroes`, {
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
