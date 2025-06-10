// src/lib/server/tokenManager.ts
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import type { AppConfig } from '../../types/config.js';
import { encryptToken, decryptToken } from '$lib/utils/encryption.js';

// Get directory path that's outside your public directory
const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, '../../../data/config.json');

// Default empty config
const DEFAULT_CONFIG: AppConfig = {
  clientId: '',
  clientSecret: '',
  tenantId: '',
};

// Create directory if it doesn't exist
const ensureConfigDir = () => {
  const dir = dirname(CONFIG_PATH);
  console.log('Ensuring config directory exists:', dir);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
};

// Save config to file
export function saveConfig(config: AppConfig): void {
  try {
    ensureConfigDir();
    // Encrypt sensitive fields
    config.clientSecret = encryptToken(config.clientSecret);
    config.tenantId = encryptToken(config.tenantId);
    config.clientId = encryptToken(config.clientId);
    // Write the config to fil
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to save configuration:', error);
    throw new Error('Could not save configuration');
  }
}

// Read config from file
export function getConfig(): AppConfig {
  try {
    if (existsSync(CONFIG_PATH)) {
      const data = readFileSync(CONFIG_PATH, 'utf8');
      const config: AppConfig = JSON.parse(data);
      try {
        config.clientSecret = decryptToken(config.clientSecret);
        config.tenantId = decryptToken(config.tenantId);
        config.clientId = decryptToken(config.clientId);
      } catch (decryptionError) {
        console.error('Failed to decrypt configuration:', decryptionError);
        throw new Error('Decryption failed');
      }
      return config;
    }
    return DEFAULT_CONFIG;
  } catch (error) {
    console.error('Failed to read configuration:', error);
    return DEFAULT_CONFIG;
  }
}

// Check if config is valid/complete
export function hasValidConfig(): boolean {
  const config = getConfig();
  return !!(
    config.clientId && 
    config.clientSecret && 
    config.tenantId 
  );
}


