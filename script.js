const tg = window.Telegram.WebApp;
tg.expand();
tg.disableVerticalSwipes();

const userId = tg.initDataUnsafe?.user?.id;

let coins = 0;
let profitPerHour = 0;

// 🔥 ENERGY VARIABLES
let energy = 0;
let maxEnergy = 100;

// 🔥 UPGRADE VARIABLES
let upgradeLevel = 0;
let nextUpgradeCost = 100;

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

/* ================= UPGRADE BUTTON UI ================= */

function updateUpgradeButton() {
  const btn = document.getElementById("upgradeBtn");
  if (btn) {
    btn.innerText = "Upgrade (" + nextUpgradeCost + " coins)";
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

    energy = data.energy || 0;
    maxEnergy = data.maxEnergy || 100;

    upgradeLevel = data.upgradeLevel || 0;
    nextUpgradeCost = data.nextCost || 100;

    document.getElementById("coins").innerText = Math.floor(coins);
    document.getElementById("profit").innerText =
      "Profit/hour: " + profitPerHour;

    updateEnergyUI();
    updateLevel();
    updateUpgradeButton();

  } catch (err) {
    console.log("Load error:", err);
  }
}

/* ================= TAP ================= */

async function tap() {
  if (!userId) return;

  try {
    const res = await fetch("/tap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId: userId })
    });

    const data = await res.json();

    if (!data.success) {
      alert("No Energy!");
      return;
    }

    coins = data.coins;
    energy = data.energy;

    document.getElementById("coins").innerText = Math.floor(coins);

    updateEnergyUI();
    updateLevel();

  } catch (err) {
    console.log("Tap error:", err);
  }
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
      energy = data.energy;
      maxEnergy = data.maxEnergy;
      upgradeLevel = data.upgradeLevel;
      nextUpgradeCost = data.nextCost;

      document.getElementById("coins").innerText = Math.floor(coins);
      document.getElementById("profit").innerText =
        "Profit/hour: " + profitPerHour;

      updateEnergyUI();
      updateLevel();
      updateUpgradeButton();

    } else {
      alert("Need " + data.required + " coins!");
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

/* ================= LIVE ENERGY REFILL ================= */

setInterval(() => {
  if (energy < maxEnergy) {
    energy += 1;
    if (energy > maxEnergy) energy = maxEnergy;
    updateEnergyUI();
  }
}, 1000);

/* ================= START ================= */

loadCoins();
