let coins = 0;
let profitPerHour = 0;
let tapPower = 1;
let currentLevelName = "Bronze";

let userId = localStorage.getItem("pupbyte_user");

if (!userId) {
  userId = "user_" + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("pupbyte_user", userId);
}

function tap() {
  coins += tapPower;
  document.getElementById("coins").innerText = coins;
  saveCoins();

  const plus = document.createElement("div");
  plus.innerText = "+" + tapPower;
  plus.className = "tap-effect";
  document.body.appendChild(plus);

  setTimeout(() => plus.remove(), 1000);
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
  tapPower = data.tapPower || 1;

  document.getElementById("coins").innerText = coins;
  document.getElementById("profit").innerText = profitPerHour;
  document.getElementById("level").innerText = if (data.level !== currentLevelName) {
  showLevelUp(data.level);
  currentLevelName = data.level;
}

document.getElementById("level").innerText = data.level;
applyLevelGlow(data.level);;
}

// REAL TIME AUTO MINING
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

window.onload = loadCoins;  localStorage.setItem("lastTime", Date.now());
};

function showLevelUp(level) {
  const popup = document.createElement("div");
  popup.innerText = "LEVEL UP! 🚀 " + level;
  popup.className = "level-popup";
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 2000);
}

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
