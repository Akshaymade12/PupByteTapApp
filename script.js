const tg = window.Telegram.WebApp;
tg.expand();
tg.disableVerticalSwipes();

const userId = tg.initDataUnsafe?.user?.id;

let coins = 0;

/* ================= LOAD COINS ================= */

async function loadCoins() {
  if (!userId) {
    console.log("User ID not found");
    return;
  }

  try {
    const res = await fetch("/load/" + userId);
    const data = await res.json();

    coins = data.coins || 0;
    document.getElementById("coins").innerText = coins;

  } catch (err) {
    console.log("Load error:", err);
  }
}

/* ================= TAP ================= */

async function tap() {
  if (!userId) return;

  // Instant UI update
  coins += 1;
  document.getElementById("coins").innerText = coins;

  // Background save
  try {
    await fetch("/tap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId: userId })
    });
  } catch (err) {
    console.log("Tap save error:", err);
  }
}

/* ================= START ================= */

loadCoins();
