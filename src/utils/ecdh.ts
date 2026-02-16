import { webcrypto } from 'node:crypto'

/* 
    * ECDH = Elliptic Curve Diffie-Hellman, a widely used asymmetric key agreement protocol that allows two parties to establish a shared secret over an insecure channel.

    The ECDH algorithm works as follows:

        1. Each party generates their own ECDH key pair (private and public keys).
        2. The parties exchange their public keys over an insecure channel.
        3. Each party uses their private key and the other party's public key to derive a shared secret.
        4. The derived shared secret can be used as a symmetric key for encryption algorithms like AES.

    ECDH provides security against various attacks, including:

        - Man-in-the-middle attacks, if the public keys are authenticated
        - Eavesdropping, as the shared secret is never transmitted directly and cannot be derived by an attacker without the private keys

    * This is recommended over RSA for key agreement due to its efficiency and smaller key sizes for equivalent security levels.

    ECDH has a built-in AES-GCM encryption example in the `EXAMPLE_RECOMMENDED_2` function, which demonstrates how to use the derived shared key for encrypting and decrypting messages securely.
*/

const ECDH_ALGO: EcKeyGenParams = {
  name: 'ECDH', // Elliptic Curve Diffie-Hellman
  namedCurve: 'P-256', // A widely used curve that offers a good balance of security and performance
}

const AES_ALGO: AesKeyGenParams = {
  name: 'AES-GCM', // AES in Galois/Counter Mode, which provides confidentiality and integrity
  length: 256, // Key length in bits (128, 192, or 256)
}

export async function generateECDHKeyPair() {
  return webcrypto.subtle.generateKey(
    ECDH_ALGO,
    true, // change to false if private key should not be exportable
    ['deriveKey' /*, 'deriveBits' */] // Key usage for ECDH
  )
}

export async function deriveSharedKey(
  privateKey: webcrypto.CryptoKey,
  publicKey: webcrypto.CryptoKey,
  extractable = false
) {
  return webcrypto.subtle.deriveKey(
    {
      // The algorithm parameters for ECDH, including the public key of the other party
      name: ECDH_ALGO.name,
      public: publicKey,
    },
    privateKey, // The private key of the local party
    AES_ALGO, // the algorithm for the derived key
    extractable,
    ['encrypt', 'decrypt'] // Key usage for the derived AES key
  )
}

export async function exportPublicKey(publicKey: webcrypto.CryptoKey) {
  return webcrypto.subtle.exportKey('spki', publicKey) // spki = Subject Public Key Info format for public keys
}

export async function exportPrivateKey(privateKey: webcrypto.CryptoKey) {
  return webcrypto.subtle.exportKey('pkcs8', privateKey) // pkcs8 = Public-Key Cryptography Standards #8 format for private keys
}
