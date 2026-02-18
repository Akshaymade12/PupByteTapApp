let profitPerHour = 0;
let coins = 0;

let userId = localStorage.getItem("pupbyte_user");

if (!userId) {
  userId = "user_" + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("pupbyte_user", userId);
}

function updateLevel(level) {
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

  let nextTarget = levelTargets[level];
  let remaining = nextTarget ? nextTarget - coins : 0;
  if (remaining < 0) remaining = 0;

  document.getElementById("level").innerText = "Legendary " + level;

  if (nextTarget) {
    document.getElementById("nextLevelInfo").innerText =
      "Next Level: " + nextTarget + " | Left: " + Math.floor(remaining);
  } else {
    document.getElementById("nextLevelInfo").innerText = "Max Level 🚀";
  }
}

function tap() {
  coins++;
  document.getElementById("coins").innerText = coins;
}

async function loadCoins() {
  const res = await fetch("/load/" + userId);
  const data = await res.json();

  coins = data.coins || 0;
  profitPerHour = data.profitPerHour || 0;

  document.getElementById("coins").innerText = coins;
  document.getElementById("profit").innerText = profitPerHour;

  updateLevel(data.level || 1);
}

setInterval(() => {
  if (profitPerHour > 0) {
    coins += profitPerHour / 3600;
    document.getElementById("coins").innerText = Math.floor(coins);
  }
}, 1000);

async function upgrade() {
  const res = await fetch("/upgrade", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  const data = await res.json();

  if (data.success) {
    coins = data.coins;
    profitPerHour = data.profitPerHour;

    document.getElementById("coins").innerText = coins;
    document.getElementById("profit").innerText = profitPerHour;

    updateLevel(data.level);

    alert("Upgrade Successful 🚀");
  } else {
    alert("Not enough coins ❌");
  }
}

window.onload = loadCoins;
