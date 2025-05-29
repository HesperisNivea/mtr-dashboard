// src/lib/server/tokenManager.ts
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import type { AppConfig } from '../../types/config.js';

// Get directory path that's outside your public directory
const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, '../../../data/config.json');

// Default empty config
const DEFAULT_CONFIG: AppConfig = {
  clientId: '',
  clientSecret: '',
  tenantId: '',
  userId: ''
};

// Create directory if it doesn't exist
const ensureConfigDir = () => {
  const dir = dirname(CONFIG_PATH);
  if (!existsSync(dir)) {
    // You'll need to import and use mkdir from fs
    // mkdir(dir, { recursive: true });
  }
};

// Save config to file
export function saveConfig(config: AppConfig): void {
  try {
    ensureConfigDir();
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
      return JSON.parse(data);
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
    config.tenantId && 
    config.userId
  );
}