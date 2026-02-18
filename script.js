let coins = 0;

function getTelegramId() {
  if (window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp.initDataUnsafe?.user?.id;
  }
  return null;
}

function tap() {
  coins += 1;
  document.getElementById("coins").innerText = coins;
  saveCoins();
}

async function saveCoins() {
  try {
    let telegramId = getTelegramId();
    if (!telegramId) return;

    await fetch("/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, coins })
    });
  } catch (err) {
    console.log(err);
  }
}

async function loadCoins() {
  try {
    let telegramId = getTelegramId();
    if (!telegramId) return;

    let res = await fetch("/load/" + telegramId);
    let data = await res.json();

    coins = data.coins || 0;
    document.getElementById("coins").innerText = coins;
  } catch (err) {
    console.log(err);
  }
}

window.onload = loadCoins;
