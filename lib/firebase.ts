import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAiD6jTRnwfmzReX9G-hsvAsOV9vJgIxzQ",
  authDomain: "ceo-assistant-5e689.firebaseapp.com",
  projectId: "ceo-assistant-5e689",
  storageBucket: "ceo-assistant-5e689.firebasestorage.app",
  messagingSenderId: "301057146029",
  appId: "1:301057146029:web:8a17cebfc1b810700e5a24",
  measurementId: "G-4X0MWC92QN"
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
let analytics;

// Only initialize analytics on the client side
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, analytics }; 