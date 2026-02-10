// Example message with 190 bytes (max message size for 2048-bit RSA-OAEP with SHA-256)
// 1 character = 1 byte (for ASCII characters), but emojis and some special characters can take more bytes (e.g., '🦅' takes 4 bytes)
let longMessage190Bytes =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris'

export const longMessage191Bytes = longMessage190Bytes + 'a' // 191 bytes (exceeds max message size)
