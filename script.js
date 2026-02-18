let coins = 0;

const API = "https://pupbytetapapp.onrender.com";

function getTelegramId() {
  if (window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp.initDataUnsafe.user.id;
  }

  // Backup ID (testing ke liye)
  return "test123";
}

// Tap
function tap() {
  coins += 1;
  document.getElementById("coins").innerText = coins;

  saveCoins();
}

// Save
async function saveCoins() {

  let telegramId = getTelegramId();

  console.log("Saving:", telegramId, coins);

  await fetch(API + "/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      telegramId,
      coins
    }),
  });
}

// Load
async function loadCoins() {

  let telegramId = getTelegramId();

  let res = await fetch(API + "/load/" + telegramId);

  let data = await res.json();

  coins = data.coins || 0;
  document.getElementById("coins").innerText = coins;
}

window.onload = loadCoins;
