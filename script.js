let profitPerHour = 0;
let coins = 0;

// Unique browser user
let userId = localStorage.getItem("pupbyte_user");

if (!userId) {
  userId = "user_" + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("pupbyte_user", userId);
}

function tap() {
  coins++;
  document.getElementById("coins").innerText = coins;
  saveCoins();
}

async function saveCoins() {
  await fetch("/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: userId,
      coins: coins
    })
  });
}

async function loadCoins() {
  const res = await fetch("/load/" + userId);
  const data = await res.json();

  coins = data.coins || 0;
  profitPerHour = data.profitPerHour || 0;

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

  let currentLevel = data.level || 1;
  let nextTarget = levelTargets[currentLevel];

  document.getElementById("coins").innerText = coins;
  document.getElementById("profit").innerText = profitPerHour;
  document.getElementById("level").innerText = "Legendary " + currentLevel;

  if (nextTarget) {
    let remaining = nextTarget - coins;
    if (remaining < 0) remaining = 0;

    document.getElementById("nextLevelInfo").innerText =
      "Next Level at: " + nextTarget + " coins | Remaining: " + remaining;
  } else {
    document.getElementById("nextLevelInfo").innerText = "Max Level Reached 🚀";
  }
}

// AUTO MINING
setInterval(() => {
    if (profitPerHour > 0) {
        coins += profitPerHour / 3600;
        document.getElementById("coins").innerText = Math.floor(coins);
        saveCoins();
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
    document.getElementById("coins").innerText = coins;
    document.getElementById("profit").innerText = data.profitPerHour;
    document.getElementById("level").innerText = "Legendary " + data.level;
    alert("Upgrade Successful 🚀");
  } else {
    alert("Not enough coins ❌");
  }
}

window.onload = loadCoins;
