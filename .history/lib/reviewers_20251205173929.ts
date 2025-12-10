import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
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

// ✅ Save a new reviewer to Firestore
export const saveReviewer = async (
  reviewer: Omit<Reviewer, "firestoreId">
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "reviewers"), reviewer);
    console.log("Reviewer saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("🔥 Error saving reviewer:", error);
    throw new Error("Failed to save reviewer");
  }
};

// ✅ Update reviewer by Firestore ID
export const updateReviewer = async (
  firestoreId: string,
  reviewer: Partial<Reviewer>
): Promise<void> => {
  try {
    const ref = doc(db, "reviewers", firestoreId);
    await updateDoc(ref, reviewer);
    console.log(`Reviewer ${firestoreId} updated successfully.`);
  } catch (error) {
    console.error("🔥 Error updating reviewer:", error);
    throw new Error("Failed to update reviewer");
  }
};

// ✅ Load all reviewers for a specific user
export const loadReviewers = async (uid: string): Promise<Reviewer[]> => {
  try {
    const q = query(collection(db, "reviewers"), where("userId", "==", uid));
    const querySnapshot = await getDocs(q);
    const reviewers: Reviewer[] = querySnapshot.docs.map((d) => ({
      firestoreId: d.id,
      ...(d.data() as Omit<Reviewer, "firestoreId">),
    }));
    return reviewers;
  } catch (error) {
    console.error("🔥 Error loading reviewers:", error);
    throw new Error("Failed to load reviewers");
  }
};

// ✅ Delete reviewer and its questionnaires
// Delete reviewer by Firestore ID
export const deleteReviewer = async (firestoreId: string) => {
  if (!firestoreId) throw new Error("Missing reviewer Firestore ID");

  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  try {
    // Fetch the reviewer document to verify ownership
    const reviewerDoc = await getDoc(doc(db, "reviewers", firestoreId));
    if (!reviewerDoc.exists()) {
      throw new Error("Reviewer not found");
    }
    const reviewerData = reviewerDoc.data();
    if (reviewerData.userId !== user.uid) {
      throw new Error("Unauthorized: You can only delete your own reviewers");
    }

    // Delete the reviewer itself
    await deleteDoc(doc(db, "reviewers", firestoreId));

    console.log(`Reviewer ${firestoreId} deleted successfully.`);
  } catch (err) {
    console.error("Failed to delete reviewer:", err);
    throw err;
  }
};
