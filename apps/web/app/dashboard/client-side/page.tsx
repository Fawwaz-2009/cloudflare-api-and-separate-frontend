"use client";
import LogoutButton from "../logout-button";
import { authClient } from "@/lib/auth";
import ClientSuperheroes from "./client-superheroes";
import { useRouter } from "next/navigation";


interface Superhero {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default  function DashboardPage() {
  const { data: session, isPending } =  authClient.useSession();
  const router = useRouter()

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push("/auth/login");
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between">
          <h1 className="text-2xl font-bold">Hi {session.user.email}</h1>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Superheroes Dashboard</h1>

        <div className="grid grid-cols-1 gap-8">


          {/* Client Side Fetching */}
          <div>
            <h2 className="text-lg font-medium mb-4">Client-side Fetched</h2>
            <ClientSuperheroes />
          </div>
        </div>

        {/* Key Differences Section */}
        <div className="mt-12">
          <h2 className="text-lg font-medium mb-6">Key Differences</h2>
          <div className="grid grid-cols-1 gap-8">

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
