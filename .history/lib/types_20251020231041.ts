export interface Question {
  id: string;
  question: string;
  answer: string;
}

export interface Reviewer {
  id: string;               // frontend ID (uuid)
  title: string;
  questions: Question[];
  firestoreId?: string;     // ✅ Firestore document ID (optional)
}
