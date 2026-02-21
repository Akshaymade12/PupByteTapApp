const tg = window.Telegram.WebApp;
tg.expand();
tg.disableVerticalSwipes();

const userId = tg.initDataUnsafe?.user?.id;

let coins = 0;
let profitPerHour = 0;

let currentLevel = "Bronze";

const levels = [
  { name: "Bronze", min: 0 },
  { name: "Silver", min: 500 },
  { name: "Gold", min: 2000 },
  { name: "Platinum", min: 5000 },
  { name: "Diamond", min: 15000 }
];

/* ================= LOAD ================= */

async function loadCoins() {
  if (!userId) {
    console.log("User ID not found");
    return;
  }

  try {
    const res = await fetch("/load/" + userId);
    const data = await res.json();

    coins = data.coins || 0;
    profitPerHour = data.profitPerHour || 0;

    document.getElementById("coins").innerText = Math.floor(coins);
    document.getElementById("profit").innerText = profitPerHour;

  } catch (err) {
    console.log("Load error:", err);
  }
}

/* ================= TAP ================= */

async function tap() {
  if (!userId) return;

  // Instant UI update
  coins += 1;
  document.getElementById("coins").innerText = Math.floor(coins);

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
  }
}, 1000);

/* ================= START ================= */

loadCoins();
