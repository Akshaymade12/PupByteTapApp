let coins = parseInt(localStorage.getItem("coins")) || 0;
let profitPerHour = parseInt(localStorage.getItem("profit")) || 0;
let currentLevel = parseInt(localStorage.getItem("level")) || 1;

const levelTargets = {
  1: 1000,
  2: 5000,
  3: 10000,
  4: 25000,
  5: 50000,
  6: 100000,
  7: 250000,
  8: 500000,
  9: 1000000
};

function saveData() {
  localStorage.setItem("coins", Math.floor(coins));
  localStorage.setItem("profit", profitPerHour);
  localStorage.setItem("level", currentLevel);
}

function updateUI() {
  document.getElementById("coins").innerText = Math.floor(coins);
  document.getElementById("profit").innerText = profitPerHour;
  document.getElementById("level").innerText = "Legendary " + currentLevel;

  let nextTarget = levelTargets[currentLevel];
  let remaining = nextTarget ? nextTarget - coins : 0;
  if (remaining < 0) remaining = 0;

  if (nextTarget) {
    document.getElementById("nextLevelInfo").innerText =
      "Next Level: " + nextTarget + " | Left: " + Math.floor(remaining);
  } else {
    document.getElementById("nextLevelInfo").innerText = "Max Level 🚀";
  }
}

function checkLevelUp() {
  let nextTarget = levelTargets[currentLevel];

  if (nextTarget && coins >= nextTarget) {
    currentLevel++;
    saveData();
  }
}

function tap() {
  coins++;
  checkLevelUp();
  saveData();
  updateUI();
}

function upgrade() {
  if (coins >= 1000) {
    coins -= 1000;
    profitPerHour += 100;
    saveData();
    updateUI();
  } else {
    alert("Not enough coins ❌");
  }
}

/* AUTO MINING */
setInterval(() => {
  if (profitPerHour > 0) {
    coins += profitPerHour / 3600;
    checkLevelUp();
    saveData();
    updateUI();
  }
}, 1000);

window.onload = () => {
  const lastTime = localStorage.getItem("lastTime");

  if (lastTime) {
    const now = Date.now();
    const diffSeconds = Math.floor((now - lastTime) / 1000);

    if (profitPerHour > 0 && diffSeconds > 0) {
      const offlineCoins = (profitPerHour / 3600) * diffSeconds;
      coins += offlineCoins;

      alert("💰 You earned " + Math.floor(offlineCoins) + " coins while offline!");
    }
  }

  updateUI();
};
window.onbeforeunload = () => {
  localStorage.setItem("lastTime", Date.now());
};
