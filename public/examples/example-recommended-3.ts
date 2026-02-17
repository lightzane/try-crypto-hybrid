import { decrypt, encrypt } from '~/utils/aes-gcm'
import {
  deriveSharedKey,
  generateECDHKeyPair,
  protectPrivateKey,
  unprotectPrivateKey,
} from '~/utils/ecdh'

export async function EXAMPLE_RECOMMENDED_3() {
  console.log(
    '\n\x1b[36;7m Example Recommended Three \x1b[0;1;36m ECDH + Storing Private Key \x1b[0m'
  )

  /*
    Generally we can directly store the private key (extractable = false) in IndexedDB, 
    but for better security, we can encrypt the private key with a password before storing it. 
    This way, even if an attacker gains access to the storage or device, 
    they would still need the password to decrypt the private key.

    1. User enters a Password.
    2. PBKDF2 turns that password into a "Master Key" (Key Encryption Key).
    3. Generate an ECDH key pair (Public and Private Key).
    4. Wrap the ECDH private key using the Master Key with AES-GCM encryption.
    5. Save the "wrapped" (encrypted) private key, along with the salt and IV used for encryption, in IndexedDB.
    6. When the user wants to use the private key, they enter their password again.
    7. PBKDF2 derives the same Master Key from the password and salt.
    8. Unwrap (decrypt) the private key using the Master Key and IV.
    9. Use the decrypted private key for ECDH operations (e.g., deriving shared keys).

    In this demo, we will skip IndexedDB
  */

  // 1. Generate ECDH key pair
  const { publicKey, privateKey } = await generateECDHKeyPair()

  // 2. Derive shared keys
  // (In a real application, you would derive the shared key with the other party's public key)
  const demoSharedKey = await deriveSharedKey(
    privateKey,
    publicKey,
    true // make the derived key extractable for demonstration purposes
  )

  // 3. Encrypt the message using AES-GCM with the derived shared key
  // (In a real application, you would use the derived shared key to encrypt/decrypt messages with the other party)
  const message =
    'This is a secret message that will be encrypted with the derived shared key and will be decrypted using the stored private key that was wrapped and encrypted with a password.'
  const { iv: ivMessage, cipherText } = await encrypt(message, demoSharedKey)

  console.log('Original Message:', message)
  console.log('Encrypted Message:', cipherText)

  // 4. Input password to derive master key and to encrypt the private key before storing it
  const password = 'my_secure_password'

  // 5. Encrypt the private key using the derived master key
  const { iv, salt, wrappedKey } = await protectPrivateKey(privateKey, password)
  console.log(
    'Encrypted Private Key (Base64):',
    window.btoa(String.fromCharCode(...new Uint8Array(wrappedKey)))
  )

  // 6. Get the private key using password
  const decryptedPrivateKey = await unprotectPrivateKey(
    password,
    iv,
    salt,
    wrappedKey
  )

  // 7. Derive the shared key again using the decrypted private key to verify it works
  const sharedKey = await deriveSharedKey(decryptedPrivateKey, publicKey)

  // 8. Decrypt the message using the shared key derived from the decrypted private key
  const decryptedMessage = await decrypt(sharedKey, ivMessage, cipherText)
  console.log('Decrypted Message:', decryptedMessage)
}
