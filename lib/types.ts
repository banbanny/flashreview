// lib/types.ts
export interface Question {
  id: string;
  question: string;
  answer: string;
}

export interface Reviewer {
  id: string;               // Frontend UUID
  title: string;
  questions: Question[];
  firestoreId?: string;     // Firestore document ID (optional)
}
