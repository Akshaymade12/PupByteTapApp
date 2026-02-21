const tg = window.Telegram.WebApp;
tg.expand();
tg.disableVerticalSwipes();

const userId = tg.initDataUnsafe?.user?.id;

let coins = 0;
let profitPerHour = 0;

const levels = [
  { name: "Bronze", min: 0 },
  { name: "Silver", min: 500 },
  { name: "Gold", min: 2000 },
  { name: "Platinum", min: 5000 },
  { name: "Diamond", min: 15000 }
];

/* ================= LEVEL UPDATE ================= */

function updateLevel() {
  let currentLevel = levels[0];

  for (let lvl of levels) {
    if (coins >= lvl.min) {
      currentLevel = lvl;
    }
  }

  document.getElementById("level").innerText = currentLevel.name;

  let next = levels.find(l => l.min > coins);

  if (next) {
    let progress = (coins / next.min) * 100;
    if (progress > 100) progress = 100;

    document.getElementById("progressBar").style.width = progress + "%";
    document.getElementById("nextLevelInfo").innerText =
      "Next Level: " + next.name + " (" + next.min + " coins)";
  } else {
    document.getElementById("progressBar").style.width = "100%";
    document.getElementById("nextLevelInfo").innerText =
      "Max Level Reached";
  }
}

/* ================= LOAD ================= */

async function loadCoins() {
  if (!userId) return;

  try {
    const res = await fetch("/load/" + userId);
    const data = await res.json();

    coins = data.coins || 0;
    profitPerHour = data.profitPerHour || 0;

    document.getElementById("coins").innerText = Math.floor(coins);
    document.getElementById("profit").innerText = profitPerHour;

    updateLevel();

  } catch (err) {
    console.log("Load error:", err);
  }
}

/* ================= TAP ================= */

function tap() {
  if (!userId) return;

  // Instant UI update
  coins += 1;
  document.getElementById("coins").innerText = Math.floor(coins);

  updateLevel();

  // Background save
  fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId: userId })
  }).catch(() => {});
}

/* ================= UPGRADE ================= */

async function upgrade() {
  if (!userId) return;

  try {
    const res = await fetch("/upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId: userId })
    });

    const data = await res.json();

    if (data.success) {
      coins = data.coins;
      profitPerHour = data.profitPerHour;

      document.getElementById("coins").innerText = Math.floor(coins);
      document.getElementById("profit").innerText = profitPerHour;

      updateLevel();
    } else {
      alert("Not enough coins!");
    }

  } catch (err) {
    console.log("Upgrade error:", err);
  }
}

/* ================= LIVE AUTO MINING ================= */

setInterval(() => {
  if (profitPerHour > 0) {
    coins += profitPerHour / 3600;
    document.getElementById("coins").innerText = Math.floor(coins);

    updateLevel();
  }
}, 1000);

/* ================= START ================= */

loadCoins();
