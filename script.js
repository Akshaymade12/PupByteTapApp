let coins = 0;

function tap() {
  coins += 1;
  document.getElementById("coins").innerText = coins;

  saveCoins();
}

async function saveCoins() {
  let telegramId = window.Telegram.WebApp.initDataUnsafe.user.id;

  await fetch("https://pupbytebot.onrender.com", {
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

async function loadCoins() {
  let telegramId = window.Telegram.WebApp.initDataUnsafe.user.id;

  let res = await fetch(
    "https://pupbytebot.onrender.com" + telegramId
  );

  let data = await res.json();

  coins = data.coins;
  document.getElementById("coins").innerText = coins;
}

window.onload = loadCoins;
