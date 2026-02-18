let coins = 0;

if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
    console.log("Telegram WebApp Loaded");
    console.log("User Data:", window.Telegram.WebApp.initDataUnsafe);
}
// Unique user id (browser based)
let userId = localStorage.getItem("pupbyte_user");

if (!userId) {
    userId = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("pupbyte_user", userId);
}

function tap() {
    coins++;
    document.getElementById("coins").innerText = coins;
    saveCoins();
}

async function saveCoins() {
    try {
        await fetch("/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                telegramId: userId,
                coins: coins
            })
        });
    } catch (err) {
        console.log("Save error:", err);
    }
}

async function loadCoins() {
  try {
    if (!window.Telegram || !window.Telegram.WebApp) return;

    const user = window.Telegram.WebApp.initDataUnsafe.user;
    if (!user) return;

    const res = await fetch("/load/" + user.id);
    const data = await res.json();

    coins = data.coins || 0;
    document.getElementById("coins").innerText = coins;

    // 🔥 PROFIT DISPLAY FIX
    if (document.getElementById("profit")) {
      document.getElementById("profit").innerText = data.profitPerHour || 0;
    }

  } catch (err) {
    console.log("Load error:", err);
  }
}

window.onload = loadCoins;
