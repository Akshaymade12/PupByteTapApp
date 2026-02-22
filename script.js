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

  const levels = [
    { name: "Bronze", min: 0 },
    { name: "Silver", min: 500 },
    { name: "Gold", min: 2000 },
    { name: "Platinum", min: 5000 },
    { name: "Diamond", min: 15000 }
  ];

  let currentLevel = levels[0];
  let nextLevel = null;

  for (let i = 0; i < levels.length; i++) {
    if (coins >= levels[i].min) {
      currentLevel = levels[i];
      nextLevel = levels[i + 1];
    }
  }

  document.getElementById("level").innerText = currentLevel.name;

  if (nextLevel) {
    document.getElementById("nextLevelInfo").innerText =
      "Next Level: " + nextLevel.name + " (" + nextLevel.min + " coins)";
  } else {
    document.getElementById("nextLevelInfo").innerText =
      "Max Level Reached";
  }
}

// ================= UPGRADE BUTTON =================

function updateUpgradeButton() {
  document.getElementById("upgradeCost").innerText =
    nextUpgradeCost + " coins";
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
  profitPerHour;
  document.getElementById("energy").innerText =
  Math.floor(energy) + "/" + maxEnergy;

document.getElementById("energyText").innerText =
  Math.floor(energy) + " / " + maxEnergy;
  
  updateUpgradeButton();
  updateLevel();
if (data.bonusGiven) {
   alert("🎉 Level Bonus Received!");
}

}  // 👈 YE LINE ADD KARO (loadCoins close)
   

// ================= TAP =================

async function tap(event) {

  const res = await fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId: userId })
  });

  const data = await res.json();
  if (!data.success) return;

  coins = data.coins;
  energy = data.energy;

  document.getElementById("coins").innerText = Math.floor(coins);
  document.getElementById("energy").innerText =
  Math.floor(energy) + " / " + maxEnergy;

  updateLevel();

  // 🔥 Press Animation
  const coinElement = document.querySelector(".coin");
  coinElement.style.transform = "scale(0.9)";
  setTimeout(() => {
    coinElement.style.transform = "scale(1)";
  }, 100);

  // 🔥 Vibration
  if (navigator.vibrate) {
    navigator.vibrate(30);
  }

  // 🔥 Floating +1
  const floating = document.createElement("div");
  floating.className = "floating-coin";
  floating.innerText = "+" + data.tapReward;

  const container = document.querySelector(".coin-container");
  container.appendChild(floating);

  floating.style.left = "50%";
  floating.style.top = "50%";

  setTimeout(() => {
    floating.remove();
  }, 800);
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
  profitPerHour;
  document.getElementById("energy").innerText =
  Math.floor(energy) + " / " + maxEnergy;

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
