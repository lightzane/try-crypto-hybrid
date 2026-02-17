import express from 'express'
import path from 'node:path'
import { createServer as createViteServer } from 'vite'

import { API_ENDPOINTS } from '@/api'
import { EXAMPLE_1_BASIC } from '@/examples/example-1'
import { EXAMPLE_2_HYBRID } from '@/examples/example-2'
import { EXAMPLE_3_IMPORT_EXPORT_KEYS } from '@/examples/example-3'
import { EXAMPLE_RECOMMENDED_1 } from '@/examples/example-recommended-1'
import { EXAMPLE_RECOMMENDED_2 } from '@/examples/example-recommended-2'
import { EXAMPLE_RECOMMENDED_3 } from '@/examples/example-recommended-3'
import { VITE_INDEX_HTML } from '@/vite-index-html'

async function start() {
  const PORT = process.env.PORT || 3000

  const app = express()
  const vite = await createViteServer({
    root: path.join(process.cwd(), 'public'), // Set Vite root to 'public' directory
    server: { middlewareMode: true },
    configFile: path.join(process.cwd(), 'vite.config.ts'),
  })

  // ! MUST COME FIRST before all api endpoints, so it can parse req.body
  app.use(express.json()) // For parsing application/json

  // ! [IMPORTANT] Define API endpoints above catch-all middleware
  // ! so that API routes are registered first
  // catch-all middleware = (app.use(async (req, res) => {...}) / See (vite-index-html.ts))
  API_ENDPOINTS(app)

  app.use(vite.middlewares)

  // ! DO NOT let Express serve static files
  // app.use(express.static('public')) // ❌
  // * Instead, let Vite handle serving index.html and assets
  VITE_INDEX_HTML(app, vite) // ✅

  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`)
    console.log('🧪 \x1b[33mRunning quick examples...\x1b[0m')

    EXAMPLE_1_BASIC()
      .then(EXAMPLE_2_HYBRID) //
      .then(EXAMPLE_3_IMPORT_EXPORT_KEYS)
      .then(EXAMPLE_RECOMMENDED_1)
      .then(EXAMPLE_RECOMMENDED_2)
      .then(EXAMPLE_RECOMMENDED_3)
  })
}

start()
