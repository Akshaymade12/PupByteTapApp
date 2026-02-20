let coins = 0;
let profitPerHour = 0;
let tapPower = 1;
let currentLevelName = "Bronze";

let userId = null;
let username = "Guest";

/* ===============================
   TELEGRAM LOGIN
=================================*/

if (window.Telegram && window.Telegram.WebApp) {
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();

  const telegramUser = tg.initDataUnsafe.user;

  if (telegramUser) {
    userId = telegramUser.id.toString();
    username = telegramUser.username || telegramUser.first_name;
  }
}

/* ===============================
   TAP FUNCTION
=================================*/

function tap() {
  coins += tapPower;
  document.getElementById("coins").innerText = Math.floor(coins);
  saveCoins();

  // Tap animation
  const plus = document.createElement("div");
  plus.innerText = "+" + tapPower;
  plus.className = "tap-effect";
  document.body.appendChild(plus);
  setTimeout(() => plus.remove(), 800);
}

/* ===============================
   SAVE COINS
=================================*/

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

/* ===============================
   LOAD DATA
=================================*/

async function loadCoins() {
  if (!userId) return;

  const res = await fetch("/load/" + userId);
  const data = await res.json();

  coins = data.coins || 0;
  profitPerHour = data.profitPerHour || 0;
  tapPower = data.tapPower || 1;

  document.getElementById("coins").innerText = Math.floor(coins);
  document.getElementById("profit").innerText = profitPerHour;

  if (data.level !== currentLevelName) {
    currentLevelName = data.level;
  }

  document.getElementById("level").innerText = data.level || "Bronze";
}

/* ===============================
   AUTO MINING
=================================*/

setInterval(() => {
  if (profitPerHour > 0) {
    coins += profitPerHour / 3600;
    document.getElementById("coins").innerText = Math.floor(coins);
    saveCoins();
  }
}, 1000);

/* ===============================
   UPGRADE
=================================*/

async function upgrade() {
  if (!userId) return;

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
  }
}

/* ===============================
   START
=================================*/

setTimeout(() => {
  loadCoins();
}, 500);
