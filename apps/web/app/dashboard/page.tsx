"use client";
import { useRouter } from "next/navigation";
import LogoutButton from "./logout-button";
import { authClient } from "@/lib/auth";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
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
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Next.js Data Fetching Exploration</h1>
          
          {/* Implementation Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">About This Demo</h3>
                <p className="mt-1 text-sm text-amber-700">
                  This is an exploration of different Next.js data fetching approaches. During development, we discovered that while the client-side implementation works in both local and production environments, the server-side approach currently only functions in local development.
                </p>
              </div>
            </div>
          </div>

          {/* Implementation Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Client-side Card */}
            <Link href="/dashboard/client-side" className="group">
              <div className="h-full bg-white rounded-lg border border-slate-200 p-6 hover:border-blue-400 hover:shadow-md transition duration-150">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Client-side Example</h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Works Everywhere
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  An implementation using client-side fetching that demonstrates working functionality in both local and production environments.
                </p>
                <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                  View implementation
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Server-side Card */}
            <Link href="/dashboard/server-side" className="group">
              <div className="h-full bg-white rounded-lg border border-slate-200 p-6 hover:border-blue-400 hover:shadow-md transition duration-150">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Server-side Example</h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Local Dev Only
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  An exploration of Next.js Server Actions that currently only functions in local development, highlighting deployment considerations.
                </p>
                <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                  View implementation
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
