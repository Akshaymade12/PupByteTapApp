let coins = 0;
let profitPerHour = 100;
let currentLevelName = "Bronze";
let userId = null;

const levels = [
   { name: "Bronze", min: 0 },
   { name: "Silver", min: 1000 },
   { name: "Gold", min: 5000 },
   { name: "Diamond", min: 20000 }
];

function updateLevelColor(levelName) {
   const levelText = document.getElementById("level");

   if (levelName === "Bronze") levelText.style.color = "#cd7f32";
   if (levelName === "Silver") levelText.style.color = "#c0c0c0";
   if (levelName === "Gold") levelText.style.color = "#ffd700";
   if (levelName === "Diamond") levelText.style.color = "#00e5ff";
}

function updateProgress() {
   let nextLevel = null;

   for (let i = levels.length - 1; i >= 0; i--) {
      if (coins >= levels[i].min) {
         currentLevelName = levels[i].name;
         break;
      }
   }

   for (let i = 0; i < levels.length; i++) {
      if (levels[i].name === currentLevelName && i < levels.length - 1) {
         nextLevel = levels[i + 1];
      }
   }

   document.getElementById("level").innerText = currentLevelName;

   if (nextLevel) {
      const percent =
         ((coins - levels.find(l => l.name === currentLevelName).min) /
         (nextLevel.min - levels.find(l => l.name === currentLevelName).min)) * 100;

   document.getElementById("progressFill").style.width = percent + "%";
      document.getElementById("nextLevelInfo").innerText =
         "Next Level: " + nextLevel.name + " (" + nextLevel.min + " coins)";
   } else {
      document.getElementById("progressFill").style.width = "100%";
      document.getElementById("nextLevelInfo").innerText = "Max Level Reached";
   }

   updateLevelColor(currentLevelName);
}

async function loadCoins() {
   if (!userId) return;

   const res = await fetch("/load/" + userId);
   const data = await res.json();

   coins = data.coins || 0;
   profitPerHour = data.profitPerHour || 100;

   document.getElementById("coins").innerText = Math.floor(coins);
   document.getElementById("profit").innerText = profitPerHour;

   updateProgress();
}

async function upgrade() {
   const res = await fetch("/upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId: userId })
   });

   const data = await res.json();

   if (data.success) {
      coins = data.coins;
      profitPerHour = data.profitPerHour;

      document.getElementById("coins").innerText = Math.floor(coins);
      document.getElementById("profit").innerText = profitPerHour;

      updateProgress();
   }
}

setInterval(() => {
   coins += profitPerHour / 3600;
   document.getElementById("coins").innerText = Math.floor(coins);
   updateProgress();
}, 1000);

async function showLeaderboard() {
   const res = await fetch("/leaderboard/" + currentLevelName);
   const data = await res.json();

   let message = "🏆 " + currentLevelName + " Top 10\n\n";

   data.forEach((user, index) => {
      message += `${index + 1}. ${user.username || "User"} - ${Math.floor(user.coins)} coins\n`;
   });

   alert(message);
}

document.addEventListener("DOMContentLoaded", () => {
   const tg = window.Telegram.WebApp;
   tg.expand();

   userId = tg.initDataUnsafe?.user?.id;
   const username = tg.initDataUnsafe?.user?.username;

   fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId: userId, username })
   });

   loadCoins();

   document.getElementById("leaderboardBtn")
      .addEventListener("click", showLeaderboard);
});
