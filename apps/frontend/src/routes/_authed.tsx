import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw new Error('Not authenticated')
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === "Not authenticated") {
      return <a href="/auth/login">Login</a>;
    }

    throw error
  },
})
