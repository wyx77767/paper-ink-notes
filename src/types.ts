export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export type SaveStatus = 'saved' | 'saving';
