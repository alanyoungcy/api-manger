import { APIKey } from './db.types';

export function initDatabase(): Promise<boolean>;
export function insertAPIKey(apiKey: Omit<APIKey, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
export function searchAPIKeys(query: string): Promise<APIKey[]>;
export function getAllAPIKeys(): Promise<APIKey[]>;
export { APIKey }; 