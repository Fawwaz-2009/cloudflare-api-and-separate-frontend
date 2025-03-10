"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
      Logout
    </button>
  );
}
