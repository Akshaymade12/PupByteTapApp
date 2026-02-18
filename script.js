let coins = parseInt(localStorage.getItem("coins")) || 0;
let profitPerHour = parseInt(localStorage.getItem("profit")) || 0;
let currentLevel = parseInt(localStorage.getItem("level")) || 1;

function saveData() {
  localStorage.setItem("coins", coins);
  localStorage.setItem("profit", profitPerHour);
  localStorage.setItem("level", currentLevel);
}

function updateLevel() {
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

  let nextTarget = levelTargets[currentLevel];
  let remaining = nextTarget ? nextTarget - coins : 0;
  if (remaining < 0) remaining = 0;

  document.getElementById("level").innerText = "Legendary " + currentLevel;

  if (nextTarget) {
    document.getElementById("nextLevelInfo").innerText =
      "Next Level: " + nextTarget + " | Left: " + remaining;
  } else {
    document.getElementById("nextLevelInfo").innerText = "Max Level 🚀";
  }
}

function tap() {
  coins++;
  document.getElementById("coins").innerText = coins;
  checkLevelUp();
  saveData();
}

function checkLevelUp() {
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

  let nextTarget = levelTargets[currentLevel];

  if (nextTarget && coins >= nextTarget) {
    currentLevel++;
    updateLevel();
    saveData();
  }
}

function upgrade() {
  if (coins >= 1000) {
    coins -= 1000;
    profitPerHour += 100;
    saveData();
    document.getElementById("profit").innerText = profitPerHour;
    document.getElementById("coins").innerText = coins;
  } else {
    alert("Not enough coins ❌");
  }
}

setInterval(() => {
  if (profitPerHour > 0) {
    coins += profitPerHour / 3600;
    document.getElementById("coins").innerText = Math.floor(coins);
    saveData();
  }
}, 1000);

window.onload = () => {
  document.getElementById("coins").innerText = coins;
  document.getElementById("profit").innerText = profitPerHour;
  updateLevel();
};
