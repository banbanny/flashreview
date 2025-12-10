// lib/reviewers.ts
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "./firebase";

// Reviewer type definition
export interface Reviewer {
  firestoreId?: string;
  title: string;
  questions: { id: string; question: string; answer: string }[];
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

// ✅ Save a new reviewer
export const saveReviewer = async (
  reviewer: Omit<Reviewer, "firestoreId">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "reviewers"), reviewer);
  console.log("Reviewer saved:", docRef.id);
  return docRef.id;
};

// ✅ Update reviewer by ID
export const updateReviewer = async (
  firestoreId: string,
  reviewer: Partial<Reviewer>
): Promise<void> => {
  const ref = doc(db, "reviewers", firestoreId);
  await updateDoc(ref, reviewer);
  console.log("Reviewer updated:", firestoreId);
};

// ✅ Load reviewers for a specific user
export const loadReviewers = async (uid: string): Promise<Reviewer[]> => {
  const q = query(collection(db, "reviewers"), where("userId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    firestoreId: d.id,
    ...(d.data() as Omit<Reviewer, "firestoreId">),
  }));
};

// ✅ Delete reviewer + questions
export const deleteReviewer = async (firestoreId: string) => {
  if (!firestoreId) throw new Error("Missing reviewer Firestore ID");

  const reviewerRef = doc(db, "reviewers", firestoreId);

  // Delete all questions in subcollection
  const questionsCol = collection(db, "reviewers", firestoreId, "questions");
  const questionsSnap = await getDocs(questionsCol);
  const deleteQuestions = questionsSnap.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(deleteQuestions);
  console.log("All questions deleted for reviewer:", firestoreId);

  // Delete the reviewer document itself
  await deleteDoc(reviewerRef);
  console.log("Reviewer deleted:", firestoreId);
};
