let coins = 0;

// Simple Tap
function tap() {
  coins += 1;
  document.getElementById("coins").innerText = coins;

  // Telegram me ho to save karo
  if (window.Telegram && window.Telegram.WebApp) {
    saveCoins();
  }
}

// Save to backend
async function saveCoins() {
  try {
    let telegramId = window.Telegram.WebApp.initDataUnsafe?.user?.id;

    if (!telegramId) return;

    await fetch("/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        telegramId: telegramId,
        coins: coins,
      }),
    });
  } catch (err) {
    console.log("Save error:", err);
  }
}

// Load saved coins
async function loadCoins() {
  try {
    if (!(window.Telegram && window.Telegram.WebApp)) return;

    let telegramId = window.Telegram.WebApp.initDataUnsafe?.user?.id;
    if (!telegramId) return;

    let res = await fetch("/load/" + telegramId);
    let data = await res.json();

    coins = data.coins || 0;
    document.getElementById("coins").innerText = coins;
  } catch (err) {
    console.log("Load error:", err);
  }
}

window.onload = loadCoins;
