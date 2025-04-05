import { APIKey } from './db.types';

// Web storage implementation using localStorage
class WebStorage {
  private storageKey = 'api_keys_storage';
  private keyCounter = 0;
  private apiKeys: APIKey[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        this.apiKeys = JSON.parse(storedData);
        // Find the highest ID to set our counter
        if (this.apiKeys.length > 0) {
          this.keyCounter = Math.max(...this.apiKeys.map(key => key.id));
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      this.apiKeys = [];
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.apiKeys));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  async init(): Promise<boolean> {
    // Nothing to do for web storage implementation
    return Promise.resolve(true);
  }

  async insertKey(apiKey: Omit<APIKey, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date().toISOString();
    const newId = ++this.keyCounter;
    
    const newKey: APIKey = {
      id: newId,
      ...apiKey,
      createdAt: now,
      updatedAt: now
    };
    
    this.apiKeys.push(newKey);
    this.saveToLocalStorage();
    
    return newId;
  }

  async search(query: string): Promise<APIKey[]> {
    const lowerQuery = query.toLowerCase();
    return this.apiKeys.filter(key => 
      key.name.toLowerCase().includes(lowerQuery) ||
      (key.organization && key.organization.toLowerCase().includes(lowerQuery)) ||
      (key.description && key.description.toLowerCase().includes(lowerQuery))
    ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getAll(): Promise<APIKey[]> {
    return [...this.apiKeys].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }
}

// Single instance of WebStorage
const storage = new WebStorage();

// Export the functions for the common API
export const initDatabase = () => storage.init();
export const insertAPIKey = (apiKey: Omit<APIKey, 'id' | 'createdAt' | 'updatedAt'>) => 
  storage.insertKey(apiKey);
export const searchAPIKeys = (query: string) => storage.search(query);
export const getAllAPIKeys = () => storage.getAll();

// Re-export the types
export { APIKey }; 