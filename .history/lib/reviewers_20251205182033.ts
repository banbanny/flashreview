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
import { getAuth } from "firebase/auth";

export interface Reviewer {
  firestoreId?: string;
  title: string;
  questions: { id: string; question: string; answer: string }[];
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

// Create new reviewer
export const saveReviewer = async (
  reviewer: Omit<Reviewer, "firestoreId">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "reviewers"), reviewer);
  return docRef.id;
};

// Update reviewer
export const updateReviewer = async (
  firestoreId: string,
  reviewer: Partial<Reviewer>
): Promise<void> => {
  await updateDoc(doc(db, "reviewers", firestoreId), reviewer);
};

// Load reviewers for one user
export const loadReviewers = async (uid: string): Promise<Reviewer[]> => {
  const q = query(collection(db, "reviewers"), where("userId", "==", uid));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((d) => ({
    firestoreId: d.id,
    ...(d.data() as Omit<Reviewer, "firestoreId">),
  }));
};

// Delete reviewer
export const deleteReviewer = async (firestoreId: string) => {
  if (!firestoreId) throw new Error("Missing ID");

  try {
    console.log("Firestore deleting:", firestoreId);

    await deleteDoc(doc(db, "reviewers", firestoreId));

    console.log("Firestore delete success");
  } catch (err) {
    console.error("Delete ERROR:", err);
    throw err;
  }
};
