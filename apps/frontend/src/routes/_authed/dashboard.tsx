import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "../../lib/auth";
import { useEffect } from "react";

function DashboardPage() {
  const navigate = useNavigate();
  const { isPending, data: session } = authClient.useSession();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      navigate({ to: "/" });
    }
  }, [isPending, session, navigate]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      navigate({ to: "/" });
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  // Show loading state while checking authentication
  if (isPending) {
    return <div className="min-h-screen p-8 flex items-center justify-center">Loading...</div>;
  }

  // If no session and not pending, we're in the process of redirecting
  if (!session) {
    return <div className="min-h-screen p-8 flex items-center justify-center">Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Logged in as: {session.user.email}</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Sign Out
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to your dashboard!</h2>
          <p className="text-gray-300">This is a protected page that is only accessible to authenticated users.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Your Profile</h3>
            <p className="text-gray-300 mb-4">Manage your account settings and preferences.</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Edit Profile</button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Your Activity</h3>
            <p className="text-gray-300 mb-4">View your recent activity and statistics.</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">View Activity</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_authed/dashboard")({
  component: DashboardPage,
});
