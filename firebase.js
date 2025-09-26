// Firebase Configuration
// Import and initialize Firebase services
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  addDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqxSWug9EmnFzZNPKkUvNAMQfuCs7SheE",
  authDomain: "gamanrehab-1785e.firebaseapp.com",
  projectId: "gamanrehab-1785e",
  storageBucket: "gamanrehab-1785e.firebasestorage.app",
  messagingSenderId: "722017105818",
  appId: "1:722017105818:web:6c5cdd70ee61d8bbba2c23",
  measurementId: "G-WZ4YGMCMCB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('🔥 Firebase app initialized');

const auth = getAuth(app);
console.log('🔑 Firebase auth initialized');

// Set authentication persistence to LOCAL (persists across browser sessions)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('✅ Authentication persistence set to LOCAL');
  })
  .catch((error) => {
    console.error('❌ Error setting auth persistence:', error);
  });

const db = getFirestore(app);
console.log('📊 Firestore initialized');

// Make Firebase services available globally for backend service
window.db = db;
window.firebase = {
  auth,
  db,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc
};

console.log('🌐 Firebase services made globally available');

// Export Firebase services for use in other files
export { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged, 
  signOut, 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  addDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  setPersistence,
  browserLocalPersistence
};
