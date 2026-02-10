import { longMessage191Bytes } from '@/constants/messages'
import { decrypt, encrypt, generateKeyPair } from '@/utils/rsa-oaep'

export async function EXAMPLE_1_BASIC() {
  console.log(
    '\n\x1b[36;7m Example One \x1b[0;1;36m Basic Asymmetric Encryption \x1b[0m'
  )

  // 1. Generate a key pair (public and private keys) using RSA-OAEP algorithm.
  const { publicKey, privateKey } = await generateKeyPair()

  // 2. Encrypt a message using the public key and the RSA-OAEP algorithm.
  /* 
    ! Message size must NOT be greater than the key size minus padding overhead 
    For example, with (RSA-OAEP modulus length) of 2048-bit key and SHA-256, the maximum message size is 190 bytes
      
      Formula: `maxMessageSize = keySizeInBytes - (2 * hashOutputSizeInBytes) - 2`
        2048 bits = 256 bytes (key size in bytes)
        256 bits = 32 bytes (hash output size for SHA-256)

      So, `maxMessageSize = 256 - (2 * 32) - 2 = 190 bytes`

      ? Why multiply hash output size by 2?
        Because OAEP uses two hash outputs: one for the seed and one for the data block. 
        Each hash output contributes to the padding overhead, hence the multiplication by 2.

      * RSA-OAEP is commonly used to encrypt small pieces of data, such as symmetric keys (e.g., AES keys = 256 bits or 32 bytes) or short messages.
  */
  const message = 'The eagle flies at midnight 🦅'
  console.log('Message Size (bytes):', new TextEncoder().encode(message).length)

  const encrypted = await encrypt(message, publicKey)
  console.log('Encrypted Buffer (RSA-OAEP):', new Uint8Array(encrypted))

  // 3. Decrypt the message using the private key and the RSA-OAEP algorithm.
  const decrypted = await decrypt(encrypted, privateKey)
  console.log(
    'Decrypted Message (RSA-OAEP):',
    new TextDecoder().decode(decrypted)
  )

  try {
    await MAXED_OUT()
  } catch (error) {
    console.error('Error in MAXED_OUT example:', error.message, '\n')
  }
}

async function MAXED_OUT() {
  console.log()

  const { publicKey } = await generateKeyPair()

  console.log(
    'Message Size (bytes):',
    new TextEncoder().encode(longMessage191Bytes).length
  )

  await encrypt(longMessage191Bytes, publicKey)
}
