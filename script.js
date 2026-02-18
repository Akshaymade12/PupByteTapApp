let coins = 0;

function tap() {
  coins++;
  document.getElementById("coins").innerText = coins;
  saveCoins();
}

async function saveCoins() {
  try {
    let telegramId = window.Telegram.WebApp.initDataUnsafe.user.id;

    await fetch("https://pupbytetapapp.onrender.com/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        telegramId: telegramId,
        coins: coins
      })
    });

  } catch (err) {
    console.log("Save error:", err);
  }
}

async function loadCoins() {
  try {
    let telegramId = window.Telegram.WebApp.initDataUnsafe.user.id;

    let res = await fetch(
      "https://pupbytetapapp.onrender.com/load/" + telegramId
    );

    let data = await res.json();

    coins = data.coins || 0;
    document.getElementById("coins").innerText = coins;

  } catch (err) {
    console.log("Load error:", err);
  }
}

window.onload = loadCoins;
