// app/types.ts
export type Question = {
  id: string;
  question: string;
  answer: string;
};

export type Reviewer = {
  id: string;
  title: string;
  questions: Question[];
};
