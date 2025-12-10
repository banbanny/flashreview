export interface Question {
  id: string;
  question: string;
  answer: string;
}

export interface Reviewer {
  id: string;
  title: string;
  questions: Question[];
}
