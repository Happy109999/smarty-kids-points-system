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

// 🔐 Your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyAFI1haj8xAXQ3R70Sfn6q-4X9TYt2UrTs",
  authDomain: "smartypants-kids-pointsystem.firebaseapp.com",
  projectId: "smartypants-kids-pointsystem",
  storageBucket: "smartypants-kids-pointsystem.firebasestorage.app",
  messagingSenderId: "111102049554",
  appId: "1:111102049554:web:8f8feb81d3a5813dcc07cb"
};

// 🔧 Firebase setup
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// 📛 Get selected role
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

// 📧 Email sign in or register
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
      console.error("Could not sign in or register:", signUpError);
    }
  }
});

// 🗃️ Set up user in Firestore
async function setupUserDoc(user, role) {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      name: user.displayName || "Email User",
      email: user.email,
      role: role,
      createdAt: new Date()
    });
    console.log("User document created.");
  }
}

// 🚪 Sign out
window.signOutUser = async function () {
  await signOut(auth);
};

// 🔁 Auth state listener
onAuthStateChanged(auth, async (user) => {
  const userInfo = document.getElementById("user-info");
  const signOutBtn = document.getElementById("sign-out-btn");
  const googleBtn = document.getElementById("google-btn");
  const emailForm = document.getElementById("email-form");

  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const data = userDoc.data();
    const role = data?.role || "student";

    userInfo.textContent = `Hello, ${user.displayName || "User"} (${user.email}) - Role: ${role}`;
    signOutBtn.style.display = "inline-block";
    googleBtn.style.display = "none";
    emailForm.style.display = "none";
  } else {
    userInfo.textContent = "Not signed in";
    signOutBtn.style.display = "none";
    googleBtn.style.display = "inline-block";
    emailForm.style.display = "block";
  }
});

    signOutBtn.style.display = "none";
  }
});

