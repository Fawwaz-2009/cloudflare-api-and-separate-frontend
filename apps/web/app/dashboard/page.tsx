"use client";

import { cookies, headers } from "next/headers";
import { notFound, redirect, useRouter } from "next/navigation";
import LogoutButton from "./logout-button";
import { authClient } from "@/lib/auth";

// TODO the isue might be server components or the nextjs, try using clinet components and see how it goes
export default function DashboardPage() {
  const { isPending, data: session } = authClient
    .useSession
    //   {
    //   fetchOptions: {
    //     headers: await headers(),
    //     credentials: "include",
    //     onRequest: (request) => {
    //       console.log(request, "__________________");
    //     },
    //   },
    // }
    ();
  const router = useRouter();
  console.log(session, "__________________");

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push("/auth/login");
    return <div>Redirecting to login...</div>;
  }

  return (
    <main className="min-h-screen p-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
            <p className="text-gray-400">Logged in as: {session.user.email}</p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
