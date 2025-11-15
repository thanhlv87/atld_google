// Firebase v9 Modular SDK
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  increment,
  arrayUnion,
  arrayRemove,
  QuerySnapshot,
  DocumentSnapshot,
  DocumentReference,
  CollectionReference,
  Query
} from 'firebase/firestore';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  type FirebaseStorage
} from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVkNiY3B4yIdCGH4afN8xnrQGP4-U685Q",
  authDomain: "gen-lang-client-013063590.firebaseapp.com",
  projectId: "gen-lang-client-0113063590",
  storageBucket: "gen-lang-client-0113063590.firebasestorage.app",
  messagingSenderId: "40246586993",
  appId: "1:402246586993:web:a2a3af0df097e2d5ae41d0"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Get Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Function to send email via Firestore extension
const sendEmail = async (to: string | string[], subject: string, html: string, text?: string) => {
  try {
    const mailCollection = collection(db, 'mail');
    const emailData = {
      to: to,
      message: {
        subject: subject,
        html: html,
        ...(text && { text: text })
      },
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(mailCollection, emailData);
    return docRef.id;
  } catch (error: any) {
    console.error('Error queuing email:', error);

    if (error.code === 'permission-denied') {
      console.error('PERMISSION DENIED: Firestore rules may not allow writing to "mail" collection');
    } else if (error.code === 'unauthenticated') {
      console.error('UNAUTHENTICATED: User may need to be signed in');
    }

    throw error;
  }
};

// Export Firebase services and utilities
export {
  app,
  db,
  auth,
  storage,
  sendEmail,
  // Firestore functions
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  increment,
  arrayUnion,
  arrayRemove,
  // Auth functions
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  // Storage functions
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  // Types
  type User,
  type Firestore,
  type Auth,
  type FirebaseStorage as Storage,
  type QuerySnapshot,
  type DocumentSnapshot,
  type DocumentReference,
  type CollectionReference,
  type Query
};

// Legacy compatibility exports (for gradual migration)
export const firebase = {
  firestore: {
    FieldValue: {
      serverTimestamp,
      arrayUnion,
      arrayRemove
    },
    Timestamp
  }
};
