# CloudFront Bridge: Separated Cloudflare API with Multiple Frontend Options

This project demonstrates how to build a Cloudflare-hosted API connected to separate frontend applications. It tackles a common challenge: deploying a Cloudflare Worker backend with standalone frontend apps that share authentication.

## Project Overview

This monorepo contains:

1. **API Server** (Cloudflare Worker)
   - Hono-based API with better-auth authentication
   - Cloudflare D1 database integration
   - Cross-origin support for multiple frontend deployments

2. **Frontend Implementations**
   - [TanStack Router app](https://tanstack.f-stack.dev) (Cloudflare Pages) - ✅ Fully compatible
   - [Next.js app](https://www.f-stack.dev) (Vercel) - ⚠️ Client-side auth only

## Why This Project Exists

Setting up a Cloudflare Worker API with separate frontend deployment can be challenging, especially with authentication. This project provides a working reference implementation that:

- Keeps backend and frontend codebases separate for better maintenance
- Uses Cloudflare's edge network for the API while allowing flexible frontend hosting
- Implements shared authentication that works across subdomains
- Demonstrates both a fully functional TanStack implementation and a Next.js implementation with some limitations

## Getting Started

### Server Setup (Cloudflare Worker)

1. **Environment Variables**:
   - Copy `.env.example` to `.env` in the `/apps/server` directory
   - Set `BETTER_AUTH_SECRET` (keep it consistent across environments)
   - Set `BASE_BETTER_AUTH_URL` to your root domain (important: this is the domain root, not full API URL)

2. **Configure Trusted Origins**:
   - Update `src/lib/constants.ts` with your frontend domains that will access the API
   ```typescript
   export const TRUSTED_ORIGINS = [
     "http://localhost:3000", 
     "https://your-frontend-domain.com"
   ];
   ```

3. **Set Up D1 Database**:
   - Create a D1 database in Cloudflare Dashboard
   - Update `wrangler.jsonc` with your database ID
   - Or locally: `npx wrangler d1 create mixer-exp`

4. **Apply Database Migrations**:
   - For development: `cd apps/server && pnpm db:migrate:dev`
   - For production: `cd apps/server && pnpm db:migrate:prod`

5. **Deploy**:
   - `cd apps/server && pnpm deploy`

### TanStack Frontend (Cloudflare Pages)

1. **Environment Variables**:
   - Copy `.env.example` to `.env` in the `/apps/frontend` directory
   - Set `VITE_SERVER_URL` to your API server URL
   - Set `VITE_BETTER_AUTH_URL` to your API server URL
   - Set `BETTER_AUTH_SECRET` to match your server's secret

2. **Deploy**:
   - `cd apps/frontend && pnpm build`
   - Deploy the `dist` directory to Cloudflare Pages
   - Or locally: `pnpm dev`

### Next.js Frontend (Vercel)

1. **Environment Variables**:
   - Copy `.env.example` to `.env.local` in the `/apps/web` directory
   - Set `NEXT_PUBLIC_SERVER_URL` to your API server URL
   - Set `NEXT_PUBLIC_BETTER_AUTH_URL` to your API server URL

2. **Limitations**:
   - ⚠️ Server-side authentication does not work properly in production
   - Client-side authentication works correctly

3. **Deploy**:
   - `cd apps/web && pnpm build`
   - Deploy to Vercel
   - Or locally: `pnpm dev`

## Development Workflow

1. Start the server:
   ```bash
   cd apps/server && pnpm dev
   ```

2. Start the frontend of your choice:
   ```bash
   # Either TanStack
   cd apps/frontend && pnpm dev
   
   # Or Next.js
   cd apps/web && pnpm dev
   ```

## Implementation Notes

### Domain Strategy

For full functionality in production, this setup works best with a domain/subdomain strategy:

- API on `api.yourdomain.com`
- TanStack frontend on `app.yourdomain.com`
- Next.js frontend on `www.yourdomain.com`

The `BASE_BETTER_AUTH_URL` should be set to `yourdomain.com` (not the full API URL).

### Authentication

- Uses [better-auth](https://github.com/better-auth/better-auth) for authentication
- Works with cross-subdomain cookies
- Server-side auth in Next.js has compatibility issues in production

## License

MIT
