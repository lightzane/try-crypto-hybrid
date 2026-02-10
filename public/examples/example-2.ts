// import { webcrypto } from 'node:crypto' // For Node.js environment

const webcrypto = window.crypto // For web browsers

import { longMessage191Bytes } from '@/constants/messages'
import {
  decrypt as aesDec,
  encrypt as aesEnc,
  generateKey,
} from '~/utils/aes-gcm'
import { decrypt, encrypt, generateKeyPair } from '~/utils/rsa-oaep'

export async function EXAMPLE_2_HYBRID() {
  console.log(
    `\n\x1b[36;7m Example Two \x1b[0;1;36m Hybrid Encryption (RSA-OAEP + AES-GCM) \x1b[0m`
  )

  // 1. Generate a key pair (public and private keys) using RSA-OAEP algorithm.
  const { publicKey, privateKey } = await generateKeyPair()
  const aesKey = await generateKey()

  // 2. Encrypt actual data using AES-GCM algorithm and the generated AES key.
  const message =
    'The eagle flies at midnight 🦅 + the very long message to demo that AES-GCM can handle large messages: ' +
    longMessage191Bytes
  console.log('Message size (bytes):', new TextEncoder().encode(message).length)

  const encryptedMessage = await aesEnc(message, aesKey)
  console.log('Encrypted Message (AES-GCM):', encryptedMessage)

  // 3. Export the AES key as raw bytes
  const aesKeyRaw = await webcrypto.subtle.exportKey('raw', aesKey)
  console.log('Key size (bytes):', aesKeyRaw.byteLength) // Should be 32 bytes for AES-256

  // 4. Encrypt the AES key using the RSA-OAEP algorithm and the public key.
  const encryptedAesKey = await encrypt(aesKeyRaw, publicKey)
  console.log('Encrypted AES Key (RSA-OAEP):', new Uint8Array(encryptedAesKey))

  // 5. Decrypt the AES key using the RSA-OAEP algorithm and the private key.
  const decryptedAesKeyRaw = await decrypt(encryptedAesKey, privateKey)
  const decryptedAesKey = await webcrypto.subtle.importKey(
    'raw',
    decryptedAesKeyRaw,
    'AES-GCM',
    true,
    ['encrypt', 'decrypt']
  )

  // 6. Decrypt the actual data using AES-GCM algorithm and the decrypted AES key.
  const decryptedMessage = await aesDec(
    decryptedAesKey,
    encryptedMessage.iv,
    encryptedMessage.cipherText
  )
  console.log('Decrypted Message (AES-GCM):', decryptedMessage, '\n')
}
