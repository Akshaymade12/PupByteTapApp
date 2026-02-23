const tg = window.Telegram.WebApp;

if (tg) {
  tg.expand();
}

const userId = tg?.initDataUnsafe?.user?.id;

let coins = 0;
let profitPerHour = 0;
let energy = 0;
let maxEnergy = 100;
let nextUpgradeCost = 100;

const levels = [
  { name: "Bronze", min: 0 },
  { name: "Silver", min: 500 },
  { name: "Gold", min: 2000 },
  { name: "Platinum", min: 5000 },
  { name: "Diamond", min: 15000 }
];

// ================= LOAD =================

async function loadCoins() {
  const res = await fetch("/load/" + userId);
  const data = await res.json();

  coins = data.coins;
  profitPerHour = data.profitPerHour;
  energy = data.energy;
  maxEnergy = data.maxEnergy;
  nextUpgradeCost = data.nextCost;

  document.getElementById("coins").innerText = Math.floor(coins);
  document.getElementById("profit").innerText = profitPerHour;
  document.getElementById("energyText").innerText =
    Math.floor(energy) + " / " + maxEnergy;

  document.getElementById("upgradeCost").innerText =
    nextUpgradeCost + " coins";

  updateLevel();

  if (data.bonusGiven) {
    alert("🎉 Level Bonus Received!");
  }
}

// ================= LEVEL SYSTEM =================

function updateLevel() {
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

    const progress =
      ((coins - currentLevel.min) /
        (nextLevel.min - currentLevel.min)) *
      100;

    document.getElementById("levelProgress").style.width =
      progress + "%";
  } else {
    document.getElementById("nextLevelInfo").innerText =
      "Max Level Reached";
    document.getElementById("levelProgress").style.width = "100%";
  }
}

// ================= TAP =================

async function tap() {
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
  document.getElementById("energyText").innerText =
    Math.floor(energy) + " / " + maxEnergy;

  updateLevel();

  // Tap animation
  const btn = document.querySelector(".tap-btn");
  btn.style.transform = "scale(0.9)";
  setTimeout(() => {
    btn.style.transform = "scale(1)";
  }, 100);

  // Vibration
  if (navigator.vibrate) {
    navigator.vibrate(30);
  }

  // Floating +1
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
    alert("Need " + data.required + " coins!");
    return;
  }

  loadCoins();
}

// ================= AUTO PROFIT =================

setInterval(() => {
  coins += profitPerHour / 3600;
  document.getElementById("coins").innerText =
    Math.floor(coins);
  updateLevel();
}, 1000);

// ================= SAFE BOOST BUTTON =================

function showBoots() {
  alert("Boots Section Coming Soon 🔥");
}

function showEarn() {
  // placeholder
}

// Initial load
loadCoins();
