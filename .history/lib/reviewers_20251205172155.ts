import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
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
import { getAuth } from "firebase/auth";

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
// Delete reviewer
const handleDelete = (firestoreId?: string) => {
  console.log("🔵 handleDelete called with:", firestoreId);

  if (!firestoreId) {
    console.log("❌ No Firestore ID provided, aborting delete.");
    Alert.alert("Error", "No Firestore ID provided.");
    return;
  }

  const executeDelete = async () => {
    try {
      console.log("🟢 Attempting to delete reviewer:", firestoreId);
      await deleteReviewer(firestoreId);
      console.log("✅ Reviewer deleted successfully:", firestoreId);

      setSets((prev) => prev.filter((p) => p.firestoreId !== firestoreId));
      Alert.alert("Deleted", "Reviewer removed successfully.");
    } catch (err) {
      console.error("🔥 Delete error:", err);
      Alert.alert("Error", "Failed to delete reviewer.");
    }
  };

  Alert.alert(
    "Confirm delete",
    "Are you sure you want to delete this reviewer?",
    [
      { text: "Cancel", style: "cancel", onPress: () => console.log("⚪ Delete cancelled") },
      { text: "Delete", style: "destructive", onPress: executeDelete },
    ]
  );
};
