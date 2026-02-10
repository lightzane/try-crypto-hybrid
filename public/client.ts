// See (vite.config.ts + tsconfig.json + server.ts) for aliasing '~' to 'public' directory
import { EXAMPLE_1_BASIC } from '~/examples/example-1'
import { EXAMPLE_2_HYBRID } from '~/examples/example-2'
import { EXAMPLE_3_IMPORT_EXPORT_KEYS } from '~/examples/example-3'
import { hello } from '~/examples/hello'

document.addEventListener('DOMContentLoaded', start)

async function start() {
  document.querySelector('h1').textContent = await hello()

  EXAMPLE_1_BASIC()
    .then(EXAMPLE_2_HYBRID) //
    .then(EXAMPLE_3_IMPORT_EXPORT_KEYS)
}
