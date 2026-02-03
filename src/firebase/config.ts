import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBq4lHWqzr6-CDaTbb-zbvYekLCfe8LgoA",
  authDomain: "venus-bb5f3.firebaseapp.com",
  projectId: "venus-bb5f3",
  storageBucket: "venus-bb5f3.firebasestorage.app",
  messagingSenderId: "156818982017",
  appId: "1:156818982017:web:46926a6b9599644cf53980",
  measurementId: "G-YGEEM0E811"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
