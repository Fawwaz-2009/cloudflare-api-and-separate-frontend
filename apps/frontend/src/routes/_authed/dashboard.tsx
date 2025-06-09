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
  const headers = new Headers()
  headers.set("cookie", request?.headers.get("cookie") ?? "")
  const session = await authClient.getSession({
    fetchOptions: {
      headers,
    },
  });
  if (!session.data) {
    throw new Error("Not authenticated");
  }
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/super-heroes`);
  return res.json();
});

export const Route = createFileRoute("/_authed/dashboard")({
  component: Dashboard,
  loader: async ({ context }) => {
    const superheroes = (await getSuperheroes()) as Superhero[];
    return { superheroes, session: context.session?.session };
  },
});

function Dashboard() {
  const { superheroes, session } = Route.useLoaderData();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await authClient.signOut();
      await router.invalidate();
      router.navigate({ to: "/" });
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Simple header with sign out button */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between">
          <h1 className="text-2xl font-bold">Hi {session?.user.email}</h1>
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded transition-colors"
          >
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Superheroes Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Server Side Fetching */}
          <div>
            <h2 className="text-lg font-medium mb-4">Server-side Fetched</h2>

            <form
              onSubmit={async (event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const response = await addSuperhero({ data: formData });
                router.invalidate();
                (event.target as HTMLFormElement).reset();
              }}
              className="mb-6"
            >
              <input
                type="text"
                name="name"
                placeholder="Enter superhero name"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 mb-2"
                required
              />
              <button type="submit" className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md">
                Add Hero
              </button>
            </form>

            {superheroes.length === 0 ? (
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

          {/* Client Side Fetching */}
          <div>
            <h2 className="text-lg font-medium mb-4">Client-side Fetched</h2>
            <ClientSuperheroes />
          </div>
        </div>

        {/* Key Differences Section */}
        <div className="mt-12">
          <h2 className="text-lg font-medium mb-6">Key Differences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 border border-slate-200 rounded-md">
              <h3 className="font-medium mb-4 text-blue-600">Server-side Implementation</h3>
              <ul className="space-y-2 text-sm">
                <li>• Uses Next.js Server Actions</li>
                <li>• No client-side state management</li>
                <li>• Automatic page revalidation</li>
                <li>• Progressive enhancement - works without JS</li>
              </ul>
            </div>
            <div className="bg-white p-6 border border-slate-200 rounded-md">
              <h3 className="font-medium mb-4 text-blue-600">Client-side Implementation</h3>
              <ul className="space-y-2 text-sm">
                <li>• Uses client-side fetch API</li>
                <li>• Manages loading and error states</li>
                <li>• Immediate UI feedback</li>
                <li>• Requires JavaScript</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
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
