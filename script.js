let coins = 0;

const API = "https://pupbytetapapp.onrender.com";

// Tap
function tap() {
  coins += 1;
  document.getElementById("coins").innerText = coins;

  saveCoins();
}

// Save
async function saveCoins() {
  let telegramId = window.Telegram.WebApp.initDataUnsafe.user.id;

  await fetch(API + "/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      telegramId: telegramId,
      coins: coins,
    }),
  });
}

// Load
async function loadCoins() {
  let telegramId = window.Telegram.WebApp.initDataUnsafe.user.id;

  let res = await fetch(API + "/load/" + telegramId);

  let data = await res.json();

  coins = data.coins;
  document.getElementById("coins").innerText = coins;
}

// On Start
window.onload = loadCoins;
