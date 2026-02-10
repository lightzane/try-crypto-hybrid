# Try Crypto Hybrid

Exploring Web Crypto API's **asymmetric encryption** (`RSA-OAEP`) combining with **symmetric encryption** (`AES-GCM`)

## Summary

Hybrid Encryption:

1. Generate symmetric key (AES)
2. Encrypt the large data using the **AES Key**
3. Encrypt the **AES Key** with the recipient's **Public RSA Key**

Hybrid Decryption:

1. Decrypt the encrypted **AES Key** using the recipient's **Private RSA Key**
2. Use the decrypted **AES Key** to decrypt the encrypted data

### Comparison Table

| Feature           | **`AES-GCM`**                | **`RSA-OAEP`**                |
| ----------------- | ---------------------------- | ----------------------------- |
| Randomness Source | Initialization Vector (`iv`) | OAEP Padding                  |
| Speed             | Very Fast                    | Slow                          |
| Data Size         | Almost unlimited             | Very small (e.g. < 190 bytes) |

## Getting Started

```bash
pnpm install
pnpm dev
```

## General Notes

- [Uint8Array vs ArrayBuffer](#uint8array-vs-arraybuffer)
- [Public Exponent](#public-exponent)
- [Crypto Key Formats](#key-formats)

### `UInt8Array` vs `ArrayBuffer`

Comparison:

- **`ArrayBuffer`** is a fixed-length, raw binary data buffer. It represents a chunk of memory, but you cannot access or modify its contents directly.

- **`Uint8Array`** is a typed array view over an ArrayBuffer. It allows you to read and write individual bytes (8-bit unsigned integers) within the buffer.

In summary:

- Use **`ArrayBuffer`** for storing raw binary data.

- Use **`Uint8Array`** (or other typed arrays) to access and manipulate the data in an `ArrayBuffer`.

Example:

```ts
const buffer = new ArrayBuffer(4) // 4 bytes
const view = new Uint8Array(buffer) // view to access those bytes
view[0] = 255 // set first byte
```

### Public Exponent

In RSA, it is part of the mathematical formula to lock the data.

```ts
const RSA_OAEP_ALGO: RsaHashedKeyGenParams = {
  // ...
  publicExponent: new Uint8Array([1, 0, 1]), // 65537
  // ...
}
```

Uint8Array treats each index as an 8-bit byte.

- Byte 0 = `00000001` (Value $1$ x $256^2$ = $65,536$)
- Byte 1 = `00000000` (Value $0$ x $256^1$ = $0$)
- Byte 2 = `00000001` (Value $1$ x $256^0$ = $1$)

#### Why do we use $65, 537$?

Technically, we can use other prime numbers like 3 or 17.

**$65, 537$** is a prime number (4th Fermat prime). Mathematically,
it is very effecient for computers to process (it only has two bits set to 1 in binary),
but it is large enough to avoid certain cryptographic attacks that happen in smaller numbers.

In 99% of web development, you should **always** use $65, 537$. It is industry standard

### Key Formats

| Algorithm  | Public Key Format | Private Key Format | Symmetric Key Format |
| ---------- | ----------------- | ------------------ | -------------------- |
| RSA        | `spki`,`jwk`      | `pkcs8`,`jwk`      | N/A                  |
| ECDSA/ECDH | `spki`,`jwk`      | `pkcs8`,`jwk`      | N/A                  |
| AES        | N/A               | N/A                | `raw`,`jwk`          |
| HMAC       | N/A               | N/A                | `raw`,`jwk`          |

- `spki`, `pkcs8`, `raw` = store keys as **text**
- `jwk` = store keys as **JSON** format
