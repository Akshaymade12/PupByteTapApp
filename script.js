document.addEventListener("DOMContentLoaded", () => {

  const tg = window.Telegram?.WebApp;

  if (!tg) {
    alert("Please open inside Telegram");
    return;
  }

  tg.expand();

  const telegramId = tg.initDataUnsafe?.user?.id;
  const startParam = tg.initDataUnsafe?.start_param;

  if (!telegramId) {
    alert("Telegram ID not found");
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
  const accountSection = document.getElementById("accountSection");
  const skillsSection = document.getElementById("skillsSection");
  
  const dailyRewardBtn = document.getElementById("dailyRewardBtn");

  const accountUserId = document.getElementById("accountUserId");
  const accountCoins = document.getElementById("accountCoins");
  const accountReferrals = document.getElementById("accountReferrals");
  const accountRefLink = document.getElementById("accountRefLink");
  const copyRefBtn = document.getElementById("copyRefBtn");

  /* ================= LOAD USER ================= */

  async function loadUser() {
    const res = await fetch(`/load/${telegramId}`);
    const data = await res.json();

    coinsEl.innerText = Math.floor(data.coins);
    energyEl.innerText = data.energy;
    profitEl.innerText = data.profitPerHour;

    if (accountUserId) accountUserId.innerText = telegramId;
    if (accountCoins) accountCoins.innerText = Math.floor(data.coins);
    if (accountReferrals) accountReferrals.innerText = data.referrals || 0;

    if (accountRefLink) {
      accountRefLink.value = `https://t.me/PupByteTapBot?start=${telegramId}`;
    }

    if (upgradeTapBtn)
      upgradeTapBtn.innerText = `Upgrade Tap (${data.nextTapCost})`;

    if (upgradeProfitBtn)
      upgradeProfitBtn.innerText = `Upgrade Profit (${data.nextProfitCost})`;
  }

  loadUser();

  /* ================= TAP ================= */

  if (tapBtn) {
    tapBtn.onclick = async () => {

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
    };
  }

  /* ================= TAP UPGRADE ================= */

  if (upgradeTapBtn) {
    upgradeTapBtn.onclick = async () => {

      const res = await fetch("/upgrade-tap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId })
      });

      const data = await res.json();

      if (data.success) loadUser();
      else alert("Not enough coins");
    };
  }

  /* ================= PROFIT UPGRADE ================= */

  if (upgradeProfitBtn) {
    upgradeProfitBtn.onclick = async () => {

      const res = await fetch("/upgrade-profit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId })
      });

      const data = await res.json();

      if (data.success) loadUser();
      else alert("Not enough coins");
    };
  }

  /* ================= DAILY REWARD ================= */

  if (dailyRewardBtn) {
    dailyRewardBtn.onclick = async () => {

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
        alert("Already claimed today");
      }
    };
  }
  
/* ================= SPIN ================= */
  
  const spinBtn = document.getElementById("spinBtn");

if (spinBtn) {
  spinBtn.addEventListener("click", async () => {

    const res = await fetch("/spin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId })
    });

    const data = await res.json();

    if (data.success) {
      alert("🎉 You won " + data.reward + " coins!");
      loadUser();
    } else {
      alert(data.message || "Spin already used today!");
    }
  });
}
  
  /* ================= OPEN BOOST ================= */

const openBoostBtn = document.getElementById("openBoost");
const backBtn = document.getElementById("backBtn");

if (openBoostBtn) {
  openBoostBtn.onclick = () => {
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
  
  /* ================= REFERRAL ================= */

  const inviteBtn = document.getElementById("inviteBtn");

  if (inviteBtn) {
    inviteBtn.onclick = () => {
      const link = `https://t.me/PupByteTapBot?start=${telegramId}`;
      tg.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(link)}`
      );
    };
  }

  if (copyRefBtn) {
    copyRefBtn.onclick = () => {
      navigator.clipboard.writeText(accountRefLink.value);
      alert("Referral link copied!");
    };
  }

  /* ================= TASK TABS ================= */

const specialBtn = document.getElementById("specialBtn");
const leagueBtn = document.getElementById("leagueBtn");
const referBtn = document.getElementById("referBtn");

const specialTab = document.getElementById("specialTab");
const leagueTab = document.getElementById("leagueTab");
const referTab = document.getElementById("referTab");

if (specialBtn) {
  specialBtn.onclick = () => {
    specialTab.style.display = "block";
    leagueTab.style.display = "none";
    referTab.style.display = "none";
  };
}

if (leagueBtn) {
  leagueBtn.onclick = () => {
    specialTab.style.display = "none";
    leagueTab.style.display = "block";
    referTab.style.display = "none";
  };
}

if (referBtn) {
  referBtn.onclick = () => {
    specialTab.style.display = "none";
    leagueTab.style.display = "none";
    referTab.style.display = "block";
  };
}

  /* ================= LEAGUE OPEN ================= */

const openLeague = document.getElementById("openLeague");

if (openLeague) {
  openLeague.onclick = () => {
    earnSection.style.display = "none";
    leagueSection.style.display = "block";
  };
}
  
/* ================= NAVIGATION ================= */

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((item, index) => {

  item.onclick = () => {

    navItems.forEach(nav => nav.classList.remove("active"));
    item.classList.add("active");

    if (earnSection) earnSection.style.display = "none";
    if (boostSection) boostSection.style.display = "none";
    if (tasksSection) tasksSection.style.display = "none";
    if (leagueSection) leagueSection.style.display = "none";
    if (accountSection) accountSection.style.display = "none";
    if (skillsSection) skillsSection.style.display = "none";

    if (index === 0 && earnSection) earnSection.style.display = "block";
    if (index === 1 && tasksSection) tasksSection.style.display = "block";
    if (index === 2 && accountSection) accountSection.style.display = "block";
    if (index === 3 && skillsSection) skillsSection.style.display = "block";
    if (index === 4) alert("Cashier coming soon");
  };
});
  
  /* ================= +1 Animation ================= */

  function showPlusOne(amount) {
    const plus = document.createElement("div");
    plus.className = "plus-one";
    plus.innerText = "+" + amount;
    document.querySelector(".coin-wrapper").appendChild(plus);
    setTimeout(() => plus.remove(), 800);
  }

});
