document.addEventListener("DOMContentLoaded", () => {
  /* ================= TELEGRAM SAFE INIT ================= */
  const tg = window.Telegram?.WebApp;

  if (!tg) {
    document.body.innerHTML = "<h2 style='color:white;text-align:center;margin-top:50px;'>Please open from Telegram</h2>";
    throw new Error("Telegram not found");
  }

  tg.expand();

  let user;
  if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    user = tg.initDataUnsafe.user;
  } else {
    document.body.innerHTML = "<h2 style='color:white;text-align:center;margin-top:50px;'>Please open from Telegram</h2>";
    throw new Error("User not found");
  }

  const telegramId = String(user.id);
  const initData = tg.initData;

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
  const cashierSection = document.getElementById("cashierSection");
  const mineSection = document.getElementById("mineSection");
  const missionPage = document.getElementById("missionPage");

  const accountUserId = document.getElementById("accountUserId");
  const accountUserName = document.getElementById("accountUserName");
  const accountCoins = document.getElementById("accountCoins");
  const accountReferrals = document.getElementById("accountReferrals");
const accountRefLink = document.getElementById("accountRefLink");
const copyRefBtn = document.getElementById("copyRefBtn");
  
  const dailyPopup = document.getElementById("dailyRewardPopup");
  const dailyGrid = document.getElementById("dailyGrid");
  const claimDailyBtn = document.getElementById("claimDailyBtn");

  const rewards = [500, 1000, 2500, 5000, 15000, 25000, 100000, 500000, 1000000, 5000000];

  if (dailyPopup) {
    dailyPopup.addEventListener("click", (e) => {
      if (e.target === dailyPopup) {
        dailyPopup.style.display = "none";
      }
    });
  }

  /* ================= LOAD USER ================= */
  async function loadUser() {
    try {
      const res = await fetch("/load", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId, initData })
      });

      const data = await res.json();

      if (!data || data.success === false) {
        console.log("User load failed ❌", data);
        return;
      }

      coinsEl.innerText = Math.floor(data.coins || 0);
      energyEl.innerText = data.energy || 0;
      profitEl.innerText = data.profitPerHour || 0;

      const leagueText = document.getElementById("currentLeagueText");
      if (leagueText) leagueText.innerText = data.league || "Wood";

      updateLeagueProgress(data.coins || 0);

      if (accountUserId) accountUserId.innerText = telegramId;
      if (accountUserName) accountUserName.innerText = user.first_name || "User";
      if (accountCoins) accountCoins.innerText = Math.floor(data.coins || 0);
      if (accountReferrals) accountReferrals.innerText = data.referrals || 0;

      console.log("Telegram ID:", telegramId);
      
      // ✅ Referral link set karo
if (accountRefLink) {
  accountRefLink.value = `https://t.me/PupByteTapBot?start=${String(telegramId)}`;
}
      
// ✅ Copy button
if (copyRefBtn) {
  copyRefBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(accountRefLink.value);
      alert("Referral link copied ✅");
    } catch (e) {
      accountRefLink.select();
      document.execCommand("copy");
      alert("Referral link copied ✅");
    }
  };
}
      
      const totalClaimsEl = document.getElementById("totalClaims");
      if (totalClaimsEl) totalClaimsEl.innerText = data.totalClaims || 0;

      if (upgradeTapBtn) {
        upgradeTapBtn.innerText = `Upgrade Tap (${data.nextTapCost})`;
      }

      if (upgradeProfitBtn) {
        upgradeProfitBtn.innerText = `Upgrade Profit (${data.nextProfitCost})`;
      }

      loadDailyCombo();
    } catch (e) {
      console.log("Load user error", e);
    }
  }

  loadUser();

  /* ================= LEAGUE PROGRESS ================= */
  function updateLeagueProgress(coins) {
    const LEAGUES = [
      { name: "Wood", min: 0, max: 1000 },
      { name: "Bronze", min: 1000, max: 5000 },
      { name: "Silver", min: 5000, max: 15000 },
      { name: "Gold", min: 15000, max: 50000 },
      { name: "Platinum", min: 50000, max: 100000 },
      { name: "Diamond", min: 100000, max: 250000 },
      { name: "Master", min: 250000, max: 500000 },
      { name: "Elite", min: 500000, max: 1000000 },
      { name: "Champion", min: 1000000, max: 2500000 },
      { name: "Legend", min: 2500000, max: 5000000 },
      { name: "Grandmaster", min: 5000000, max: 10000000 },
      { name: "Immortal", min: 10000000, max: Infinity }
    ];

    let currentLeague = LEAGUES[0];

    for (let league of LEAGUES) {
      if (coins >= league.min && coins < league.max) {
        currentLeague = league;
        break;
      }
    }

    const leagueText = document.getElementById("currentLeagueText");
    if (leagueText) leagueText.innerText = currentLeague.name;
  }

  /* ================= TAP ================= */
  let tapping = false;

  if (tapBtn) {
    tapBtn.addEventListener("click", async () => {
      if (tapping) return;
      tapping = true;

      tapBtn.style.transform = "scale(0.9)";
      setTimeout(() => {
        tapBtn.style.transform = "scale(1)";
      }, 100);

      try {
        const res = await fetch("/tap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telegramId, initData })
        });

        const data = await res.json();

        if (data.success) {
          coinsEl.innerText = Math.floor(data.coins || 0);
          energyEl.innerText = data.energy || 0;
          profitEl.innerText = data.profitPerHour || 0;

          const leagueText = document.getElementById("currentLeagueText");
          if (leagueText) leagueText.innerText = data.league || "Wood";

          if (accountCoins) accountCoins.innerText = Math.floor(data.coins || 0);

          showPlusOne(data.tapPower || 1);
        } else {
          alert(data.message || "Tap failed");
        }
      } catch (e) {
        console.log("Tap error", e);
      }

      setTimeout(() => {
        tapping = false;
      }, 120);
    });
  }

/* ================= TASK TABS ================= */

const tabSpecial = document.getElementById("tabSpecial");
const tabLeague = document.getElementById("tabLeague");
const tabRef = document.getElementById("tabRef");

const specialTabContent = document.getElementById("specialTabContent");
const leagueTabContent = document.getElementById("leagueTabContent");
const refTabContent = document.getElementById("refTabContent");

window.openTaskLink = function(url){
  window.open(url, "_blank");
};
  
/* ================= TASK STATUS VERIFY ================= */
  
  const SPECIAL_TASK_KEYS = [
  "telegram_channel",
  "instagram",
  "x",
  "discord",
  "telegram_group"
];

function getSpecialTasksState() {
  try {
    return JSON.parse(localStorage.getItem("specialTasksDone") || "{}");
  } catch {
    return {};
  }
}

function saveSpecialTasksState(state) {
  localStorage.setItem("specialTasksDone", JSON.stringify(state));
}

function refreshSpecialTaskUI(claimed = false) {
  const state = getSpecialTasksState();

  const map = {
    telegram_channel: document.getElementById("taskTelegramChannel"),
    instagram: document.getElementById("taskInstagram"),
    x: document.getElementById("taskX"),
    discord: document.getElementById("taskDiscord"),
    telegram_group: document.getElementById("taskTelegramGroup")
  };

  if (claimed) {
    SPECIAL_TASK_KEYS.forEach(key => {
      const btn = map[key];
      if (!btn) return;
      btn.innerText = "✅";
      btn.disabled = true;
    });

    const specialClaimBtn = document.getElementById("specialClaimBtn");
    if (specialClaimBtn) {
      specialClaimBtn.innerText = "Claimed ✅";
      specialClaimBtn.disabled = true;
    }
    return;
  }

  SPECIAL_TASK_KEYS.forEach(key => {
    const btn = map[key];
    if (!btn) return;

    if (state[key]) {
      btn.innerText = "✅";
      btn.disabled = false;
    } else {
      btn.innerText = "Go";
      btn.disabled = false;
    }
  });

  const specialClaimBtn = document.getElementById("specialClaimBtn");
  if (!specialClaimBtn) return;

  const allDone = SPECIAL_TASK_KEYS.every(key => state[key]);

  if (allDone) {
    specialClaimBtn.innerText = "Claim";
    specialClaimBtn.disabled = false;
  } else {
    specialClaimBtn.innerText = "Complete All";
    specialClaimBtn.disabled = true;
  }
}

window.markSpecialTask = async function(taskKey, url) {
  const specialClaimBtn = document.getElementById("specialClaimBtn");

  if (specialClaimBtn && specialClaimBtn.disabled) {
    return;
  }

  try {
    const res = await fetch("/special-task-status/" + telegramId);
    const data = await res.json();

    if (data.success && data.claimed) {
      refreshSpecialTaskUI(true);
      return;
    }
  } catch (e) {
    console.log("special status check error", e);
  }

  const state = getSpecialTasksState();
  state[taskKey] = true;
  saveSpecialTasksState(state);

  refreshSpecialTaskUI(false);

  if (url.includes("t.me")) {
    tg.openTelegramLink(url);
  } else {
    tg.openLink(url);
  }
};

async function loadSpecialTaskClaimStatus() {
  try {
    const res = await fetch("/special-task-status/" + telegramId);
    const data = await res.json();

    if (data.success && data.claimed) {
      localStorage.removeItem("specialTasksDone");
      refreshSpecialTaskUI(true);
    } else {
      refreshSpecialTaskUI(false);
    }
  } catch (e) {
    console.log("special task status error", e);
    refreshSpecialTaskUI(false);
  }
}

window.claimSpecialTask = async function() {
  try {
    const state = getSpecialTasksState();
    const clickedTasks = Object.keys(state).filter(key => state[key]);

    const res = await fetch("/claim-special-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData, clickedTasks })
    });

    const data = await res.json();

    if (data.success) {
      alert("Claimed +" + data.reward + " coins");
      refreshSpecialTaskUI(true);
      loadUser();
      loadTaskStatus();
      localStorage.removeItem("specialTasksDone");
    } else {
      if (data.message === "Already claimed") {
        refreshSpecialTaskUI(true);
        localStorage.removeItem("specialTasksDone");
      }
      alert(data.message || "Cannot claim");
    }
  } catch (e) {
    console.log("Claim special task error", e);
  }
};
  
/* ================= SWITCH TASK ================= */
  
function switchTaskTab(tabName){
  if (specialTabContent) specialTabContent.style.display = "none";
  if (leagueTabContent) leagueTabContent.style.display = "none";
  if (refTabContent) refTabContent.style.display = "none";

  if (tabSpecial) tabSpecial.classList.remove("active");
  if (tabLeague) tabLeague.classList.remove("active");
  if (tabRef) tabRef.classList.remove("active");

  if (tabName === "special") {
    if (specialTabContent) specialTabContent.style.display = "block";
    if (tabSpecial) tabSpecial.classList.add("active");
  }

  if (tabName === "league") {
    if (leagueTabContent) leagueTabContent.style.display = "block";
    if (tabLeague) tabLeague.classList.add("active");
  }

  if (tabName === "ref") {
    if (refTabContent) refTabContent.style.display = "block";
    if (tabRef) tabRef.classList.add("active");
  }
}

if (tabSpecial) tabSpecial.onclick = () => switchTaskTab("special");
if (tabLeague) tabLeague.onclick = () => switchTaskTab("league");
if (tabRef) tabRef.onclick = () => switchTaskTab("ref");

async function loadTaskStatus() {
  try {
    const res = await fetch("/task-status/" + telegramId);
    const data = await res.json();

    if (!data.success) return;

    renderLeagueRewards(data.leagueRewards || []);
    renderRefRewards(data.refRewards || []);
    loadSpecialTaskClaimStatus();
  } catch (e) {
    console.log("Task status error", e);
  }
}
  
function renderLeagueRewards(items) {
  const box = document.getElementById("leagueRewardsList");
  if (!box) return;

  box.innerHTML = "";

  items.forEach(item => {
    box.innerHTML += `
      <div class="task-card2">
        <div class="task-left">
          <div class="task-emoji">🏆</div>
          <div>
            <h3>${item.league} League Reward</h3>
            <p>${item.reward} Coins</p>
          </div>
        </div>
        ${
          item.claimed
            ? `<div class="reward-done">Claimed</div>`
            : item.unlocked
            ? `<button class="task-claim-btn" onclick="claimLeagueReward('${item.league}')">Claim</button>`
            : `<button class="task-claim-btn" disabled>Locked</button>`
        }
      </div>
    `;
  });
}

function renderRefRewards(items) {
  const box = document.getElementById("refRewardsList");
  if (!box) return;

  box.innerHTML = "";

  items.forEach(item => {
    box.innerHTML += `
      <div class="task-card2">
        <div class="task-left">
          <div class="task-emoji">👥</div>
          <div>
            <h3>${item.refs} Successful Referrals</h3>
            <p>${item.reward} Coins</p>
          </div>
        </div>
        ${
          item.claimed
            ? `<div class="reward-done">Claimed</div>`
            : item.unlocked
            ? `<button class="task-claim-btn" onclick="claimRefReward('${item.key}')">Claim</button>`
            : `<button class="task-claim-btn" disabled>Locked</button>`
        }
      </div>
    `;
  });
}

window.claimLeagueReward = async function(leagueName) {
  try {
    const res = await fetch("/claim-league-reward", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData, leagueName })
    });

    const data = await res.json();

    if (data.success) {
      alert("Claimed +" + data.reward + " coins");
      loadUser();
      loadTaskStatus();
    } else {
      alert(data.message || "Cannot claim");
    }
  } catch (e) {
    console.log("Claim league reward error", e);
  }
};

window.claimRefReward = async function(rewardKey) {
  try {
    const res = await fetch("/claim-ref-reward", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData, rewardKey })
    });

    const data = await res.json();

    if (data.success) {
      alert("Claimed +" + data.reward + " coins");
      loadUser();
      loadTaskStatus();
    } else {
      alert(data.message || "Cannot claim");
    }
  } catch (e) {
    console.log("Claim ref reward error", e);
  }
};
  
  /* ================= TAP UPGRADE ================= */
  if (upgradeTapBtn) {
    upgradeTapBtn.onclick = async () => {
      try {
        const res = await fetch("/upgrade-tap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telegramId, initData })
        });

        const data = await res.json();
        if (data.success) {
          loadUser();
        } else {
          alert(data.message || "Not enough coins");
        }
      } catch (e) {
        console.log("Upgrade tap error", e);
      }
    };
  }

  /* ================= DAILY COMBO ================= */
  const comboContainer = document.getElementById("combo");

  async function loadDailyCombo() {
    try {
      const res = await fetch("/daily-combo");
      const data = await res.json();

      if (!comboContainer) return;

      comboContainer.innerHTML = "";
      (data.combo || []).forEach(() => {
        comboContainer.innerHTML += `<div class="combo-card">?</div>`;
      });
    } catch (e) {
      console.log("Daily combo error", e);
    }
  }

  /* ================= PROFIT UPGRADE ================= */
  if (upgradeProfitBtn) {
    upgradeProfitBtn.onclick = async () => {
      try {
        const res = await fetch("/upgrade-profit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telegramId, initData })
        });

        const data = await res.json();
        if (data.success) {
          loadUser();
        } else {
          alert(data.message || "Not enough coins");
        }
      } catch (e) {
        console.log("Upgrade profit error", e);
      }
    };
  }

  /* ================= BOOST OPEN/CLOSE ================= */
  const openBoostBtn = document.getElementById("openBoost");
  const backBtn = document.getElementById("backBtn");

  if (openBoostBtn) {
    openBoostBtn.onclick = () => {
      if (earnSection) earnSection.style.display = "none";
      if (boostSection) boostSection.style.display = "block";
    };
  }

  if (backBtn) {
    backBtn.onclick = () => {
      if (boostSection) boostSection.style.display = "none";
      if (earnSection) earnSection.style.display = "block";
    };
  }

  /* ================= NAVIGATION ================= */
  function hideAllSections() {
    if (earnSection) earnSection.style.display = "none";
    if (mineSection) mineSection.style.display = "none";
    if (tasksSection) tasksSection.style.display = "none";
    if (accountSection) accountSection.style.display = "none";
    if (skillsSection) skillsSection.style.display = "none";
    if (cashierSection) cashierSection.style.display = "none";
    if (leagueSection) leagueSection.style.display = "none";
    if (missionPage) missionPage.style.display = "none";
    if (boostSection) boostSection.style.display = "none";

    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
  }

  const navEarn = document.getElementById("navEarn");
  const navMine = document.getElementById("navMine");
  const navTasks = document.getElementById("navTasks");
  const navAccount = document.getElementById("navAccount");
  const navSkills = document.getElementById("navSkills");
  const navCashier = document.getElementById("navCashier");

  if (navEarn) {
    navEarn.onclick = () => {
      hideAllSections();
      if (earnSection) earnSection.style.display = "block";
      navEarn.classList.add("active");
    };
  }

  if (navMine) {
    navMine.onclick = () => {
      hideAllSections();
      if (mineSection) mineSection.style.display = "block";
      navMine.classList.add("active");
    };
  }

document.getElementById("navTasks").onclick = () => {
  hideAllSections();
  tasksSection.style.display = "block";
  document.getElementById("navTasks").classList.add("active");
  switchTaskTab("special");
  loadTaskStatus();
  loadSpecialTaskClaimStatus();
};

  if (navAccount) {
    navAccount.onclick = () => {
      hideAllSections();
      if (accountSection) accountSection.style.display = "block";
      navAccount.classList.add("active");
      loadAccount();
    };
  }

  if (navSkills) {
    navSkills.onclick = () => {
      hideAllSections();
      if (skillsSection) skillsSection.style.display = "block";
      navSkills.classList.add("active");
    };
  }

  if (navCashier) {
    navCashier.onclick = () => {
      hideAllSections();
      if (cashierSection) cashierSection.style.display = "block";
      navCashier.classList.add("active");
    };
  }

  /* ================= LEAGUE OPEN ================= */
  const openLeagueBtn = document.getElementById("openLeague");

  if (openLeagueBtn) {
    openLeagueBtn.onclick = async () => {
      hideAllSections();
      if (leagueSection) leagueSection.style.display = "block";

      try {
        const res = await fetch("/league/" + telegramId);
        const data = await res.json();

        const leagueNameEl = document.getElementById("leagueName");
        if (leagueNameEl) leagueNameEl.innerText = (data.league || "Wood") + " League";

        const topRes = await fetch("/top-league/" + (data.league || "Wood"));
        const players = await topRes.json();

        const box = document.getElementById("leagueTop");
        if (box) {
          box.innerHTML = "";

          players.forEach((p, i) => {
            box.innerHTML += `
              <div class="leaderboard-item">
                <span class="rank">#${i + 1}</span>
                <span class="name">Player ${p.telegramId}</span>
                <span class="coins">${Math.floor(p.coins || 0)}</span>
              </div>
            `;
          });
        }

        const rankRes = await fetch("/rank/" + telegramId);
        const rankData = await rankRes.json();

        const myRankDisplay = document.getElementById("myRankDisplay");
        const myCoinsDisplay = document.getElementById("myCoinsDisplay");

        if (myRankDisplay) myRankDisplay.innerText = "#" + (rankData.rank || "--");
        if (myCoinsDisplay) myCoinsDisplay.innerText = Math.floor(rankData.coins || 0);
      } catch (e) {
        console.log("League error", e);
      }
    };
  }

  const closeLeagueBtn = document.getElementById("closeLeagueBtn");
  if (closeLeagueBtn) {
    closeLeagueBtn.onclick = () => {
      hideAllSections();
      if (earnSection) earnSection.style.display = "block";
      if (navEarn) navEarn.classList.add("active");
    };
  }

  /* ================= ACCOUNT ================= */
  async function loadAccount() {
    try {
      const res = await fetch("/rank/" + telegramId);
      const data = await res.json();

      const accountUserIdEl = document.getElementById("accountUserId");
      const accountUserNameEl = document.getElementById("accountUserName");
      const accountCoinsEl = document.getElementById("accountCoins");
      const accountReferralsEl = document.getElementById("accountReferrals");

      if (accountUserIdEl) accountUserIdEl.innerText = telegramId;
      if (accountUserNameEl) accountUserNameEl.innerText = user.first_name || "User";
      if (accountCoinsEl) accountCoinsEl.innerText = Math.floor(data.coins || 0);
      if (accountReferralsEl) accountReferralsEl.innerText = data.referrals || 0;

      const condCoins = (data.coins || 0) >= 50000;
      const condWallet = false;
      const condRefs = (data.referrals || 0) >= 5;

      const condCoinsEl = document.getElementById("condCoins");
      const condWalletEl = document.getElementById("condWallet");
      const condRefsEl = document.getElementById("condRefs");
      const airdropStatus = document.getElementById("airdropStatus");

      if (condCoinsEl) condCoinsEl.innerText = condCoins ? "✅" : "❌";
      if (condWalletEl) condWalletEl.innerText = condWallet ? "✅" : "❌";
      if (condRefsEl) condRefsEl.innerText = condRefs ? "✅" : "❌";

      if (airdropStatus) {
        if (condCoins && condWallet && condRefs) {
          airdropStatus.innerText = "Eligible";
          airdropStatus.className = "eligibility-status eligible";
        } else {
          airdropStatus.innerText = "Not Eligible";
          airdropStatus.className = "eligibility-status";
        }
      }
    } catch (e) {
      console.log("Account error", e);
    }
  }

  /* ================= DAILY REWARD ================= */
  setTimeout(() => {
    if (dailyPopup && !localStorage.getItem("dailySeen")) {
      dailyPopup.style.display = "flex";
      renderDaily(1);
      localStorage.setItem("dailySeen", "true");
    }
  }, 1000);

  function renderDaily(currentDay) {
    if (!dailyGrid) return;

    dailyGrid.innerHTML = "";
    rewards.forEach((r, i) => {
      dailyGrid.innerHTML += `
        <div class="day-card ${i + 1 === currentDay ? "active-day" : ""}">
          Day ${i + 1}<br>${r}
        </div>
      `;
    });
  }

  if (claimDailyBtn) {
    claimDailyBtn.onclick = async () => {
      try {
        const res = await fetch("/daily-reward", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telegramId, initData })
        });

        const data = await res.json();

        if (data.success) {
          alert("💰 +" + data.reward);
          loadUser();
          renderDaily(data.day);
          if (dailyPopup) dailyPopup.style.display = "none";
        } else {
          alert(data.message || "Already claimed");
        }
      } catch (e) {
        console.log("Claim error", e);
      }
    };
  }

  /* ================= +1 ANIMATION ================= */
  function showPlusOne(amount) {
    const wrapper = document.querySelector(".coin-wrapper");
    if (!wrapper) return;

    const plus = document.createElement("div");
    plus.className = "plus-one";
    plus.innerText = "+" + amount;
    wrapper.appendChild(plus);

    setTimeout(() => plus.remove(), 800);
  }

  /* ================= VERIFY TASK ================= */
  window.verifyTask = async function () {
    try {
      const res = await fetch("/complete-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegramId,
          initData,
          taskId: "telegram_join"
        })
      });

      const data = await res.json();
      if (data.success) {
        alert("Task completed +" + data.reward + " coins");
        loadUser();
      } else {
        alert(data.message || "Task failed");
      }
    } catch (e) {
      console.log("Verify task error", e);
    }
  };
});
