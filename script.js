const auth = firebase.auth();
const db = firebase.firestore();
let user = null;

async function register() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    const uid = cred.user.uid;

    await db.collection("users").doc(uid).set({
      email,
      role,
      wallet: generateWallet(),
      spk: 20,
      kindness: 0,
      btc: 0
    });

    alert("Registered! You can now log in.");
  } catch (err) {
    alert("Error: " + err.message);
  }
}

async function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  try {
    const cred = await auth.signInWithEmailAndPassword(email, pass);
    const uid = cred.user.uid;
    const doc = await db.collection("users").doc(uid).get();

    user = { uid, ...doc.data() };
    document.getElementById("auth").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    updateUI();
  } catch (err) {
    alert("Login failed: " + err.message);
  }
}

async function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    const uid = result.user.uid;
    const docRef = db.collection("users").doc(uid);
    const doc = await docRef.get();

    if (!doc.exists) {
      const role = prompt("Are you a student or teacher?");
      await docRef.set({
        email: result.user.email,
        role: role || "student",
        wallet: generateWallet(),
        spk: 20,
        kindness: 0,
        btc: 0
      });
    }

    const userDoc = await docRef.get();
    user = { uid, ...userDoc.data() };

    document.getElementById("auth").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    updateUI();
  } catch (err) {
    alert("Google Sign-In Failed: " + err.message);
  }
}

function logout() {
  auth.signOut();
  user = null;
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("auth").style.display = "block";
}

function generateWallet() {
  return "SPK-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function updateUI() {
  document.getElementById("user-name").innerText = user.email;
  document.getElementById("wallet-address").innerText = user.wallet;
  document.getElementById("spk-balance").innerText = user.spk;
  document.getElementById("btc-balance").innerText = user.btc;
  document.getElementById("kindness").innerText = user.kindness;
}

async function earnKindness() {
  user.kindness += 1;
  user.spk += 5;
  await db.collection("users").doc(user.uid).update({
    kindness: user.kindness,
    spk: user.spk
  });
  updateUI();
  alert("Kind deed! +5 SPK");
}

async function answerQuiz(correct) {
  if (correct) {
    user.btc += 0.0001;
    await db.collection("users").doc(user.uid).update({
      btc: user.btc
    });
    alert("Correct! +0.0001 BTC");
  } else {
    alert("Oops! Try again.");
  }
  updateUI();
}

async function buyPerk(item, cost) {
  if (user.spk >= cost) {
    user.spk -= cost;
    await db.collection("users").doc(user.uid).update({
      spk: user.spk
    });
    updateUI();
    alert("You bought: " + item);
  } else {
    alert("Not enough SPK!");
  }
}

