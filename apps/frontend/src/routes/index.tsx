import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Welcome</h1>
          <p className="text-gray-300 text-lg">Sign in to access your account or create a new one.</p>
        </div>

        <div className="space-y-4">
          <Link
            to="/auth/login"
            className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-center rounded-lg shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Log In
          </Link>

          <Link
            to="/auth/signup"
            className="block w-full py-3 px-4 bg-transparent border border-gray-600 hover:border-gray-400 text-white font-medium text-center rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Sign Up
          </Link>
        </div>

        <div className="mt-12 text-center text-sm text-gray-400">
          <p>© 2023 Your Company. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
