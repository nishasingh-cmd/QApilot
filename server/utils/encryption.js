import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";

// Helper to get an encryption key of 32 bytes from JWT_SECRET or a fallback
const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || "fallback_secret_key_minimum_32_bytes_long";
  return crypto.createHash("sha256").update(String(secret)).digest();
};

export const encrypt = (text) => {
  if (!text) return null;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getSecretKey(), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

export const decrypt = (text) => {
  if (!text) return null;
  try {
    const parts = text.split(":");
    if (parts.length !== 2) return null;
    const [ivHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, getSecretKey(), iv);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error.message);
    return null;
  }
};

export default { encrypt, decrypt };
