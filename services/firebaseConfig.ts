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
    console.log('📧 Creating email document in Firestore...');
    console.log('Recipients:', to);
    console.log('Subject:', subject);

    const mailRef = db.collection('mail').doc();
    const emailData = {
      to: to,
      message: {
        subject: subject,
        html: html,
        ...(text && { text: text })
      },
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    console.log('Email data to be saved:', {
      to: emailData.to,
      subject: emailData.message.subject,
      hasHtml: !!emailData.message.html
    });

    await mailRef.set(emailData);

    console.log('✅ Email queued successfully with ID:', mailRef.id);
    console.log('📝 Check Firestore collection "mail" to see the document');

    return mailRef.id;
  } catch (error: any) {
    console.error('❌ Error queuing email:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);

    if (error.code === 'permission-denied') {
      console.error('⚠️ PERMISSION DENIED: Firestore rules may not allow writing to "mail" collection');
      console.error('👉 Please check and deploy firestore.rules file');
    } else if (error.code === 'unauthenticated') {
      console.error('⚠️ UNAUTHENTICATED: User may need to be signed in');
    }

    throw error;
  }
};

export { db, auth, storage, firebase, sendEmail };