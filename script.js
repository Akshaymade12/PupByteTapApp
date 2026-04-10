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

let appState = {
  btcPairs: null,
  ethPairs: null,
  
  futuresTrading: {
  level: 1,
  upgrading: false,
  currentProfit: 25,
  nextCost: 800,
  upgradeTime: 30,
  upgradeEndTime: null
},
  
  liquidityPool: {
  level: 1,
  upgrading: false,
  currentProfit: 18,
  nextCost: 700,
  upgradeTime: 30,
  upgradeEndTime: null
},
  
  arbitrageBot: {
  level: 1,
  upgrading: false,
  currentProfit: 32,
  nextCost: 1000,
  upgradeTime: 30,
  upgradeEndTime: null
},
  
  signalNetwork: {
  level: 1,
  upgrading: false,
  currentProfit: 40,
  nextCost: 1200,
  upgradeTime: 30,
  upgradeEndTime: null
},
  
  myTeam: {
    level: 1,
    upgrading: false,
    currentBonus: 2,
    nextCost: 1000,
    upgradeTime: 60,
    upgradeEndTime: null,
    members: 0
  },
  marketing: {
  level: 1,
  upgrading: false,
  currentBoost: 2,
  nextBoost: 4,
  effectiveExtraProfit: 0,
  nextCost: 500,
  upgradeTime: 30,
  upgradeEndTime: null
},
  communityManager: {
  level: 1,
  upgrading: false,
  currentBonus: 1,
  effectiveExtraProfit: 0,
  nextBonus: 2,
  nextCost: 900,
  upgradeTime: 30,
  upgradeEndTime: null
},

  partnershipDeals: {
  level: 1,
  upgrading: false,
  currentBoost: 3,
  effectiveExtraProfit: 0,
  nextBoost: 6,
  nextCost: 1100,
  upgradeTime: 30,
  upgradeEndTime: null
},

  ambassadorProgram: {
  level: 1,
  upgrading: false,
  currentBonus: 2,
  effectiveExtraProfit: 0,
  nextBonus: 4,
  nextCost: 1300,
  upgradeTime: 30,
  upgradeEndTime: null
},

  vipPartners: {
  level: 1,
  upgrading: false,
  currentBoost: 4,
  effectiveExtraProfit: 0,
  nextBoost: 8,
  nextCost: 1500,
  upgradeTime: 30,
  upgradeEndTime: null
},
  
taxOptimization: {
  level: 1,
  upgrading: false,
  currentReduction: 1,
  currentTax: 9,
  nextReduction: 2,
  savedProfit: 0,
  nextCost: 800,
  upgradeTime: 30,
  upgradeEndTime: null
},
complianceLicense: {
  level: 1,
  upgrading: false,
  currentReduction: 3,
  nextReduction: 6,
  nextCost: 1200,
  upgradeTime: 30,
  upgradeEndTime: null
},

  auditProtection: {
  level: 1,
  upgrading: false,
  currentProtection: 2,
  effectiveExtraProfit: 0,
  nextProtection: 4,
  nextCost: 1000,
  upgradeTime: 30,
  upgradeEndTime: null
},

  regulatoryLicense: {
  level: 1,
  upgrading: false,
  currentBoost: 3,
  effectiveExtraProfit: 0,
  nextBoost: 6,
  nextCost: 1200,
  upgradeTime: 30,
  upgradeEndTime: null
},

  legalAdvisory: {
  level: 1,
  upgrading: false,
  currentDiscount: 2,
  nextDiscount: 4,
  nextCost: 1400,
  upgradeTime: 30,
  upgradeEndTime: null
},

  courtSettlement: {
  level: 1,
  upgrading: false,
  currentRecovery: 4,
  effectiveExtraProfit: 0,
  nextRecovery: 8,
  nextCost: 1600,
  upgradeTime: 30,
  upgradeEndTime: null
},
  
  turboCharger: {
  level: 1,
  upgrading: false,
  currentBonus: 1,
  nextBonus: 2,
  nextCost: 600,
  upgradeTime: 25,
  upgradeEndTime: null
  },

  energyCore: {
  level: 1,
  upgrading: false,
  currentBonus: 20,
  currentMax: 120,
  nextBonus: 40,
  nextCost: 700,
  upgradeTime: 25,
  upgradeEndTime: null
  },

  powerSurge: {
  level: 1,
  upgrading: false,
  currentBoost: 10,
  recoveryMultiplier: 1.1,
  nextBoost: 20,
  nextCost: 900,
  upgradeTime: 25,
  upgradeEndTime: null
  },

  overclockEngine: {
  level: 1,
  upgrading: false,
  currentTapBoost: 5,
  currentProfitBoost: 2,
  effectiveTapPower: 0,
  effectiveExtraProfit: 0,
  nextTapBoost: 10,
  nextProfitBoost: 4,
  nextCost: 2000,
  upgradeTime: 35,
  upgradeEndTime: null
  },

  neuralSync: {
  level: 1,
  upgrading: false,
  currentBoost: 3,
  nextBoost: 6,
  nextCost: 2200,
  upgradeTime: 35,
  upgradeEndTime: null
  }
};

let btcPairsTimerInterval = null;
  let ethPairsTimerInterval = null;
  let futuresTradingTimerInterval = null;
  let liquidityPoolTimerInterval = null;
  let arbitrageBotTimerInterval = null;
  let signalNetworkTimerInterval = null;
  let myTeamTimerInterval = null;
  let marketingTimerInterval = null;
  let communityManagerTimerInterval = null;
  let partnershipDealsTimerInterval = null;
  let ambassadorProgramTimerInterval = null;
  let vipPartnersTimerInterval = null;
  let taxOptimizationTimerInterval = null;
  let complianceLicenseTimerInterval = null;
  let auditProtectionTimerInterval = null;
  let regulatoryLicenseTimerInterval = null;
  let legalAdvisoryTimerInterval = null;
  let courtSettlementTimerInterval = null;
  let turboChargerTimerInterval = null;
  let energyCoreTimerInterval = null;
  let powerSurgeTimerInterval = null;
  let overclockEngineTimerInterval = null;
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
      energyEl.innerText = `${data.energy || 0}/${data.maxEnergy || appState.energyCore?.currentMax || 120}`;
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
if (copyRefBtn && accountRefLink) {
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
      
appState.btcPairs = data.btcPairs || null;
appState.ethPairs = data.ethPairs || null;
appState.futuresTrading = data.futuresTrading || null;
appState.liquidityPool = data.liquidityPool || null;
appState.arbitrageBot = data.arbitrageBot || null;
appState.signalNetwork = data.signalNetwork || null;
appState.myTeam = data.myTeam || null;
appState.marketing = data.marketing || null;
appState.communityManager = data.communityManager || null;
appState.partnershipDeals = data.partnershipDeals || null;
appState.ambassadorProgram = data.ambassadorProgram || null;
appState.vipPartners = data.vipPartners || null;
appState.taxOptimization = data.taxOptimization || null;
appState.complianceLicense = data.complianceLicense || null;
appState.auditProtection = data.auditProtection || null;
appState.regulatoryLicense = data.regulatoryLicense || null;
appState.legalAdvisory = data.legalAdvisory || null;
appState.courtSettlement = data.courtSettlement || null;
appState.turboCharger = data.turboCharger || null;
appState.energyCore = data.energyCore || null;
appState.powerSurge = data.powerSurge || null;
appState.overclockEngine = data.overclockEngine || null;
appState.neuralSync = data.neuralSync || null;
      
      
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
          energyEl.innerText = `${data.energy || 0}/${data.maxEnergy || appState.energyCore?.currentMax || 120}`;
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
  
/* ================= Legal Section ================= */

  function renderLegalSection() {
  if (!mineTabContent) return;

  const tax = appState.taxOptimization || {
    level: 1,
    upgrading: false,
    currentReduction: 1,
    currentTax: 9,
    nextReduction: 2,
    savedProfit: 0,
    nextCost: 800,
    upgradeTime: 30,
    upgradeEndTime: null
  };

  const compliance = appState.complianceLicense || {
    level: 1,
    upgrading: false,
    currentReduction: 3,
    nextReduction: 6,
    nextCost: 1200,
    upgradeTime: 30,
    upgradeEndTime: null
  };

  const audit = appState.auditProtection || {
    level: 1,
    upgrading: false,
    currentProtection: 2,
    effectiveExtraProfit: 0,
    nextProtection: 4,
    nextCost: 1000,
    upgradeTime: 30,
    upgradeEndTime: null
  };

  const regulatory = appState.regulatoryLicense || {
    level: 1,
    upgrading: false,
    currentBoost: 3,
    effectiveExtraProfit: 0,
    nextBoost: 6,
    nextCost: 1200,
    upgradeTime: 30,
    upgradeEndTime: null
  };

  const advisory = appState.legalAdvisory || {
    level: 1,
    upgrading: false,
    currentDiscount: 2,
    nextDiscount: 4,
    nextCost: 1400,
    upgradeTime: 30,
    upgradeEndTime: null
  };

  const court = appState.courtSettlement || {
    level: 1,
    upgrading: false,
    currentRecovery: 4,
    effectiveExtraProfit: 0,
    nextRecovery: 8,
    nextCost: 1600,
    upgradeTime: 30,
    upgradeEndTime: null
  };

  const makeLegalCard = (id, title, subtitle, icon, data, label, value, upgradeFnName) => {
    const isMax = data.level >= 20;
    const isUpgrading = data.upgrading;

    let middleHtml = "";
    let buttonHtml = "";

    if (isUpgrading && data.upgradeEndTime) {
      const secondsLeft = Math.max(
        0,
        Math.floor((new Date(data.upgradeEndTime).getTime() - Date.now()) / 1000)
      );

      middleHtml = `
        <div class="mine-card-profit-label">Upgrade time</div>
        <div class="mine-card-profit-value" id="${id}Countdown">${formatCountdown(secondsLeft)}</div>
      `;

      buttonHtml = `<button class="mine-card-upgrade-btn" disabled>Upgrading...</button>`;
    } else if (isMax) {
      middleHtml = `
        <div class="mine-card-profit-label">${label}</div>
        <div class="mine-card-profit-value">${value}</div>
      `;

      buttonHtml = `<button class="mine-card-upgrade-btn" disabled>MAX</button>`;
    } else {
      middleHtml = `
        <div class="mine-card-profit-label">${label}</div>
        <div class="mine-card-profit-value">${value}</div>
      `;

      buttonHtml = `<button class="mine-card-upgrade-btn" onclick="${upgradeFnName}()">Upgrade</button>`;
    }

    return `
      <div class="mine-card-box">
        <div class="mine-card-top">
          <div class="mine-card-left">
            <img src="${icon}" alt="${title}" class="mine-card-icon">
            <div class="mine-card-title-wrap">
              <h3 class="mine-card-title">${title}</h3>
              <div class="mine-card-subtitle">${subtitle}</div>
            </div>
          </div>
          <div class="mine-card-level">lvl ${data.level}</div>
        </div>

        ${middleHtml}

        <div class="mine-card-bottom">
          <div class="mine-card-cost">🪙 <span>${isMax ? "MAX" : data.nextCost}</span></div>
          ${buttonHtml}
        </div>
      </div>
    `;
  };

  mineTabContent.innerHTML = `
    <div class="mine-cards-grid">
      ${makeLegalCard(
        "taxOptimization",
        "Tax Optimization",
        "Reduce income tax",
        "models/taxoptimization.png",
        tax,
        "Tax reduction",
        `-${tax.currentReduction}%`,
        "upgradeTaxOptimization"
      )}

      ${makeLegalCard(
        "complianceLicense",
        "Compliance License",
        "Reduce upgrade time",
        "models/compliancelicense.png",
        compliance,
        "Timer reduction",
        `-${compliance.currentReduction}%`,
        "upgradeComplianceLicense"
      )}

      ${makeLegalCard(
        "auditProtection",
        "Audit Protection",
        "Protect passive income",
        "models/auditprotection.png",
        audit,
        "Income protection",
        `+${audit.currentProtection}%`,
        "upgradeAuditProtection"
      )}

      ${makeLegalCard(
        "regulatoryLicense",
        "Regulatory License",
        "Boost legal income safety",
        "models/regulatorylicense.png",
        regulatory,
        "Protection boost",
        `+${regulatory.currentBoost}%`,
        "upgradeRegulatoryLicense"
      )}

      ${makeLegalCard(
        "legalAdvisory",
        "Legal Advisory",
        "Reduce legal upgrade costs",
        "models/legaladvisory.png",
        advisory,
        "Cost reduction",
        `-${advisory.currentDiscount}%`,
        "upgradeLegalAdvisory"
      )}

      ${makeLegalCard(
        "courtSettlement",
        "Court Settlement",
        "Recover lost legal income",
        "models/courtsettlement.png",
        court,
        "Recovery bonus",
        `+${court.currentRecovery}%`,
        "upgradeCourtSettlement"
      )}
    </div>
  `;

  startTaxOptimizationCountdown();
  startComplianceLicenseCountdown();
  startAuditProtectionCountdown();
  startRegulatoryLicenseCountdown();
  startLegalAdvisoryCountdown();
  startCourtSettlementCountdown();
  }
      
 /* ================= SPECIAL SECTION ================= */

  function renderSpecialSection() {
  if (!mineTabContent) return;

  const turbo = appState.turboCharger || {
    level: 1,
    upgrading: false,
    currentBonus: 1,
    nextBonus: 2,
    nextCost: 600,
    upgradeTime: 25,
    upgradeEndTime: null
  };

  const energyCore = appState.energyCore || {
    level: 1,
    upgrading: false,
    currentBonus: 20,
    currentMax: 120,
    nextBonus: 40,
    nextCost: 700,
    upgradeTime: 25,
    upgradeEndTime: null
  };

  const powerSurge = appState.powerSurge || {
    level: 1,
    upgrading: false,
    currentBoost: 10,
    recoveryMultiplier: 1.1,
    nextBoost: 20,
    nextCost: 900,
    upgradeTime: 25,
    upgradeEndTime: null
  };

  const overclock = appState.overclockEngine || {
    level: 1,
    upgrading: false,
    currentTapBoost: 5,
    currentProfitBoost: 2,
    effectiveTapPower: 0,
    effectiveExtraProfit: 0,
    nextTapBoost: 10,
    nextProfitBoost: 4,
    nextCost: 2000,
    upgradeTime: 35,
    upgradeEndTime: null
  };

const neuralSync = appState.neuralSync || {
  level: 1,
  upgrading: false,
  currentBoost: 3,
  nextBoost: 6,
  nextCost: 2200,
  upgradeTime: 35,
  upgradeEndTime: null
 };
    
  const makeSpecialCard = (id, title, subtitle, icon, data, label, value, upgradeFnName) => {
    const isMax = data.level >= 20;
    const isUpgrading = data.upgrading;

    let middleHtml = "";
    let buttonHtml = "";

    if (isUpgrading && data.upgradeEndTime) {
      const secondsLeft = Math.max(
        0,
        Math.floor((new Date(data.upgradeEndTime).getTime() - Date.now()) / 1000)
      );

      middleHtml = `
        <div class="mine-card-profit-label">Upgrade time</div>
        <div class="mine-card-profit-value" id="${id}Countdown">${formatCountdown(secondsLeft)}</div>
      `;

      buttonHtml = `<button class="mine-card-upgrade-btn" disabled>Upgrading...</button>`;
    } else if (isMax) {
      middleHtml = `
        <div class="mine-card-profit-label">${label}</div>
        <div class="mine-card-profit-value">${value}</div>
      `;

      buttonHtml = `<button class="mine-card-upgrade-btn" disabled>MAX</button>`;
    } else {
      middleHtml = `
        <div class="mine-card-profit-label">${label}</div>
        <div class="mine-card-profit-value">${value}</div>
      `;

      buttonHtml = `<button class="mine-card-upgrade-btn" onclick="${upgradeFnName}()">Upgrade</button>`;
    }

    return `
      <div class="mine-card-box">
        <div class="mine-card-top">
          <div class="mine-card-left">
            <img src="${icon}" alt="${title}" class="mine-card-icon">
            <div class="mine-card-title-wrap">
              <h3 class="mine-card-title">${title}</h3>
              <div class="mine-card-subtitle">${subtitle}</div>
            </div>
          </div>
          <div class="mine-card-level">lvl ${data.level}</div>
        </div>

        ${middleHtml}

        <div class="mine-card-bottom">
          <div class="mine-card-cost">🪙 <span>${isMax ? "MAX" : data.nextCost}</span></div>
          ${buttonHtml}
        </div>
      </div>
    `;
  };

  mineTabContent.innerHTML = `
    <div class="mine-cards-grid">
      ${makeSpecialCard(
        "turboCharger",
        "Turbo Charger",
        "Boost tap power",
        "models/turbocharger.png",
        turbo,
        "Tap boost",
        `+${turbo.currentBonus}`,
        "upgradeTurboCharger"
      )}

      ${makeSpecialCard(
        "energyCore",
        "Energy Core",
        "Increase max energy",
        "models/energycore.png",
        energyCore,
        "Max energy",
        `+${energyCore.currentBonus}`,
        "upgradeEnergyCore"
      )}

      ${makeSpecialCard(
        "powerSurge",
        "Power Surge",
        "Boost energy recovery",
        "models/powersurge.png",
        powerSurge,
        "Recovery boost",
        `+${powerSurge.currentBoost}%`,
        "upgradePowerSurge"
      )}

      ${makeSpecialCard(
        "overclockEngine",
        "Overclock Engine",
        "Boost all tap efficiency",
        "models/overclockengine.png",
        overclock,
        "Tap boost",
        `+${overclock.currentTapBoost}%`,
        "upgradeOverclockEngine"
      )}

      ${makeSpecialCard(
  "neuralSync",
  "Neural Sync",
  "Boost all special effects",
  "models/neuralsync.png",
  neuralSync,
  "Boost",
  `+${neuralSync.currentBoost}%`,
  "upgradeNeuralSync"
)}
    </div>
  `;

  startTurboChargerCountdown();
  startEnergyCoreCountdown();
  startPowerSurgeCountdown();
  startOverclockEngineCountdown();
  startNeuralSyncCountdown();
  }
 
/* ================= Team Section ================= */

function renderTeamSection() {
  if (!mineTabContent) return;

  const team = appState.myTeam || {
    level: 1,
    upgrading: false,
    currentBonus: 2,
    nextCost: 1000,
    upgradeTime: 60,
    upgradeEndTime: null,
    members: 0
  };

  const marketing = appState.marketing || {
    level: 1,
    upgrading: false,
    currentBoost: 2,
    nextBoost: 4,
    effectiveExtraProfit: 0,
    nextCost: 500,
    upgradeTime: 30,
    upgradeEndTime: null
  };

  const community = appState.communityManager || {
    level: 1,
    upgrading: false,
    currentBonus: 1,
    effectiveExtraProfit: 0,
    nextBonus: 2,
    nextCost: 900,
    upgradeTime: 30,
    upgradeEndTime: null
  };

  const partnership = appState.partnershipDeals || {
    level: 1,
    upgrading: false,
    currentBoost: 3,
    effectiveExtraProfit: 0,
    nextBoost: 6,
    nextCost: 1100,
    upgradeTime: 30,
    upgradeEndTime: null
  };

  const ambassador = appState.ambassadorProgram || {
    level: 1,
    upgrading: false,
    currentBonus: 2,
    effectiveExtraProfit: 0,
    nextBonus: 4,
    nextCost: 1300,
    upgradeTime: 30,
    upgradeEndTime: null
  };

  const vip = appState.vipPartners || {
    level: 1,
    upgrading: false,
    currentBoost: 4,
    effectiveExtraProfit: 0,
    nextBoost: 8,
    nextCost: 1500,
    upgradeTime: 30,
    upgradeEndTime: null
  };

  const makeTeamCard = (id, title, subtitle, icon, data, label, value, upgradeFnName) => {
    const isMax = data.level >= 20;
    const isUpgrading = data.upgrading;

    let middleHtml = "";
    let buttonHtml = "";

    if (isUpgrading && data.upgradeEndTime) {
      const secondsLeft = Math.max(
        0,
        Math.floor((new Date(data.upgradeEndTime).getTime() - Date.now()) / 1000)
      );

      middleHtml = `
        <div class="mine-card-profit-label">Upgrade time</div>
        <div class="mine-card-profit-value" id="${id}Countdown">${formatCountdown(secondsLeft)}</div>
      `;

      buttonHtml = `<button class="mine-card-upgrade-btn" disabled>Upgrading...</button>`;
    } else if (isMax) {
      middleHtml = `
        <div class="mine-card-profit-label">${label}</div>
        <div class="mine-card-profit-value">${value}</div>
      `;

      buttonHtml = `<button class="mine-card-upgrade-btn" disabled>MAX</button>`;
    } else {
      middleHtml = `
        <div class="mine-card-profit-label">${label}</div>
        <div class="mine-card-profit-value">${value}</div>
      `;

      buttonHtml = `<button class="mine-card-upgrade-btn" onclick="${upgradeFnName}()">Upgrade</button>`;
    }

    return `
      <div class="mine-card-box">
        <div class="mine-card-top">
          <div class="mine-card-left">
            <img src="${icon}" alt="${title}" class="mine-card-icon">
            <div class="mine-card-title-wrap">
              <h3 class="mine-card-title">${title}</h3>
              <div class="mine-card-subtitle">${subtitle}</div>
            </div>
          </div>
          <div class="mine-card-level">lvl ${data.level}</div>
        </div>

        ${middleHtml}

        <div class="mine-card-bottom">
          <div class="mine-card-cost">🪙 <span>${isMax ? "MAX" : data.nextCost}</span></div>
          ${buttonHtml}
        </div>
      </div>
    `;
  };

  mineTabContent.innerHTML = `
    <div class="mine-cards-grid">
      ${makeTeamCard(
        "myTeam",
        "My Team",
        "Invite & earn",
        "models/myteam.png",
        team,
        "Team bonus",
        `+${team.currentBonus}%`,
        "upgradeMyTeam"
      )}

      ${makeTeamCard(
        "marketing",
        "Marketing",
        "Audience boost",
        "models/marketing.png",
        marketing,
        "Boost",
        `+${marketing.currentBoost}%`,
        "upgradeMarketing"
      )}

      ${makeTeamCard(
        "communityManager",
        "Community Manager",
        "Grow referral strength",
        "models/communitymanager.png",
        community,
        "Referral bonus",
        `+${community.currentBonus}`,
        "upgradeCommunityManager"
      )}

      ${makeTeamCard(
        "partnershipDeals",
        "Partnership Deals",
        "Boost team income share",
        "models/partnershipdeals.png",
        partnership,
        "Partner boost",
        `+${partnership.currentBoost}%`,
        "upgradePartnershipDeals"
      )}

      ${makeTeamCard(
        "ambassadorProgram",
        "Ambassador Program",
        "Scale global referrals",
        "models/ambassadorprogram.png",
        ambassador,
        "Referral power",
        `+${ambassador.currentBonus}`,
        "upgradeAmbassadorProgram"
      )}

      ${makeTeamCard(
        "vipPartners",
        "VIP Partners",
        "Elite network advantage",
        "models/vippartners.png",
        vip,
        "VIP boost",
        `+${vip.currentBoost}%`,
        "upgradeVipPartners"
      )}
    </div>
  `;

  startMyTeamCountdown();
  startMarketingCountdown();
  startCommunityManagerCountdown();
  startPartnershipDealsCountdown();
  startAmbassadorProgramCountdown();
  startVipPartnersCountdown();
}
      
/* ================= START MY TEAM COUNTDOWN ================= */
  
function startMyTeamCountdown() {
  if (myTeamTimerInterval) {
    clearInterval(myTeamTimerInterval);
    myTeamTimerInterval = null;
  }

  if (!appState.myTeam || !appState.myTeam.upgrading || !appState.myTeam.upgradeEndTime) {
    return;
  }

  myTeamTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("myTeamCountdown");

    if (!countdownEl || !appState.myTeam?.upgradeEndTime) {
      clearInterval(myTeamTimerInterval);
      myTeamTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.myTeam.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(myTeamTimerInterval);
      myTeamTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("team");
        }
      });
    }
  }, 1000);
}

  function startTaxOptimizationCountdown() {
  if (taxOptimizationTimerInterval) {
    clearInterval(taxOptimizationTimerInterval);
    taxOptimizationTimerInterval = null;
  }

  if (
    !appState.taxOptimization ||
    !appState.taxOptimization.upgrading ||
    !appState.taxOptimization.upgradeEndTime
  ) {
    return;
  }
    
/* ================= TAX OPTIMIZATION COUNTDOWN ================= */
    
  taxOptimizationTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("taxOptimizationCountdown");

    if (!countdownEl || !appState.taxOptimization?.upgradeEndTime) {
      clearInterval(taxOptimizationTimerInterval);
      taxOptimizationTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.taxOptimization.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(taxOptimizationTimerInterval);
      taxOptimizationTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("legal");
        }
      });
    }
  }, 1000);
  }

 /* ================= COMPLIANCEL LICENSE COUNTDOWN ================= */
  
  function startComplianceLicenseCountdown() {
  if (complianceLicenseTimerInterval) {
    clearInterval(complianceLicenseTimerInterval);
    complianceLicenseTimerInterval = null;
  }

  if (
    !appState.complianceLicense ||
    !appState.complianceLicense.upgrading ||
    !appState.complianceLicense.upgradeEndTime
  ) {
    return;
  }

  complianceLicenseTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("complianceLicenseCountdown");

    if (!countdownEl || !appState.complianceLicense?.upgradeEndTime) {
      clearInterval(complianceLicenseTimerInterval);
      complianceLicenseTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.complianceLicense.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(complianceLicenseTimerInterval);
      complianceLicenseTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("legal");
        }
      });
    }
  }, 1000);
  }
  
/* ================= AUDIT PROTECTION COUNTDOWN ================= */
  
  function startAuditProtectionCountdown() {
  if (auditProtectionTimerInterval) {
    clearInterval(auditProtectionTimerInterval);
    auditProtectionTimerInterval = null;
  }

  if (
    !appState.auditProtection ||
    !appState.auditProtection.upgrading ||
    !appState.auditProtection.upgradeEndTime
  ) {
    return;
  }

  auditProtectionTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("auditProtectionCountdown");

    if (!countdownEl || !appState.auditProtection?.upgradeEndTime) {
      clearInterval(auditProtectionTimerInterval);
      auditProtectionTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.auditProtection.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(auditProtectionTimerInterval);
      auditProtectionTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("legal");
        }
      });
    }
  }, 1000);
  }

/* ================= REGULATORY LICENSE COUNTDOWN ================= */

  function startRegulatoryLicenseCountdown() {
  if (regulatoryLicenseTimerInterval) {
    clearInterval(regulatoryLicenseTimerInterval);
    regulatoryLicenseTimerInterval = null;
  }

  if (
    !appState.regulatoryLicense ||
    !appState.regulatoryLicense.upgrading ||
    !appState.regulatoryLicense.upgradeEndTime
  ) {
    return;
  }

  regulatoryLicenseTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("regulatoryLicenseCountdown");

    if (!countdownEl || !appState.regulatoryLicense?.upgradeEndTime) {
      clearInterval(regulatoryLicenseTimerInterval);
      regulatoryLicenseTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.regulatoryLicense.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(regulatoryLicenseTimerInterval);
      regulatoryLicenseTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("legal");
        }
      });
    }
  }, 1000);
  }

  /* ================= LEGAL ADVISORY COUNTDOWN ================= */

  function startLegalAdvisoryCountdown() {
  if (legalAdvisoryTimerInterval) {
    clearInterval(legalAdvisoryTimerInterval);
    legalAdvisoryTimerInterval = null;
  }

  if (
    !appState.legalAdvisory ||
    !appState.legalAdvisory.upgrading ||
    !appState.legalAdvisory.upgradeEndTime
  ) {
    return;
  }

  legalAdvisoryTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("legalAdvisoryCountdown");

    if (!countdownEl || !appState.legalAdvisory?.upgradeEndTime) {
      clearInterval(legalAdvisoryTimerInterval);
      legalAdvisoryTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.legalAdvisory.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(legalAdvisoryTimerInterval);
      legalAdvisoryTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("legal");
        }
      });
    }
  }, 1000);
  }

  /* ================= COURT SETTLEMENT COUNTDOWN ================= */

  function startCourtSettlementCountdown() {
  if (courtSettlementTimerInterval) {
    clearInterval(courtSettlementTimerInterval);
    courtSettlementTimerInterval = null;
  }

  if (
    !appState.courtSettlement ||
    !appState.courtSettlement.upgrading ||
    !appState.courtSettlement.upgradeEndTime
  ) {
    return;
  }

  courtSettlementTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("courtSettlementCountdown");

    if (!countdownEl || !appState.courtSettlement?.upgradeEndTime) {
      clearInterval(courtSettlementTimerInterval);
      courtSettlementTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.courtSettlement.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(courtSettlementTimerInterval);
      courtSettlementTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("legal");
        }
      });
    }
  }, 1000);
  }
  
/* ================= TURBO CHARGER COUNTDOWN ================= */
  
  function startTurboChargerCountdown() {
  if (turboChargerTimerInterval) {
    clearInterval(turboChargerTimerInterval);
    turboChargerTimerInterval = null;
  }

  if (
    !appState.turboCharger ||
    !appState.turboCharger.upgrading ||
    !appState.turboCharger.upgradeEndTime
  ) {
    return;
  }

  turboChargerTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("turboChargerCountdown");

    if (!countdownEl || !appState.turboCharger?.upgradeEndTime) {
      clearInterval(turboChargerTimerInterval);
      turboChargerTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.turboCharger.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(turboChargerTimerInterval);
      turboChargerTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("special");
        }
      });
    }
  }, 1000);
  }
  
/* ================= ENERGY CORE COUNTDOWN ================= */
  
  function startEnergyCoreCountdown() {
  if (energyCoreTimerInterval) {
    clearInterval(energyCoreTimerInterval);
    energyCoreTimerInterval = null;
  }

  if (
    !appState.energyCore ||
    !appState.energyCore.upgrading ||
    !appState.energyCore.upgradeEndTime
  ) {
    return;
  }

  energyCoreTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("energyCoreCountdown");

    if (!countdownEl || !appState.energyCore?.upgradeEndTime) {
      clearInterval(energyCoreTimerInterval);
      energyCoreTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.energyCore.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(energyCoreTimerInterval);
      energyCoreTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("special");
        }
      });
    }
  }, 1000);
  }
  
/* ================= POWER SURGE CONNTDOWN ================= */
  
  function startPowerSurgeCountdown() {
  if (powerSurgeTimerInterval) {
    clearInterval(powerSurgeTimerInterval);
    powerSurgeTimerInterval = null;
  }

  if (
    !appState.powerSurge ||
    !appState.powerSurge.upgrading ||
    !appState.powerSurge.upgradeEndTime
  ) {
    return;
  }

  powerSurgeTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("powerSurgeCountdown");

    if (!countdownEl || !appState.powerSurge?.upgradeEndTime) {
      clearInterval(powerSurgeTimerInterval);
      powerSurgeTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.powerSurge.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(powerSurgeTimerInterval);
      powerSurgeTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("special");
        }
      });
    }
  }, 1000);
  }
  
/* ================= OVERCLOCK ENGINE COUNTDOWN ================= */
  
  function startOverclockEngineCountdown() {
  if (overclockEngineTimerInterval) {
    clearInterval(overclockEngineTimerInterval);
    overclockEngineTimerInterval = null;
  }

  if (
    !appState.overclockEngine ||
    !appState.overclockEngine.upgrading ||
    !appState.overclockEngine.upgradeEndTime
  ) {
    return;
  }

  overclockEngineTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("overclockEngineCountdown");

    if (!countdownEl || !appState.overclockEngine?.upgradeEndTime) {
      clearInterval(overclockEngineTimerInterval);
      overclockEngineTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.overclockEngine.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(overclockEngineTimerInterval);
      overclockEngineTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("special");
        }
      });
    }
  }, 1000);
  }

/* ================= NEURAL SYNC COUNTDOWN ================= */

  let neuralSyncTimerInterval = null;

function startNeuralSyncCountdown() {
  if (neuralSyncTimerInterval) clearInterval(neuralSyncTimerInterval);

  if (!appState.neuralSync?.upgrading) return;

  neuralSyncTimerInterval = setInterval(() => {
    const el = document.getElementById("neuralSyncCountdown");

    if (!el) return;

    const sec = Math.max(
      0,
      Math.floor((new Date(appState.neuralSync.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    el.innerText = formatCountdown(sec);

    if (sec <= 0) {
      clearInterval(neuralSyncTimerInterval);
      loadUser().then(() => switchMineTab("special"));
    }
  }, 1000);
}
  
/* ================= MARKETING COUNTDOWN ================= */
  
 function startMarketingCountdown() {
  if (marketingTimerInterval) {
    clearInterval(marketingTimerInterval);
    marketingTimerInterval = null;
  }

  if (!appState.marketing || !appState.marketing.upgrading || !appState.marketing.upgradeEndTime) {
    return;
  }

  marketingTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("marketingCountdown");

    if (!countdownEl || !appState.marketing?.upgradeEndTime) {
      clearInterval(marketingTimerInterval);
      marketingTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.marketing.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(marketingTimerInterval);
      marketingTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("team");
        }
      });
    }
  }, 1000);
 }
  
/* ================= COMMUNITY MANAGER CONUTDOWN ================= */
  
  function startCommunityManagerCountdown() {
  if (communityManagerTimerInterval) {
    clearInterval(communityManagerTimerInterval);
    communityManagerTimerInterval = null;
  }

  if (
    !appState.communityManager ||
    !appState.communityManager.upgrading ||
    !appState.communityManager.upgradeEndTime
  ) {
    return;
  }

  communityManagerTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("communityManagerCountdown");

    if (!countdownEl || !appState.communityManager?.upgradeEndTime) {
      clearInterval(communityManagerTimerInterval);
      communityManagerTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.communityManager.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(communityManagerTimerInterval);
      communityManagerTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("team");
        }
      });
    }
  }, 1000);
  }
  
/* ================= PARTNERSHIP DEALS COUNTDOWN ================= */
  
  function startPartnershipDealsCountdown() {
  if (partnershipDealsTimerInterval) {
    clearInterval(partnershipDealsTimerInterval);
    partnershipDealsTimerInterval = null;
  }

  if (
    !appState.partnershipDeals ||
    !appState.partnershipDeals.upgrading ||
    !appState.partnershipDeals.upgradeEndTime
  ) {
    return;
  }

  partnershipDealsTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("partnershipDealsCountdown");

    if (!countdownEl || !appState.partnershipDeals?.upgradeEndTime) {
      clearInterval(partnershipDealsTimerInterval);
      partnershipDealsTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.partnershipDeals.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(partnershipDealsTimerInterval);
      partnershipDealsTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("team");
        }
      });
    }
  }, 1000);
  }
  
/* ================= START AMBASSADOR PROGRAM COUNTDOWN ================= */
  
  function startAmbassadorProgramCountdown() {
  if (ambassadorProgramTimerInterval) {
    clearInterval(ambassadorProgramTimerInterval);
    ambassadorProgramTimerInterval = null;
  }

  if (
    !appState.ambassadorProgram ||
    !appState.ambassadorProgram.upgrading ||
    !appState.ambassadorProgram.upgradeEndTime
  ) {
    return;
  }

  ambassadorProgramTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("ambassadorProgramCountdown");

    if (!countdownEl || !appState.ambassadorProgram?.upgradeEndTime) {
      clearInterval(ambassadorProgramTimerInterval);
      ambassadorProgramTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.ambassadorProgram.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(ambassadorProgramTimerInterval);
      ambassadorProgramTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("team");
        }
      });
    }
  }, 1000);
  }
  
/* ================= VIP PARTNERS COUNTDOWN ================= */
  
  function startVipPartnersCountdown() {
  if (vipPartnersTimerInterval) {
    clearInterval(vipPartnersTimerInterval);
    vipPartnersTimerInterval = null;
  }

  if (
    !appState.vipPartners ||
    !appState.vipPartners.upgrading ||
    !appState.vipPartners.upgradeEndTime
  ) {
    return;
  }

  vipPartnersTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("vipPartnersCountdown");

    if (!countdownEl || !appState.vipPartners?.upgradeEndTime) {
      clearInterval(vipPartnersTimerInterval);
      vipPartnersTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.vipPartners.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(vipPartnersTimerInterval);
      vipPartnersTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("team");
        }
      });
    }
  }, 1000);
  }
  
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

 /* ================= UPGRADE BTC PAIRS ================= */
  
  window.upgradeBtcPairs = async function() {
  try {
    const res = await fetch("/upgrade-btc-pairs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
  coinsEl.innerText = Math.floor(data.coins || 0);
appState.btcPairs = data.btcPairs || null;
renderMarketSection();
loadUser();
    
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade btc pairs error", e);
  }
};

/* ================= UPGRADE ETH PAIRS ================= */
  
window.upgradeEthPairs = async function() {
  try {
    const res = await fetch("/upgrade-eth-pairs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.ethPairs = data.ethPairs || null;
      renderMarketSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade eth pairs error", e);
  }
};

/* ================= UPGRADE FUTURES TRADING ================= */
  
  window.upgradeFuturesTrading = async function() {
  try {
    const res = await fetch("/upgrade-futures-trading", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.futuresTrading = data.futuresTrading || null;
      renderMarketSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade futures trading error", e);
  }
};
  
/* ================= UPGRADE LIQUIDITY POOL ================= */
  
  window.upgradeLiquidityPool = async function() {
  try {
    const res = await fetch("/upgrade-liquidity-pool", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.liquidityPool = data.liquidityPool || null;
      renderMarketSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade liquidity pool error", e);
  }
};

/* ================= UPGRADE ARBITRAGE BOT ================= */
  
 window.upgradeArbitrageBot = async function() {
  try {
    const res = await fetch("/upgrade-arbitrage-bot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.arbitrageBot = data.arbitrageBot || null;
      renderMarketSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade arbitrage bot error", e);
  }
};

  /* ================= UPGRADE SIGNAL NETWORK ================= */
  
  window.upgradeSignalNetwork = async function() {
  try {
    const res = await fetch("/upgrade-signal-network", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.signalNetwork = data.signalNetwork || null;
      renderMarketSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade signal network error", e);
  }
};
  
/* ================= UPGRADE MY TEAM ================= */
  
  window.upgradeMyTeam = async function() {
  try {
    const res = await fetch("/upgrade-my-team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.myTeam = data.myTeam || null;
      renderTeamSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade my team error", e);
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
  
/* ================= MARKETING UPGRADE ================= */
  
  window.upgradeMarketing = async function() {
  try {
    const res = await fetch("/upgrade-marketing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.marketing = data.marketing || null;
      renderTeamSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade marketing error", e);
  }
};

 /* ================= COMMUNITY MANAGER UPGRADE ================= */

  window.upgradeCommunityManager = async function() {
  try {
    const res = await fetch("/upgrade-community-manager", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.communityManager = data.communityManager || null;
      renderTeamSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade community manager error", e);
  }
};

 /* ================= PARTNERSHIP DEALS UPGRADE ================= */

  window.upgradePartnershipDeals = async function() {
  try {
    const res = await fetch("/upgrade-partnership-deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.partnershipDeals = data.partnershipDeals || null;
      renderTeamSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade partnership deals error", e);
  }
};

/* ================= AMBASSADOR PROGRAM UPGRADE ================= */

  window.upgradeAmbassadorProgram = async function() {
  try {
    const res = await fetch("/upgrade-ambassador-program", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.ambassadorProgram = data.ambassadorProgram || null;
      renderTeamSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade ambassador program error", e);
  }
};

/* ================= VIP PARTNERS UPGRADE ================= */

  window.upgradeVipPartners = async function() {
  try {
    const res = await fetch("/upgrade-vip-partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.vipPartners = data.vipPartners || null;
      renderTeamSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade vip partners error", e);
  }
};
  
/* ================= UPGRADE TAX OPTIMIZATION ================= */
  
  window.upgradeTaxOptimization = async function() {
  try {
    const res = await fetch("/upgrade-tax-optimization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.taxOptimization = data.taxOptimization || null;
      renderLegalSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade tax optimization error", e);
  }
};

/* ================= COMPLIANCE LICENSE UPGRADE ================= */

  window.upgradeComplianceLicense = async function() {
  try {
    const res = await fetch("/upgrade-compliance-license", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.complianceLicense = data.complianceLicense || null;
      renderLegalSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade compliance license error", e);
  }
};

  /* ================= AUDIT PROTECTION UPGRADE ================= */

  window.upgradeAuditProtection = async function() {
  try {
    const res = await fetch("/upgrade-audit-protection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.auditProtection = data.auditProtection || null;
      renderLegalSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade audit protection error", e);
  }
};

/* ================= REGULATORY LICENSE UPGRADE ================= */

  window.upgradeRegulatoryLicense = async function() {
  try {
    const res = await fetch("/upgrade-regulatory-license", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.regulatoryLicense = data.regulatoryLicense || null;
      renderLegalSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade regulatory license error", e);
  }
};

  /* ================= LEGAL ADVISORY UPGRADE ================= */

  window.upgradeLegalAdvisory = async function() {
  try {
    const res = await fetch("/upgrade-legal-advisory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.legalAdvisory = data.legalAdvisory || null;
      renderLegalSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade legal advisory error", e);
  }
};

  /* ================= COURT SETTLEMENT UPGRADE ================= */

  window.upgradeCourtSettlement = async function() {
  try {
    const res = await fetch("/upgrade-court-settlement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.courtSettlement = data.courtSettlement || null;
      renderLegalSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade court settlement error", e);
  }
};
  
 /* ================= TURBO CHARGER UPGRADE ================= */

  window.upgradeTurboCharger = async function() {
  try {
    const res = await fetch("/upgrade-turbo-charger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.turboCharger = data.turboCharger || null;
      renderSpecialSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade turbo charger error", e);
  }
};
  
/* ================= UPGRADE ENERGY CORE ================= */
  
  window.upgradeEnergyCore = async function() {
  try {
    const res = await fetch("/upgrade-energy-core", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.energyCore = data.energyCore || null;
      renderSpecialSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade energy core error", e);
  }
};

/* ================= POWER SURGE UPGRADE ================= */

  window.upgradePowerSurge = async function() {
  try {
    const res = await fetch("/upgrade-power-surge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.powerSurge = data.powerSurge || null;
      renderSpecialSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade power surge error", e);
  }
};
  
/* ================= OVERCLOCK ENGINE UPGRADE ================= */

  window.upgradeOverclockEngine = async function() {
  try {
    const res = await fetch("/upgrade-overclock-engine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = Math.floor(data.coins || 0);
      appState.overclockEngine = data.overclockEngine || null;
      renderSpecialSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade overclock engine error", e);
  }
};

/* ================= NEURAL SYNC UPGRADE ================= */

  window.upgradeNeuralSync = async function () {
  const res = await fetch("/upgrade-neural-sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId, initData })
  });

  const data = await res.json();

  if (data.success) {
    appState.neuralSync = data.neuralSync;
    renderSpecialSection();
    loadUser();
  }
};
  
/* ================= DAILY COMBO ================= */
const comboContainer = document.getElementById("combo");

/* ================= COUNTDOWN TIMER ================= */
  
function formatCountdown(seconds) {
  const total = Math.max(0, Math.floor(seconds));

  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
  
/* ================= MARKET CARD HELPERS ================= */

function getCardProfit(level) {
  return 10 * Math.pow(2, level - 1);
}

function getCardCost(level) {
  return 500 * Math.pow(4, level - 1);
}

/* ================= MARKET SECTION ================= */

  function renderMarketSection() {
  if (!mineTabContent) return;

  const btc = appState.btcPairs || {
    level: 1,
    upgrading: false,
    currentProfit: 10,
    nextCost: 500,
    upgradeTime: 30,
    upgradeEndTime: null
  };

  const eth = appState.ethPairs || {
    level: 1,
    upgrading: false,
    currentProfit: 8,
    nextCost: 400,
    upgradeTime: 30,
    upgradeEndTime: null
  };

  const futures = appState.futuresTrading || {
    level: 1,
    upgrading: false,
    currentProfit: 25,
    nextCost: 800,
    upgradeTime: 30,
    upgradeEndTime: null
  };

  const liquidity = appState.liquidityPool || {
    level: 1,
    upgrading: false,
    currentProfit: 18,
    nextCost: 700,
    upgradeTime: 30,
    upgradeEndTime: null
  };

  const arbitrage = appState.arbitrageBot || {
    level: 1,
    upgrading: false,
    currentProfit: 32,
    nextCost: 1000,
    upgradeTime: 30,
    upgradeEndTime: null
  };

  const signal = appState.signalNetwork || {
    level: 1,
    upgrading: false,
    currentProfit: 40,
    nextCost: 1200,
    upgradeTime: 30,
    upgradeEndTime: null
  };

  const makeCard = (id, title, subtitle, icon, data, upgradeFnName) => {
    const isMax = data.level >= 20;
    const isUpgrading = data.upgrading;

    let middleHtml = "";
    let buttonHtml = "";

    if (isUpgrading && data.upgradeEndTime) {
      const secondsLeft = Math.max(
        0,
        Math.floor((new Date(data.upgradeEndTime).getTime() - Date.now()) / 1000)
      );

      middleHtml = `
        <div class="mine-card-profit-label">Upgrade time</div>
        <div class="mine-card-profit-value" id="${id}Countdown">${formatCountdown(secondsLeft)}</div>
      `;

      buttonHtml = `<button class="mine-card-upgrade-btn" disabled>Upgrading...</button>`;
    } else if (isMax) {
      middleHtml = `
        <div class="mine-card-profit-label">Profit per hour</div>
        <div class="mine-card-profit-value">+${data.currentProfit}</div>
      `;

      buttonHtml = `<button class="mine-card-upgrade-btn" disabled>MAX</button>`;
    } else {
      middleHtml = `
        <div class="mine-card-profit-label">Profit per hour</div>
        <div class="mine-card-profit-value">+${data.currentProfit}</div>
      `;

      buttonHtml = `<button class="mine-card-upgrade-btn" onclick="${upgradeFnName}()">Upgrade</button>`;
    }

    return `
      <div class="mine-card-box">
        <div class="mine-card-top">
          <div class="mine-card-left">
            <img src="${icon}" alt="${title}" class="mine-card-icon">
            <div class="mine-card-title-wrap">
              <h3 class="mine-card-title">${title}</h3>
              <div class="mine-card-subtitle">${subtitle}</div>
            </div>
          </div>
          <div class="mine-card-level">lvl ${data.level}</div>
        </div>

        ${middleHtml}

        <div class="mine-card-bottom">
          <div class="mine-card-cost">🪙 <span>${isMax ? "MAX" : data.nextCost}</span></div>
          ${buttonHtml}
        </div>
      </div>
    `;
  };

  mineTabContent.innerHTML = `
    <div class="mine-cards-grid">
      ${makeCard("btcPairs", "BTC Pairs", "Bitcoin market", "models/btcpairs.png", btc, "upgradeBtcPairs")}
      ${makeCard("ethPairs", "ETH Pairs", "Ethereum market", "models/ethpairs.png", eth, "upgradeEthPairs")}
      ${makeCard("futuresTrading", "Futures Trading", "High risk, high reward", "models/futurestrading.png", futures, "upgradeFuturesTrading")}
      ${makeCard("liquidityPool", "Liquidity Pool", "Stable passive income", "models/liquiditypool.png", liquidity, "upgradeLiquidityPool")}
      ${makeCard("arbitrageBot", "Arbitrage Bot", "Exploit price gaps", "models/arbitragebot.png", arbitrage, "upgradeArbitrageBot")}
      ${makeCard("signalNetwork", "Signal Network", "Predict market moves", "models/signalnetwork.png", signal, "upgradeSignalNetwork")}
    </div>
  `;

  startBtcPairsCountdown();
  startEthPairsCountdown();
  startFuturesTradingCountdown();
  startLiquidityPoolCountdown();
  startArbitrageBotCountdown();
  startSignalNetworkCountdown();
  }
  
/* ================= BTC PAIRS COUNTDOWN ================= */
  
function startBtcPairsCountdown() {
  if (btcPairsTimerInterval) {
    clearInterval(btcPairsTimerInterval);
    btcPairsTimerInterval = null;
  }

  if (!appState.btcPairs || !appState.btcPairs.upgrading || !appState.btcPairs.upgradeEndTime) {
    return;
  }

  btcPairsTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("btcPairsCountdown");

    if (!countdownEl || !appState.btcPairs?.upgradeEndTime) {
      clearInterval(btcPairsTimerInterval);
      btcPairsTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.btcPairs.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(btcPairsTimerInterval);
      btcPairsTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("market");
        }
      });
    }
  }, 1000);
}

/* ================= ETH PAIRS COUNTDOWN ================= */
  
function startEthPairsCountdown() {
  if (ethPairsTimerInterval) {
    clearInterval(ethPairsTimerInterval);
    ethPairsTimerInterval = null;
  }

  if (!appState.ethPairs || !appState.ethPairs.upgrading || !appState.ethPairs.upgradeEndTime) {
    return;
  }

  ethPairsTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("ethPairsCountdown");

    if (!countdownEl || !appState.ethPairs?.upgradeEndTime) {
      clearInterval(ethPairsTimerInterval);
      ethPairsTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.ethPairs.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(ethPairsTimerInterval);
      ethPairsTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("market");
        }
      });
    }
  }, 1000);
}

/* ================= FUTURES TRADING COUNTDOWN ================= */

  function startFuturesTradingCountdown() {
  if (futuresTradingTimerInterval) {
    clearInterval(futuresTradingTimerInterval);
    futuresTradingTimerInterval = null;
  }

  if (!appState.futuresTrading || !appState.futuresTrading.upgrading || !appState.futuresTrading.upgradeEndTime) {
    return;
  }

  futuresTradingTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("futuresTradingCountdown");

    if (!countdownEl || !appState.futuresTrading?.upgradeEndTime) {
      clearInterval(futuresTradingTimerInterval);
      futuresTradingTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.futuresTrading.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(futuresTradingTimerInterval);
      futuresTradingTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("market");
        }
      });
    }
  }, 1000);
  }
  
/* ================= LIQUIDITY POOL COUNTDOWN ================= */
  
  function startLiquidityPoolCountdown() {
  if (liquidityPoolTimerInterval) {
    clearInterval(liquidityPoolTimerInterval);
    liquidityPoolTimerInterval = null;
  }

  if (!appState.liquidityPool || !appState.liquidityPool.upgrading || !appState.liquidityPool.upgradeEndTime) {
    return;
  }

  liquidityPoolTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("liquidityPoolCountdown");

    if (!countdownEl || !appState.liquidityPool?.upgradeEndTime) {
      clearInterval(liquidityPoolTimerInterval);
      liquidityPoolTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.liquidityPool.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(liquidityPoolTimerInterval);
      liquidityPoolTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("market");
        }
      });
    }
  }, 1000);
  }
  
/* ================= ARBITRAGE BOT COUNTDOWN ================= */
  
  function startArbitrageBotCountdown() {
  if (arbitrageBotTimerInterval) {
    clearInterval(arbitrageBotTimerInterval);
    arbitrageBotTimerInterval = null;
  }

  if (!appState.arbitrageBot || !appState.arbitrageBot.upgrading || !appState.arbitrageBot.upgradeEndTime) {
    return;
  }

  arbitrageBotTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("arbitrageBotCountdown");

    if (!countdownEl || !appState.arbitrageBot?.upgradeEndTime) {
      clearInterval(arbitrageBotTimerInterval);
      arbitrageBotTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.arbitrageBot.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(arbitrageBotTimerInterval);
      arbitrageBotTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("market");
        }
      });
    }
  }, 1000);
  }
  
/* ================= SIGNAL NETWORK COUNTDOWN ================= */
  
  function startSignalNetworkCountdown() {
  if (signalNetworkTimerInterval) {
    clearInterval(signalNetworkTimerInterval);
    signalNetworkTimerInterval = null;
  }

  if (!appState.signalNetwork || !appState.signalNetwork.upgrading || !appState.signalNetwork.upgradeEndTime) {
    return;
  }

  signalNetworkTimerInterval = setInterval(() => {
    const countdownEl = document.getElementById("signalNetworkCountdown");

    if (!countdownEl || !appState.signalNetwork?.upgradeEndTime) {
      clearInterval(signalNetworkTimerInterval);
      signalNetworkTimerInterval = null;
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.floor((new Date(appState.signalNetwork.upgradeEndTime).getTime() - Date.now()) / 1000)
    );

    countdownEl.innerText = formatCountdown(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(signalNetworkTimerInterval);
      signalNetworkTimerInterval = null;
      loadUser().then(() => {
        if (mineSection && mineSection.style.display !== "none") {
          switchMineTab("market");
        }
      });
    }
  }, 1000);
  }
  
/* ================= MINE TABS ================= */

const mineTabMarket = document.getElementById("mineTabMarket");
const mineTabTeam = document.getElementById("mineTabTeam");
const mineTabLegal = document.getElementById("mineTabLegal");
const mineTabSpecial = document.getElementById("mineTabSpecial");
const mineTabContent = document.getElementById("mineTabContent");

function switchMineTab(tabName) {
  if (!mineTabContent) return;

  [mineTabMarket, mineTabTeam, mineTabLegal, mineTabSpecial].forEach(btn => {
    if (btn) btn.classList.remove("active");
  });

  if (tabName === "market") {
    if (mineTabMarket) mineTabMarket.classList.add("active");
    renderMarketSection();
  }

if (tabName === "team") {
  if (mineTabTeam) mineTabTeam.classList.add("active");
  renderTeamSection();
}

  if (tabName === "legal") {
  if (mineTabLegal) mineTabLegal.classList.add("active");
  renderLegalSection();
}

  if (tabName === "special") {
  if (mineTabSpecial) mineTabSpecial.classList.add("active");
  renderSpecialSection();
}
    }
  
if (mineTabMarket) mineTabMarket.onclick = () => switchMineTab("market");
if (mineTabTeam) mineTabTeam.onclick = () => switchMineTab("team");
if (mineTabLegal) mineTabLegal.onclick = () => switchMineTab("legal");
if (mineTabSpecial) mineTabSpecial.onclick = () => switchMineTab("special");

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
    switchMineTab("market");
  };
}

if (navTasks) {
  navTasks.onclick = () => {
    hideAllSections();
    if (tasksSection) tasksSection.style.display = "block";
    navTasks.classList.add("active");
    switchTaskTab("special");
    loadTaskStatus();
    loadSpecialTaskClaimStatus();
  };
}

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
