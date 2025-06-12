import crypto from 'crypto';
import { env } from "$env/dynamic/private";


const algorithm = 'aes-256-cbc';
// Ensure the secret key is 32 bytes long for AES-256
const secretKey = Buffer.from(env.STORAGE_SECRET_KEY, 'base64');


/**
 * Encrypts a token.
 * @param token - The token to encrypt.
 * @returns The encrypted token in base64 format.
 */
export function encryptToken(token: string): string {
    const iv = crypto.randomBytes(16); // Generate a unique IV for each encryption
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(token, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return `${iv.toString('base64')}:${encrypted}`; // Include the IV in the output
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

