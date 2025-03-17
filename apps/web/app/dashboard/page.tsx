import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";
import { authClient } from "@/lib/auth";
import ClientSuperheroes from "./client-superheroes";
import { createSuperhero } from "./actions";

interface Superhero {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default async function DashboardPage() {
  const headersList = new Headers(await headers());
  // const response = await authClient.getSession({
  //   fetchOptions: {
  //     headers: headersList,
  //   },
  // });

  // console.log(response, "RESPONSE__________________");
  // console.log(JSON.stringify(response), "JSON STRINGIFY RESPONSE __________________");
  // console.log(JSON.stringify(response?.data), "JSON STRINGIFY DATA __________________");

  const regularFetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/auth/get-session`, {
    headers: headersList,
  });
  const headersf = Object.fromEntries(headersList.entries());
  console.log(headersf, "HEADERS __________________");
  const response = await regularFetchResponse.json();
  console.log(regularFetchResponse, "REGULAR FETCH RESPONSE __________________");
  console.log(response, "REGULAR FETCH RESPONSE JSON __________________");
  if (!response) {
    redirect("/auth/login");
    return <div>Redirecting to login...</div>;
  }

  // Server-side fetch
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/super-heroes`);
  const superheroes = (await res.json()) as Superhero[];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between">
          <h1 className="text-2xl font-bold">Hi {response.user.email}</h1>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Superheroes Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Server Side Fetching */}
          <div>
            <h2 className="text-lg font-medium mb-4">Server-side Fetched</h2>

            <form action={createSuperhero} className="mb-6">
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
