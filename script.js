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

function updateUpgradeButton() {
  document.getElementById("upgradeBtn").innerText =
    "Upgrade (" + nextUpgradeCost + " coins)";
}

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
}

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
}

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
}

setInterval(() => {
  coins += profitPerHour / 3600;
  document.getElementById("coins").innerText = Math.floor(coins);

  if (energy < maxEnergy) {
    energy += 1;
    document.getElementById("energy").innerText =
      "Energy: " + Math.floor(energy) + " / " + maxEnergy;
  }
}, 1000);

loadCoins();
