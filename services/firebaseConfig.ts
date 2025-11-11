import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

// Your Firebase configuration object. 
// This should be replaced with your actual Firebase project configuration.
const firebaseConfig = {
  apiKey: "AIzaSyBVkNiY3B4yIdCGH4afN8xnrQGP4-U685Q",
  authDomain: "gen-lang-client-013063590.firebaseapp.com",
  projectId: "gen-lang-client-0113063590",
  storageBucket: "gen-lang-client-0113063590.firebasestorage.app",
  messagingSenderId: "40246586993",
  appId: "1:402246586993:web:a2a3af0df097e2d5ae41d0"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get Firebase services
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Function to send email via Firestore extension
const sendEmail = async (to: string | string[], subject: string, html: string, text?: string) => {
  try {
    const mailRef = db.collection('mail').doc();
    await mailRef.set({
      to: to,
      message: {
        subject: subject,
        html: html,
        ...(text && { text: text })
      }
    });
    console.log('Email queued for sending with ID:', mailRef.id);
    return mailRef.id;
  } catch (error) {
    console.error('Error queuing email:', error);
    throw error;
  }
};

export { db, auth, storage, firebase, sendEmail };