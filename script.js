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

/* ================= BOOST UI ELEMENTS ================= */

const upgradeBoostX2Btn = document.getElementById("upgradeBoostX2Btn");
const upgradeMultitapBtn = document.getElementById("upgradeMultitapBtn");
const upgradeEnergyLimitBtn = document.getElementById("upgradeEnergyLimitBtn");
const upgradeRechargingSpeedBtn = document.getElementById("upgradeRechargingSpeedBtn");

const upgradeCriticalStrikeBtn = document.getElementById("upgradeCriticalStrikeBtn");
const criticalStrikeLevelText = document.getElementById("criticalStrikeLevelText");
const criticalStrikeChanceText = document.getElementById("criticalStrikeChanceText");
const criticalStrikeMultiplierText = document.getElementById("criticalStrikeMultiplierText");
const criticalStrikeCostText = document.getElementById("criticalStrikeCostText");

const upgradeBotOptimizationBtn = document.getElementById("upgradeBotOptimizationBtn");
const botOptimizationLevelText = document.getElementById("botOptimizationLevelText");
const botOptimizationValueText = document.getElementById("botOptimizationValueText");
const botOptimizationCostText = document.getElementById("botOptimizationCostText");

const upgradeDailyAmplifierBtn = document.getElementById("upgradeDailyAmplifierBtn");
const dailyAmplifierLevelText = document.getElementById("dailyAmplifierLevelText");
const dailyAmplifierValueText = document.getElementById("dailyAmplifierValueText");
const dailyAmplifierCostText = document.getElementById("dailyAmplifierCostText");

const boostX2CostText = document.getElementById("boostX2CostText");
const multitapCostText = document.getElementById("multitapCostText");
const multitapLevelText = document.getElementById("multitapLevelText");
const energyLimitCostText = document.getElementById("energyLimitCostText");
const energyLimitLevelText = document.getElementById("energyLimitLevelText");
const rechargingSpeedCostText = document.getElementById("rechargingSpeedCostText");
const rechargingSpeedLevelText = document.getElementById("rechargingSpeedLevelText");

const upgradeAutoTapBotBtn = document.getElementById("upgradeAutoTapBotBtn");
const autoTapBotCostText = document.getElementById("autoTapBotCostText");
const autoTapBotStatusText = document.getElementById("autoTapBotStatusText");

const upgradeOfflineYieldBtn = document.getElementById("upgradeOfflineYieldBtn");
const offlineYieldLevelText = document.getElementById("offlineYieldLevelText");
const offlineYieldValueText = document.getElementById("offlineYieldValueText");
const offlineYieldCostText = document.getElementById("offlineYieldCostText");

const watchAdBtn = document.getElementById("watchAdBtn");
const dailySpinBtn = document.getElementById("dailySpinBtn");
const dailySpinText = document.getElementById("dailySpinText");
const spinWheel = document.getElementById("spinWheel");
const rewardAdLimitText = document.getElementById("rewardAdLimitText");

const freeTapDailyCard = document.getElementById("freeTapDailyCard");
const freeTapDailyText = document.getElementById("freeTapDailyText");
const freeEnergyDailyCard = document.getElementById("freeEnergyDailyCard");
const freeEnergyDailyText = document.getElementById("freeEnergyDailyText");

const tapBtn = document.getElementById("tapBtn");
const upgradeTapBtn = document.getElementById("upgradeTapBtn");
const upgradeProfitBtn = document.getElementById("upgradeProfitBtn");

const earnSection = document.getElementById("earnSection");
const boostSection = document.getElementById("boostSection");
const tasksSection = document.getElementById("tasksSection");
const leagueSection = document.getElementById("leagueSection");

const leaderboardTabGlobal = document.getElementById("leaderboardTabGlobal");
const leaderboardTabLeague = document.getElementById("leaderboardTabLeague");
const leaderboardListTitle = document.getElementById("leaderboardListTitle");
const leaderboardCountText = document.getElementById("leaderboardCountText");

const accountSection = document.getElementById("accountSection");
const skillsSection = document.getElementById("skillsSection");
const cashierSection = document.getElementById("cashierSection");
const spinSection = document.getElementById("spinSection");
const mineSection = document.getElementById("mineSection");
const missionPage = document.getElementById("missionPage");

const accountUserId = document.getElementById("accountUserId");
const accountUserName = document.getElementById("accountUserName");
const profileName = document.getElementById("profileName");
const profileAvatar = document.getElementById("profileAvatar");
const profileLeagueBadge = document.getElementById("profileLeagueBadge");
const accountProfit = document.getElementById("accountProfit");
const accountCoins = document.getElementById("accountCoins");
const accountReferrals = document.getElementById("accountReferrals");
const accountRefLink = document.getElementById("accountRefLink");
const copyRefBtn = document.getElementById("copyRefBtn");

const airdropScoreText = document.getElementById("airdropScore");
const airdropTierText = document.getElementById("airdropTier");
const airdropProgress = document.getElementById("airdropProgress");
const coinScoreText = document.getElementById("coinScoreText");
const refScoreText = document.getElementById("refScoreText");
const taskScoreText = document.getElementById("taskScoreText");
const activityScoreText = document.getElementById("activityScoreText");
const upgradeScoreText = document.getElementById("upgradeScoreText");

const missionTabSpin = document.getElementById("missionTabSpin");
const missionTabDaily = document.getElementById("missionTabDaily");
const missionTabEvents = document.getElementById("missionTabEvents");
const missionSpinPanel = document.getElementById("missionSpinPanel");
const missionDailyPanel = document.getElementById("missionDailyPanel");
const missionEventsPanel = document.getElementById("missionEventsPanel");
const missionsList = document.getElementById("missionsList");

const offlinePopup = document.getElementById("offlinePopup");
const offlineCoinsText = document.getElementById("offlineCoinsText");
const closeOfflinePopup = document.getElementById("closeOfflinePopup");

const dailyPopup = document.getElementById("dailyRewardPopup");
const dailyGrid = document.getElementById("dailyGrid");
const claimDailyBtn = document.getElementById("claimDailyBtn");

const comboContainer = document.getElementById("combo");
const claimComboBtn = document.getElementById("claimBtn");

  const rewards = [500, 1000, 2500, 5000, 15000, 25000, 100000, 500000, 1000000, 5000000];

let appState = {
  btcPairs: null,
  ethPairs: null,

  dailySpin: {
  dailyLimit: 1,
  usedToday: 0,
  remaining: 1
},

  rewardedAds: {
  reward: 1000,
  watchedToday: 0,
  dailyLimit: 5,
  remaining: 5,
  cooldownLeftMs: 0
},
  
  boostX2: {
    level: 0,
    active: false,
    multiplier: 2,
    priceGems: 400,
    durationMinutes: 30,
    endTime: null
  },

  freeTapDaily: {
    usesToday: 0,
    dailyLimit: 3,
    active: false,
    multiplier: 5,
    endTime: null
  },

  freeEnergyDaily: {
    usesToday: 0,
    dailyLimit: 3
  },

  criticalStrike: {
  level: 0,
  chance: 0,
  multiplier: 2,
  nextCost: 1000,
  upgrading: false,
  upgradeEndTime: null
},
  
  autoTapBot: {
  active: false,
  priceCoins: 200000,
  durationHours: 12,
  endTime: null,
  coinsPerSecond: 0,
  coinsPerHour: 0
},
  
  offlineYield: {
  level: 0,
  boostPercent: 0,
  nextCost: 1500,
  upgrading: false,
  upgradeEndTime: null
},

  dailyAmplifier: {
  level: 0,
  boostPercent: 0,
  nextCost: 2000,
  upgrading: false,
  upgradeEndTime: null
},

  botOptimization: {
  level: 0,
  boostPercent: 0,
  nextCost: 1800,
  upgrading: false,
  upgradeEndTime: null
},
  
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
  nextCost: 2500,
  upgradeTime: 35,
  upgradeEndTime: null
  },

  quantumCore: {
  level: 1,
  upgrading: false,
  currentBoost: 3,
  multiplier: 1.03,
  nextBoost: 6,
  nextCost: 3000,
  upgradeTime: 40,
  upgradeEndTime: null
  }
};
  
let rewardedAdInterval = null;
let btcPairsTimerInterval = null;
  let ethPairsTimerInterval = null;
  let futuresTradingTimerInterval = null;
  let liquidityPoolTimerInterval = null;
  let arbitrageBotTimerInterval = null;
  let signalNetworkTimerInterval = null;
  let myTeamTimerInterval = null;
  let freeTapDailyTimerInterval = null;
  let autoTapBotTimerInterval = null;
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
  let criticalStrikeTimerInterval = null;
  let offlineYieldTimerInterval = null;
  let botOptimizationTimerInterval = null;
  let dailyAmplifierTimerInterval = null;
  let selectedComboCards = [];
let dailyComboCards = [];
let dailyComboLocked = false;
let dailyComboStatus = "";
  
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
  body: JSON.stringify({
    telegramId,
    initData,
    playerName: user.first_name || "Player",
    username: user.username || ""
  })
});
const data = await res.json();

if (!data || data.success === false) {
  console.log("User load failed ❌", data);
  return;
}

if (offlinePopup && offlineCoinsText && (data.offlineCoins || 0) > 0) {
  offlineCoinsText.innerText = `+${Math.floor(data.offlineCoins)} coins`;
  offlinePopup.style.display = "flex";
}

      coinsEl.innerText = formatNumber(data.coins || 0);
      energyEl.innerText = `${data.energy || 0}/${data.maxEnergy || appState.energyCore?.currentMax || 120}`;
      profitEl.innerText = formatNumber(data.profitPerHour);

      const leagueText = document.getElementById("currentLeagueText");
      if (leagueText) leagueText.innerText = data.league || "Wood";

      updateLeagueProgress(data.coins || 0);

      if (accountUserId) accountUserId.innerText = telegramId;
      if (accountUserName) accountUserName.innerText = user.first_name || "User";
      if (profileName) profileName.innerText = data.playerName || user.first_name || "Player";

if (profileAvatar) {
  const firstLetter = (data.playerName || user.first_name || "P").charAt(0).toUpperCase();
  profileAvatar.innerText = firstLetter;
}

if (profileLeagueBadge) {
  profileLeagueBadge.innerText = data.league || "Wood";
}

if (accountProfit) {
  accountProfit.innerText = formatNumber(data.profitPerHour || 0);
}
      if (accountCoins) accountCoins.innerText = formatNumber(data.coins || 0);
      if (accountReferrals) accountReferrals.innerText = data.referrals || 0;

      if (data.airdrop) {
  if (airdropScoreText) {
    airdropScoreText.innerText = data.airdrop.score || 0;
  }

  if (airdropTierText) {
    airdropTierText.innerText = data.airdrop.tier || "Not Eligible";
  }

  if (airdropProgress) {
    const percent = Math.min(((data.airdrop.score || 0) / 350) * 100, 100);
    airdropProgress.style.width = percent + "%";
  }

  const b = data.airdrop.breakdown || {};

  if (coinScoreText) coinScoreText.innerText = `${b.coinsScore || 0} pts`;
  if (refScoreText) refScoreText.innerText = `${b.referralScore || 0} pts`;
  if (taskScoreText) taskScoreText.innerText = `${b.taskScore || 0} pts`;
  if (activityScoreText) activityScoreText.innerText = `${b.activityScore || 0} pts`;
  if (upgradeScoreText) upgradeScoreText.innerText = `${b.upgradeScore || 0} pts`;
      }
      
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
appState.quantumCore = data.quantumCore || null;
appState.dailySpin = data.dailySpin || appState.dailySpin;
appState.rewardedAds = data.rewardedAds || appState.rewardedAds;
appState.boostX2 = data.boostX2 || appState.boostX2;
appState.freeTapDaily = data.freeTapDaily || appState.freeTapDaily;
appState.freeEnergyDaily = data.freeEnergyDaily || appState.freeEnergyDaily;
appState.autoTapBot = data.autoTapBot || appState.autoTapBot;
appState.offlineYield = data.offlineYield || appState.offlineYield;
appState.botOptimization = data.botOptimization || appState.botOptimization;
appState.dailyAmplifier = data.dailyAmplifier || appState.dailyAmplifier;

appState.criticalStrike = data.criticalStrike || appState.criticalStrike;

renderDailySpinUI();
renderRewardAdUI();
startRewardAdCooldownTimer();
renderBoostSectionUI();
startBoostX2Timer();
renderFreeTapDailyUI();
startFreeTapDailyTimer();
renderFreeEnergyDailyUI();
renderAutoTapBotUI();
startAutoTapBotTimer();
renderCriticalStrikeUI();
startCriticalStrikeTimer();
startOfflineYieldTimer();
startDailyAmplifierTimer();
renderOfflineYieldUI();
renderBotOptimizationUI();
startBotOptimizationTimer();
renderDailyAmplifierUI();
      
// loadDailyCombo();
    } catch (e) {
      console.log("Load user error", e);
    }
  }

  loadUser();

  if (closeOfflinePopup) {
    closeOfflinePopup.onclick = () => {
      if (offlinePopup) offlinePopup.style.display = "none";
    };
  }

  /* ================= UPGRADE BOOST 2X ================= */

  if (upgradeBoostX2Btn) {
  upgradeBoostX2Btn.addEventListener("click", async () => {
    try {
      const res = await fetch("/activate-boost-x2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId, initData })
      });

      const data = await res.json();

      if (data.success) {
        coinsEl.innerText = formatNumber(data.coins || 0);
        appState.boostX2 = data.boostX2 || appState.boostX2;
        renderBoostSectionUI();
        startBoostX2Timer();
        loadUser();
      } else {
        alert(data.message || "Boost activation failed");
      }
    } catch (e) {
      console.log("Boost X2 error", e);
      alert("Server error");
    }
  });
}

if (upgradeMultitapBtn) {
  upgradeMultitapBtn.addEventListener("click", () => {
    if (typeof window.upgradeTurboCharger === "function") {
      window.upgradeTurboCharger();
    }
  });
}

if (upgradeEnergyLimitBtn) {
  upgradeEnergyLimitBtn.addEventListener("click", () => {
    if (typeof window.upgradeEnergyCore === "function") {
      window.upgradeEnergyCore();
    }
  });
}

if (upgradeRechargingSpeedBtn) {
  upgradeRechargingSpeedBtn.addEventListener("click", () => {
    if (typeof window.upgradePowerSurge === "function") {
      window.upgradePowerSurge();
    }
  });
}
  
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
  coinsEl.innerText = formatNumber(data.coins || 0);
  energyEl.innerText = `${data.energy || 0}/${data.maxEnergy || appState.energyCore?.currentMax || 120}`;
  profitEl.innerText = data.profitPerHour || 0;

  const leagueText = document.getElementById("currentLeagueText");
  if (leagueText) leagueText.innerText = data.league || "Wood";

  if (accountCoins) accountCoins.innerText = formatNumber(data.coins || 0);

  if (data.boostX2) {
    appState.boostX2 = data.boostX2;
  }

          if (data.freeTapDaily) {
  appState.freeTapDaily = data.freeTapDaily;
  renderFreeTapDailyUI();
  startFreeTapDailyTimer();
}
          
  if (appState.energyCore) {
    appState.energyCore.currentMax =
      data.maxEnergy || appState.energyCore.currentMax;
  }

  renderBoostSectionUI();
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

const quantumCore = appState.quantumCore || {
  level: 1,
  upgrading: false,
  currentBoost: 3,
  multiplier: 1.03,
  nextBoost: 6,
  nextCost: 3000,
  upgradeTime: 40,
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

${makeSpecialCard(
  "quantumCore",
  "Quantum Core",
  "Multiply all income",
  "models/quantumcore.png",
  quantumCore,
  "Multiplier",
  `x${quantumCore.multiplier}`,
  "upgradeQuantumCore"
)}
    </div>
  `;

  startTurboChargerCountdown();
  startEnergyCoreCountdown();
  startPowerSurgeCountdown();
  startOverclockEngineCountdown();
  startNeuralSyncCountdown();
  startQuantumCountdown();
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
  
/* ================= AD FORMAT UI ================= */
  
  function formatAdCooldown(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  
function renderRewardAdUI() {
  const ads = appState.rewardedAds || {
    reward: 1000,
    watchedToday: 0,
    dailyLimit: 5,
    remaining: 5,
    cooldownLeftMs: 0
  };

  if (rewardAdLimitText) {
    rewardAdLimitText.innerText = `Remaining: ${ads.remaining}/${ads.dailyLimit} today`;
  }

  if (!watchAdBtn) return;

  if (ads.remaining <= 0) {
    watchAdBtn.innerText = "Limit Reached";
    watchAdBtn.disabled = true;
    return;
  }

  if (ads.cooldownLeftMs > 0) {
    watchAdBtn.innerText = formatAdCooldown(ads.cooldownLeftMs);
    watchAdBtn.disabled = true;
    return;
  }

  watchAdBtn.innerText = "Watch";
  watchAdBtn.disabled = false;
}

  /* ================= ADS COOLDOWN UI ================= */

  function startAdCooldownUI() {
  let time = 30;
  watchAdBtn.disabled = true;

  const i = setInterval(() => {
    watchAdBtn.innerText = `Wait ${time}s`;
    time--;

    if (time < 0) {
      clearInterval(i);
      watchAdBtn.disabled = false;
      watchAdBtn.innerText = "Watch Ad";
    }
  }, 1000);
  }
  
  /* ================= FORMAT NUMBER ================= */

  function formatNumber(num) {
  if (num === null || num === undefined) return "0";

  if (num >= 1e12) return (num / 1e12).toFixed(1).replace(/\.0$/, "") + "T";
  if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K";

  return Math.floor(num).toString();
  }

/* ================= LEADERBOARD HELPER API ================= */

  function shortPlayerId(id) {
  const text = String(id || "Player");
  if (text.length <= 6) return text;
  return text.slice(0, 3) + "..." + text.slice(-3);
}

function getRankIcon(rank) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "#" + rank;
}

function renderLeaderboardPlayers(players) {
  const box = document.getElementById("leagueTop");
  if (!box) return;

  box.innerHTML = "";

  if (!players || players.length === 0) {
    box.innerHTML = `
      <div class="leaderboard-empty">
        No players found yet.
      </div>
    `;
    return;
  }

  players.forEach((p, i) => {
    const rank = p.rank || i + 1;

    box.innerHTML += `
      <div class="leaderboard-player-card ${rank <= 3 ? "top-rank" : ""}">
        <div class="leaderboard-rank-badge">${getRankIcon(rank)}</div>

        <div class="leaderboard-player-main">
          <div class="leaderboard-player-name">Player ${shortPlayerId(p.telegramId)}</div>
          <div class="leaderboard-player-meta">
            ${p.league || "Wood"} League • ⛏ ${formatNumber(p.profitPerHour || 0)}/H
          </div>
        </div>

        <div class="leaderboard-player-coins">
          🪙 ${formatNumber(p.coins || 0)}
        </div>
      </div>
    `;
  });
}
  
/* ================= GLOBAL LEADERBOARD LOAD ================= */

  async function loadGlobalLeaderboard() {
  try {
    if (leaderboardTabGlobal) leaderboardTabGlobal.classList.add("active");
    if (leaderboardTabLeague) leaderboardTabLeague.classList.remove("active");
    if (leaderboardListTitle) leaderboardListTitle.innerText = "Top Global Players";
    if (leaderboardCountText) leaderboardCountText.innerText = "Top 50";

    const res = await fetch("/leaderboard/global/" + telegramId);
    const data = await res.json();

    if (!data.success) return;

    const leagueNameEl = document.getElementById("leagueName");
    const myRankDisplay = document.getElementById("myRankDisplay");
    const myCoinsDisplay = document.getElementById("myCoinsDisplay");

    if (leagueNameEl) leagueNameEl.innerText = "🏆 Leaderboard";
    if (myRankDisplay) myRankDisplay.innerText = "#" + (data.myRank || "--");
    if (myCoinsDisplay) myCoinsDisplay.innerText = formatNumber(data.myCoins || 0);

    renderLeaderboardPlayers(data.players || []);
  } catch (e) {
    console.log("Global leaderboard error", e);
  }
}

async function loadLeagueLeaderboard() {
  try {
    if (leaderboardTabLeague) leaderboardTabLeague.classList.add("active");
    if (leaderboardTabGlobal) leaderboardTabGlobal.classList.remove("active");
    if (leaderboardListTitle) leaderboardListTitle.innerText = "Top League Players";
    if (leaderboardCountText) leaderboardCountText.innerText = "Top 10";

    const res = await fetch("/league/" + telegramId);
    const data = await res.json();

    const league = data.league || "Wood";

    const leagueNameEl = document.getElementById("leagueName");
    if (leagueNameEl) leagueNameEl.innerText = `🏆 ${league} League`;

    const topRes = await fetch("/top-league/" + league);
    const players = await topRes.json();

    const rankRes = await fetch("/rank/" + telegramId);
    const rankData = await rankRes.json();

    const myRankDisplay = document.getElementById("myRankDisplay");
    const myCoinsDisplay = document.getElementById("myCoinsDisplay");

    if (myRankDisplay) myRankDisplay.innerText = "#" + (rankData.rank || "--");
    if (myCoinsDisplay) myCoinsDisplay.innerText = formatNumber(rankData.coins || 0);

    renderLeaderboardPlayers(
      (players || []).map((p, index) => ({
        rank: index + 1,
        telegramId: p.telegramId,
        coins: p.coins || 0,
        league: p.league || league,
        profitPerHour: p.profitPerHour || 0
      }))
    );
  } catch (e) {
    console.log("League leaderboard error", e);
  }
}

if (leaderboardTabGlobal) {
  leaderboardTabGlobal.onclick = () => loadGlobalLeaderboard();
}

if (leaderboardTabLeague) {
  leaderboardTabLeague.onclick = () => loadLeagueLeaderboard();
}
  
/* ================= BOOST SECTION UI ================= */

function formatBoostTimeLeft(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function renderBoostSectionUI() {
  /* ---------- Boost X2 ---------- */
  const x2 = appState.boostX2 || {
    level: 0,
    active: false,
    multiplier: 2,
    priceGems: 400,
    durationMinutes: 30,
    endTime: null
  };

  if (boostX2CostText) {
    boostX2CostText.innerText = x2.priceGems || 400;
  }

  if (upgradeBoostX2Btn) {
    if (x2.active && x2.endTime) {
      const leftMs = Math.max(0, new Date(x2.endTime).getTime() - Date.now());
      upgradeBoostX2Btn.innerText = leftMs > 0 ? formatBoostTimeLeft(leftMs) : "›";
      upgradeBoostX2Btn.disabled = leftMs > 0;
    } else {
      upgradeBoostX2Btn.innerText = "›";
      upgradeBoostX2Btn.disabled = false;
    }
  }

  /* ---------- Multitap = turboCharger ---------- */
  const multitap = appState.turboCharger || {
    level: 1,
    upgrading: false,
    currentBonus: 1,
    nextBonus: 2,
    nextCost: 600,
    upgradeTime: 25,
    upgradeEndTime: null
  };

  if (multitapCostText) {
    multitapCostText.innerText = multitap.level >= 20 ? "MAX" : (multitap.nextCost ?? 600);
  }

  if (multitapLevelText) {
    if (multitap.upgrading && multitap.upgradeEndTime) {
      const leftMs = Math.max(0, new Date(multitap.upgradeEndTime).getTime() - Date.now());
      multitapLevelText.innerText = leftMs > 0 ? formatBoostTimeLeft(leftMs) : `${multitap.level} level`;
    } else {
      multitapLevelText.innerText = `${multitap.level} level`;
    }
  }

  if (upgradeMultitapBtn) {
    if (multitap.level >= 20) {
      upgradeMultitapBtn.innerText = "✓";
      upgradeMultitapBtn.disabled = true;
    } else if (multitap.upgrading) {
      upgradeMultitapBtn.innerText = "…";
      upgradeMultitapBtn.disabled = true;
    } else {
      upgradeMultitapBtn.innerText = "›";
      upgradeMultitapBtn.disabled = false;
    }
  }

  /* ---------- Energy Limit = energyCore ---------- */
  const energyLimit = appState.energyCore || {
    level: 1,
    upgrading: false,
    currentBonus: 20,
    currentMax: 120,
    nextBonus: 40,
    nextCost: 700,
    upgradeTime: 25,
    upgradeEndTime: null
  };

  if (energyLimitCostText) {
    energyLimitCostText.innerText = energyLimit.level >= 20 ? "MAX" : (energyLimit.nextCost ?? 700);
  }

  if (energyLimitLevelText) {
    if (energyLimit.upgrading && energyLimit.upgradeEndTime) {
      const leftMs = Math.max(0, new Date(energyLimit.upgradeEndTime).getTime() - Date.now());
      energyLimitLevelText.innerText = leftMs > 0 ? formatBoostTimeLeft(leftMs) : `${energyLimit.level} level`;
    } else {
      energyLimitLevelText.innerText = `${energyLimit.level} level`;
    }
  }

  if (upgradeEnergyLimitBtn) {
    if (energyLimit.level >= 20) {
      upgradeEnergyLimitBtn.innerText = "✓";
      upgradeEnergyLimitBtn.disabled = true;
    } else if (energyLimit.upgrading) {
      upgradeEnergyLimitBtn.innerText = "…";
      upgradeEnergyLimitBtn.disabled = true;
    } else {
      upgradeEnergyLimitBtn.innerText = "›";
      upgradeEnergyLimitBtn.disabled = false;
    }
  }

  
  /* ---------- Recharging Speed = powerSurge ---------- */
  const recharge = appState.powerSurge || {
    level: 1,
    upgrading: false,
    currentBoost: 10,
    recoveryMultiplier: 1.1,
    nextBoost: 20,
    nextCost: 900,
    upgradeTime: 25,
    upgradeEndTime: null
  };

  if (rechargingSpeedCostText) {
    rechargingSpeedCostText.innerText = recharge.level >= 20 ? "MAX" : (recharge.nextCost ?? 900);
  }

  if (rechargingSpeedLevelText) {
    if (recharge.upgrading && recharge.upgradeEndTime) {
      const leftMs = Math.max(0, new Date(recharge.upgradeEndTime).getTime() - Date.now());
      rechargingSpeedLevelText.innerText = leftMs > 0 ? formatBoostTimeLeft(leftMs) : `${recharge.level} level`;
    } else {
      rechargingSpeedLevelText.innerText = `${recharge.level} level`;
    }
  }

  if (upgradeRechargingSpeedBtn) {
    if (recharge.level >= 20) {
      upgradeRechargingSpeedBtn.innerText = "✓";
      upgradeRechargingSpeedBtn.disabled = true;
    } else if (recharge.upgrading) {
      upgradeRechargingSpeedBtn.innerText = "…";
      upgradeRechargingSpeedBtn.disabled = true;
    } else {
      upgradeRechargingSpeedBtn.innerText = "›";
      upgradeRechargingSpeedBtn.disabled = false;
    }
  }
}
  
/* ================= BOOST X2 TIMER  ================= */

let boostX2TimerInterval = null;

function startBoostX2Timer() {
  if (boostX2TimerInterval) {
    clearInterval(boostX2TimerInterval);
    boostX2TimerInterval = null;
  }

  if (!appState.boostX2?.active || !appState.boostX2?.endTime) {
    renderBoostSectionUI();
    return;
  }

  renderBoostSectionUI();

  boostX2TimerInterval = setInterval(() => {
    if (!appState.boostX2?.active || !appState.boostX2?.endTime) {
      clearInterval(boostX2TimerInterval);
      boostX2TimerInterval = null;
      renderBoostSectionUI();
      return;
    }

    const leftMs = Math.max(0, new Date(appState.boostX2.endTime).getTime() - Date.now());

    if (leftMs <= 0) {
      appState.boostX2.active = false;
      appState.boostX2.endTime = null;
      clearInterval(boostX2TimerInterval);
      boostX2TimerInterval = null;
      renderBoostSectionUI();
      loadUser();
      return;
    }

    renderBoostSectionUI();
  }, 1000);
}
  
/* ================= FREE DAILY TAP  ================= */
  
 function renderFreeTapDailyUI() {
  const freeTap = appState.freeTapDaily || {
    usesToday: 0,
    dailyLimit: 3,
    active: false,
    multiplier: 5,
    endTime: null
  };

  if (!freeTapDailyText) return;

  if (freeTap.active && freeTap.endTime) {
    const leftMs = Math.max(0, new Date(freeTap.endTime).getTime() - Date.now());
    freeTapDailyText.innerText = leftMs > 0
      ? `${formatBoostTimeLeft(leftMs)} | x5 active`
      : "Used";
    return;
  }

  const remaining = Math.max(0, (freeTap.dailyLimit || 3) - (freeTap.usesToday || 0));
  freeTapDailyText.innerText = `${remaining}/${freeTap.dailyLimit || 3} available`;
}
  
/* ================= FREE DAILY ENERGY  ================= */
  
  function renderFreeEnergyDailyUI() {
  const freeEnergy = appState.freeEnergyDaily || {
    usesToday: 0,
    dailyLimit: 3
  };

  if (!freeEnergyDailyText) return;

  const remaining = Math.max(
    0,
    (freeEnergy.dailyLimit || 3) - (freeEnergy.usesToday || 0)
  );

  freeEnergyDailyText.innerText = `${remaining}/${freeEnergy.dailyLimit || 3} available`;
  }

/* ================= AUTO BOT TAP  ================= */

  function renderAutoTapBotUI() {
  const bot = appState.autoTapBot || {
    active: false,
    priceCoins: 200000,
    durationHours: 12,
    endTime: null,
    coinsPerSecond: 0,
    coinsPerHour: 0
  };

  if (autoTapBotCostText) {
    autoTapBotCostText.innerText = bot.active
      ? `${formatNumber(bot.coinsPerHour || 0)}/H`
      : formatNumber(bot.priceCoins || 200000);
  }

  if (autoTapBotStatusText) {
    if (bot.active && bot.endTime) {
      const leftMs = Math.max(0, new Date(bot.endTime).getTime() - Date.now());
      autoTapBotStatusText.innerText =
        leftMs > 0 ? `Active ${formatBoostTimeLeft(leftMs)}` : "Inactive";
    } else {
      autoTapBotStatusText.innerText = "Inactive";
    }
  }

  if (upgradeAutoTapBotBtn) {
    if (bot.active && bot.endTime) {
      upgradeAutoTapBotBtn.style.opacity = "0.85";
    } else {
      upgradeAutoTapBotBtn.style.opacity = "1";
    }
  }
}
  /* ================= AUTO BOT TAP TIMER ================= */

  function startAutoTapBotTimer() {
  if (autoTapBotTimerInterval) {
    clearInterval(autoTapBotTimerInterval);
    autoTapBotTimerInterval = null;
  }

  if (!appState.autoTapBot?.active || !appState.autoTapBot?.endTime) {
    renderAutoTapBotUI();
    return;
  }

  renderAutoTapBotUI();

  autoTapBotTimerInterval = setInterval(() => {
    const current = appState.autoTapBot;

    if (!current?.active || !current?.endTime) {
      clearInterval(autoTapBotTimerInterval);
      autoTapBotTimerInterval = null;
      renderAutoTapBotUI();
      return;
    }

    const leftMs = Math.max(0, new Date(current.endTime).getTime() - Date.now());

    if (leftMs <= 0) {
      current.active = false;
      current.endTime = null;
      clearInterval(autoTapBotTimerInterval);
      autoTapBotTimerInterval = null;
      renderAutoTapBotUI();
      loadUser();
      return;
    }

    renderAutoTapBotUI();
  }, 1000);
}
  
/* ================= FREE DAILY TAP TIMER  ================= */
  
  function startFreeTapDailyTimer() {
  if (freeTapDailyTimerInterval) {
    clearInterval(freeTapDailyTimerInterval);
    freeTapDailyTimerInterval = null;
  }

  const freeTap = appState.freeTapDaily;
  if (!freeTap?.active || !freeTap?.endTime) {
    renderFreeTapDailyUI();
    return;
  }

  renderFreeTapDailyUI();

  freeTapDailyTimerInterval = setInterval(() => {
    const current = appState.freeTapDaily;

    if (!current?.active || !current?.endTime) {
      clearInterval(freeTapDailyTimerInterval);
      freeTapDailyTimerInterval = null;
      renderFreeTapDailyUI();
      return;
    }

    const leftMs = Math.max(0, new Date(current.endTime).getTime() - Date.now());

    if (leftMs <= 0) {
      current.active = false;
      current.endTime = null;
      clearInterval(freeTapDailyTimerInterval);
      freeTapDailyTimerInterval = null;
      renderFreeTapDailyUI();
      loadUser();
      return;
    }

    renderFreeTapDailyUI();
  }, 1000);
}

/* ================= CRITICAL STRIKE UI ================= */

function renderCriticalStrikeUI() {
  const skill = appState.criticalStrike || {
    level: 0,
    chance: 0,
    multiplier: 2,
    nextCost: 1000,
    upgrading: false,
    upgradeEndTime: null
  };

  if (criticalStrikeLevelText) {
    criticalStrikeLevelText.innerText = `lvl ${skill.level || 0}`;
  }

  if (criticalStrikeChanceText) {
    criticalStrikeChanceText.innerText = `${skill.chance || 0}%`;
  }

  if (criticalStrikeMultiplierText) {
    criticalStrikeMultiplierText.innerText = `x${skill.multiplier || 2}`;
  }

  if (skill.upgrading && skill.upgradeEndTime) {
    const leftMs = Math.max(0, new Date(skill.upgradeEndTime).getTime() - Date.now());
    const totalSec = Math.max(0, Math.floor(leftMs / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const timerText = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

    if (criticalStrikeCostText) criticalStrikeCostText.innerText = timerText;

    if (upgradeCriticalStrikeBtn) {
      upgradeCriticalStrikeBtn.innerText = "Upgrading...";
      upgradeCriticalStrikeBtn.disabled = true;
    }

    return;
  }

  if (criticalStrikeCostText) {
    criticalStrikeCostText.innerText =
      skill.level >= 20 ? "MAX" : `${skill.nextCost || 0}`;
  }

  if (upgradeCriticalStrikeBtn) {
    upgradeCriticalStrikeBtn.innerText = skill.level >= 20 ? "MAX" : "Upgrade";
    upgradeCriticalStrikeBtn.disabled = skill.level >= 20;
  }
}

/* ================= CRITICAL STRIKE TIMER ================= */

  function startCriticalStrikeTimer() {
  if (criticalStrikeTimerInterval) {
    clearInterval(criticalStrikeTimerInterval);
    criticalStrikeTimerInterval = null;
  }

  if (!appState.criticalStrike?.upgrading || !appState.criticalStrike?.upgradeEndTime) {
    renderCriticalStrikeUI();
    return;
  }

  renderCriticalStrikeUI();

  criticalStrikeTimerInterval = setInterval(() => {
    if (!appState.criticalStrike?.upgrading || !appState.criticalStrike?.upgradeEndTime) {
      clearInterval(criticalStrikeTimerInterval);
      criticalStrikeTimerInterval = null;
      renderCriticalStrikeUI();
      return;
    }

    const leftMs = Math.max(
      0,
      new Date(appState.criticalStrike.upgradeEndTime).getTime() - Date.now()
    );

    if (leftMs <= 0) {
      clearInterval(criticalStrikeTimerInterval);
      criticalStrikeTimerInterval = null;
      loadUser();
      return;
    }

    renderCriticalStrikeUI();
  }, 1000);
  }
  
/* ================= DAILY AMPLIFIER UI  ================= */

  function renderDailyAmplifierUI() {
  const skill = appState.dailyAmplifier || {
    level: 0,
    boostPercent: 0,
    nextCost: 2000,
    upgrading: false,
    upgradeEndTime: null
  };

  if (dailyAmplifierLevelText) {
    dailyAmplifierLevelText.innerText = `lvl ${skill.level || 0}`;
  }

  if (dailyAmplifierValueText) {
    dailyAmplifierValueText.innerText = `+${skill.boostPercent || 0}%`;
  }

  if (skill.upgrading && skill.upgradeEndTime) {
    const leftMs = Math.max(0, new Date(skill.upgradeEndTime).getTime() - Date.now());
    const totalSec = Math.max(0, Math.floor(leftMs / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const timerText = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

    if (dailyAmplifierCostText) dailyAmplifierCostText.innerText = timerText;

    if (upgradeDailyAmplifierBtn) {
      upgradeDailyAmplifierBtn.innerText = "Upgrading...";
      upgradeDailyAmplifierBtn.disabled = true;
    }

    return;
  }

  if (dailyAmplifierCostText) {
    dailyAmplifierCostText.innerText =
      skill.level >= 20 ? "MAX" : `${skill.nextCost || 0}`;
  }

  if (upgradeDailyAmplifierBtn) {
    upgradeDailyAmplifierBtn.innerText = skill.level >= 20 ? "MAX" : "Upgrade";
    upgradeDailyAmplifierBtn.disabled = skill.level >= 20;
  }
}
  
/* ================= DAILY AMPLIFIER TIMER  ================= */
  
function startDailyAmplifierTimer() {
  if (dailyAmplifierTimerInterval) {
    clearInterval(dailyAmplifierTimerInterval);
    dailyAmplifierTimerInterval = null;
  }

  if (!appState.dailyAmplifier?.upgrading || !appState.dailyAmplifier?.upgradeEndTime) {
    renderDailyAmplifierUI();
    return;
  }

  renderDailyAmplifierUI();

  dailyAmplifierTimerInterval = setInterval(() => {
    if (!appState.dailyAmplifier?.upgrading || !appState.dailyAmplifier?.upgradeEndTime) {
      clearInterval(dailyAmplifierTimerInterval);
      dailyAmplifierTimerInterval = null;
      renderDailyAmplifierUI();
      return;
    }

    const leftMs = Math.max(
      0,
      new Date(appState.dailyAmplifier.upgradeEndTime).getTime() - Date.now()
    );

    if (leftMs <= 0) {
      clearInterval(dailyAmplifierTimerInterval);
      dailyAmplifierTimerInterval = null;
      loadUser();
      return;
    }

    renderDailyAmplifierUI();
  }, 1000);
}
  /* ================= MISSIONS TABS ================= */

function switchMissionTab(tabName) {
  if (missionSpinPanel) missionSpinPanel.style.display = "none";
  if (missionDailyPanel) missionDailyPanel.style.display = "none";
  if (missionEventsPanel) missionEventsPanel.style.display = "none";

  if (missionTabSpin) missionTabSpin.classList.remove("active");
  if (missionTabDaily) missionTabDaily.classList.remove("active");
  if (missionTabEvents) missionTabEvents.classList.remove("active");

  if (tabName === "spin") {
    if (missionSpinPanel) missionSpinPanel.style.display = "block";
    if (missionTabSpin) missionTabSpin.classList.add("active");
    renderDailySpinUI();
  }

  if (tabName === "daily") {
    if (missionDailyPanel) missionDailyPanel.style.display = "block";
    if (missionTabDaily) missionTabDaily.classList.add("active");
    loadMissions();
  }

  if (tabName === "events") {
    if (missionEventsPanel) missionEventsPanel.style.display = "block";
    if (missionTabEvents) missionTabEvents.classList.add("active");
  }
}

if (missionTabSpin) {
  missionTabSpin.addEventListener("click", () => {
    switchMissionTab("spin");
  });
}

if (missionTabDaily) {
  missionTabDaily.addEventListener("click", () => {
    switchMissionTab("daily");
  });
}

if (missionTabEvents) {
  missionTabEvents.addEventListener("click", () => {
    switchMissionTab("events");
  });
}
  
  /* ================= DAILY SPIN UI ================= */

function renderDailySpinUI() {
  const spin = appState.dailySpin || {
    dailyLimit: 1,
    usedToday: 0,
    remaining: 1
  };

  if (dailySpinText) {
    dailySpinText.innerText = `${spin.remaining}/${spin.dailyLimit} spin available`;
  }

  if (dailySpinBtn) {
    if (spin.remaining <= 0) {
      dailySpinBtn.innerText = "Come Back Tomorrow";
      dailySpinBtn.disabled = true;
    } else {
      dailySpinBtn.innerText = "Spin Now";
      dailySpinBtn.disabled = false;
    }
  }
}

/* ================= DAILY MISSIONS UI ================= */

async function loadMissions() {
  try {
    const res = await fetch("/missions-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (!data.success) return;

    renderMissions(data.missions || {});
  } catch (e) {
    console.log("Load missions error", e);
  }
}

function getMissionIcon(key) {
  if (key === "tap") return "👆";
  if (key === "spin") return "🎰";
  if (key === "ad") return "🎥";
  return "🔥";
}

function renderMissions(missions) {
  if (!missionsList) return;

  missionsList.innerHTML = "";

  Object.keys(missions).forEach(key => {
    const mission = missions[key];
    const progress = mission.progress || 0;
    const goal = mission.goal || 1;
    const percent = Math.min((progress / goal) * 100, 100);

    const card = document.createElement("div");
    card.className = "mission-card";

    card.innerHTML = `
      <div class="mission-card-top">
        <div>
          <div class="mission-card-title">${getMissionIcon(key)} ${mission.title || key}</div>
          <div class="mission-card-sub">${progress}/${goal} completed</div>
        </div>
        <div class="mission-reward">🪙 ${formatNumber(mission.reward || 0)}</div>
      </div>

      <div class="mission-progress-wrap">
        <div class="mission-progress-text">
          <span>Progress</span>
          <span>${Math.floor(percent)}%</span>
        </div>
        <div class="mission-progress-bar">
          <div class="mission-progress-fill" style="width:${percent}%"></div>
        </div>
      </div>

      <button class="mission-claim-btn" ${!mission.done || mission.claimed ? "disabled" : ""}>
        ${mission.claimed ? "Claimed ✅" : mission.done ? "Claim Reward" : "In Progress"}
      </button>
    `;

    const btn = card.querySelector(".mission-claim-btn");

    btn.onclick = async () => {
      try {
        const res = await fetch("/claim-mission", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telegramId, initData, type: key })
        });

        const data = await res.json();

        if (data.success) {
          alert("🎉 Mission reward +" + formatNumber(data.reward));
          if (coinsEl) coinsEl.innerText = formatNumber(data.coins || 0);
          if (accountCoins) accountCoins.innerText = formatNumber(data.coins || 0);
          renderMissions(data.missions || {});
          loadUser();
        } else {
          alert(data.message || "Cannot claim");
        }
      } catch (e) {
        console.log("Claim mission error", e);
        alert("Server error");
      }
    };

    missionsList.appendChild(card);
  });
}
  
/* ================= Watch ADS TIMER  ================= */
  
 function startRewardAdCooldownTimer() {
  if (rewardedAdInterval) {
    clearInterval(rewardedAdInterval);
    rewardedAdInterval = null;
  }

  if (!appState.rewardedAds) return;

  if ((appState.rewardedAds.cooldownLeftMs || 0) <= 0) {
    renderRewardAdUI();
    return;
  }

  rewardedAdInterval = setInterval(() => {
    if (!appState.rewardedAds) {
      clearInterval(rewardedAdInterval);
      rewardedAdInterval = null;
      return;
    }

    appState.rewardedAds.cooldownLeftMs = Math.max(
      0,
      (appState.rewardedAds.cooldownLeftMs || 0) - 1000
    );

    renderRewardAdUI();

    if (appState.rewardedAds.cooldownLeftMs <= 0) {
      clearInterval(rewardedAdInterval);
      rewardedAdInterval = null;

      appState.rewardedAds.cooldownLeftMs = 0;
      renderRewardAdUI();
    }
  }, 1000);
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
    renderBoostSectionUI();

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
    renderBoostSectionUI();

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
    renderBoostSectionUI();

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

/* ================= QUANTUM CORE COUNTDOWN ================= */

  let quantumTimer = null;

function startQuantumCountdown() {
  if (quantumTimer) clearInterval(quantumTimer);

  if (!appState.quantumCore?.upgrading) return;

  quantumTimer = setInterval(() => {
    const el = document.getElementById("quantumCoreCountdown");

    const sec = Math.floor(
      (new Date(appState.quantumCore.upgradeEndTime) - Date.now()) / 1000
    );

    if (el) el.innerText = formatCountdown(sec);

    if (sec <= 0) {
      clearInterval(quantumTimer);
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
  coinsEl.innerText = formatNumber(data.coins || 0);
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
      coinsEl.innerText = formatNumber(data.coins || 0);
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
      coinsEl.innerText = formatNumber(data.coins || 0);
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
      coinsEl.innerText = formatNumber(data.coins || 0);
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
      coinsEl.innerText = formatNumber(data.coins || 0);
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
      coinsEl.innerText = formatNumber(data.coins || 0);
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

  /* ================= BOOST X2 ACTIVATE ================= */

window.activateBoostX2 = async function() {
  try {
    const res = await fetch("/activate-boost-x2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      appState.boostX2 = data.boostX2 || appState.boostX2;
      renderBoostSectionUI();
      startBoostX2Timer();
      loadUser();
      alert("Boost X2 activated successfully ✅");
    } else {
      alert(data.message || "Boost X2 activation failed");
    }
  } catch (e) {
    console.log("activate boost x2 error", e);
  }
};
  
/* ================= FREE TAP HANDLER ================= */
  
if (freeTapDailyCard) {
  freeTapDailyCard.addEventListener("click", async () => {
    try {
      const res = await fetch("/claim-free-tap-daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId, initData })
      });

      const data = await res.json();

if (data.success) {
  appState.freeTapDaily = data.freeTapDaily || appState.freeTapDaily;
  renderFreeTapDailyUI();
  startFreeTapDailyTimer();

  if (boostSection) boostSection.style.display = "none";
  if (earnSection) earnSection.style.display = "block";

  if (mineSection) mineSection.style.display = "none";
  if (tasksSection) tasksSection.style.display = "none";
  if (leagueSection) leagueSection.style.display = "none";
  if (accountSection) accountSection.style.display = "none";
  if (skillsSection) skillsSection.style.display = "none";
  if (cashierSection) cashierSection.style.display = "none";

        alert("Free Tap Daily activated ✅");
      } else {
        alert(data.message || "Failed");
      }
    } catch (e) {
      console.log("free tap daily error", e);
      alert("Server error");
    }
  });
}

/* ================= FREE DAILY ENERGY HANDLE  ================= */

  if (freeEnergyDailyCard) {
  freeEnergyDailyCard.addEventListener("click", async () => {
    try {
      const res = await fetch("/claim-free-energy-daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId, initData })
      });

      const data = await res.json();

      if (data.success) {
        appState.freeEnergyDaily = data.freeEnergyDaily || appState.freeEnergyDaily;

        energyEl.innerText = `${data.energy || 0}/${data.maxEnergy || appState.energyCore?.currentMax || 120}`;

        if (appState.energyCore) {
          appState.energyCore.currentMax =
            data.maxEnergy || appState.energyCore.currentMax;
        }

        renderFreeEnergyDailyUI();

        if (boostSection) boostSection.style.display = "none";
        if (earnSection) earnSection.style.display = "block";
        if (mineSection) mineSection.style.display = "none";
        if (tasksSection) tasksSection.style.display = "none";
        if (leagueSection) leagueSection.style.display = "none";
        if (accountSection) accountSection.style.display = "none";
        if (skillsSection) skillsSection.style.display = "none";
        if (cashierSection) cashierSection.style.display = "none";
      } else {
        alert(data.message || "Failed");
      }
    } catch (e) {
      console.log("free energy daily error", e);
      alert("Server error");
    }
  });
  }

/* ================= AUTO BOT TAP HANDLE  ================= */

if (upgradeAutoTapBotBtn) {
  upgradeAutoTapBotBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("/activate-auto-tap-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId, initData })
      });

      const data = await res.json();

      if (data.success) {
        coinsEl.innerText = formatNumber(data.coins || 0);
        appState.autoTapBot = data.autoTapBot || appState.autoTapBot;
        renderAutoTapBotUI();
        startAutoTapBotTimer();
        loadUser();
        alert("🤖 Auto Tap Bot activated for 12 hours");
      } else {
        if (data.autoTapBot) {
          appState.autoTapBot = data.autoTapBot;
          renderAutoTapBotUI();
          startAutoTapBotTimer();
        }
        alert(data.message || "Activation failed");
      }
    } catch (e) {
      console.log("auto tap bot error", e);
      alert("Server error");
    }
  });
}

/* ================= DAILY AMPLIFIER HANDLE ================= */

if (upgradeDailyAmplifierBtn) {
  upgradeDailyAmplifierBtn.onclick = async () => {
    try {
      const res = await fetch("/upgrade-daily-amplifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId, initData })
      });

      const data = await res.json();

      if (data.success) {
        coinsEl.innerText = formatNumber(data.coins || 0);
        appState.dailyAmplifier = data.dailyAmplifier || appState.dailyAmplifier;
        renderDailyAmplifierUI();
        startDailyAmplifierTimer();
        loadUser();
      } else {
        alert(data.message || "Upgrade failed");
      }
    } catch (e) {
      console.log("upgrade daily amplifier error", e);
      alert("Server error");
    }
  };
}
  
/* ================= CRITICAL STRIKE HANDLE  ================= */

if (upgradeCriticalStrikeBtn) {
  upgradeCriticalStrikeBtn.onclick = async () => {
    try {
      const res = await fetch("/upgrade-critical-strike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId, initData })
      });

      const data = await res.json();

      if (data.success) {
        coinsEl.innerText = formatNumber(data.coins || 0);
        appState.criticalStrike = data.criticalStrike || appState.criticalStrike;
        renderCriticalStrikeUI();
        startCriticalStrikeTimer();
        loadUser();
      } else {
        alert(data.message || "Upgrade failed");
      }
    } catch (e) {
      console.log("upgrade critical strike error", e);
      alert("Server error");
    }
  };
}
  
/* ================= MULTITAP UPGRADE ================= */

window.upgradeMultitap = async function() {
  try {
    const res = await fetch("/upgrade-turbo-charger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = formatNumber(data.coins || 0);
      appState.turboCharger = data.turboCharger || appState.turboCharger;
      renderBoostSectionUI();
      startTurboChargerCountdown();
      loadUser();
    } else {
      alert(data.message || "Multitap upgrade failed");
    }
  } catch (e) {
    console.log("upgrade multitap error", e);
  }
};

/* ================= ENERGY LIMIT UPGRADE ================= */

window.upgradeEnergyLimit = async function() {
  try {
    const res = await fetch("/upgrade-energy-core", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = formatNumber(data.coins || 0);
      appState.energyCore = data.energyCore || appState.energyCore;
      renderBoostSectionUI();
      startEnergyCoreCountdown();
      loadUser();
    } else {
      alert(data.message || "Energy Limit upgrade failed");
    }
  } catch (e) {
    console.log("upgrade energy limit error", e);
  }
};

/* ================= RECHARGING SPEED UPGRADE ================= */

window.upgradeRechargingSpeed = async function() {
  try {
    const res = await fetch("/upgrade-power-surge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = formatNumber(data.coins || 0);
      appState.powerSurge = data.powerSurge || appState.powerSurge;
      renderBoostSectionUI();
      startPowerSurgeCountdown();
      loadUser();
    } else {
      alert(data.message || "Recharging Speed upgrade failed");
    }
  } catch (e) {
    console.log("upgrade recharging speed error", e);
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
      coinsEl.innerText = formatNumber(data.coins || 0);
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
      coinsEl.innerText = formatNumber(data.coins || 0);
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
      coinsEl.innerText = formatNumber(data.coins || 0);
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
      coinsEl.innerText = formatNumber(data.coins || 0);
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
      coinsEl.innerText = formatNumber(data.coins || 0);
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
      coinsEl.innerText = formatNumber(data.coins || 0);
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
      coinsEl.innerText = formatNumber(data.coins || 0);
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
      coinsEl.innerText = formatNumber(data.coins || 0);
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
      coinsEl.innerText = formatNumber(data.coins || 0);
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
      coinsEl.innerText = formatNumber(data.coins || 0);
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
      coinsEl.innerText = formatNumber(data.coins || 0);
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
      coinsEl.innerText = formatNumber(data.coins || 0);
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
  coinsEl.innerText = formatNumber(data.coins || 0);
  appState.turboCharger = data.turboCharger || appState.turboCharger;

  renderSpecialSection();
  renderBoostSectionUI();
  startTurboChargerCountdown();
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
  coinsEl.innerText = formatNumber(data.coins || 0);
  appState.energyCore = data.energyCore || appState.energyCore;

  renderSpecialSection();
  renderBoostSectionUI();
  startEnergyCoreCountdown();
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
  coinsEl.innerText = formatNumber(data.coins || 0);
  appState.powerSurge = data.powerSurge || appState.powerSurge;

  renderSpecialSection();
  renderBoostSectionUI();
  startPowerSurgeCountdown();
  loadUser();
} else {
  alert(data.message || "Upgrade failed");
}
  } catch (e) {
    console.log("upgrade power surge error", e);
  }
};

  /* ================= UPGRADE MULITAP,ENERGY,RECHARG SPEED ================= */
  
if (upgradeMultitapBtn) {
  upgradeMultitapBtn.addEventListener("click", () => {
    upgradeTurboCharger();
  });
}

if (upgradeEnergyLimitBtn) {
  upgradeEnergyLimitBtn.addEventListener("click", () => {
    upgradeEnergyCore();
  });
}

if (upgradeRechargingSpeedBtn) {
  upgradeRechargingSpeedBtn.addEventListener("click", () => {
    upgradePowerSurge();
  });
}
  
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
      coinsEl.innerText = formatNumber(data.coins || 0);
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

  window.upgradeNeuralSync = async function() {
  try {
    const res = await fetch("/upgrade-neural-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = formatNumber(data.coins || 0);
      appState.neuralSync = data.neuralSync || null;
      renderSpecialSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade neural sync error", e);
    alert("Server error");
  }
};
  
/* ================= QUANTUM CORE UPGRADE ================= */
  
  window.upgradeQuantumCore = async function() {
  try {
    const res = await fetch("/upgrade-quantum-core", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      coinsEl.innerText = formatNumber(data.coins || 0);
      appState.quantumCore = data.quantumCore || null;
      renderSpecialSection();
      loadUser();
    } else {
      alert(data.message || "Upgrade failed");
    }
  } catch (e) {
    console.log("upgrade quantum core error", e);
    alert("Server error");
  }
};

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

let comboLoadedOnce = false;

async function ensureDailyComboLoaded() {
  if (comboLoadedOnce) {
    if (typeof addComboButtonsToMineCards === "function") {
      addComboButtonsToMineCards();
    }
    return;
  }

  comboLoadedOnce = true;

  if (typeof loadDailyCombo === "function") {
    await loadDailyCombo();
  }
}

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

  setTimeout(() => {
    ensureDailyComboLoaded();
  }, 150);
}

if (mineTabMarket) mineTabMarket.onclick = () => switchMineTab("market");
if (mineTabTeam) mineTabTeam.onclick = () => switchMineTab("team");
if (mineTabLegal) mineTabLegal.onclick = () => switchMineTab("legal");
if (mineTabSpecial) mineTabSpecial.onclick = () => switchMineTab("special");

/* ================= SKILLS TAB SWITCHING ================= */

const skillsTabTap = document.getElementById("skillsTabTap");
const skillsTabEconomy = document.getElementById("skillsTabEconomy");
const skillsTabAutomation = document.getElementById("skillsTabAutomation");
const skillsTabRewards = document.getElementById("skillsTabRewards");

const skillsTapPanel = document.getElementById("skillsTapPanel");
const skillsEconomyPanel = document.getElementById("skillsEconomyPanel");
const skillsAutomationPanel = document.getElementById("skillsAutomationPanel");
const skillsRewardsPanel = document.getElementById("skillsRewardsPanel");

function openSkillsTab(tabName) {
  [skillsTabTap, skillsTabEconomy, skillsTabAutomation, skillsTabRewards].forEach(btn => {
    if (btn) btn.classList.remove("active");
  });

  [skillsTapPanel, skillsEconomyPanel, skillsAutomationPanel, skillsRewardsPanel].forEach(panel => {
    if (panel) panel.style.display = "none";
  });

  if (tabName === "tap") {
    skillsTabTap?.classList.add("active");
    if (skillsTapPanel) skillsTapPanel.style.display = "block";
  }

  if (tabName === "economy") {
    skillsTabEconomy?.classList.add("active");
    if (skillsEconomyPanel) skillsEconomyPanel.style.display = "block";
  }

  if (tabName === "automation") {
    skillsTabAutomation?.classList.add("active");
    if (skillsAutomationPanel) skillsAutomationPanel.style.display = "block";
  }

  if (tabName === "rewards") {
    skillsTabRewards?.classList.add("active");
    if (skillsRewardsPanel) skillsRewardsPanel.style.display = "block";
  }
}

if (skillsTabTap) skillsTabTap.onclick = () => openSkillsTab("tap");
if (skillsTabEconomy) skillsTabEconomy.onclick = () => openSkillsTab("economy");
if (skillsTabAutomation) skillsTabAutomation.onclick = () => openSkillsTab("automation");
if (skillsTabRewards) skillsTabRewards.onclick = () => openSkillsTab("rewards");

/* ================= OFFLINE YIELD UI ================= */

function renderOfflineYieldUI() {
  const skill = appState.offlineYield || {
    level: 0,
    boostPercent: 0,
    nextCost: 1500,
    upgrading: false,
    upgradeEndTime: null
  };

  if (offlineYieldLevelText) {
    offlineYieldLevelText.innerText = `lvl ${skill.level || 0}`;
  }

  if (offlineYieldValueText) {
    offlineYieldValueText.innerText = `+${skill.boostPercent || 0}%`;
  }

  if (skill.upgrading && skill.upgradeEndTime) {
    const leftMs = Math.max(0, new Date(skill.upgradeEndTime).getTime() - Date.now());
    const totalSec = Math.max(0, Math.floor(leftMs / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const timerText = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

    if (offlineYieldCostText) offlineYieldCostText.innerText = timerText;

    if (upgradeOfflineYieldBtn) {
      upgradeOfflineYieldBtn.innerText = "Upgrading...";
      upgradeOfflineYieldBtn.disabled = true;
    }

    return;
  }

  if (offlineYieldCostText) {
    offlineYieldCostText.innerText =
      skill.level >= 20 ? "MAX" : `${skill.nextCost || 0}`;
  }

  if (upgradeOfflineYieldBtn) {
    upgradeOfflineYieldBtn.innerText = skill.level >= 20 ? "MAX" : "Upgrade";
    upgradeOfflineYieldBtn.disabled = skill.level >= 20;
  }
}

 /* ================= OFFLINE YIELD TIMER ================= */

  function startOfflineYieldTimer() {
  if (offlineYieldTimerInterval) {
    clearInterval(offlineYieldTimerInterval);
    offlineYieldTimerInterval = null;
  }

  if (!appState.offlineYield?.upgrading || !appState.offlineYield?.upgradeEndTime) {
    renderOfflineYieldUI();
    return;
  }

  renderOfflineYieldUI();

  offlineYieldTimerInterval = setInterval(() => {
    if (!appState.offlineYield?.upgrading || !appState.offlineYield?.upgradeEndTime) {
      clearInterval(offlineYieldTimerInterval);
      offlineYieldTimerInterval = null;
      renderOfflineYieldUI();
      return;
    }

    const leftMs = Math.max(
      0,
      new Date(appState.offlineYield.upgradeEndTime).getTime() - Date.now()
    );

    if (leftMs <= 0) {
      clearInterval(offlineYieldTimerInterval);
      offlineYieldTimerInterval = null;
      loadUser();
      return;
    }

    renderOfflineYieldUI();
  }, 1000);
  }
  
 /* ================= BOT OPTIMIZATION UI ================= */

  function renderBotOptimizationUI() {
  const skill = appState.botOptimization || {
    level: 0,
    boostPercent: 0,
    nextCost: 1800,
    upgrading: false,
    upgradeEndTime: null
  };

  if (botOptimizationLevelText) {
    botOptimizationLevelText.innerText = `lvl ${skill.level || 0}`;
  }

  if (botOptimizationValueText) {
    botOptimizationValueText.innerText = `+${skill.boostPercent || 0}%`;
  }

  if (skill.upgrading && skill.upgradeEndTime) {
    const leftMs = Math.max(0, new Date(skill.upgradeEndTime).getTime() - Date.now());
    const totalSec = Math.max(0, Math.floor(leftMs / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const timerText = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

    if (botOptimizationCostText) botOptimizationCostText.innerText = timerText;

    if (upgradeBotOptimizationBtn) {
      upgradeBotOptimizationBtn.innerText = "Upgrading...";
      upgradeBotOptimizationBtn.disabled = true;
    }

    return;
  }

  if (botOptimizationCostText) {
    botOptimizationCostText.innerText =
      skill.level >= 20 ? "MAX" : `${skill.nextCost || 0}`;
  }

  if (upgradeBotOptimizationBtn) {
    upgradeBotOptimizationBtn.innerText = skill.level >= 20 ? "MAX" : "Upgrade";
    upgradeBotOptimizationBtn.disabled = skill.level >= 20;
  }
}
  
 /* ================= BOT OTIMIZATION TIMER ================= */

  function startBotOptimizationTimer() {
  if (botOptimizationTimerInterval) {
    clearInterval(botOptimizationTimerInterval);
    botOptimizationTimerInterval = null;
  }

  if (!appState.botOptimization?.upgrading || !appState.botOptimization?.upgradeEndTime) {
    renderBotOptimizationUI();
    return;
  }

  renderBotOptimizationUI();

  botOptimizationTimerInterval = setInterval(() => {
    if (!appState.botOptimization?.upgrading || !appState.botOptimization?.upgradeEndTime) {
      clearInterval(botOptimizationTimerInterval);
      botOptimizationTimerInterval = null;
      renderBotOptimizationUI();
      return;
    }

    const leftMs = Math.max(
      0,
      new Date(appState.botOptimization.upgradeEndTime).getTime() - Date.now()
    );

    if (leftMs <= 0) {
      clearInterval(botOptimizationTimerInterval);
      botOptimizationTimerInterval = null;
      loadUser();
      return;
    }

    renderBotOptimizationUI();
  }, 1000);
  }
  
  /* ================= BOT OTIMIZATION HANDLE ================= */

  if (upgradeBotOptimizationBtn) {
  upgradeBotOptimizationBtn.onclick = async () => {
    try {
      const res = await fetch("/upgrade-bot-optimization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId, initData })
      });

      const data = await res.json();

      if (data.success) {
        coinsEl.innerText = Math.floor(data.coins || 0);
        appState.botOptimization = data.botOptimization || appState.botOptimization;
        renderBotOptimizationUI();
        loadUser();
      } else {
        alert(data.message || "Upgrade failed");
      }
    } catch (e) {
      console.log("upgrade bot optimization error", e);
      alert("Server error");
    }
  };
  }
  
/* ================= BOT OPTIMIZATION UPGRADE HANDLE ================= */

if (upgradeBotOptimizationBtn) {
  upgradeBotOptimizationBtn.onclick = async () => {
    try {
      const res = await fetch("/upgrade-bot-optimization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId, initData })
      });

      const data = await res.json();

      if (data.success) {
        coinsEl.innerText = formatNumber(data.coins || 0);
        appState.botOptimization = data.botOptimization || appState.botOptimization;
        renderBotOptimizationUI();
        startBotOptimizationTimer();
        loadUser();
      } else {
        alert(data.message || "Upgrade failed");
      }
    } catch (e) {
      console.log("upgrade bot optimization error", e);
      alert("Server error");
    }
  };
}
 
/* ================= BOOST BUTTON BINDINGS ================= */

if (upgradeBoostX2Btn) {
  upgradeBoostX2Btn.onclick = () => {
    if (upgradeBoostX2Btn.disabled) return;
    activateBoostX2();
  };
}
  
if (upgradeMultitapBtn) {
  upgradeMultitapBtn.onclick = () => {
    if (upgradeMultitapBtn.disabled) return;
    upgradeMultitap();
  };
}

if (upgradeEnergyLimitBtn) {
  upgradeEnergyLimitBtn.onclick = () => {
    if (upgradeEnergyLimitBtn.disabled) return;
    upgradeEnergyLimit();
  };
}

if (upgradeRechargingSpeedBtn) {
  upgradeRechargingSpeedBtn.onclick = () => {
    if (upgradeRechargingSpeedBtn.disabled) return;
    upgradeRechargingSpeed();
  };
}

/* ================= LOAD DAILY COMBO ================= */
  
async function loadDailyCombo() {
  try {
    const res = await fetch("/daily-combo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (!data.success) return;

    dailyComboCards = data.cards || [];
    selectedComboCards = (data.selectedCards || []).map(c => c.id || c).filter(Boolean);
    dailyComboLocked = !!data.locked;
    dailyComboStatus = data.status || "";

    renderComboSlots();
    addComboButtonsToMineCards();
    setComboButtonState(data.reward || 5000000);
  } catch (e) {
    console.log("Daily combo error", e);
  }
}

function setComboButtonState(reward = 5000000) {
  if (!claimComboBtn) return;

  if (dailyComboLocked) {
    if (dailyComboStatus === "success") {
      claimComboBtn.innerHTML = `<span>Claimed ✅</span><small>+${formatNumber(reward)} coins</small>`;
    } else {
      claimComboBtn.innerHTML = `<span>Try Tomorrow</span><small>Daily Combo</small>`;
    }
    claimComboBtn.disabled = true;
    return;
  }

  claimComboBtn.innerHTML = `<span>Daily Combo</span><small>+${formatNumber(reward)} coins</small>`;
  claimComboBtn.disabled = false;
}

/* ================= DAILY COMBO INFO ================= */

  function getComboCardInfo(cardId) {
  return dailyComboCards.find(c => c.id === cardId) || {
    id: cardId,
    name: cardId,
    icon: "❓",
    section: ""
  };
}

function renderComboSlots() {
  if (!comboContainer) return;

  comboContainer.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    const cardId = selectedComboCards[i];

    if (!cardId) {
      comboContainer.innerHTML += `
        <div class="combo-card combo-empty">?</div>
      `;
      continue;
    }

    const card = getComboCardInfo(cardId);
    const lockedClass = dailyComboLocked ? " combo-locked" : "";
    const clickAction = dailyComboLocked ? "" : `onclick="removeComboCard('${cardId}')"`;

    comboContainer.innerHTML += `
      <div class="combo-card combo-selected${lockedClass}" ${clickAction}>
        <div class="combo-card-icon">${card.icon}</div>
        <div class="combo-card-name">${card.name}</div>
      </div>
    `;
  }
}

window.selectComboCard = function(cardId) {
  if (dailyComboLocked) return;
  if (!cardId) return;

  if (selectedComboCards.includes(cardId)) {
    alert("Ye card already select hai");
    return;
  }

  if (selectedComboCards.length >= 3) {
    alert("Sirf 3 cards select kar sakte ho");
    return;
  }

  selectedComboCards.push(cardId);
  renderComboSlots();
  addComboButtonsToMineCards();
};

window.removeComboCard = function(cardId) {
  if (dailyComboLocked) return;
  selectedComboCards = selectedComboCards.filter(id => id !== cardId);
  renderComboSlots();
  addComboButtonsToMineCards();
};

function addComboButtonsToMineCards() {
  if (!mineTabContent) return;

  setTimeout(() => {
    const cards = mineTabContent.querySelectorAll(".mine-card-box, .mine-card, .skill-mine-card");

    cards.forEach(card => {
      const titleEl = card.querySelector(".mine-card-title");
      if (!titleEl) return;

      const title = titleEl.innerText.trim().toLowerCase();

      const found = dailyComboCards.find(c => c.name.toLowerCase() === title);
      if (!found) return;

      if (card.querySelector(".combo-select-btn")) return;

      const btn = document.createElement("button");
      btn.className = "combo-select-btn";
      btn.innerText = selectedComboCards.includes(found.id) ? "Selected ✅" : "Add Combo";
      btn.disabled = dailyComboLocked || selectedComboCards.includes(found.id);
      btn.onclick = (e) => {
        e.stopPropagation();
        selectComboCard(found.id);
      };

      card.appendChild(btn);
    });
  }, 100);
}

if (claimComboBtn) {
  claimComboBtn.onclick = async () => {
    try {
      if (dailyComboLocked) return;

      if (selectedComboCards.length !== 3) {
        alert("Daily Combo ke liye 3 cards select karo");
        return;
      }

      claimComboBtn.disabled = true;
      claimComboBtn.innerHTML = "Checking...";

      const res = await fetch("/check-daily-combo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegramId,
          initData,
          selectedCards: selectedComboCards
        })
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Combo check failed");
        if (data.locked && data.selectedCards) {
          selectedComboCards = data.selectedCards.map(c => c.id || c).filter(Boolean);
          dailyComboLocked = true;
          dailyComboStatus = data.status || "";
          renderComboSlots();
        } else {
          claimComboBtn.disabled = false;
        }
        setComboButtonState();
        return;
      }

      if (data.win) {
        alert("🎉 Correct Daily Combo! +" + formatNumber(data.reward) + " coins");
        if (coinsEl) coinsEl.innerText = formatNumber(data.coins || 0);
        if (accountCoins) accountCoins.innerText = formatNumber(data.coins || 0);
        dailyComboLocked = true;
        dailyComboStatus = "success";
        selectedComboCards = (data.selectedCards || selectedComboCards).map(c => c.id || c).filter(Boolean);
        renderComboSlots();
        setComboButtonState(data.reward || 5000000);
        loadUser();
      } else {
        alert("❌ Wrong Combo. Try tomorrow");
        dailyComboLocked = true;
        dailyComboStatus = "failed";
        selectedComboCards = (data.selectedCards || selectedComboCards).map(c => c.id || c).filter(Boolean);
        renderComboSlots();
        setComboButtonState();
      }
    } catch (e) {
      console.log("check daily combo error", e);
      alert("Server error");
      claimComboBtn.disabled = false;
      setComboButtonState();
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
    renderBoostSectionUI();
    startBoostX2Timer();
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
    if (spinSection) spinSection.style.display = "none";
    if (leagueSection) leagueSection.style.display = "none";
    if (missionPage) missionPage.style.display = "none";
    if (boostSection) boostSection.style.display = "none";

    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
  }

  const navEarn = document.getElementById("navEarn");
  const navMine = document.getElementById("navMine");
  const navTasks = document.getElementById("navTasks");
  const navSpin = document.getElementById("navSpin");
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

  if (navSpin) {
  navSpin.onclick = () => {
    hideAllSections();
    if (spinSection) spinSection.style.display = "block";
    navSpin.classList.add("active");
    switchMissionTab("spin");
    renderDailySpinUI();
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

    if (typeof switchSkillsTab === "function") {
      switchSkillsTab("tap");
    }
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

    if (leagueSection) {
      leagueSection.style.display = "block";
    }

    await loadGlobalLeaderboard();
  };
}

const closeLeagueBtn = document.getElementById("closeLeagueBtn");

if (closeLeagueBtn) {
  closeLeagueBtn.onclick = () => {
    hideAllSections();

    if (earnSection) {
      earnSection.style.display = "block";
    }

    if (navEarn) {
      navEarn.classList.add("active");
    }
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
  
/* ================= REAL MONETAG ADS WATCHING ================= */

window.watchAdReward = async function () {
  if (!watchAdBtn || watchAdBtn.disabled) return;

  watchAdBtn.disabled = true;
  watchAdBtn.innerText = "Loading Ad...";

  try {
    if (typeof window.show_10928984 !== "function") {
      alert("Ad not loaded yet. Please try again.");
      renderRewardAdUI();
      return;
    }

    await window.show_10928984();

    watchAdBtn.innerText = "Claiming...";

    const res = await fetch("/watch-rewarded-ad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, initData })
    });

    const data = await res.json();

    if (data.success) {
      if (coinsEl) coinsEl.innerText = formatNumber(data.coins || 0);
      if (accountCoins) accountCoins.innerText = formatNumber(data.coins || 0);

      appState.rewardedAds = data.rewardedAds || appState.rewardedAds;

      renderRewardAdUI();
      startRewardAdCooldownTimer();
      
      alert(`🎉 +${formatNumber(data.reward)} coins`);
      loadMissions();
      loadUser();
    } else {
      alert(data.message || "Ad reward failed");
      if (data.rewardedAds) appState.rewardedAds = data.rewardedAds;
      renderRewardAdUI();
      startRewardAdCooldownTimer();
    }
  } catch (e) {
    console.log("Monetag ad error", e);
    alert("Ad was not completed. Reward not added.");
    renderRewardAdUI();
  }
};

  /* ================= DAILY SPIN CLICK ================= */

if (dailySpinBtn) {
  dailySpinBtn.addEventListener("click", async () => {
    try {
      dailySpinBtn.disabled = true;
      dailySpinBtn.innerText = "Spinning...";

      if (spinWheel) {
        spinWheel.style.transform = "rotate(1440deg)";
      }

      const res = await fetch("/daily-spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId, initData })
      });

      const data = await res.json();

      setTimeout(() => {
        if (spinWheel) {
          spinWheel.style.transform = "rotate(0deg)";
        }

        if (data.success) {
          alert("🎉 You won: " + data.reward.label);

          coinsEl.innerText = formatNumber(data.coins || 0);

          if (accountCoins) {
            accountCoins.innerText = formatNumber(data.coins || 0);
          }

          appState.dailySpin = data.dailySpin || appState.dailySpin;
          renderDailySpinUI();
          loadMissions();
          loadUser();
        } else {
          alert(data.message || "Spin failed");

          if (data.dailySpin) {
            appState.dailySpin = data.dailySpin;
          }

          renderDailySpinUI();
        }
      }, 2200);

    } catch (e) {
      console.log("Daily spin error", e);
      alert("Server error");
      renderDailySpinUI();
    }
  });
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

  // ================= WATCH AD BUTTON BIND =================
setTimeout(() => {
  const watchAdBtn = document.getElementById("watchAdBtn");
  if (watchAdBtn) {
    watchAdBtn.onclick = () => window.watchAdReward();
  }
}, 500);

});
