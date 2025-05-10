import { bcrypt, Binary, decode, encode } from "@deps";

// To understand how to use the `Web Crypto API`, click on the link below :
// https://medium.com/deno-the-complete-reference/private-key-aes-encryption-decryption-in-deno-10cf33b41eaf

export class Auth {
  private static AES_CBC_128: AesKeyGenParams = {
    name: "AES-CBC",
    length: 128,
  };

  private static AES_CBC_16: AesCbcParams = {
    name: "AES-CBC",
    iv: crypto.getRandomValues(new Uint8Array(16)),
  };

  private static usages: KeyUsage[] = [
    "encrypt",
    "decrypt",
  ];

  private static textEncoder(str: string) {
    return new TextEncoder().encode(str);
  }

  private static textDecoder(data: Uint8Array) {
    return new TextDecoder().decode(data);
  }

  public static async key() {
    return await crypto.subtle.generateKey(
      Auth.AES_CBC_128,
      true,
      Auth.usages,
    );
  }

  public static async exportKey(key: CryptoKey) {
    return new Uint8Array(
      await crypto.subtle.exportKey(
        "raw",
        key,
      ),
    );
  }

  public static async importKey(binOrUint8: Binary | Uint8Array) {
    let buffer: ArrayBufferLike = new ArrayBuffer(16);

    if (binOrUint8 instanceof Binary) {
      const binSequence = binOrUint8.value(true);

      if (typeof binSequence !== "string") {
        const convertedUint = new Uint8Array(binSequence);
        buffer = convertedUint.buffer;
      }
    } else {
      buffer = binOrUint8.buffer;
    }

    return await crypto.subtle.importKey(
      "raw",
      buffer,
      "AES-CBC",
      true,
      Auth.usages,
    );
  }

  public static async encryptPassword(password: string) {
    const key = await Auth.key();
    const encrypted = await crypto.subtle.encrypt(
      Auth.AES_CBC_16,
      key,
      Auth.textEncoder(password.trim()),
    );

    const data = new Uint8Array(encrypted);
    const hash = Auth.textDecoder(encode(data));

    return { hash, key };
  }

  public static async decryptPassword(
    hash: string,
    key: CryptoKey,
  ) {
    const decrypted = await crypto.subtle.decrypt(
      Auth.AES_CBC_16,
      key,
      decode(Auth.textEncoder(hash)),
    );
    const decryptedBytes = new Uint8Array(decrypted);

    return Auth.textDecoder(decryptedBytes);
  }

  public static async hashPassword(password: string) {
    return await bcrypt.hash(password);
  }

  public static async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
