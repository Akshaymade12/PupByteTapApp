let coins = 0;
let profitPerHour = 100;
let currentLevel = "Bronze";
let userId = null;

const levels = [
  { name: "Bronze", min: 0 },
  { name: "Silver", min: 1000 },
  { name: "Gold", min: 5000 },
  { name: "Diamond", min: 20000 }
];

function updateLevelColor(level) {
  const el = document.getElementById("level");
  if (level === "Bronze") el.style.color = "#cd7f32";
  if (level === "Silver") el.style.color = "#c0c0c0";
  if (level === "Gold") el.style.color = "#ffd700";
  if (level === "Diamond") el.style.color = "#00e5ff";
}

function updateProgress() {
  let next = null;

  for (let i = levels.length - 1; i >= 0; i--) {
    if (coins >= levels[i].min) {
      currentLevel = levels[i].name;
      break;
    }
  }

  for (let i = 0; i < levels.length; i++) {
    if (levels[i].name === currentLevel && i < levels.length - 1) {
      next = levels[i + 1];
    }
  }

  document.getElementById("level").innerText = currentLevel;

  if (next) {
    const percent =
      ((coins - levels.find(l => l.name === currentLevel).min) /
        (next.min - levels.find(l => l.name === currentLevel).min)) *
      100;

    document.getElementById("progressFill").style.width =
      percent + "%";

    document.getElementById("nextLevelInfo").innerText =
      "Next Level: " + next.name + " (" + next.min + " coins)";
  } else {
    document.getElementById("progressFill").style.width = "100%";
    document.getElementById("nextLevelInfo").innerText =
      "Max Level Reached";
  }

  updateLevelColor(currentLevel);
}

async function loadData() {
  const res = await fetch("/load/" + userId);
  const data = await res.json();

  coins = data.coins;
  profitPerHour = data.profitPerHour;

  document.getElementById("coins").innerText =
    Math.floor(coins);
  document.getElementById("profit").innerText =
    profitPerHour;

  updateProgress();
}

async function tap() {
  const res = await fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId: userId })
  });

  const data = await res.json();

  coins = data.coins;

  document.getElementById("coins").innerText =
    Math.floor(coins);

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

    document.getElementById("coins").innerText =
      Math.floor(coins);
    document.getElementById("profit").innerText =
      profitPerHour;

    updateProgress();
  }
}

setInterval(() => {
  coins += profitPerHour / 3600;
  document.getElementById("coins").innerText =
    Math.floor(coins);
  updateProgress();
}, 1000);

async function showLeaderboard() {
  const res = await fetch("/leaderboard/" + currentLevel);
  const data = await res.json();

  let html = "<h3>🏆 " + currentLevel + " Top 10</h3>";

  data.forEach((user, i) => {
    html +=
      "<div>" +
      (i + 1) +
      ". " +
      (user.username || "User") +
      " - " +
      Math.floor(user.coins) +
      "</div>";
  });

  const modal = document.getElementById("leaderboardModal");
  modal.innerHTML =
    html + "<br><button onclick='closeLB()'>Close</button>";
  modal.style.display = "block";
}

function closeLB() {
  document.getElementById("leaderboardModal").style.display =
    "none";
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

  loadData();

  document
    .getElementById("leaderboardBtn")
    .addEventListener("click", showLeaderboard);
});
