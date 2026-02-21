let coins = null;
let profitPerHour = 0;
let tapPower = 1;
let currentLevelName = "Bronze";

// ===============================
// LEVEL SYSTEM
// ===============================

const levels = [
   { name: "Bronze", min: 0 },
   { name: "Silver", min: 1000 },
   { name: "Gold", min: 5000 },
   { name: "Platinum", min: 20000 },
   { name: "Diamond", min: 50000 }
];

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
   updateProgress();
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
   if (!userId) {
      console.log("No userId");
      return;
   }

   console.log("Saving coins:", coins);

   await fetch("https://pupbytetapapp.onrender.com/save", {
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

  const res = await fetch("https://pupbytetapapp.onrender.com/load/" + userId)
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

updateProgress();

/* ===============================
   AUTO MINING
=================================*/

setInterval(() => {
   if (profitPerHour > 0) {
      coins += profitPerHour / 3600;
      document.getElementById("coins").innerText = Math.floor(coins);
  
       updateProgress();
   }
}, 1000);

/* ===============================
   UPGRADE
=================================*/

async function upgrade() {

   loadCoins();
    if (!userId) return;
  const res = await fetch("https://pupbytetapapp.onrender.com/upgrade", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId: userId })
  });

  const data = await res.json();

  if (data.success) {
    coins = data.coins;
    profitPerHour = data.profitPerHour;
    updateProgress();
     
    document.getElementById("coins").innerText = Math.floor(coins);
    document.getElementById("profit").innerText = profitPerHour;
  }
}

/* ===============================
   START
=================================*/

setTimeout(() => {
   if (userId) {
      loadCoins();
   }
}, 1000);

async function showLeaderboard() {
   const res = await fetch("/leaderboard");
   const data = await res.json();

   let message = "🏆 Top Players:\n\n";

   data.forEach((user, index) => {
      message += `${index + 1}. ${user.username || "User"} - ${Math.floor(user.coins)} coins\n`;
   });

   alert(message);
}

document.addEventListener("DOMContentLoaded", () => {
   const btn = document.getElementById("leaderboardBtn");
   if (btn) {
      btn.addEventListener("click", showLeaderboard);
   }
});

// ===============================
// UPDATE PROGRESS BAR
// ===============================

function updateProgress() {

   if (!currentLevelName) return;

   let currentIndex = levels.findIndex(l => l.name === currentLevelName);

   if (currentIndex === -1) return;

   if (currentIndex < levels.length - 1) {

      let currentMin = levels[currentIndex].min;
      let nextMin = levels[currentIndex + 1].min;

      let percent = ((coins - currentMin) / (nextMin - currentMin)) * 100;
      percent = Math.max(0, Math.min(percent, 100));

      const bar = document.getElementById("progressBar");
      if (bar) bar.style.width = percent + "%";

      const nextInfo = document.getElementById("nextLevelInfo");
      if (nextInfo) {
         nextInfo.innerText =
            `Next Level: ${levels[currentIndex + 1].name} (${nextMin} coins)`;
      }

   } else {

      const bar = document.getElementById("progressBar");
      if (bar) bar.style.width = "100%";

      const nextInfo = document.getElementById("nextLevelInfo");
      if (nextInfo) {
         nextInfo.innerText = "Max Level Reached 🚀";
      }
   }
}
