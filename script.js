const tg = window.Telegram.WebApp;
tg.expand();
tg.disableVerticalSwipes();

const userId = tg.initDataUnsafe?.user?.id;

let coins = 0;

async function loadCoins() {
  if (!userId) return;

  const res = await fetch("/load/" + userId);
  const data = await res.json();

  coins = data.coins || 0;
  document.getElementById("coins").innerText = coins;
}

async function tap() {
  if (!userId) return;

  // 1️⃣ Instant UI update (no delay)
  coins += 1;
  document.getElementById("coins").innerText = coins;

  // 2️⃣ Background save (async)
  fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId: userId })
  }).catch(() => {});
}

  const data = await res.json();

  coins = data.coins;
  document.getElementById("coins").innerText = coins;
}

loadCoins();
