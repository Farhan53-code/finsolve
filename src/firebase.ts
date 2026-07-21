import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Direct Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC31Z3auemmmhEQbQ_IPdseW0sncObjCtk",
  authDomain: "invoice-generator-653a2.firebaseapp.com",
  databaseURL: "https://invoice-generator-653a2-default-rtdb.firebaseio.com",
  projectId: "invoice-generator-653a2",
  storageBucket: "invoice-generator-653a2.firebasestorage.app",
  messagingSenderId: "429543997108",
  appId: "1:429543997108:web:4468a19d307ef50dcc61e1",
  measurementId: "G-CH298M7BYG"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

export const getClientFirebase = () => {
  return { auth, db, provider };
};

export default app;
