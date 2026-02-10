import {
  decrypt,
  encrypt,
  exportPrivateKeyAsPem,
  exportPublicKeyAsPem,
  generateKeyPair,
  importPrivateKeyFromPem,
} from '@/utils/rsa-oaep'

export async function EXAMPLE_3_IMPORT_EXPORT_KEYS() {
  console.log(
    '\n\x1b[36;7m Example Three \x1b[0;1;36m Import and Export Asymmetric keys \x1b[0m'
  )

  const { publicKey, privateKey } = await generateKeyPair()

  const publicKeyPem = await exportPublicKeyAsPem(publicKey)
  const privateKeyPem = await exportPrivateKeyAsPem(privateKey)

  console.log('Exported Public Key (PEM format):\n', publicKeyPem, '\n')
  console.log('Exported Private Key (PEM format):\n', privateKeyPem, '\n')

  const message = 'The eagle flies at midnight 🦅'
  const encrypted = await encrypt(message, publicKey)
  console.log('Encrypted Buffer (RSA-OAEP):', new Uint8Array(encrypted), '\n')

  const importedPrivateKey = await importPrivateKeyFromPem(privateKeyPem)
  const decrypted = await decrypt(encrypted, importedPrivateKey)
  console.log(
    'Decrypted Message with Imported Private Key (RSA-OAEP):',
    new TextDecoder().decode(decrypted),
    '\n'
  )
}
