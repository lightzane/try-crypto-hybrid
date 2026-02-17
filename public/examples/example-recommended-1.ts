import {
  deriveSharedKey,
  exportPrivateKey,
  exportPublicKey,
  generateECDHKeyPair,
} from '~/utils/ecdh'

const webcrypto = window.crypto

export async function EXAMPLE_RECOMMENDED_1() {
  console.log(
    '\n\x1b[36;7m Example Recommended One \x1b[0;1;36m ECDH Intro - Shared Key Comparison \x1b[0m'
  )

  const redKeys = await generateECDHKeyPair()
  const greenKeys = await generateECDHKeyPair()
  const blueKeys = await generateECDHKeyPair()

  const redKeysSpki = await exportPublicKey(redKeys.publicKey)
  const redKeysPkcs8 = await exportPrivateKey(redKeys.privateKey)

  const rrSharedKey = await deriveSharedKey(
    redKeys.privateKey,
    redKeys.publicKey,
    true // make the derived key extractable for demonstration purposes
  )
  const rgSharedKey = await deriveSharedKey(
    redKeys.privateKey,
    greenKeys.publicKey,
    true // make the derived key extractable for demonstration purposes
  )
  const grSharedKey = await deriveSharedKey(
    greenKeys.privateKey,
    redKeys.publicKey,
    true // make the derived key extractable for demonstration purposes
  )
  const gbSharedKey = await deriveSharedKey(
    greenKeys.privateKey,
    blueKeys.publicKey,
    true // make the derived key extractable for demonstration purposes
  )
  const bgSharedKey = await deriveSharedKey(
    blueKeys.privateKey,
    greenKeys.publicKey,
    true // make the derived key extractable for demonstration purposes
  )

  const rrSharedKeyRaw = await webcrypto.subtle.exportKey('raw', rrSharedKey)
  const rgSharedKeyRaw = await webcrypto.subtle.exportKey('raw', rgSharedKey)
  const grSharedKeyRaw = await webcrypto.subtle.exportKey('raw', grSharedKey)
  const gbSharedKeyRaw = await webcrypto.subtle.exportKey('raw', gbSharedKey)
  const bgSharedKeyRaw = await webcrypto.subtle.exportKey('raw', bgSharedKey)

  // Web implemention to base64
  function toB64(arrayBuffer: ArrayBuffer) {
    return window.btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
  }

  const rrSharedKeyB64 = toB64(rrSharedKeyRaw)
  const rgSharedKeyB64 = toB64(rgSharedKeyRaw)
  const grSharedKeyB64 = toB64(grSharedKeyRaw)
  const gbSharedKeyB64 = toB64(gbSharedKeyRaw)
  const bgSharedKeyB64 = toB64(bgSharedKeyRaw)

  console.log('Public (ECDH) Key Size:', redKeysSpki.byteLength)
  console.log('Private (ECDH) Key Size:', redKeysPkcs8.byteLength)
  console.log('Shared (AES) Key Size', rgSharedKeyRaw.byteLength, 'bytes')
  console.log()

  console.log('Red-Red Shared Key (Base64):', rrSharedKeyB64, '\n')
  console.log('Red-Green Shared Key (Base64):', rgSharedKeyB64)
  console.log('Green-Red Shared Key (Base64):', grSharedKeyB64, '\n')
  console.log('Green-Blue Shared Key (Base64):', gbSharedKeyB64)
  console.log('Blue-Green Shared Key (Base64):', bgSharedKeyB64)
}
