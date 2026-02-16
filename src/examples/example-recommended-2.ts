import { decrypt, encrypt } from '@/utils/aes-gcm'
import { deriveSharedKey, generateECDHKeyPair } from '@/utils/ecdh'

export async function EXAMPLE_RECOMMENDED_2() {
  console.log(
    '\n\x1b[36;7m Example Recommended Two \x1b[0;1;36m ECDH + AES-GCM Encryption \x1b[0m'
  )

  // 1. Generate ECDH key pairs for Alice and Bob
  const aliceKeys = await generateECDHKeyPair()
  const bobKeys = await generateECDHKeyPair()

  // 2. Derive shared keys
  const aliceSharedKey = await deriveSharedKey(
    aliceKeys.privateKey,
    bobKeys.publicKey
  )
  const bobSharedKey = await deriveSharedKey(
    bobKeys.privateKey,
    aliceKeys.publicKey
  )

  // 3. Encrypt the message using AES-GCM with the derived shared key
  const message = 'Hello Bob, this is Alice!'
  const { iv, cipherText } = await encrypt(message, aliceSharedKey)

  console.log("Alice's Original Message:", message)
  console.log(
    "Alice's Ciphertext (Base64):",
    Buffer.from(cipherText).toString('base64')
  )

  // 4. Bob can decrypt the message using the same shared key (not shown here, but would involve a corresponding decryptWithSharedKey function)
  const bobDecryptedMessage = await decrypt(bobSharedKey, iv, cipherText)
  console.log("Bob's Decrypted Message:", bobDecryptedMessage)

  // 5. For demonstration, Alice can also decrypt the message she encrypted using the same shared key
  const aliceDecryptedMessage = await decrypt(aliceSharedKey, iv, cipherText)
  console.log("Alice's Decrypted Message:", aliceDecryptedMessage)
}
