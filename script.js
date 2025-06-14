// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// 🔐 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAFI1haj8xAXQ3R70Sfn6q-4X9TYt2UrTs",
  authDomain: "smartypants-kids-pointsystem.firebaseapp.com",
  projectId: "smartypants-kids-pointsystem",
  storageBucket: "smartypants-kids-pointsystem.firebasestorage.app",
  messagingSenderId: "111102049554",
  appId: "1:111102049554:web:8f8feb81d3a5813dcc07cb"
};

// 🔧 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// 🎓 Get selected role from dropdown
function getSelectedRole() {
  const roleEl = document.getElementById("role");
  return roleEl ? roleEl.value : "student";
}

// 🔐 Sign in with Google
window.signInWithGoogle = async function () {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const role = getSelectedRole();
    await setupUserDoc(user, role);
  } catch (error) {
    console.error("Google sign-in error:", error);
  }
};

// 📧 Sign in or register with Email
document.getElementById("email-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = getSelectedRole();

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await setupUserDoc(result.user, role);
  } catch (signInError) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await setupUserDoc(result.user, role);
    } catch (signUpError) {
      console.error("Could not sign in or register:", signUpError.message);
      alert("Error: " + signUpError.message);
    }
  }
});

// 🗃️ Create or update user document in Firestore
async function setupUserDoc(user, role) {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      name: user.displayName || "Email User",
      email: user.email,
      role: role,
      spkBalance: 0,
      createdAt: new Date()
    });
    console.log("User document created in Firestore.");
  }

  // Redirect based on role
  if (role === "student") {
    window.location.href = "student.html";
  } else if (role === "teacher") {
    window.location.href = "teacher.html";
  }
}

// 🚪 Sign out
window.signOutUser = async function () {
  await signOut(auth);
};

// 🔁 Watch for auth changes and redirect if already signed in
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const data = userDoc.data();
    const role = data?.role || "student";

    if (window.location.pathname.endsWith("index.html")) {
      // Only redirect if on login page
      if (role === "student") {
        window.location.href = "student.html";
      } else if (role === "teacher") {
        window.location.href = "teacher.html";
      }
    }
  }
});


    signOutBtn.style.display = "none";
  }
});

