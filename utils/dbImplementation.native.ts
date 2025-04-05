import * as SQLite from 'expo-sqlite';
import { APIKey } from './db.types';

// Native SQLite implementation
class NativeStorage {
  private db: any;

  constructor() {
    try {
      // Check which API is available in the current Expo SDK version
      // Use bracket notation to avoid TypeScript errors
      // @ts-ignore - Ignore TypeScript checking on property access
      if (SQLite['openDatabase']) {
        // @ts-ignore
        this.db = SQLite['openDatabase']('apikeys.db');
      } else if (SQLite.openDatabaseSync) {
        this.db = SQLite.openDatabaseSync('apikeys.db');
      } else {
        throw new Error('No compatible SQLite API found');
      }

      // Verify the database has the transaction method
      if (!this.db || typeof this.db.transaction !== 'function') {
        throw new Error('Database does not have transaction method');
      }
    } catch (error) {
      console.error('Error opening SQLite database:', error);
      // Create a fallback local storage implementation for native
      this.db = null;
      console.warn('SQLite failed to initialize, falling back to in-memory storage');
    }
  }

  async init(): Promise<boolean> {
    // If db initialization failed, just return success
    if (!this.db) {
      return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      try {
        this.db.transaction((tx: any) => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS api_keys (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              key TEXT NOT NULL,
              organization TEXT,
              projectId TEXT,
              description TEXT,
              createdAt TEXT NOT NULL,
              updatedAt TEXT NOT NULL
            )`,
            [],
            () => resolve(true),
            (_: any, error: any) => {
              reject(error);
              return false;
            }
          );
        });
      } catch (error) {
        console.error('Error in init transaction:', error);
        reject(error);
      }
    });
  }

  // Store in-memory data if SQLite fails
  private inMemoryKeys: APIKey[] = [];
  private keyCounter = 0;

  async insertKey(apiKey: Omit<APIKey, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date().toISOString();

    // If SQLite failed, use in-memory storage
    if (!this.db) {
      const newId = ++this.keyCounter;
      this.inMemoryKeys.push({
        id: newId,
        ...apiKey,
        createdAt: now,
        updatedAt: now
      });
      return Promise.resolve(newId);
    }

    return new Promise<number>((resolve, reject) => {
      try {
        this.db.transaction((tx: any) => {
          tx.executeSql(
            `INSERT INTO api_keys (name, key, organization, projectId, description, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [apiKey.name, apiKey.key, apiKey.organization, apiKey.projectId, apiKey.description, now, now],
            (_: any, result: any) => resolve(result.insertId),
            (_: any, error: any) => {
              reject(error);
              return false;
            }
          );
        });
      } catch (error) {
        console.error('Error in insertKey transaction:', error);
        reject(error);
      }
    });
  }

  async search(query: string): Promise<APIKey[]> {
    // If SQLite failed, use in-memory storage
    if (!this.db) {
      const lowerQuery = query.toLowerCase();
      return Promise.resolve(
        this.inMemoryKeys.filter(key => 
          key.name.toLowerCase().includes(lowerQuery) ||
          (key.organization && key.organization.toLowerCase().includes(lowerQuery)) ||
          (key.description && key.description.toLowerCase().includes(lowerQuery))
        ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      );
    }

    return new Promise<APIKey[]>((resolve, reject) => {
      try {
        this.db.transaction((tx: any) => {
          tx.executeSql(
            `SELECT * FROM api_keys 
             WHERE name LIKE ? OR organization LIKE ? OR description LIKE ?
             ORDER BY updatedAt DESC`,
            [`%${query}%`, `%${query}%`, `%${query}%`],
            (_: any, result: any) => resolve(result.rows._array),
            (_: any, error: any) => {
              reject(error);
              return false;
            }
          );
        });
      } catch (error) {
        console.error('Error in search transaction:', error);
        reject(error);
      }
    });
  }

  async getAll(): Promise<APIKey[]> {
    // If SQLite failed, use in-memory storage
    if (!this.db) {
      return Promise.resolve([...this.inMemoryKeys].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ));
    }

    return new Promise<APIKey[]>((resolve, reject) => {
      try {
        this.db.transaction((tx: any) => {
          tx.executeSql(
            'SELECT * FROM api_keys ORDER BY updatedAt DESC',
            [],
            (_: any, result: any) => resolve(result.rows._array),
            (_: any, error: any) => {
              reject(error);
              return false;
            }
          );
        });
      } catch (error) {
        console.error('Error in getAll transaction:', error);
        resolve([]);  // Return empty array on error
      }
    });
  }
}

// Single instance of NativeStorage
const storage = new NativeStorage();

// Export the functions for the common API
export const initDatabase = () => storage.init();
export const insertAPIKey = (apiKey: Omit<APIKey, 'id' | 'createdAt' | 'updatedAt'>) => 
  storage.insertKey(apiKey);
export const searchAPIKeys = (query: string) => storage.search(query);
export const getAllAPIKeys = () => storage.getAll();

// Re-export the types
export { APIKey }; 