import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import LogoutButton from "./logout-button";
import { authClient } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
      credentials: "include",
      onRequest: (request) => {
        console.log(request, "__________________");
      },
    },
  });
  console.log(session, "__________________");

  if (!session.data) {
    redirect("/auth/login");
  }

  return (
    <main className="min-h-screen p-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
            <p className="text-gray-400">Logged in as: {session.data.user.email}</p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
