import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth";
import { createServerApi } from "@/lib/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Superhero {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const addSuperhero = createServerFn({ method: "POST" })
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
    const request = getWebRequest();
    const headers = new Headers();
    headers.set("cookie", request?.headers.get("cookie") ?? "");

    const res = await createServerApi(headers)["super-heroes"].$post({
      json: {
        name,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to create superhero");
    }

    return res.json();
  });

const getSuperheroes = createServerFn().handler(async () => {
  const request = getWebRequest();
  const headers = new Headers();
  headers.set("cookie", request?.headers.get("cookie") ?? "");
  const session = await authClient.getSession({
    fetchOptions: {
      headers,
    },
  });
  if (!session.data) {
    throw new Error("Not authenticated");
  }
  const res = await createServerApi(headers)["super-heroes"].$get();
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {session?.user.email}</p>
            </div>
            <Button
              onClick={handleSignOut}
              disabled={isSigningOut}
              variant="destructive"
              size="sm"
            >
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Superheroes Management</h2>
          <p className="text-gray-600">Compare server-side and client-side data fetching approaches</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Server Side Fetching */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Server-side Implementation</CardTitle>
                <Badge variant="secondary">Server Actions</Badge>
              </div>
              <CardDescription>
                Data fetched on the server with automatic page revalidation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  const response = await addSuperhero({ data: formData });
                  router.invalidate();
                  (event.target as HTMLFormElement).reset();
                }}
                className="space-y-3"
              >
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter superhero name"
                  required
                />
                <Button type="submit" className="w-full">
                  Add Hero
                </Button>
              </form>

              <Separator />

              {superheroes.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No superheroes found. Add your first one above!
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700 mb-3">
                    Heroes ({superheroes.length})
                  </h4>
                  <div className="space-y-2">
                    {superheroes.map((hero) => (
                      <div key={hero.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{hero.name}</div>
                          <div className="text-xs text-gray-500">
                            Added on {new Date(hero.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge variant="outline">{hero.id}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Client Side Fetching */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Client-side Implementation</CardTitle>
                <Badge variant="secondary">TanStack Query</Badge>
              </div>
              <CardDescription>
                Data fetched on the client with smart caching and state management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientSuperheroes />
            </CardContent>
          </Card>
        </div>

        {/* Key Differences Section */}
        <Card>
          <CardHeader>
            <CardTitle>Implementation Comparison</CardTitle>
            <CardDescription>
              Understanding the trade-offs between server-side and client-side data fetching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge>Server-side</Badge>
                  <h3 className="font-semibold text-gray-900">Benefits</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    Uses TanStack Start Server Functions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    No client-side state management needed
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    Automatic page revalidation after mutations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    Progressive enhancement - works without JS
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Client-side</Badge>
                  <h3 className="font-semibold text-gray-900">Features</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Uses TanStack Query for smart data fetching
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Automatic caching and background refetching
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Built-in loading, error, and optimistic updates
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Manual refresh control with query invalidation
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function ClientSuperheroes() {
  const [newHeroName, setNewHeroName] = useState("");
  const queryClient = useQueryClient();

  // Query for fetching superheroes
  const {
    data: superheroes = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['client-superheroes'],
    queryFn: async () => {
      const res = await createServerApi()["super-heroes"].$get();
      if (!res.ok) {
        throw new Error('Failed to fetch superheroes');
      }
      return res.json() as Promise<Superhero[]>;
    },
  });

  // Mutation for adding new superhero
  const addHeroMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await createServerApi()["super-heroes"].$post({
        json: { name },
      });
      if (!res.ok) {
        throw new Error("Failed to create superhero");
      }
      return res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch the superheroes query
      queryClient.invalidateQueries({ queryKey: ['client-superheroes'] });
      // Clear the input
      setNewHeroName("");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeroName.trim()) return;
    
    addHeroMutation.mutate(newHeroName);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error: {error instanceof Error ? error.message : 'Something went wrong'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          value={newHeroName}
          onChange={(e) => setNewHeroName(e.target.value)}
          placeholder="Enter superhero name"
          disabled={addHeroMutation.isPending}
        />
        <Button
          type="submit"
          disabled={addHeroMutation.isPending || !newHeroName.trim()}
          className="w-full"
        >
          {addHeroMutation.isPending ? "Adding..." : "Add Hero"}
        </Button>
      </form>

      {addHeroMutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {addHeroMutation.error instanceof Error 
              ? addHeroMutation.error.message 
              : 'Failed to add superhero'
            }
          </AlertDescription>
        </Alert>
      )}

      <Separator />

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
        </div>
      ) : superheroes.length === 0 ? (
        <Alert>
          <AlertDescription>
            No superheroes found. Add your first one above!
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm text-gray-700">
              Heroes ({superheroes.length})
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              {isLoading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
          <div className="space-y-2">
            {superheroes.map((hero) => (
              <div key={hero.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{hero.name}</div>
                  <div className="text-xs text-gray-500">
                    Added on {new Date(hero.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <Badge variant="outline">{hero.id}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
