import type { Express } from 'express'

export async function API_ENDPOINTS(app: Express) {
  app.post('/api/hello', (req, res) => {
    const name = req.body.name || 'Guest'
    console.log(`Received name: ${name}`)
    res.json({ message: `Hello, ${name}, from the server!` })
  })
}
