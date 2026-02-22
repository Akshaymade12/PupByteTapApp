const tg = window.Telegram.WebApp;
tg.expand();
tg.disableVerticalSwipes();

const userId = tg.initDataUnsafe?.user?.id;

let coins = 0;
let profitPerHour = 0;
let energy = 0;
let maxEnergy = 100;
let upgradeLevel = 0;
let nextUpgradeCost = 100;

const levels = [
  { name: "Bronze", min: 0 },
  { name: "Silver", min: 500 },
  { name: "Gold", min: 2000 },
  { name: "Platinum", min: 5000 },
  { name: "Diamond", min: 15000 }
];

// ================= LEVEL UPDATE =================

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

// ================= UPGRADE BUTTON =================

function updateUpgradeButton() {
  document.getElementById("upgradeBtn").innerText =
    "Upgrade (" + nextUpgradeCost + " coins)";
}

// ================= LOAD =================

async function loadCoins() {
  const res = await fetch("/load/" + userId);
  const data = await res.json();

  coins = data.coins;
  profitPerHour = data.profitPerHour;
  energy = data.energy;
  maxEnergy = data.maxEnergy;
  upgradeLevel = data.upgradeLevel;
  nextUpgradeCost = data.nextCost;

  document.getElementById("coins").innerText = Math.floor(coins);
  document.getElementById("profit").innerText =
    "Profit/hour: " + profitPerHour;
  document.getElementById("energy").innerText =
    "Energy: " + Math.floor(energy) + " / " + maxEnergy;

  updateUpgradeButton();
  updateLevel();
  if (data.bonusGiven) {
   alert("🎉 Level Bonus Received!");
  }

// ================= TAP =================

async function tap() {
  const res = await fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId: userId })
  });

  const data = await res.json();

  if (!data.success) return alert("No Energy!");

  coins = data.coins;
  energy = data.energy;

  document.getElementById("coins").innerText = Math.floor(coins);
  document.getElementById("energy").innerText =
    "Energy: " + energy + " / " + maxEnergy;

  updateLevel();
}

// ================= UPGRADE =================

async function upgrade() {
  const res = await fetch("/upgrade", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId: userId })
  });

  const data = await res.json();

  if (!data.success) {
    return alert("Need " + data.required + " coins!");
  }

  coins = data.coins;
  profitPerHour = data.profitPerHour;
  energy = data.energy;
  maxEnergy = data.maxEnergy;
  upgradeLevel = data.upgradeLevel;
  nextUpgradeCost = data.nextCost;

  document.getElementById("coins").innerText = Math.floor(coins);
  document.getElementById("profit").innerText =
    "Profit/hour: " + profitPerHour;
  document.getElementById("energy").innerText =
    "Energy: " + energy + " / " + maxEnergy;

  updateUpgradeButton();
  updateLevel();
}

// ================= AUTO UPDATE =================

setInterval(() => {
  coins += profitPerHour / 3600;
  document.getElementById("coins").innerText = Math.floor(coins);

  if (energy < maxEnergy) {
    energy += 1;
    document.getElementById("energy").innerText =
      "Energy: " + Math.floor(energy) + " / " + maxEnergy;
  }

  updateLevel();
}, 1000);

loadCoins();
