// /lib/auth.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { auth, db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";
import uuid from "react-native-uuid";

type UserData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  createdAt?: any;
  role?: string;
};

type Questionnaire = {
  questionnaireId: string;
  title: string;
  questions: any[]; // change to typed structure if you want
  createdAt?: any;
};

type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  signOutUser: () => Promise<void>;
  createQuestionnaire: (uid: string, payload: Omit<Questionnaire, "questionnaireId" | "createdAt">) => Promise<string>;
  getUserQuestionnaires: (uid: string) => Promise<Questionnaire[]>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      setUserData(null);
      setLoading(false);
      return;
    }

    setUser(firebaseUser);

    try {
      const ref = doc(db, "reviewers", firebaseUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        setUserData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || firebaseUser.email || "",
          role: data.role || "reviewer",
        });
      } else {
        // Only used if Firestore somehow failed
        const display = firebaseUser.displayName?.split(" ") || ["", ""];
        setUserData({
          firstName: display[0] || "",
          lastName: display.slice(1).join(" ") || "",
          email: firebaseUser.email || "",
        });
      }

    } catch (error) {
      console.log("Error loading user data:", error);
      setUserData({
        firstName: "",
        lastName: "",
        email: firebaseUser.email || "",
      });
    }

    setLoading(false);
  });

  return unsubscribe;
}, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = result.user;

      // Update displayName on auth user
      await updateProfile(newUser, { displayName: `${firstName} ${lastName}` });

      // Save reviewer profile to Firestore under "reviewers" collection
      await setDoc(doc(db, "reviewers", newUser.uid), {
        firstName,
        lastName,
        email,
        createdAt: serverTimestamp(),
        role: "reviewer",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  // QUESTIONNAIRE HELPERS
  const createQuestionnaire = async (uid: string, payload: Omit<Questionnaire, "questionnaireId" | "createdAt">) => {
    // create unique id
    const qId = uuid.v4() as string;
    const docRef = doc(db, "reviewers", uid, "questionnaires", qId);
    await setDoc(docRef, {
      questionnaireId: qId,
      ...payload,
      createdAt: serverTimestamp(),
    });
    return qId;
  };

  const getUserQuestionnaires = async (uid: string) => {
    const qSnap = await getDocs(query(collection(db, "reviewers", uid, "questionnaires"), orderBy("createdAt", "desc")));
    const arr: Questionnaire[] = qSnap.docs.map((d) => {
      const data = d.data() as DocumentData;
      return {
        questionnaireId: data.questionnaireId || d.id,
        title: data.title || "",
        questions: data.questions || [],
        createdAt: data.createdAt || null,
      };
    });
    return arr;
  };

  return (
    <AuthContext.Provider
      value={{ user, userData, loading, signIn, signUp, signOutUser, createQuestionnaire, getUserQuestionnaires }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
