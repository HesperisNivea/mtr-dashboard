import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = process.env.VITE_STORAGE_SECRET_KEY || crypto.randomBytes(32); // Ensure this is a 32-byte key
const iv = crypto.randomBytes(16); // Initialization vector

/**
 * Encrypts a token.
 * @param token - The token to encrypt.
 * @returns The encrypted token in base64 format.
 */
export function encryptToken(token: string): string {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(token, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return `${iv.toString('base64')}:${encrypted}`;
}

/**
 * Decrypts an encrypted token.
 * @param encryptedToken - The encrypted token in base64 format.
 * @returns The original token.
 */
export function decryptToken(encryptedToken: string): string {
    const [ivBase64, encrypted] = encryptedToken.split(':');
    const ivBuffer = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv(algorithm, secretKey, ivBuffer);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

