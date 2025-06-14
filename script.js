let user = {};

function generateWallet() {
  return 'SPK-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function login() {
  const name = document.getElementById('username').value;
  const role = document.getElementById('role').value;
  if (!name) return alert("Enter your name!");

  user = {
    name,
    role,
    wallet: generateWallet(),
    spk: 20,
    kindness: 0,
    btc: 0,
  };

  document.getElementById('login').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  updateUI();
}

function updateUI() {
  document.getElementById('user-name').innerText = user.name;
  document.getElementById('wallet-address').innerText = user.wallet;
  document.getElementById('spk-balance').innerText = user.spk;
  document.getElementById('kindness').innerText = user.kindness;
  document.getElementById('btc-balance').innerText = user.btc;
}

function showQuiz() {
  document.getElementById('quiz').style.display = 'block';
}

function answerQuiz(correct) {
  document.getElementById('quiz').style.display = 'none';
  if (correct) {
    user.btc += 0.0001;
    alert("✅ Correct! You earned 0.0001 BTC.");
  } else {
    alert("❌ Oops! Try again next time.");
  }
  updateUI();
}

function earnKindness() {
  user.kindness += 1;
  user.spk += 5;
  alert("You earned 5 SPK for being kind!");
  updateUI();
}

function openShop() {
  document.getElementById('shop').style.display = 'block';
}

function closeShop() {
  document.getElementById('shop').style.display = 'none';
}

function buyPerk(item, cost) {
  if (user.spk >= cost) {
    user.spk -= cost;
    alert(`You bought: ${item}`);
    updateUI();
  } else {
    alert("Not enough SPK!");
  }
}

function logout() {
  user = {};
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('login').style.display = 'block';
}
