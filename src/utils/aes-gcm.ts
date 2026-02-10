// ! Excerpt from: https://github.com/lightzane/try-crypto-pbe/blob/main/src/utils/aes-gcm.ts

import { webcrypto } from 'node:crypto'

/*
    * Why AES-GCM?

    - AES (Advanced Encryption Standard) is a widely adopted symmetric encryption algorithm 
        known for its security and efficiency.

    - GCM (Galois/Counter Mode) is a mode of operation for AES that provides both confidentiality and data integrity, 
        making it suitable for secure communications.

    - AES-GCM is optimized for performance and is widely supported in modern cryptographic libraries and hardware, 
        making it a popular choice for encrypting sensitive data.

        - CIA = Confidentiality, Integrity, Authenticity
        - [C] = Data is kept secret from unauthorized parties.
        - [I] = Data has not been altered or tampered with.
        - [A] = Verification of the identity of the parties involved in communication.
*/

/**
 * Used for AES-GCM encryption, decryption and derivation.
 */
const AES_ALGO: AesKeyGenParams = {
  name: 'AES-GCM',
  length: 256, // Key length can be 128, 192, or 256 bits
}

export async function generateKey() {
  return await webcrypto.subtle.generateKey(
    AES_ALGO,
    true, // extractable
    ['encrypt', 'decrypt'] // key usages
  )
}

export async function encrypt(message: string, key: webcrypto.CryptoKey) {
  /** Initialization Vector */
  const iv = webcrypto.getRandomValues(new Uint8Array(12)) // nonce
  const encoded = new TextEncoder().encode(message)

  const AES_GCM_PARAMS: AesGcmParams = {
    name: AES_ALGO.name,
    iv,
  }

  const cipherTextBuffer = await webcrypto.subtle.encrypt(
    AES_GCM_PARAMS,
    key,
    encoded
  )

  return {
    iv,
    cipherText: new Uint8Array(cipherTextBuffer),
  }
}

export async function decrypt(
  key: webcrypto.CryptoKey,
  iv: Uint8Array<ArrayBuffer>,
  cipherText: Uint8Array<ArrayBuffer>
) {
  const AES_GCM_PARAMS: AesGcmParams = {
    name: AES_ALGO.name,
    iv,
  }

  const plainTextBuffer = await webcrypto.subtle.decrypt(
    AES_GCM_PARAMS,
    key,
    cipherText
  )

  return new TextDecoder().decode(plainTextBuffer)
}
