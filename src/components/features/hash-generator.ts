export type Algorithm =
  | "sha256"
  | "sha512"
  | "md5"
  | "pbkdf2"
  | "hmac-sha256"
  | "hmac-sha512";

export const generateHash = async (
  algorithm: Algorithm,
  data: string,
  encoding: "hex" | "base64" | "latin1" = "hex",
  secretKey?: string
): Promise<string> => {
  if (typeof data !== "string" || data.trim() === "") {
    throw new Error("Data must be a non-empty string");
  }

  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  let hashBuffer: ArrayBuffer;

  if (algorithm.startsWith("hmac")) {
    if (!secretKey) throw new Error("Secret key must be provided for HMAC algorighms");
    const keyData = encoder.encode(secretKey);
    const hashName = algorithm === "hmac-sha512" ? "SHA-512" : "SHA-256";
    const cryptoKey = await crypto.subtle.importKey(
      "raw", keyData, { name: "HMAC", hash: hashName }, false, ["sign"]
    );
    hashBuffer = await crypto.subtle.sign("HMAC", cryptoKey, dataBuffer);
  } else {
    let hashName = "SHA-256";
    if (algorithm === "sha512") hashName = "SHA-512";
    if (algorithm === "md5") throw new Error("MD5 is not supported by Web Crypto API natively.");
    hashBuffer = await crypto.subtle.digest(hashName, dataBuffer);
  }

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  if (encoding === "hex") {
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  } else if (encoding === "base64") {
    return btoa(String.fromCharCode.apply(null, hashArray as unknown as number[]));
  }
  
  return hashArray.map(b => String.fromCharCode(b)).join("");
};
