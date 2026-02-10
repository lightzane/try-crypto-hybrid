// ! [IMPORTANT]: To import module dependencies (e.g. 'axios')
// ! Then allow Vite to transform index.html (not express.static)
// ! --> see (vite-index-html.ts)
import axios from 'axios'

export async function hello() {
  const name = (document.title =
    'Try + Crypto + Hybrid (Asymmetric & Symmetric) Encryption')

  const result = await axios.post('/api/hello', {
    name,
  })

  console.log(result.data)

  return result.data.message
}
