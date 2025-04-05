// This is a default implementation that gets overridden by the platform-specific files
// dbImplementation.web.ts and dbImplementation.native.ts
import { APIKey } from './db.types';

// Export the placeholder functions
export const initDatabase = async (): Promise<boolean> => {
  console.warn('Using default database implementation. This should be overridden.');
  return true;
};

export const insertAPIKey = async (
  apiKey: Omit<APIKey, 'id' | 'createdAt' | 'updatedAt'>
): Promise<number> => {
  console.warn('Using default database implementation. This should be overridden.');
  return 0;
};

export const searchAPIKeys = async (query: string): Promise<APIKey[]> => {
  console.warn('Using default database implementation. This should be overridden.');
  return [];
};

export const getAllAPIKeys = async (): Promise<APIKey[]> => {
  console.warn('Using default database implementation. This should be overridden.');
  return [];
};

// Re-export the types
export { APIKey }; 