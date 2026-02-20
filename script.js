let coins = 0;
let profitPerHour = 0;
let tapPower = 1;
let currentLevelName = "Bronze";

let telegramUser = null;
let userId = null;
let username = null;

if (window.Telegram && window.Telegram.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();

  telegramUser = window.Telegram.WebApp.initDataUnsafe.user;

  if (telegramUser) {
    userId = telegramUser.id.toString();
    username = telegramUser.username || telegramUser.first_name;
  }
}
function tap() {
  coins += tapPower;
  document.getElementById("coins").innerText = coins;
  saveCoins();

  // Tap animation
  const plus = document.createElement("div");
  plus.innerText = "+" + tapPower;
  plus.className = "tap-effect";
  document.body.appendChild(plus);

  setTimeout(() => plus.remove(), 1000);
}

async function saveCoins() {
  if (!userId) return;

  await fetch("/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      telegramId: userId,
      username: username,
      coins: coins
    })
  });
}

async function loadCoins() {
  if (!userId) return;

  const res = await fetch("/load/" + userId);
  const data = await res.json();

  coins = data.coins || 0;
  profitPerHour = data.profitPerHour || 0;
  tapPower = data.tapPower || 1;

  document.getElementById("coins").innerText = coins;
  document.getElementById("profit").innerText = profitPerHour;
  document.getElementById("level").innerText = data.level || "Bronze";
}

  // Level update + popup
  if (data.level !== currentLevelName) {
    showLevelUp(data.level);
    currentLevelName = data.level;
  }

  document.getElementById("level").innerText = data.level;
  applyLevelGlow(data.level);
}

// Real time auto mining
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
    profitPerHour = data.profitPerHour;

    document.getElementById("coins").innerText = coins;
    document.getElementById("profit").innerText = profitPerHour;
  }
}

// Level up popup
function showLevelUp(level) {
  const popup = document.createElement("div");
  popup.innerText = "LEVEL UP! 🚀 " + level;
  popup.className = "level-popup";
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 2000);
}

// Glow change based on level
function applyLevelGlow(level) {
  const character = document.querySelector(".character");

  const glowColors = {
    Bronze: "gray",
    Silver: "silver",
    Gold: "gold",
    Platinum: "lightblue",
    Diamond: "aqua",
    Epic: "purple",
    Legendary: "orange",
    Master: "red",
    Grandmaster: "magenta",
    Lord: "white"
  };

  character.style.boxShadow = `0 0 40px ${glowColors[level] || "gold"}`;
}

window.onload = loadCoins;
