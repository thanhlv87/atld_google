import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

// Firebase config - copy from your firebaseConfig.ts
const firebaseConfig = {
  apiKey: "AIzaSyCf5P3bEEJxqxo5Gu8OtQXdWM9NwYSA4eM",
  authDomain: "gen-lang-client-0113063590.firebaseapp.com",
  projectId: "gen-lang-client-0113063590",
  storageBucket: "gen-lang-client-0113063590.firebasestorage.app",
  messagingSenderId: "808783437931",
  appId: "1:808783437931:web:cbcea9cb98c14fe9f08eb3",
  measurementId: "G-F5VLX1M8VX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updatePartners() {
  try {
    console.log('Fetching all partners...');
    const partnersRef = collection(db, 'partners');
    const snapshot = await getDocs(partnersRef);

    console.log(`Found ${snapshot.size} partners`);

    let updated = 0;

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const updates: any = {};

      // Add missing fields with default values
      if (data.verified === undefined) {
        updates.verified = false;
      }

      if (data.featured === undefined) {
        updates.featured = false;
      }

      if (!data.businessName) {
        // Generate businessName from email
        const email = data.email || '';
        const emailPrefix = email.split('@')[0];
        const generatedName = emailPrefix
          .split(/[-_.]/)
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        updates.businessName = generatedName || 'Đối tác';
      }

      if (!data.description || data.description === 'description') {
        const capabilities = data.capabilities || [];
        if (capabilities.length > 0) {
          updates.description = `Đơn vị đào tạo chuyên về ${capabilities[0]} và các lĩnh vực an toàn lao động khác`;
        } else {
          updates.description = 'Đơn vị đào tạo an toàn lao động uy tín';
        }
      }

      if (!data.website) {
        updates.website = '';
      }

      // Only update if there are changes
      if (Object.keys(updates).length > 0) {
        console.log(`Updating partner ${docSnap.id}:`, updates);
        await updateDoc(doc(db, 'partners', docSnap.id), updates);
        updated++;
      }
    }

    console.log(`✅ Successfully updated ${updated} partners`);
  } catch (error) {
    console.error('Error updating partners:', error);
  }
}

// Run the update
updatePartners();
