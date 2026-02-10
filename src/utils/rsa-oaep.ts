import { webcrypto } from 'node:crypto'

/* 
    RSA = Rivest-Shamir-Adleman (the inventors' last names), a widely used asymmetric encryption algorithm

    RSA-OAEP (Optimal Asymmetric Encryption Padding) 
    
        is a widely used asymmetric encryption scheme 
        that provides security against various attacks. 
        It is based on the RSA algorithm and uses a padding scheme to enhance security.

    The RSA-OAEP algorithm works as follows:

        1. Key Generation: A pair of keys (public and private) is generated using the RSA algorithm. 
        The public key is used for encryption, while the private key is used for decryption.

        2. Encryption: To encrypt a message, the sender uses the recipient's public key and the RSA-OAEP algorithm. 
        The message is first padded using the OAEP scheme, which adds randomness and prevents certain types of attacks. 
        The padded message is then encrypted using the RSA algorithm.

        3. Decryption: To decrypt the message, the recipient uses their private key and the RSA-OAEP algorithm. 
        The encrypted message is decrypted using the RSA algorithm, and then the padding is removed to retrieve the original message.

    RSA-OAEP provides security against various attacks, including:

        - Chosen Plaintext Attacks (CPA): The OAEP padding scheme adds randomness to the encryption process, making it resistant to CPA attacks.
        - Chosen Ciphertext Attacks (CCA): The OAEP padding scheme also provides security against CCA attacks, where an attacker can choose ciphertexts and obtain their corresponding plaintexts.
        - Timing Attacks: The RSA-OAEP algorithm is designed to be resistant to timing attacks, which attempt to exploit the time taken for encryption and decryption operations to gain information about the keys.

    * Use RSA-OAEP to encrypt the AES key.
    * Use AES-GCM to encrypt the actual data. 
        (AES-GCM = Advanced Encryption Standard in Galois/Counter Mode, a widely used symmetric encryption algorithm that provides confidentiality and integrity for the encrypted data.)
    
*/

const RSA_OAEP_ALGO: RsaHashedKeyGenParams = {
  name: 'RSA-OAEP',
  modulusLength: 2048, // key size in bits (2048 is considered secure for most applications)
  publicExponent: new Uint8Array([1, 0, 1]), // 65537
  hash: 'SHA-256',
}

export async function generateKeyPair() {
  return webcrypto.subtle.generateKey(
    RSA_OAEP_ALGO,
    true, // extractable
    ['encrypt', 'decrypt']
  )
}

export async function encrypt(
  message: string | ArrayBuffer,
  publicKey: webcrypto.CryptoKey
) {
  const encoded =
    typeof message === 'string'
      ? new TextEncoder().encode(message) //
      : message // If it's already an ArrayBuffer, use it directly

  const algorithm = { name: RSA_OAEP_ALGO.name }

  return webcrypto.subtle.encrypt(
    algorithm, // or directly pass a string 'RSA-OAEP'
    publicKey,
    encoded
  )
}

export async function decrypt(
  cipherText: ArrayBuffer,
  privateKey: webcrypto.CryptoKey
) {
  const algorithm = RSA_OAEP_ALGO.name // or { name: RSA_OAEP_ALGO.name }

  return webcrypto.subtle.decrypt(
    algorithm, // or directly pass an object { name: 'RSA-OAEP' }
    privateKey,
    cipherText
  )
}

// PEM = Privacy-Enhanced Mail, a widely used format for encoding cryptographic keys and certificates in a human-readable form.
const PEM_PUBLIC_HEADER = '-----BEGIN PUBLIC KEY-----'
const PEM_PUBLIC_FOOTER = '-----END PUBLIC KEY-----'
const PEM_PRIVATE_HEADER = '-----BEGIN PRIVATE KEY-----'
const PEM_PRIVATE_FOOTER = '-----END PRIVATE KEY-----'

export async function exportPublicKeyAsPem(publicKey: webcrypto.CryptoKey) {
  // spki = Subject Public Key Info, a standard format for storing public keys
  const spki = await webcrypto.subtle.exportKey('spki', publicKey)
  const base64 = Buffer.from(spki).toString('base64')
  return `${PEM_PUBLIC_HEADER}\n${base64}\n${PEM_PUBLIC_FOOTER}`
}

export async function exportPrivateKeyAsPem(privateKey: webcrypto.CryptoKey) {
  // pkcs8 = Public-Key Cryptography Standards #8, a standard format for storing private keys
  const pkcs8 = await webcrypto.subtle.exportKey('pkcs8', privateKey)
  const base64 = Buffer.from(pkcs8).toString('base64')
  return `${PEM_PRIVATE_HEADER}\n${base64}\n${PEM_PRIVATE_FOOTER}`
}

export async function importPublicKeyFromPem(pem: string) {
  const base64 = pem
    .replace(PEM_PUBLIC_HEADER, '')
    .replace(PEM_PUBLIC_FOOTER, '')
    .replace(/\s/g, '') // Remove all whitespace
  const spki = Buffer.from(base64, 'base64')
  return webcrypto.subtle.importKey(
    'spki', // format
    spki, // key data
    RSA_OAEP_ALGO,
    true,
    ['encrypt']
  )
}

export async function importPrivateKeyFromPem(pem: string) {
  const base64 = pem
    .replace(PEM_PRIVATE_HEADER, '')
    .replace(PEM_PRIVATE_FOOTER, '')
    .replace(/\s/g, '') // Remove all whitespace
  const pkcs8 = Buffer.from(base64, 'base64')
  return webcrypto.subtle.importKey(
    'pkcs8', // format
    pkcs8, // key data
    RSA_OAEP_ALGO,
    true,
    ['decrypt']
  )
}
