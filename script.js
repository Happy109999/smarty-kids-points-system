// Firebase SDK imports for module usage
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Your Firebase config - REPLACE these with your own project's values!
const firebaseConfig = {
  apiKey: "AIzaSyAFI1haj8xAXQ3R70Sfn6q-4X9TYt2UrTs",
  authDomain: "smartypants-kids-pointsystem.firebaseapp.com",
  projectId: "smartypants-kids-pointsystem",
  storageBucket: "smartypants-kids-pointsystem.firebasestorage.app",
  messagingSenderId: "111102049554",
  appId: "1:111102049554:web:8f8feb81d3a5813dcc07cb"
};

// Initialize Firebase app and services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Sign in with Google popup
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Signed in:", user.email);

    // Create user document if doesn't exist
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        createdAt: new Date()
      });
      console.log("User document created.");
    } else {
      console.log("User document exists.");
    }
  } catch (error) {
    console.error("Google sign-in error:", error);
  }
}

// Sign out user
export async function signOutUser() {
  await signOut(auth);
  console.log("User signed out");
}

// Listen for auth state changes and update UI
onAuthStateChanged(auth, (user) => {
  const userInfoEl = document.getElementById("user-info");
  const signInBtn = document.getElementById("sign-in-btn");
  const signOutBtn = document.getElementById("sign-out-btn");

  if (user) {
    userInfoEl.textContent = `Hello, ${user.displayName} (${user.email})`;
    signInBtn.style.display = "none";
    signOutBtn.style.display = "inline-block";
  } else {
    userInfoEl.textContent = "Not signed in";
    signInBtn.style.display = "inline-block";
    signOutBtn.style.display = "none";
  }
});

