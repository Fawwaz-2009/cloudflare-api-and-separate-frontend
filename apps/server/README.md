# Cloudflare Worker API Server

This is the API server component deployed via the Deploy to Cloudflare button. It's part of the CloudFront Bridge project that demonstrates a Cloudflare Worker API with separate frontend deployments.

## Post-Deployment Setup

### 1. Configure Environment Variables

In your Cloudflare dashboard, set the following environment variables:

- `BETTER_AUTH_SECRET`: A secure random string for authentication
- `BASE_BETTER_AUTH_URL`: Your domain root (e.g., `yourdomain.com`, not `api.yourdomain.com`)

### 2. Update Trusted Origins

Edit `src/lib/constants.ts` to include your frontend domains:

```typescript
export const TRUSTED_ORIGINS = [
  "http://localhost:3000",
  "https://your-frontend-domain.com",
  "https://another-frontend.vercel.app"
];
```

### 3. Custom Domain (Optional)

If you want to use a custom domain instead of `*.workers.dev`:

1. Go to your Worker settings in Cloudflare dashboard
2. Add a custom domain or route
3. Update `wrangler.jsonc` if needed

## API Endpoints

- `GET /`: Health check
- `POST /api/auth/*`: Authentication endpoints (login, signup, logout)
- `GET /api/session`: Get current user session
- More endpoints can be added in `src/router/`

## Database

This Worker uses Cloudflare D1 for data storage. Migrations are automatically applied during deployment.

To add new migrations:

1. Create migration files in `src/db/migrations/`
2. Run `npm run db:generate -- your-migration-name`
3. Deploy to apply migrations: `npm run deploy`

## Local Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Apply migrations locally
npm run db:migrate:dev
```

## Frontend Applications

This API is designed to work with separate frontend applications. The original project includes:

- **TanStack Router** frontend (deploy to Cloudflare Pages)
- **Next.js** frontend (deploy to Vercel)

To set up frontends:

1. Clone the full project from: [Original Repository]
2. Configure frontend environment variables to point to this API
3. Deploy frontends to their respective platforms

## Troubleshooting

### CORS Issues

Make sure your frontend domain is listed in `TRUSTED_ORIGINS` in `src/lib/constants.ts`.

### Authentication Not Working

1. Verify `BETTER_AUTH_SECRET` is the same across all environments
2. Check that `BASE_BETTER_AUTH_URL` is set to your domain root
3. Ensure cookies are enabled and using secure settings in production

## Support

For issues and questions, please refer to the main project repository.

```
npm run deploy
```
