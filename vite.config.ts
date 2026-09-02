import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import type { IncomingMessage, ServerResponse } from 'node:http'

/**
 * Serves the `api/` folder during `npm run dev`.
 *
 * Those files are Vercel-style serverless functions, which only exist once
 * deployed — the Vite dev server knows nothing about them, so every POST to
 * /api/send-email 404s locally. This mounts them as dev middleware so the forms
 * behave the same on localhost as in production, with no extra CLI to run.
 *
 * Production is unaffected: this plugin only registers `configureServer`.
 */
function devApiRoutes(): Plugin {
  return {
    name: 'dev-api-routes',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const url = req.url?.split('?')[0] ?? ''
        if (!url.startsWith('/api/')) return next()

        try {
          // Collect the body; Vite's connect stack does not parse it for us.
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const rawBody = Buffer.concat(chunks).toString('utf8')

          // Adapt Node's bare response to the Express-ish shape the handlers use.
          let statusCode = 200
          const shim = {
            setHeader: (k: string, v: string) => res.setHeader(k, v),
            status(code: number) {
              statusCode = code
              return this
            },
            json(payload: unknown) {
              res.statusCode = statusCode
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(payload))
              return this
            },
            end(chunk?: string) {
              res.statusCode = statusCode
              res.end(chunk)
              return this
            },
          }

          // ssrLoadModule transpiles the TypeScript handler on the fly and picks
          // up edits without restarting the server.
          const mod = await server.ssrLoadModule(`/api/${url.slice(5)}.ts`)
          const handler = mod.default

          if (typeof handler !== 'function') {
            res.statusCode = 500
            res.end(JSON.stringify({ error: `No default export in api/${url.slice(5)}.ts` }))
            return
          }

          await handler(
            {
              method: req.method,
              headers: req.headers,
              body: rawBody ? JSON.parse(rawBody) : {},
            },
            shim,
          )
        } catch (err) {
          server.config.logger.error(`[dev-api] ${url} failed: ${(err as Error).message}`)
          if (!res.writableEnded) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: (err as Error).message }))
          }
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Handlers read process.env; Vite only exposes VITE_-prefixed vars to the
  // client, so server-side keys have to be loaded in explicitly. The '' prefix
  // loads every key. These never reach the browser bundle.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [react(), tailwindcss(), devApiRoutes()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
