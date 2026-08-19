import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCsAxhSbyYfl0JWZqEMCe17epmrz6OzPtk",
  authDomain: "khth-theodoicongviec.firebaseapp.com",
  projectId: "khth-theodoicongviec",
  storageBucket: "khth-theodoicongviec.firebasestorage.app",
  messagingSenderId: "568400718526",
  appId: "1:568400718526:web:aff790e1ea4723df054cef",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
