let coins = 0;
let tapPower = 1;
let profitPerHour = 0;

const tg = window.Telegram.WebApp;

tg.expand();
tg.disableVerticalSwipes();
tg.enableClosingConfirmation();

// Viewport lock
tg.onEvent("viewportChanged", function() {
  document.body.style.height = window.innerHeight + "px";
});

const userId = tg.initDataUnsafe?.user?.id;

const levels = [
  { name: "Bronze", min: 0 },
  { name: "Silver", min: 1000 },
  { name: "Gold", min: 5000 },
  { name: "Diamond", min: 20000 }
];

function updateLevel() {
  let currentLevel = levels[0];

  for (let lvl of levels) {
    if (coins >= lvl.min) currentLevel = lvl;
  }

  document.getElementById("level").innerText = currentLevel.name;

  let next = levels.find(l => l.min > coins);

  if (next) {
    let progress = (coins / next.min) * 100;
    document.getElementById("progressFill").style.width = progress + "%";
    document.getElementById("nextLevelInfo").innerText =
      "Next Level: " + next.name + " (" + next.min + " coins)";
  } else {
    document.getElementById("progressFill").style.width = "100%";
    document.getElementById("nextLevelInfo").innerText = "Max Level Reached";
  }
}

function tap() {
  if (!userId) return;

  coins += tapPower;

  document.getElementById("coins").innerText = Math.floor(coins);

  updateLevel();

  fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId: userId, coins })
  }).catch(() => {});
}

function upgrade() {
  if (coins < 1000) return alert("Need 1000 coins");

  coins -= 1000;
  profitPerHour += 100;

  document.getElementById("profit").innerText = profitPerHour;
  document.getElementById("coins").innerText = Math.floor(coins);

  fetch("/upgrade", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId: userId })
  });
}


async function loadData() {
  if (!userId) return;

  const res = await fetch("/load/" + userId);
  const data = await res.json();

  coins = data.coins || 0;
  profitPerHour = data.profitPerHour || 0;

  document.getElementById("coins").innerText = Math.floor(coins);
  document.getElementById("profit").innerText = profitPerHour;

  updateLevel();
}

document.getElementById("leaderboardBtn").addEventListener("click", async () => {
  const res = await fetch("/leaderboard");
  const data = await res.json();

  let html = "<h3>🏆 Leaderboard</h3>";

  data.forEach((u, i) => {
    html += `${i+1}. ${u.telegramId} - ${Math.floor(u.coins)} coins<br>`;
  });

  html += "<br><button onclick='closeBoard()'>Close</button>";

  document.getElementById("leaderboardModal").innerHTML = html;
  document.getElementById("leaderboardModal").style.display = "block";
});

function closeBoard(){
  document.getElementById("leaderboardModal").style.display = "none";
}

loadData();
window.scrollTo(0, 0);
