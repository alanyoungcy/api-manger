// Common interface for our data operations across platforms
export interface APIKey {
  id: number;
  name: string;
  key: string;
  organization?: string;
  projectId?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
} 