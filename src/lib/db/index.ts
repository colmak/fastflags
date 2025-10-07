// Database instance - single source of truth for database operations
// To switch databases, just swap the adapter implementation

import { db as firestore } from "../firebase";
import { FirebaseAdapter } from "./firebase-adapter";
import type { DatabaseAdapter } from "./interface";

// Export the database adapter instance
// To switch to a different database (e.g., PostgreSQL, Supabase):
// 1. Create a new adapter implementing DatabaseAdapter interface
// 2. Import and use it here instead of FirebaseAdapter
// 3. No other code changes needed!

export const db: DatabaseAdapter = new FirebaseAdapter(firestore);

// Re-export types for convenience
export type * from "./types";
export type { DatabaseAdapter } from "./interface";
