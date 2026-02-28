document.addEventListener("DOMContentLoaded", () => {
const tg = window.Telegram?.WebApp;

if (tg) {
  tg.expand();
}

const telegramId = tg?.initDataUnsafe?.user?.id;
  const startParam = tg?.initDataUnsafe?.start_param;

if (!telegramId) {
  alert("Please open inside Telegram!");
}

const coinsEl = document.getElementById("coins");
const energyEl = document.getElementById("energy");
const profitEl = document.getElementById("profit");
const tapBtn = document.getElementById("tapBtn");
const upgradeTapBtn = document.getElementById("upgradeTapBtn");
const upgradeProfitBtn = document.getElementById("upgradeProfitBtn");

/* LOAD USER */

async function loadUser() {
  const res = await fetch(`/load/${telegramId}/${startParam || ""}`);
  const data = await res.json();

  coinsEl.innerText = Math.floor(data.coins);
  energyEl.innerText = data.energy;
  profitEl.innerText = data.profitPerHour;

  upgradeTapBtn.innerText = `Tap Upgrade (${data.nextTapCost})`;
  upgradeProfitBtn.innerText = `Profit Upgrade (${data.nextProfitCost})`;
}

loadUser();

/* TAP */

tapBtn.addEventListener("click", async () => {
  const res = await fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId })
  });

  const data = await res.json();

  if (data.success) {
    coinsEl.innerText = Math.floor(data.coins);
    energyEl.innerText = data.energy;
    
    profitEl.innerText = data.profitPerHour || profitEl.innerText;
    
    showPlusOne(data.tapPower);
  }
});

/* TAP UPGRADE */

upgradeTapBtn.addEventListener("click", async () => {
  const res = await fetch("/upgrade-tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId })
  });

  const data = await res.json();

  if (data.success) {
    loadUser();
  } else {
    alert("Not enough coins!");
  }
});

/* PROFIT UPGRADE */

upgradeProfitBtn.addEventListener("click", async () => {
  const res = await fetch("/upgrade-profit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId })
  });

  const data = await res.json();

  if (data.success) {
    loadUser();
  } else {
    alert("Not enough coins!");
  }
});

/* +1 Animation */

function showPlusOne(amount) {
  const plus = document.createElement("div");
  plus.className = "plus-one";
  plus.innerText = "+" + amount;
  document.querySelector(".coin-wrapper").appendChild(plus);
  setTimeout(() => plus.remove(), 800);
}

const earnSection = document.getElementById("earnSection");
const boostSection = document.getElementById("boostSection");

document.getElementById("openBoost").onclick = () => {
  earnSection.style.display = "none";
  boostSection.style.display = "block";
};

document.getElementById("backBtn").onclick = () => {
  boostSection.style.display = "none";
  earnSection.style.display = "block";
};

/* ========= LEAGUE SECTION ========= */

const leagueSection = document.getElementById("leagueSection");
const openLeague = document.getElementById("openLeague");

if (openLeague) {
  openLeague.addEventListener("click", async () => {

    console.log("League clicked");

    if (earnSection) earnSection.style.display = "none";
    if (boostSection) boostSection.style.display = "none";
    if (leagueSection) leagueSection.style.display = "block";

    try {
      const res = await fetch(`/load/${telegramId}`);
      const data = await res.json();

      document.getElementById("leagueName").innerText =
        data.league + " League";

      loadTopUsers(data.league);

    } catch (err) {
      console.log("League error:", err);
    }

  });
}
/* ================= TOP USERS ================= */

async function loadTopUsers(league) {
  const res = await fetch(`/top/${league}`);
  const data = await res.json();

  const container = document.getElementById("topUsers");
  container.innerHTML = "";

  data.forEach((user, index) => {
    container.innerHTML += `
      <div class="user-row">
        <span>#${index + 1}</span>
        <span>${user.telegramId}</span>
        <span>${user.coins}</span>
      </div>
    `;
  });
  
}

/* ========= EARN NAV FIX ========= */

document.querySelector(".nav-item.active").onclick = () => {
  if (earnSection) earnSection.style.display = "block";
  if (boostSection) boostSection.style.display = "none";
  if (leagueSection) leagueSection.style.display = "none";
};

  function generateReferral() {
  const botUsername = "PupByteTapBot"; // exact username likhna
  const link = `https://t.me/${botUsername}?start=${telegramId}`;
  alert("Your Referral Link:\n" + link);
  }

  function showTab(tab) {
  document.getElementById("specialTab").style.display = "none";
  document.getElementById("leagueTab").style.display = "none";
  document.getElementById("referTab").style.display = "none";
  document.getElementById(tab + "Tab").style.display = "block";
}

async function completeTask(taskId) {
  const res = await fetch("/complete-task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId, taskId })
  });
  const data = await res.json();
  if (data.success) {
    alert("You earned " + data.reward);
    loadUser();
  }
}

async function claimLeagueReward() {
  const res = await fetch("/claim-league", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId })
  });
  const data = await res.json();
  if (data.success) {
    alert("League reward: " + data.reward);
    loadUser();
  }
}
  
});
