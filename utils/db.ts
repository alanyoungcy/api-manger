// This file serves as a convenient entry point to the database utilities
// It re-exports from the platform-specific implementations:
// - dbImplementation.native.ts for iOS/Android
// - dbImplementation.web.ts for web

export { 
  initDatabase,
  insertAPIKey,
  searchAPIKeys,
  getAllAPIKeys,
  APIKey
} from './dbImplementation';