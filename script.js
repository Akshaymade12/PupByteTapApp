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

  /* ================= NAVIGATION ================= */

  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item, index) => {

    item.onclick = () => {

      navItems.forEach(nav => nav.classList.remove("active"));
      item.classList.add("active");

      earnSection.style.display = "none";
      boostSection.style.display = "none";
      tasksSection.style.display = "none";
      leagueSection.style.display = "none";
      accountSection.style.display = "none";
      skillsSection.style.display = "none";
      
      if (index === 0) earnSection.style.display = "block";
      if (index === 1) tasksSection.style.display = "block";
      if (index === 2) accountSection.style.display = "block";
      if (index === 3) skillsSection.style.display = "block";
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
