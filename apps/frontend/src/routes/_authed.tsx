import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
  beforeLoad: ({ context }) => {
    console.log(context, "context________");
    if (!context.session) {
      console.log("redirecting to login");
      throw redirect({
        to: "/auth/login",
      });
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === "Not authenticated") {
      return <a href="/auth/login">Login</a>;
    }

    throw error;
  },
});
