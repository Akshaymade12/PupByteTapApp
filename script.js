document.addEventListener("DOMContentLoaded", () => {

  const tg = window.Telegram?.WebApp;

  if (tg) {
    tg.expand();
  }

  const telegramId = tg?.initDataUnsafe?.user?.id;
  const startParam = tg?.initDataUnsafe?.start_param;

  if (!telegramId) {
    console.log("Not inside Telegram");
    return;
  }

  /* ================= ELEMENTS ================= */

  const coinsEl = document.getElementById("coins");
  const energyEl = document.getElementById("energy");
  const profitEl = document.getElementById("profit");

  const tapBtn = document.getElementById("tapBtn");
  const upgradeTapBtn = document.getElementById("upgradeTapBtn");
  const upgradeProfitBtn = document.getElementById("upgradeProfitBtn");

  const earnSection = document.getElementById("earnSection");
  const boostSection = document.getElementById("boostSection");
  const tasksSection = document.getElementById("tasksSection");
  const leagueSection = document.getElementById("leagueSection");
  const dailyRewardBtn = document.getElementById("dailyRewardBtn");

  /* ================= LOAD USER ================= */

  async function loadUser() {
    try {
      const res = await fetch(`/load/${telegramId}/${startParam || ""}`);
      const data = await res.json();

      coinsEl.innerText = Math.floor(data.coins);
      energyEl.innerText = data.energy;
      profitEl.innerText = data.profitPerHour;

      if (upgradeTapBtn)
        upgradeTapBtn.innerText = `Tap Upgrade (${data.nextTapCost})`;

      if (upgradeProfitBtn)
        upgradeProfitBtn.innerText = `Profit Upgrade (${data.nextProfitCost})`;

    } catch (err) {
      console.log("Load error:", err);
    }
  }

  loadUser();

  /* ================= TAP ================= */

  if (tapBtn) {
    tapBtn.addEventListener("click", async () => {

      try {
        const res = await fetch("/tap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telegramId })
        });

        const data = await res.json();

        if (data.success) {
          coinsEl.innerText = Math.floor(data.coins);
          energyEl.innerText = data.energy;
          profitEl.innerText = data.profitPerHour;
          showPlusOne(data.tapPower);
        }

      } catch (err) {
        console.log("Tap error:", err);
      }

    });
  }

  /* ================= UPGRADE TAP ================= 

  if (upgradeTapBtn) {
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
  }

  /* ================= UPGRADE PROFIT ================= */

  if (upgradeProfitBtn) {
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
  }

  /* ================= DAILY REWARD ================= */

if (dailyRewardBtn) {
  dailyRewardBtn.addEventListener("click", async () => {

    const res = await fetch("/daily-reward", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId })
    });

    const data = await res.json();

    if (data.success) {
      alert("You received " + data.reward + " coins!");
      loadUser();
    } else {
      alert("Already claimed today!");
    }

  });
}
  
  /* ================= TASK TABS ================= */

  function showTab(tab) {
    document.getElementById("specialTab").style.display = "none";
    document.getElementById("leagueTab").style.display = "none";
    document.getElementById("referTab").style.display = "none";
    document.getElementById(tab + "Tab").style.display = "block";
  }

  const specialBtn = document.getElementById("specialBtn");
  const leagueBtn = document.getElementById("leagueBtn");
  const referBtn = document.getElementById("referBtn");

  if (specialBtn) specialBtn.onclick = () => showTab("special");
  if (leagueBtn) leagueBtn.onclick = () => showTab("league");
  if (referBtn) referBtn.onclick = () => showTab("refer");

  /* ================= REFERRAL ================= */

  function generateReferral() {
  const botUsername = "PupByteTapBot";
  const referralLink = `https://t.me/${botUsername}?start=${telegramId}`;

  if (tg) {
    tg.openTelegramLink(
      `https://t.me/share/url?url=${encodeURIComponent(referralLink)}`
    );
  }
  }
  
  const inviteBtn = document.getElementById("inviteBtn");
  if (inviteBtn) inviteBtn.onclick = generateReferral;

  /* ================= BOOST NAV ================= */

const openBoost = document.getElementById("openBoost");
  const backBtn = document.getElementById("backBtn");

  if (openBoost) {
    openBoost.onclick = () => {
      earnSection.style.display = "none";
      boostSection.style.display = "block";
    };
  }

  if (backBtn) {
    backBtn.onclick = () => {
      boostSection.style.display = "none";
      earnSection.style.display = "block";
    };
  }

  /* ================= LEAGUE ================= */

  const openLeague = document.getElementById("openLeague");

  if (openLeague) {
    openLeague.onclick = async () => {

      earnSection.style.display = "none";
      boostSection.style.display = "none";
      leagueSection.style.display = "block";

      const res = await fetch(`/load/${telegramId}/${startParam || ""}`);
      const data = await res.json();

      document.getElementById("leagueName").innerText =
        data.league + " League";

      loadTopUsers(data.league);
    };
  }

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

  /* ================= NAVIGATION ================= */

  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item, index) => {
    item.addEventListener("click", () => {

      navItems.forEach(nav => nav.classList.remove("active"));
      item.classList.add("active");

      earnSection.style.display = "none";
      boostSection.style.display = "none";
      leagueSection.style.display = "none";
      tasksSection.style.display = "none";

      if (index === 0) earnSection.style.display = "block";
      if (index === 1) tasksSection.style.display = "block";
      if (index === 3) boostSection.style.display = "block";

    });
  });

  /* ================= +1 ANIMATION ================= */

  function showPlusOne(amount) {
    const plus = document.createElement("div");
    plus.className = "plus-one";
    plus.innerText = "+" + amount;
    document.querySelector(".coin-wrapper").appendChild(plus);
    setTimeout(() => plus.remove(), 800);
  }

});
