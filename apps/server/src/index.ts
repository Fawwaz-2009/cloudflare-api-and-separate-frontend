import { Hono } from 'hono'
import { cors } from 'hono/cors'


const app = new Hono<{ Bindings: CloudflareBindings }>()

app.use('*', cors({
  origin: ['http://localhost:3000', "https://cloudflare-vercel-mix-web.vercel.app"],
  allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app