const rateLimit = require("express-rate-limit");
const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const TelegramBot = require("node-telegram-bot-api");
const cron = require("node-cron");

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.static(__dirname));

/* ================= ENV ================= */
const BOT_TOKEN = process.env.BOT_TOKEN;
const MONGO_URI = process.env.MONGO_URI;

if (!BOT_TOKEN || !MONGO_URI) {
  console.log("ENV missing ❌");
  process.exit(1);
}

/* ================= DB ================= */
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

/* ================= BOT ================= */
const bot = new TelegramBot(BOT_TOKEN);
bot.setWebHook(`https://pupbytetapapp.onrender.com/bot${BOT_TOKEN}`);

app.post(`/bot${BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

/* ================= RATE LIMIT ================= */
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 120
}));

/* ================= SCHEMA ================= */
const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  coins: { type: Number, default: 0 },
  suspiciousCount: { type: Number, default: 0 },
  isBlocked: { type: Boolean, default: false },
  lastCoinUpdate: { type: Date, default: null },
  profitPerHour: { type: Number, default: 10 },
  energy: { type: Number, default: 100 },
  maxEnergy: { type: Number, default: 100 },
  tapLevel: { type: Number, default: 1 },
  tapPower: { type: Number, default: 1 },
  tapCount: { type: Number, default: 0 },
  tapResetTime: { type: Number, default: Date.now },
  dailyComboClaimed: { type: String, default: "" },
  upgradeLevel: { type: Number, default: 0 },
  lastTap: { type: Number, default: 0 },
  referredBy: { type: String, default: null },
  referrals: { type: Number, default: 0 },
  completedTasks: { type: [String], default: [] },
  leagueRewardsClaimed: { type: [String], default: [] },
  refRewardsClaimed: { type: [String], default: [] },
  league: { type: String, default: "Wood" },
  lastActive: { type: Date, default: Date.now },
  lastDailyClaim: { type: Date, default: null },
  lastSpin: { type: Date, default: null },
  lastEnergyUpdate: { type: Number, default: Date.now },
rewardClaimed: { type: Boolean, default: false },
streakDay: { type: Number, default: 0 },
lastClaim: { type: Date, default: null },
totalClaims: { type: Number, default: 0 },
rewardAdsWatched: { type: Number, default: 0 },
lastRewardAdAt: { type: Date, default: null },
rewardAdDate: { type: String, default: "" },
  
btcPairs: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
},
  ethPairs: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },

  futuresTrading: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },

  liquidityPool: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },

  arbitrageBot: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },

  signalNetwork: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },
  
  myTeam: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null },
  members: { type: Number, default: 0 }
  },

  marketing: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },

  communityManager: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },

  partnershipDeals: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },

  ambassadorProgram: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },

  vipPartners: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },
  
  taxOptimization: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },

  complianceLicense: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },

  auditProtection: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },

  regulatoryLicense: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },

  legalAdvisory: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },

  courtSettlement: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },
  
  turboCharger: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },

  energyCore: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },

  powerSurge: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },

  overclockEngine: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },

  neuralSync: {
  level: { type: Number, default: 1 },
  upgrading: { type: Boolean, default: false },
  upgradeStartTime: { type: Date, default: null },
  upgradeEndTime: { type: Date, default: null }
  },

quantumCore: {
    level: { type: Number, default: 1 },
    upgrading: { type: Boolean, default: false },
    upgradeStartTime: { type: Date, default: null },
    upgradeEndTime: { type: Date, default: null }
  },

  boostX2: {
    active: { type: Boolean, default: false },
    multiplier: { type: Number, default: 2 },
    priceGems: { type: Number, default: 400 },
    durationMinutes: { type: Number, default: 30 },
    endTime: { type: Date, default: null }
  }
});

const User = mongoose.model("User", userSchema);

/* ================= TELEGRAM VERIFY ================= */
function verifyTelegram(initData) {
  if (!initData) return false;

  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get("hash");
  if (!hash) return false;

  urlParams.delete("hash");

  const dataCheckString = [...urlParams.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(BOT_TOKEN)
    .digest();

  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return hmac === hash;
}

/* ================= VALID USER ================= */

async function getValidUser(telegramId, initData) {
  if (!telegramId) return null;

  if (!verifyTelegram(initData)) {
    return null;
  }

  let user = await User.findOne({ telegramId });

  if (!user) {
    user = await User.create({ telegramId: String(telegramId) });
  }

  if (user.isBlocked) return null;

  return user;
}

/* ================= LEAGUE ================= */
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

function getLeague(coins) {
  const l = LEAGUES.find(x => coins >= x.min && coins < x.max);
  return l ? l.name : "Wood";
}

/* ================= BTC PAIRS HELPERS ================= */

function getBtcPairsProfit(level) {
  return 10 * Math.pow(2, level - 1);
}

function getBtcPairsCost(level) {
  return 500 * Math.pow(4, level - 1);
}

function getBtcPairsUpgradeTime(level) {
  const times = [
    30, 45, 60, 120, 180,
    300, 420, 600, 900, 1200,
    1800, 2700, 3600, 5400, 7200,
    10800, 18000, 25200, 36000, 0
  ];

  return times[level - 1] || 0;
}

async function finalizeBtcPairsUpgrade(user) {
  if (!user.btcPairs) {
    user.btcPairs = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.btcPairs.upgrading &&
    user.btcPairs.upgradeEndTime &&
    new Date(user.btcPairs.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.btcPairs.level < 20) {
      const oldProfit = getBtcPairsProfit(user.btcPairs.level);
      user.btcPairs.level += 1;
      const newProfit = getBtcPairsProfit(user.btcPairs.level);
      user.profitPerHour += (newProfit - oldProfit);
    }

    user.btcPairs.upgrading = false;
    user.btcPairs.upgradeStartTime = null;
    user.btcPairs.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= ETH PAIRS ================= */

function getEthPairsProfit(level) {
  return 8 * Math.pow(2, level - 1);
}

function getEthPairsCost(level) {
  return 400 * Math.pow(4, level - 1);
}

function getEthPairsUpgradeTime(level) {
  const times = [
    30, 45, 60, 120, 180,
    300, 420, 600, 900, 1200,
    1800, 2700, 3600, 5400, 7200,
    10800, 18000, 25200, 36000, 0
  ];

  return times[level - 1] || 0;
}

async function finalizeEthPairsUpgrade(user) {
  if (!user.ethPairs) {
    user.ethPairs = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.ethPairs.upgrading &&
    user.ethPairs.upgradeEndTime &&
    new Date(user.ethPairs.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.ethPairs.level < 20) {
      const oldProfit = getEthPairsProfit(user.ethPairs.level);
      user.ethPairs.level += 1;
      const newProfit = getEthPairsProfit(user.ethPairs.level);
      user.profitPerHour += (newProfit - oldProfit);
    }

    user.ethPairs.upgrading = false;
    user.ethPairs.upgradeStartTime = null;
    user.ethPairs.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= FUTURES TRADING ================= */

function getFuturesTradingProfit(level) {
  return 25 * Math.pow(2, level - 1);
}

function getFuturesTradingCost(level) {
  return 800 * Math.pow(4, level - 1);
}

function getFuturesTradingUpgradeTime(level) {
  return 30 * level;
}

async function finalizeFuturesTradingUpgrade(user) {
  if (!user.futuresTrading) {
    user.futuresTrading = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.futuresTrading.upgrading &&
    user.futuresTrading.upgradeEndTime &&
    new Date(user.futuresTrading.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.futuresTrading.level < 20) {
      const oldProfit = getFuturesTradingProfit(user.futuresTrading.level);
      user.futuresTrading.level += 1;
      const newProfit = getFuturesTradingProfit(user.futuresTrading.level);
      user.profitPerHour += (newProfit - oldProfit);
    }

    user.futuresTrading.upgrading = false;
    user.futuresTrading.upgradeStartTime = null;
    user.futuresTrading.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= LIQUIDITY POOL ================= */

function getLiquidityPoolProfit(level) {
  return 18 * Math.pow(2, level - 1);
}

function getLiquidityPoolCost(level) {
  return 700 * Math.pow(4, level - 1);
}

function getLiquidityPoolUpgradeTime(level) {
  return 30 * level;
}

async function finalizeLiquidityPoolUpgrade(user) {
  if (!user.liquidityPool) {
    user.liquidityPool = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.liquidityPool.upgrading &&
    user.liquidityPool.upgradeEndTime &&
    new Date(user.liquidityPool.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.liquidityPool.level < 20) {
      const oldProfit = getLiquidityPoolProfit(user.liquidityPool.level);
      user.liquidityPool.level += 1;
      const newProfit = getLiquidityPoolProfit(user.liquidityPool.level);
      user.profitPerHour += (newProfit - oldProfit);
    }

    user.liquidityPool.upgrading = false;
    user.liquidityPool.upgradeStartTime = null;
    user.liquidityPool.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= ARBITRAGE BOT ================= */

function getArbitrageBotProfit(level) {
  return 32 * Math.pow(2, level - 1);
}

function getArbitrageBotCost(level) {
  return 1000 * Math.pow(4, level - 1);
}

function getArbitrageBotUpgradeTime(level) {
  return 30 * level;
}

async function finalizeArbitrageBotUpgrade(user) {
  if (!user.arbitrageBot) {
    user.arbitrageBot = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.arbitrageBot.upgrading &&
    user.arbitrageBot.upgradeEndTime &&
    new Date(user.arbitrageBot.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.arbitrageBot.level < 20) {
      const oldProfit = getArbitrageBotProfit(user.arbitrageBot.level);
      user.arbitrageBot.level += 1;
      const newProfit = getArbitrageBotProfit(user.arbitrageBot.level);
      user.profitPerHour += (newProfit - oldProfit);
    }

    user.arbitrageBot.upgrading = false;
    user.arbitrageBot.upgradeStartTime = null;
    user.arbitrageBot.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= SIGNAL NETWORK ================= */

function getSignalNetworkProfit(level) {
  return 40 * Math.pow(2, level - 1);
}

function getSignalNetworkCost(level) {
  return 1200 * Math.pow(4, level - 1);
}

function getSignalNetworkUpgradeTime(level) {
  return 30 * level;
}

async function finalizeSignalNetworkUpgrade(user) {
  if (!user.signalNetwork) {
    user.signalNetwork = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.signalNetwork.upgrading &&
    user.signalNetwork.upgradeEndTime &&
    new Date(user.signalNetwork.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.signalNetwork.level < 20) {
      const oldProfit = getSignalNetworkProfit(user.signalNetwork.level);
      user.signalNetwork.level += 1;
      const newProfit = getSignalNetworkProfit(user.signalNetwork.level);
      user.profitPerHour += (newProfit - oldProfit);
    }

    user.signalNetwork.upgrading = false;
    user.signalNetwork.upgradeStartTime = null;
    user.signalNetwork.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= TURBO CHARGER SECTION ================= */

function getTurboTapBonus(level) {
  return level;
}

function getTurboChargerCost(level) {
  return 600 * Math.pow(4, level - 1);
}

function getTurboChargerUpgradeTime(level) {
  return 25 * level;
}

async function finalizeTurboChargerUpgrade(user) {
  if (!user.turboCharger) {
    user.turboCharger = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.turboCharger.upgrading &&
    user.turboCharger.upgradeEndTime &&
    new Date(user.turboCharger.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.turboCharger.level < 20) {
      user.turboCharger.level += 1;
    }

    user.turboCharger.upgrading = false;
    user.turboCharger.upgradeStartTime = null;
    user.turboCharger.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= ENERGY CORE SECTION ================= */

function getEnergyCoreBonus(level) {
  return level * 20;
}

function getEnergyCoreMax(level) {
  return 100 + getEnergyCoreBonus(level);
}

function getEnergyCoreCost(level) {
  return 700 * Math.pow(4, level - 1);
}

function getEnergyCoreUpgradeTime(level) {
  return 25 * level;
}

async function finalizeEnergyCoreUpgrade(user) {
  if (!user.energyCore) {
    user.energyCore = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.energyCore.upgrading &&
    user.energyCore.upgradeEndTime &&
    new Date(user.energyCore.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.energyCore.level < 20) {
      user.energyCore.level += 1;
    }

    user.energyCore.upgrading = false;
    user.energyCore.upgradeStartTime = null;
    user.energyCore.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= POWER SURGE SECTION ================= */

function getPowerSurgeBoost(level) {
  return Math.min(level * 10, 200);
}

function getPowerSurgeRecoveryMultiplier(level) {
  return 1 + getPowerSurgeBoost(level) / 100;
}

function getPowerSurgeCost(level) {
  return 900 * Math.pow(4, level - 1);
}

function getPowerSurgeUpgradeTime(level) {
  return 25 * level;
}

async function finalizePowerSurgeUpgrade(user) {
  if (!user.powerSurge) {
    user.powerSurge = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.powerSurge.upgrading &&
    user.powerSurge.upgradeEndTime &&
    new Date(user.powerSurge.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.powerSurge.level < 20) {
      user.powerSurge.level += 1;
    }

    user.powerSurge.upgrading = false;
    user.powerSurge.upgradeStartTime = null;
    user.powerSurge.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= OVERCLOCK ENGINE SECTION ================= */

function getOverclockTapBoost(level) {
  return Math.min(level * 5, 100);
}

function getOverclockProfitBoost(level) {
  return Math.min(level * 2, 40);
}

function getOverclockTapPower(baseTapPower, level) {
  return Math.floor((baseTapPower || 0) * (1 + getOverclockTapBoost(level || 1) / 100));
}

function getOverclockExtraProfit(baseProfit, level) {
  return Math.floor((baseProfit || 0) * (getOverclockProfitBoost(level || 1) / 100));
}

function getOverclockEngineCost(level) {
  return 2000 * Math.pow(4, level - 1);
}

function getOverclockEngineUpgradeTime(level) {
  return 35 * level;
}

async function finalizeOverclockEngineUpgrade(user) {
  if (!user.overclockEngine) {
    user.overclockEngine = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.overclockEngine.upgrading &&
    user.overclockEngine.upgradeEndTime &&
    new Date(user.overclockEngine.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.overclockEngine.level < 20) {
      user.overclockEngine.level += 1;
    }

    user.overclockEngine.upgrading = false;
    user.overclockEngine.upgradeStartTime = null;
    user.overclockEngine.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= NEURAL SYNC SECTION ================= */

function getNeuralSyncBoost(level) {
  return Math.min(level * 3, 60);
}

function applyNeuralBoost(baseValue, neuralLevel) {
  return Math.floor((baseValue || 0) * (1 + getNeuralSyncBoost(neuralLevel || 1) / 100));
}

function getNeuralSyncExtraProfit(baseProfit, level) {
  return Math.floor((baseProfit || 0) * (getNeuralSyncBoost(level || 1) / 100));
}

function getNeuralSyncCost(level) {
  return 2500 * Math.pow(4, level - 1);
}

function getNeuralSyncUpgradeTime(level) {
  return 40 * level;
}

async function finalizeNeuralSyncUpgrade(user) {
  if (!user.neuralSync) {
    user.neuralSync = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.neuralSync.upgrading &&
    user.neuralSync.upgradeEndTime &&
    new Date(user.neuralSync.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.neuralSync.level < 20) {
      user.neuralSync.level += 1;
    }

    user.neuralSync.upgrading = false;
    user.neuralSync.upgradeStartTime = null;
    user.neuralSync.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= QUANTUM CORE ================= */

function getQuantumCoreBoost(level) {
  return Math.min(level * 3, 60);
}

function getQuantumMultiplier(level) {
  return 1 + getQuantumCoreBoost(level || 1) / 100;
}

function applyQuantum(value, level) {
  return Math.floor(value * getQuantumMultiplier(level));
}

function getQuantumCost(level) {
  return 3000 * Math.pow(4, level - 1);
}

function getQuantumUpgradeTime(level) {
  return 40 * level;
}

async function finalizeQuantumUpgrade(user) {
  if (!user.quantumCore) {
    user.quantumCore = {
      level: 1,
      upgrading: false
    };
  }

  if (
    user.quantumCore.upgrading &&
    user.quantumCore.upgradeEndTime &&
    new Date(user.quantumCore.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.quantumCore.level < 20) {
      user.quantumCore.level++;
    }

    user.quantumCore.upgrading = false;
    user.quantumCore.upgradeEndTime = null;
    await user.save();
  }
}

/* ================= MY TEAM SECTION ================= */

function getMyTeamBonus(level) {
  return 2 * level;
}

function getMyTeamCost(level) {
  return 1000 * Math.pow(3, level - 1);
}

function getMyTeamUpgradeTime(level) {
  const times = [
    60, 120, 240, 480, 960,
    1800, 2700, 3600, 5400, 7200,
    10800, 14400, 18000, 21600, 25200,
    28800, 32400, 36000, 43200, 0
  ];

  return times[level - 1] || 0;
}

/* ================= MY TEAM UPGRADE ================= */

async function finalizeMyTeamUpgrade(user) {
  if (!user.myTeam) {
    user.myTeam = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null,
      members: user.referrals || 0
    };
  }

  if (
    user.myTeam.upgrading &&
    user.myTeam.upgradeEndTime &&
    new Date(user.myTeam.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.myTeam.level < 20) {
      user.myTeam.level += 1;
    }

    user.myTeam.upgrading = false;
    user.myTeam.upgradeStartTime = null;
    user.myTeam.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= UPGRADE MARKETING ================= */

app.post("/upgrade-marketing", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.marketing) {
      user.marketing = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizeMarketingUpgrade(user);

    const level = user.marketing.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.marketing.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = getMarketingCost(level);
    const baseUpgradeTime = getMarketingUpgradeTime(level);
const upgradeTime = applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1);

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.marketing.upgrading = true;
    user.marketing.upgradeStartTime = new Date();
    user.marketing.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      marketing: {
  level: user.marketing.level,
  upgrading: true,
  currentBoost: getMarketingBoost(user.marketing.level),
  nextBoost: user.marketing.level >= 20 ? getMarketingBoost(user.marketing.level) : getMarketingBoost(user.marketing.level + 1),
  effectiveExtraProfit: getMarketingExtraProfit(user.profitPerHour, user.marketing.level),
  nextCost: getMarketingCost(user.marketing.level),
  upgradeTime,
  upgradeEndTime: user.marketing.upgradeEndTime
}
    });
  } catch (e) {
    console.log("/upgrade-marketing error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE COMMUNITY MANAGER ================= */

app.post("/upgrade-community-manager", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.communityManager) {
      user.communityManager = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizeCommunityManagerUpgrade(user);

    const level = user.communityManager.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.communityManager.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = getCommunityManagerCost(level);
    const baseUpgradeTime = getCommunityManagerUpgradeTime(level);
    const upgradeTime =
      typeof applyComplianceReduction === "function"
        ? applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1)
        : baseUpgradeTime;

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.communityManager.upgrading = true;
    user.communityManager.upgradeStartTime = new Date();
    user.communityManager.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      communityManager: {
        level: user.communityManager.level,
        upgrading: true,
        currentBonus: getCommunityManagerBonus(user.communityManager.level),
        effectiveExtraProfit: getCommunityManagerExtraProfit(user.referrals || 0, user.communityManager.level),
        nextBonus:
          user.communityManager.level >= 20
            ? getCommunityManagerBonus(user.communityManager.level)
            : getCommunityManagerBonus(user.communityManager.level + 1),
        nextCost: getCommunityManagerCost(user.communityManager.level),
        upgradeTime,
        upgradeEndTime: user.communityManager.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-community-manager error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE PARTNERSHIP DEALS ================= */

app.post("/upgrade-partnership-deals", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.partnershipDeals) {
      user.partnershipDeals = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizePartnershipDealsUpgrade(user);

    const level = user.partnershipDeals.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.partnershipDeals.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = getPartnershipDealsCost(level);
    const baseUpgradeTime = getPartnershipDealsUpgradeTime(level);
    const upgradeTime =
      typeof applyComplianceReduction === "function"
        ? applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1)
        : baseUpgradeTime;

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.partnershipDeals.upgrading = true;
    user.partnershipDeals.upgradeStartTime = new Date();
    user.partnershipDeals.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      partnershipDeals: {
        level: user.partnershipDeals.level,
        upgrading: true,
        currentBoost: getPartnershipDealsBoost(user.partnershipDeals.level),
        effectiveExtraProfit: getPartnershipDealsExtraProfit(
          user.referrals || 0,
          user.communityManager?.level || 1,
          user.partnershipDeals.level
        ),
        nextBoost:
          user.partnershipDeals.level >= 20
            ? getPartnershipDealsBoost(user.partnershipDeals.level)
            : getPartnershipDealsBoost(user.partnershipDeals.level + 1),
        nextCost: getPartnershipDealsCost(user.partnershipDeals.level),
        upgradeTime,
        upgradeEndTime: user.partnershipDeals.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-partnership-deals error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE AMBASSADOR PROGRAM ================= */

app.post("/upgrade-ambassador-program", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.ambassadorProgram) {
      user.ambassadorProgram = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizeAmbassadorProgramUpgrade(user);

    const level = user.ambassadorProgram.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.ambassadorProgram.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = getAmbassadorProgramCost(level);
    const baseUpgradeTime = getAmbassadorProgramUpgradeTime(level);
    const upgradeTime =
      typeof applyComplianceReduction === "function"
        ? applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1)
        : baseUpgradeTime;

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.ambassadorProgram.upgrading = true;
    user.ambassadorProgram.upgradeStartTime = new Date();
    user.ambassadorProgram.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      ambassadorProgram: {
        level: user.ambassadorProgram.level,
        upgrading: true,
        currentBonus: getAmbassadorProgramBonus(user.ambassadorProgram.level),
        effectiveExtraProfit: getAmbassadorProgramExtraProfit(
          user.referrals || 0,
          user.ambassadorProgram.level
        ),
        nextBonus:
          user.ambassadorProgram.level >= 20
            ? getAmbassadorProgramBonus(user.ambassadorProgram.level)
            : getAmbassadorProgramBonus(user.ambassadorProgram.level + 1),
        nextCost: getAmbassadorProgramCost(user.ambassadorProgram.level),
        upgradeTime,
        upgradeEndTime: user.ambassadorProgram.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-ambassador-program error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE VIP PARTNERS ================= */

app.post("/upgrade-vip-partners", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.vipPartners) {
      user.vipPartners = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizeVipPartnersUpgrade(user);

    const level = user.vipPartners.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.vipPartners.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = getVipPartnersCost(level);
    const baseUpgradeTime = getVipPartnersUpgradeTime(level);
    const upgradeTime =
      typeof applyComplianceReduction === "function"
        ? applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1)
        : baseUpgradeTime;

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.vipPartners.upgrading = true;
    user.vipPartners.upgradeStartTime = new Date();
    user.vipPartners.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      vipPartners: {
        level: user.vipPartners.level,
        upgrading: true,
        currentBoost: getVipPartnersBoost(user.vipPartners.level),
        effectiveExtraProfit: getVipPartnersExtraProfit(
          user.referrals || 0,
          user.communityManager?.level || 1,
          user.ambassadorProgram?.level || 1,
          user.vipPartners.level
        ),
        nextBoost:
          user.vipPartners.level >= 20
            ? getVipPartnersBoost(user.vipPartners.level)
            : getVipPartnersBoost(user.vipPartners.level + 1),
        nextCost: getVipPartnersCost(user.vipPartners.level),
        upgradeTime,
        upgradeEndTime: user.vipPartners.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-vip-partners error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= MARKETING SECTION ================= */

function getMarketingBoost(level) {
  return 2 * level;
}

function getMarketingCost(level) {
  return 500 * Math.pow(4, level - 1);
}

function getMarketingUpgradeTime(level) {
  return 30 * level;
}

function getMarketingExtraProfit(baseProfit, level) {
  const boostPercent = getMarketingBoost(level);
  return Math.floor(baseProfit * (boostPercent / 100));
}

async function finalizeMarketingUpgrade(user) {
  if (!user.marketing) {
    user.marketing = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.marketing.upgrading &&
    user.marketing.upgradeEndTime &&
    new Date(user.marketing.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.marketing.level < 20) {
      user.marketing.level += 1;
    }

    user.marketing.upgrading = false;
    user.marketing.upgradeStartTime = null;
    user.marketing.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= COMMUNITY MANAGER SECTION ================= */

function getCommunityManagerBonus(level) {
  return level;
}

function getCommunityManagerExtraProfit(referrals, level) {
  return (referrals || 0) * getCommunityManagerBonus(level);
}

function getCommunityManagerCost(level) {
  return 900 * Math.pow(4, level - 1);
}

function getCommunityManagerUpgradeTime(level) {
  return 30 * level;
}

async function finalizeCommunityManagerUpgrade(user) {
  if (!user.communityManager) {
    user.communityManager = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.communityManager.upgrading &&
    user.communityManager.upgradeEndTime &&
    new Date(user.communityManager.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.communityManager.level < 20) {
      user.communityManager.level += 1;
    }

    user.communityManager.upgrading = false;
    user.communityManager.upgradeStartTime = null;
    user.communityManager.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= PARTNERSHIP DEALS SECTION ================= */

function getPartnershipDealsBoost(level) {
  return level * 3;
}

function getPartnershipDealsExtraProfit(referrals, communityManagerLevel, partnershipLevel) {
  const communityBase = getCommunityManagerExtraProfit(referrals || 0, communityManagerLevel || 1);
  return Math.floor(communityBase * (getPartnershipDealsBoost(partnershipLevel || 1) / 100));
}

function getPartnershipDealsCost(level) {
  return 1100 * Math.pow(4, level - 1);
}

function getPartnershipDealsUpgradeTime(level) {
  return 30 * level;
}

async function finalizePartnershipDealsUpgrade(user) {
  if (!user.partnershipDeals) {
    user.partnershipDeals = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.partnershipDeals.upgrading &&
    user.partnershipDeals.upgradeEndTime &&
    new Date(user.partnershipDeals.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.partnershipDeals.level < 20) {
      user.partnershipDeals.level += 1;
    }

    user.partnershipDeals.upgrading = false;
    user.partnershipDeals.upgradeStartTime = null;
    user.partnershipDeals.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= AMBASSADOR PROGRAM SECTION ================= */

function getAmbassadorProgramBonus(level) {
  return level * 2;
}

function getAmbassadorProgramExtraProfit(referrals, level) {
  return (referrals || 0) * getAmbassadorProgramBonus(level || 1);
}

function getAmbassadorProgramCost(level) {
  return 1300 * Math.pow(4, level - 1);
}

function getAmbassadorProgramUpgradeTime(level) {
  return 30 * level;
}

async function finalizeAmbassadorProgramUpgrade(user) {
  if (!user.ambassadorProgram) {
    user.ambassadorProgram = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.ambassadorProgram.upgrading &&
    user.ambassadorProgram.upgradeEndTime &&
    new Date(user.ambassadorProgram.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.ambassadorProgram.level < 20) {
      user.ambassadorProgram.level += 1;
    }

    user.ambassadorProgram.upgrading = false;
    user.ambassadorProgram.upgradeStartTime = null;
    user.ambassadorProgram.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= VIP PARTNERS SECTION ================= */

function getVipPartnersBoost(level) {
  return level * 4;
}

function getVipPartnersExtraProfit(referrals, communityLevel, ambassadorLevel, vipLevel) {
  const communityIncome = getCommunityManagerExtraProfit(referrals || 0, communityLevel || 1);
  const ambassadorIncome = getAmbassadorProgramExtraProfit(referrals || 0, ambassadorLevel || 1);
  const baseReferralIncome = communityIncome + ambassadorIncome;

  return Math.floor(baseReferralIncome * (getVipPartnersBoost(vipLevel || 1) / 100));
}

function getVipPartnersCost(level) {
  return 1500 * Math.pow(4, level - 1);
}

function getVipPartnersUpgradeTime(level) {
  return 30 * level;
}

async function finalizeVipPartnersUpgrade(user) {
  if (!user.vipPartners) {
    user.vipPartners = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.vipPartners.upgrading &&
    user.vipPartners.upgradeEndTime &&
    new Date(user.vipPartners.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.vipPartners.level < 20) {
      user.vipPartners.level += 1;
    }

    user.vipPartners.upgrading = false;
    user.vipPartners.upgradeStartTime = null;
    user.vipPartners.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= UPGRADE TAX OPTIMIZATION ================= */

app.post("/upgrade-tax-optimization", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.taxOptimization) {
      user.taxOptimization = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizeTaxOptimizationUpgrade(user);

    const level = user.taxOptimization.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.taxOptimization.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = applyLegalAdvisoryDiscount(
  getTaxOptimizationCost(level),
  user.legalAdvisory?.level || 1
);
    const baseUpgradeTime = getTaxOptimizationUpgradeTime(level);
const upgradeTime = applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1);

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.taxOptimization.upgrading = true;
    user.taxOptimization.upgradeStartTime = new Date();
    user.taxOptimization.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      taxOptimization: {
        level: user.taxOptimization.level,
        upgrading: true,
        currentReduction: getTaxOptimizationReduction(user.taxOptimization.level),
        currentTax: getCurrentTaxPercent(user.taxOptimization.level),
        nextReduction:
          user.taxOptimization.level >= 20
            ? getTaxOptimizationReduction(user.taxOptimization.level)
            : getTaxOptimizationReduction(user.taxOptimization.level + 1),
        savedProfit: getTaxOptimizationSavedProfit(user.profitPerHour, user.taxOptimization.level),
        nextCost: getTaxOptimizationCost(user.taxOptimization.level),
        upgradeTime,
        upgradeEndTime: user.taxOptimization.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-tax-optimization error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE COMPLIANCE LICENSE ================= */

app.post("/upgrade-compliance-license", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.complianceLicense) {
      user.complianceLicense = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizeComplianceLicenseUpgrade(user);

    const level = user.complianceLicense.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.complianceLicense.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = applyLegalAdvisoryDiscount(
  getComplianceLicenseCost(level),
  user.legalAdvisory?.level || 1
);
    const baseUpgradeTime = getComplianceLicenseUpgradeTime(level);
    const upgradeTime = applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1);

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.complianceLicense.upgrading = true;
    user.complianceLicense.upgradeStartTime = new Date();
    user.complianceLicense.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      complianceLicense: {
        level: user.complianceLicense.level,
        upgrading: true,
        currentReduction: getComplianceReduction(user.complianceLicense.level),
        nextReduction:
          user.complianceLicense.level >= 20
            ? getComplianceReduction(user.complianceLicense.level)
            : getComplianceReduction(user.complianceLicense.level + 1),
        nextCost: getComplianceLicenseCost(user.complianceLicense.level),
        upgradeTime,
        upgradeEndTime: user.complianceLicense.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-compliance-license error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE AUDIT PROTECTION ================= */

app.post("/upgrade-audit-protection", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.auditProtection) {
      user.auditProtection = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizeAuditProtectionUpgrade(user);

    const level = user.auditProtection.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.auditProtection.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = applyLegalAdvisoryDiscount(
  getAuditProtectionCost(level),
  user.legalAdvisory?.level || 1
);
    const baseUpgradeTime = getAuditProtectionUpgradeTime(level);
    const upgradeTime =
      typeof applyComplianceReduction === "function"
        ? applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1)
        : baseUpgradeTime;

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.auditProtection.upgrading = true;
    user.auditProtection.upgradeStartTime = new Date();
    user.auditProtection.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      auditProtection: {
        level: user.auditProtection.level,
        upgrading: true,
        currentProtection: getAuditProtectionPercent(user.auditProtection.level),
        effectiveExtraProfit: getAuditProtectionExtraProfit(
          user.profitPerHour,
          user.auditProtection.level
        ),
        nextProtection:
          user.auditProtection.level >= 20
            ? getAuditProtectionPercent(user.auditProtection.level)
            : getAuditProtectionPercent(user.auditProtection.level + 1),
        nextCost: getAuditProtectionCost(user.auditProtection.level),
        upgradeTime,
        upgradeEndTime: user.auditProtection.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-audit-protection error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE REGULATORY LICENSE ================= */

app.post("/upgrade-regulatory-license", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.regulatoryLicense) {
      user.regulatoryLicense = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizeRegulatoryLicenseUpgrade(user);

    const level = user.regulatoryLicense.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.regulatoryLicense.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = applyLegalAdvisoryDiscount(
  getRegulatoryLicenseCost(level),
  user.legalAdvisory?.level || 1
);
    const baseUpgradeTime = getRegulatoryLicenseUpgradeTime(level);
    const upgradeTime =
      typeof applyComplianceReduction === "function"
        ? applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1)
        : baseUpgradeTime;

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.regulatoryLicense.upgrading = true;
    user.regulatoryLicense.upgradeStartTime = new Date();
    user.regulatoryLicense.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      regulatoryLicense: {
        level: user.regulatoryLicense.level,
        upgrading: true,
        currentBoost: getRegulatoryLicenseBoost(user.regulatoryLicense.level),
        effectiveExtraProfit: getRegulatoryLicenseExtraProfit(
          user.profitPerHour,
          user.auditProtection?.level || 1,
          user.regulatoryLicense.level
        ),
        nextBoost:
          user.regulatoryLicense.level >= 20
            ? getRegulatoryLicenseBoost(user.regulatoryLicense.level)
            : getRegulatoryLicenseBoost(user.regulatoryLicense.level + 1),
        nextCost: getRegulatoryLicenseCost(user.regulatoryLicense.level),
        upgradeTime,
        upgradeEndTime: user.regulatoryLicense.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-regulatory-license error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE LEGAL ADVISORY ================= */

app.post("/upgrade-legal-advisory", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.legalAdvisory) {
      user.legalAdvisory = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizeLegalAdvisoryUpgrade(user);

    const level = user.legalAdvisory.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.legalAdvisory.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = getLegalAdvisoryCost(level);
    const baseUpgradeTime = getLegalAdvisoryUpgradeTime(level);
    const upgradeTime =
      typeof applyComplianceReduction === "function"
        ? applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1)
        : baseUpgradeTime;

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.legalAdvisory.upgrading = true;
    user.legalAdvisory.upgradeStartTime = new Date();
    user.legalAdvisory.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      legalAdvisory: {
        level: user.legalAdvisory.level,
        upgrading: true,
        currentDiscount: getLegalAdvisoryDiscount(user.legalAdvisory.level),
        nextDiscount:
          user.legalAdvisory.level >= 20
            ? getLegalAdvisoryDiscount(user.legalAdvisory.level)
            : getLegalAdvisoryDiscount(user.legalAdvisory.level + 1),
        nextCost: getLegalAdvisoryCost(user.legalAdvisory.level),
        upgradeTime,
        upgradeEndTime: user.legalAdvisory.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-legal-advisory error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE COURT SETTLEMENT ================= */

app.post("/upgrade-court-settlement", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.courtSettlement) {
      user.courtSettlement = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizeCourtSettlementUpgrade(user);

    const level = user.courtSettlement.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.courtSettlement.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = applyLegalAdvisoryDiscount(
      getCourtSettlementCost(level),
      user.legalAdvisory?.level || 1
    );

    const baseUpgradeTime = getCourtSettlementUpgradeTime(level);
    const upgradeTime =
      typeof applyComplianceReduction === "function"
        ? applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1)
        : baseUpgradeTime;

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.courtSettlement.upgrading = true;
    user.courtSettlement.upgradeStartTime = new Date();
    user.courtSettlement.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      courtSettlement: {
        level: user.courtSettlement.level,
        upgrading: true,
        currentRecovery: getCourtSettlementRecovery(user.courtSettlement.level),
        effectiveExtraProfit: getCourtSettlementExtraProfit(
          user.profitPerHour,
          user.taxOptimization?.level || 1,
          user.auditProtection?.level || 1,
          user.courtSettlement.level
        ),
        nextRecovery:
          user.courtSettlement.level >= 20
            ? getCourtSettlementRecovery(user.courtSettlement.level)
            : getCourtSettlementRecovery(user.courtSettlement.level + 1),
        nextCost: applyLegalAdvisoryDiscount(
          getCourtSettlementCost(user.courtSettlement.level),
          user.legalAdvisory?.level || 1
        ),
        upgradeTime,
        upgradeEndTime: user.courtSettlement.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-court-settlement error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= TAX OPTIMIZATION SECTION ================= */

const BASE_TAX_PERCENT = 10;

function getTaxOptimizationReduction(level) {
  return Math.min(level * 1, 10);
}

function getTaxOptimizationCost(level) {
  return 800 * Math.pow(4, level - 1);
}

function getTaxOptimizationUpgradeTime(level) {
  return 30 * level;
}

function getCurrentTaxPercent(level) {
  return Math.max(0, BASE_TAX_PERCENT - getTaxOptimizationReduction(level));
}

function getTaxOptimizationSavedProfit(baseProfit, level) {
  return Math.floor(baseProfit * (getTaxOptimizationReduction(level) / 100));
}

async function finalizeTaxOptimizationUpgrade(user) {
  if (!user.taxOptimization) {
    user.taxOptimization = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.taxOptimization.upgrading &&
    user.taxOptimization.upgradeEndTime &&
    new Date(user.taxOptimization.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.taxOptimization.level < 20) {
      user.taxOptimization.level += 1;
    }

    user.taxOptimization.upgrading = false;
    user.taxOptimization.upgradeStartTime = null;
    user.taxOptimization.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= COMPLIANCE LICENSE SECTION ================= */

function getComplianceReduction(level) {
  return Math.min(level * 3, 45);
}

function getComplianceLicenseCost(level) {
  return 1200 * Math.pow(4, level - 1);
}

function getComplianceLicenseUpgradeTime(level) {
  return 30 * level;
}

function applyComplianceReduction(baseTime, level) {
  const reduction = getComplianceReduction(level);
  return Math.max(5, Math.floor(baseTime * (1 - reduction / 100)));
}

async function finalizeComplianceLicenseUpgrade(user) {
  if (!user.complianceLicense) {
    user.complianceLicense = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.complianceLicense.upgrading &&
    user.complianceLicense.upgradeEndTime &&
    new Date(user.complianceLicense.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.complianceLicense.level < 20) {
      user.complianceLicense.level += 1;
    }

    user.complianceLicense.upgrading = false;
    user.complianceLicense.upgradeStartTime = null;
    user.complianceLicense.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= AUDIT PROTECTION SECTION ================= */

function getAuditProtectionPercent(level) {
  return Math.min(level * 2, 40);
}

function getAuditProtectionExtraProfit(baseProfit, level) {
  return Math.floor((baseProfit || 0) * (getAuditProtectionPercent(level || 1) / 100));
}

function getAuditProtectionCost(level) {
  return 1000 * Math.pow(4, level - 1);
}

function getAuditProtectionUpgradeTime(level) {
  return 30 * level;
}

async function finalizeAuditProtectionUpgrade(user) {
  if (!user.auditProtection) {
    user.auditProtection = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.auditProtection.upgrading &&
    user.auditProtection.upgradeEndTime &&
    new Date(user.auditProtection.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.auditProtection.level < 20) {
      user.auditProtection.level += 1;
    }

    user.auditProtection.upgrading = false;
    user.auditProtection.upgradeStartTime = null;
    user.auditProtection.upgradeEndTime = null;

    await user.save();
  }
   }

/* ================= REGULATORY LICENSE SECTION ================= */

function getRegulatoryLicenseBoost(level) {
  return level * 3;
}

function getRegulatoryLicenseExtraProfit(baseProfit, auditLevel, regulatoryLevel) {
  const auditExtra = getAuditProtectionExtraProfit(baseProfit || 0, auditLevel || 1);
  return Math.floor(auditExtra * (getRegulatoryLicenseBoost(regulatoryLevel || 1) / 100));
}

function getRegulatoryLicenseCost(level) {
  return 1200 * Math.pow(4, level - 1);
}

function getRegulatoryLicenseUpgradeTime(level) {
  return 30 * level;
}

async function finalizeRegulatoryLicenseUpgrade(user) {
  if (!user.regulatoryLicense) {
    user.regulatoryLicense = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.regulatoryLicense.upgrading &&
    user.regulatoryLicense.upgradeEndTime &&
    new Date(user.regulatoryLicense.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.regulatoryLicense.level < 20) {
      user.regulatoryLicense.level += 1;
    }

    user.regulatoryLicense.upgrading = false;
    user.regulatoryLicense.upgradeStartTime = null;
    user.regulatoryLicense.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= LEGAL ADVISORY SECTION ================= */

function getLegalAdvisoryDiscount(level) {
  return Math.min(level * 2, 40);
}

function applyLegalAdvisoryDiscount(baseCost, level) {
  return Math.floor((baseCost || 0) * (1 - getLegalAdvisoryDiscount(level || 1) / 100));
}

function getLegalAdvisoryCost(level) {
  return 1400 * Math.pow(4, level - 1);
}

function getLegalAdvisoryUpgradeTime(level) {
  return 30 * level;
}

async function finalizeLegalAdvisoryUpgrade(user) {
  if (!user.legalAdvisory) {
    user.legalAdvisory = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.legalAdvisory.upgrading &&
    user.legalAdvisory.upgradeEndTime &&
    new Date(user.legalAdvisory.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.legalAdvisory.level < 20) {
      user.legalAdvisory.level += 1;
    }

    user.legalAdvisory.upgrading = false;
    user.legalAdvisory.upgradeStartTime = null;
    user.legalAdvisory.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= COURT SETTLEMENT SECTION ================= */

function getCourtSettlementRecovery(level) {
  return Math.min(level * 4, 60);
}

function getCourtSettlementExtraProfit(baseProfit, taxLevel, auditLevel, courtLevel) {
  const taxSaved = getTaxOptimizationSavedProfit(baseProfit || 0, taxLevel || 1);
  const auditExtra = getAuditProtectionExtraProfit(baseProfit || 0, auditLevel || 1);
  const legalBaseGain = taxSaved + auditExtra;

  return Math.floor(legalBaseGain * (getCourtSettlementRecovery(courtLevel || 1) / 100));
}

function getCourtSettlementCost(level) {
  return 1600 * Math.pow(4, level - 1);
}

function getCourtSettlementUpgradeTime(level) {
  return 30 * level;
}

async function finalizeCourtSettlementUpgrade(user) {
  if (!user.courtSettlement) {
    user.courtSettlement = {
      level: 1,
      upgrading: false,
      upgradeStartTime: null,
      upgradeEndTime: null
    };
  }

  if (
    user.courtSettlement.upgrading &&
    user.courtSettlement.upgradeEndTime &&
    new Date(user.courtSettlement.upgradeEndTime).getTime() <= Date.now()
  ) {
    if (user.courtSettlement.level < 20) {
      user.courtSettlement.level += 1;
    }

    user.courtSettlement.upgrading = false;
    user.courtSettlement.upgradeStartTime = null;
    user.courtSettlement.upgradeEndTime = null;

    await user.save();
  }
}

/* ================= BOOST X2 ================= */

const BOOST_X2_MULTIPLIER = 2;
const BOOST_X2_PRICE_GEMS = 400;
const BOOST_X2_DURATION_MINUTES = 30;

function normalizeBoostX2(user) {
  if (!user.boostX2) {
    user.boostX2 = {
      active: false,
      multiplier: BOOST_X2_MULTIPLIER,
      priceGems: BOOST_X2_PRICE_GEMS,
      durationMinutes: BOOST_X2_DURATION_MINUTES,
      endTime: null
    };
  }

  if (
    user.boostX2.active &&
    user.boostX2.endTime &&
    new Date(user.boostX2.endTime).getTime() <= Date.now()
  ) {
    user.boostX2.active = false;
    user.boostX2.endTime = null;
  }
}

function isBoostX2Active(user) {
  normalizeBoostX2(user);

  return !!(
    user.boostX2 &&
    user.boostX2.active &&
    user.boostX2.endTime &&
    new Date(user.boostX2.endTime).getTime() > Date.now()
  );
}

function getBoostX2State(user) {
  normalizeBoostX2(user);

  return {
    level: user.boostX2?.active ? 1 : 0,
    active: !!user.boostX2?.active,
    multiplier: user.boostX2?.multiplier || BOOST_X2_MULTIPLIER,
    priceGems: user.boostX2?.priceGems || BOOST_X2_PRICE_GEMS,
    durationMinutes: user.boostX2?.durationMinutes || BOOST_X2_DURATION_MINUTES,
    endTime: user.boostX2?.endTime || null
  };
}

/* ================= REWARDED ADS ================= */

const REWARDED_AD_COINS = 1000;
const REWARDED_AD_DAILY_LIMIT = 5;
const REWARDED_AD_COOLDOWN_MS = 2 * 60 * 1000;

function getTodayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function normalizeRewardAdState(user) {
  const today = getTodayKey();

  if (user.rewardAdDate !== today) {
    user.rewardAdDate = today;
    user.rewardAdsWatched = 0;
  }
}

function getRewardAdsRemaining(user) {
  normalizeRewardAdState(user);
  return Math.max(0, REWARDED_AD_DAILY_LIMIT - (user.rewardAdsWatched || 0));
}

function getRewardAdCooldownLeft(user) {
  if (!user.lastRewardAdAt) return 0;

  const diff = Date.now() - new Date(user.lastRewardAdAt).getTime();
  return Math.max(0, REWARDED_AD_COOLDOWN_MS - diff);
}

/* ================= ENERGY ================= */

function rechargeEnergy(user) {
  const now = Date.now();
  const secondsPassed = (now - user.lastEnergyUpdate) / 1000;
  const baseRecoveredEnergy = Math.floor(secondsPassed * 2);
const baseRecovery = getPowerSurgeRecoveryMultiplier(user.powerSurge?.level || 1);
const finalRecovery = baseRecovery * (1 + getNeuralSyncBoost(user.neuralSync?.level || 1) / 100);
const recoveredEnergy = Math.floor(
  baseRecoveredEnergy * finalRecovery
);
  const maxEnergy = getEnergyCoreMax(user.energyCore?.level || 1);

  if (recoveredEnergy > 0) {
    user.energy = Math.min(maxEnergy, user.energy + recoveredEnergy);
    user.lastEnergyUpdate = now;
  } else {
    user.energy = Math.min(maxEnergy, user.energy);
  }
}

/* ================= OFFLINE ================= */
async function applyOfflineMining(user) {
  rechargeEnergy(user);
  user.maxEnergy = getEnergyCoreMax(user.energyCore?.level || 1);

  const now = new Date();
  const seconds = (now - user.lastActive) / 1000;

  let offlineCoins = 0;

  if (seconds > 0) {
    const earned = (user.profitPerHour / 3600) * seconds;
    offlineCoins = Math.floor(earned);

    if (offlineCoins > 0) {
      user.coins += offlineCoins;
    }

    user.lastActive = now;
    user.league = getLeague(user.coins);
    await user.save();
  }

  return offlineCoins;
}

/* ================= LOAD ================= */
app.post("/load", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) return res.json({ success: false, message: "Invalid user" });

    const offlineCoins = await applyOfflineMining(user);
    await finalizeBtcPairsUpgrade(user);
    await finalizeFuturesTradingUpgrade(user);
    await finalizeLiquidityPoolUpgrade(user);
    await finalizeArbitrageBotUpgrade(user);
    await finalizeEthPairsUpgrade(user);
    await finalizeSignalNetworkUpgrade(user);
    await finalizeMyTeamUpgrade(user);
    await finalizeMarketingUpgrade(user);
    await finalizeCommunityManagerUpgrade(user);
    await finalizePartnershipDealsUpgrade(user);
    await finalizeAmbassadorProgramUpgrade(user);
    await finalizeVipPartnersUpgrade(user);
    await finalizeTaxOptimizationUpgrade(user);
    await finalizeComplianceLicenseUpgrade(user);
    await finalizeAuditProtectionUpgrade(user);
    await finalizeRegulatoryLicenseUpgrade(user);
    await finalizeLegalAdvisoryUpgrade(user);
    await finalizeCourtSettlementUpgrade(user);
    await finalizeTurboChargerUpgrade(user);
    await finalizeEnergyCoreUpgrade(user);
    await finalizePowerSurgeUpgrade(user);
    await finalizeOverclockEngineUpgrade(user);
    await finalizeNeuralSyncUpgrade(user);
    await finalizeQuantumUpgrade(user);
    normalizeBoostX2(user);

    user.maxEnergy = getEnergyCoreMax(user.energyCore?.level || 1);
user.energy = Math.min(user.maxEnergy, user.energy);
    
    return res.json({
      success: true,
      coins: user.coins,
      energy: user.energy,
      maxEnergy: getEnergyCoreMax(user.energyCore?.level || 1),
      profitPerHour: Math.floor((
  user.profitPerHour +
  getMarketingExtraProfit(user.profitPerHour, user.marketing?.level || 1) +
  getCommunityManagerExtraProfit(user.referrals || 0, user.communityManager?.level || 1) +
  getPartnershipDealsExtraProfit(
    user.referrals || 0,
    user.communityManager?.level || 1,
    user.partnershipDeals?.level || 1
  ) +
  getAmbassadorProgramExtraProfit(
    user.referrals || 0,
    user.ambassadorProgram?.level || 1
  ) +
  getVipPartnersExtraProfit(
    user.referrals || 0,
    user.communityManager?.level || 1,
    user.ambassadorProgram?.level || 1,
    user.vipPartners?.level || 1
  ) +
  getTaxOptimizationSavedProfit(user.profitPerHour, user.taxOptimization?.level || 1) +
  getAuditProtectionExtraProfit(user.profitPerHour, user.auditProtection?.level || 1) +
  getRegulatoryLicenseExtraProfit(
    user.profitPerHour,
    user.auditProtection?.level || 1,
    user.regulatoryLicense?.level || 1
  ) +
  getCourtSettlementExtraProfit(
    user.profitPerHour,
    user.taxOptimization?.level || 1,
    user.auditProtection?.level || 1,
    user.courtSettlement?.level || 1
  ) +
  getOverclockExtraProfit(user.profitPerHour, user.overclockEngine?.level || 1)
) * getQuantumMultiplier(user.quantumCore?.level || 1)),
      tapLevel: user.tapLevel,
      tapPower: user.tapPower,
      league: user.league,
      referrals: user.referrals,
      streak: user.streakDay,
      totalClaims: user.totalClaims,
      rewardedAds: {
  reward: REWARDED_AD_COINS,
  watchedToday: user.rewardAdsWatched || 0,
  dailyLimit: REWARDED_AD_DAILY_LIMIT,
  remaining: getRewardAdsRemaining(user),
  cooldownLeftMs: getRewardAdCooldownLeft(user)
},
      boostX2: getBoostX2State(user),
      offlineCoins,
      nextTapCost: Math.floor(40 * Math.pow(1.7, user.tapLevel)),
      nextProfitCost: Math.floor(60 * Math.pow(1.8, user.upgradeLevel)),
/* ================= BTC PAIRS ================= */
      btcPairs: {
        level: user.btcPairs?.level || 1,
        upgrading: user.btcPairs?.upgrading || false,
        currentProfit: getBtcPairsProfit(user.btcPairs?.level || 1),
        nextCost: (user.btcPairs?.level || 1) >= 20 ? 0 : getBtcPairsCost(user.btcPairs?.level || 1),
        upgradeTime: (user.btcPairs?.level || 1) >= 20 ? 0 : getBtcPairsUpgradeTime(user.btcPairs?.level || 1),
        upgradeEndTime: user.btcPairs?.upgradeEndTime || null
      },
/* ================= ETH PARIS ================= */
      ethPairs: {
  level: user.ethPairs?.level || 1,
  upgrading: user.ethPairs?.upgrading || false,
  currentProfit: getEthPairsProfit(user.ethPairs?.level || 1),
  nextCost: (user.ethPairs?.level || 1) >= 20 ? 0 : getEthPairsCost(user.ethPairs?.level || 1),
  upgradeTime: (user.ethPairs?.level || 1) >= 20 ? 0 : getEthPairsUpgradeTime(user.ethPairs?.level || 1),
  upgradeEndTime: user.ethPairs?.upgradeEndTime || null
      },
/* ================= FUTURES TRADING ================= */
      futuresTrading: {
  level: user.futuresTrading?.level || 1,
  upgrading: user.futuresTrading?.upgrading || false,
  currentProfit: getFuturesTradingProfit(user.futuresTrading?.level || 1),
  nextCost: (user.futuresTrading?.level || 1) >= 20 ? 0 : getFuturesTradingCost(user.futuresTrading?.level || 1),
  upgradeTime: (user.futuresTrading?.level || 1) >= 20 ? 0 : getFuturesTradingUpgradeTime(user.futuresTrading?.level || 1),
  upgradeEndTime: user.futuresTrading?.upgradeEndTime || null
      },
 /* ================= LIQUIDITY POOL ================= */  
      liquidityPool: {
  level: user.liquidityPool?.level || 1,
  upgrading: user.liquidityPool?.upgrading || false,
  currentProfit: getLiquidityPoolProfit(user.liquidityPool?.level || 1),
  nextCost: (user.liquidityPool?.level || 1) >= 20 ? 0 : getLiquidityPoolCost(user.liquidityPool?.level || 1),
  upgradeTime: (user.liquidityPool?.level || 1) >= 20 ? 0 : getLiquidityPoolUpgradeTime(user.liquidityPool?.level || 1),
  upgradeEndTime: user.liquidityPool?.upgradeEndTime || null
      },
/* ================= ARBITRAGE BOT ================= */   
      arbitrageBot: {
  level: user.arbitrageBot?.level || 1,
  upgrading: user.arbitrageBot?.upgrading || false,
  currentProfit: getArbitrageBotProfit(user.arbitrageBot?.level || 1),
  nextCost: (user.arbitrageBot?.level || 1) >= 20 ? 0 : getArbitrageBotCost(user.arbitrageBot?.level || 1),
  upgradeTime: (user.arbitrageBot?.level || 1) >= 20 ? 0 : getArbitrageBotUpgradeTime(user.arbitrageBot?.level || 1),
  upgradeEndTime: user.arbitrageBot?.upgradeEndTime || null
       },
/* ================= SIGNAL NETWORK ================= */    
      signalNetwork: {
  level: user.signalNetwork?.level || 1,
  upgrading: user.signalNetwork?.upgrading || false,
  currentProfit: getSignalNetworkProfit(user.signalNetwork?.level || 1),
  nextCost: (user.signalNetwork?.level || 1) >= 20 ? 0 : getSignalNetworkCost(user.signalNetwork?.level || 1),
  upgradeTime: (user.signalNetwork?.level || 1) >= 20 ? 0 : getSignalNetworkUpgradeTime(user.signalNetwork?.level || 1),
  upgradeEndTime: user.signalNetwork?.upgradeEndTime || null
        },
 /* ================= MY TEAM ================= */
      myTeam: {
  level: user.myTeam?.level || 1,
  upgrading: user.myTeam?.upgrading || false,
  currentBonus: getMyTeamBonus(user.myTeam?.level || 1),
  nextCost: (user.myTeam?.level || 1) >= 20 ? 0 : getMyTeamCost(user.myTeam?.level || 1),
  upgradeTime: (user.myTeam?.level || 1) >= 20 ? 0 : getMyTeamUpgradeTime(user.myTeam?.level || 1),
  upgradeEndTime: user.myTeam?.upgradeEndTime || null,
  members: user.referrals || 0
      },
/* ================= MARKETING ================= */
      marketing: {
  level: user.marketing?.level || 1,
  upgrading: user.marketing?.upgrading || false,
  currentBoost: getMarketingBoost(user.marketing?.level || 1),
  nextBoost: (user.marketing?.level || 1) >= 20 ? getMarketingBoost(user.marketing?.level || 1) : getMarketingBoost((user.marketing?.level || 1) + 1),
  effectiveExtraProfit: getMarketingExtraProfit(user.profitPerHour, user.marketing?.level || 1),
  nextCost: (user.marketing?.level || 1) >= 20 ? 0 : getMarketingCost(user.marketing?.level || 1),
  upgradeTime: (user.marketing?.level || 1) >= 20 ? 0 : getMarketingUpgradeTime(user.marketing?.level || 1),
  upgradeEndTime: user.marketing?.upgradeEndTime || null
       },
/* ================= COMMUITY MANAGER ================= */
      communityManager: {
  level: user.communityManager?.level || 1,
  upgrading: user.communityManager?.upgrading || false,
  currentBonus: getCommunityManagerBonus(user.communityManager?.level || 1),
  effectiveExtraProfit: getCommunityManagerExtraProfit(user.referrals || 0, user.communityManager?.level || 1),
  nextBonus:
    (user.communityManager?.level || 1) >= 20
      ? getCommunityManagerBonus(user.communityManager?.level || 1)
      : getCommunityManagerBonus((user.communityManager?.level || 1) + 1),
  nextCost:
    (user.communityManager?.level || 1) >= 20
      ? 0
      : getCommunityManagerCost(user.communityManager?.level || 1),
  upgradeTime:
    (user.communityManager?.level || 1) >= 20
      ? 0
      : getCommunityManagerUpgradeTime(user.communityManager?.level || 1),
  upgradeEndTime: user.communityManager?.upgradeEndTime || null
         },
 /* ================= PARTNERSHIP DEALS ================= */
      partnershipDeals: {
  level: user.partnershipDeals?.level || 1,
  upgrading: user.partnershipDeals?.upgrading || false,
  currentBoost: getPartnershipDealsBoost(user.partnershipDeals?.level || 1),
  effectiveExtraProfit: getPartnershipDealsExtraProfit(
    user.referrals || 0,
    user.communityManager?.level || 1,
    user.partnershipDeals?.level || 1
  ),
  nextBoost:
    (user.partnershipDeals?.level || 1) >= 20
      ? getPartnershipDealsBoost(user.partnershipDeals?.level || 1)
      : getPartnershipDealsBoost((user.partnershipDeals?.level || 1) + 1),
  nextCost:
    (user.partnershipDeals?.level || 1) >= 20
      ? 0
      : getPartnershipDealsCost(user.partnershipDeals?.level || 1),
  upgradeTime:
    (user.partnershipDeals?.level || 1) >= 20
      ? 0
      : getPartnershipDealsUpgradeTime(user.partnershipDeals?.level || 1),
  upgradeEndTime: user.partnershipDeals?.upgradeEndTime || null
        },
 /* ================= COMPLIANCE LICENSE ================= */
      complianceLicense: {
  level: user.complianceLicense?.level || 1,
  upgrading: user.complianceLicense?.upgrading || false,
  currentReduction: getComplianceReduction(user.complianceLicense?.level || 1),
  nextReduction:
    (user.complianceLicense?.level || 1) >= 20
      ? getComplianceReduction(user.complianceLicense?.level || 1)
      : getComplianceReduction((user.complianceLicense?.level || 1) + 1),
  nextCost:
  (user.complianceLicense?.level || 1) >= 20
    ? 0
    : applyLegalAdvisoryDiscount(
        getComplianceLicenseCost(user.complianceLicense?.level || 1),
        user.legalAdvisory?.level || 1
      ),
  upgradeTime:
    (user.complianceLicense?.level || 1) >= 20
      ? 0
      : applyComplianceReduction(
          getComplianceLicenseUpgradeTime(user.complianceLicense?.level || 1),
          user.complianceLicense?.level || 1
        ),
  upgradeEndTime: user.complianceLicense?.upgradeEndTime || null
      },
/* ================= AUDI PROTECTION ================= */
      auditProtection: {
  level: user.auditProtection?.level || 1,
  upgrading: user.auditProtection?.upgrading || false,
  currentProtection: getAuditProtectionPercent(user.auditProtection?.level || 1),
  effectiveExtraProfit: getAuditProtectionExtraProfit(
    user.profitPerHour,
    user.auditProtection?.level || 1
  ),
  nextProtection:
    (user.auditProtection?.level || 1) >= 20
      ? getAuditProtectionPercent(user.auditProtection?.level || 1)
      : getAuditProtectionPercent((user.auditProtection?.level || 1) + 1),
  nextCost:
  (user.auditProtection?.level || 1) >= 20
    ? 0
    : applyLegalAdvisoryDiscount(
        getAuditProtectionCost(user.auditProtection?.level || 1),
        user.legalAdvisory?.level || 1
      ),
  upgradeTime:
    (user.auditProtection?.level || 1) >= 20
      ? 0
      : getAuditProtectionUpgradeTime(user.auditProtection?.level || 1),
  upgradeEndTime: user.auditProtection?.upgradeEndTime || null
          },
/* ================= REGULATORY LICENSE ================= */   
      regulatoryLicense: {
  level: user.regulatoryLicense?.level || 1,
  upgrading: user.regulatoryLicense?.upgrading || false,
  currentBoost: getRegulatoryLicenseBoost(user.regulatoryLicense?.level || 1),
  effectiveExtraProfit: getRegulatoryLicenseExtraProfit(
    user.profitPerHour,
    user.auditProtection?.level || 1,
    user.regulatoryLicense?.level || 1
  ),
  nextBoost:
    (user.regulatoryLicense?.level || 1) >= 20
      ? getRegulatoryLicenseBoost(user.regulatoryLicense?.level || 1)
      : getRegulatoryLicenseBoost((user.regulatoryLicense?.level || 1) + 1),
  nextCost:
  (user.regulatoryLicense?.level || 1) >= 20
    ? 0
    : applyLegalAdvisoryDiscount(
        getRegulatoryLicenseCost(user.regulatoryLicense?.level || 1),
        user.legalAdvisory?.level || 1
      ),
  upgradeTime:
    (user.regulatoryLicense?.level || 1) >= 20
      ? 0
      : getRegulatoryLicenseUpgradeTime(user.regulatoryLicense?.level || 1),
  upgradeEndTime: user.regulatoryLicense?.upgradeEndTime || null
       },
/* ================= IEGAL ADVISORY ================= */
   legalAdvisory: {
  level: user.legalAdvisory?.level || 1,
  upgrading: user.legalAdvisory?.upgrading || false,
  currentDiscount: getLegalAdvisoryDiscount(user.legalAdvisory?.level || 1),
  nextDiscount:
    (user.legalAdvisory?.level || 1) >= 20
      ? getLegalAdvisoryDiscount(user.legalAdvisory?.level || 1)
      : getLegalAdvisoryDiscount((user.legalAdvisory?.level || 1) + 1),
  nextCost:
    (user.legalAdvisory?.level || 1) >= 20
      ? 0
      : getLegalAdvisoryCost(user.legalAdvisory?.level || 1),
  upgradeTime:
    (user.legalAdvisory?.level || 1) >= 20
      ? 0
      : getLegalAdvisoryUpgradeTime(user.legalAdvisory?.level || 1),
  upgradeEndTime: user.legalAdvisory?.upgradeEndTime || null
         },
 /* ================= COURT SETTLEMENT ================= */
      courtSettlement: {
  level: user.courtSettlement?.level || 1,
  upgrading: user.courtSettlement?.upgrading || false,
  currentRecovery: getCourtSettlementRecovery(user.courtSettlement?.level || 1),
  effectiveExtraProfit: getCourtSettlementExtraProfit(
    user.profitPerHour,
    user.taxOptimization?.level || 1,
    user.auditProtection?.level || 1,
    user.courtSettlement?.level || 1
  ),
  nextRecovery:
    (user.courtSettlement?.level || 1) >= 20
      ? getCourtSettlementRecovery(user.courtSettlement?.level || 1)
      : getCourtSettlementRecovery((user.courtSettlement?.level || 1) + 1),
  nextCost:
    (user.courtSettlement?.level || 1) >= 20
      ? 0
      : getCourtSettlementCost(user.courtSettlement?.level || 1),
  upgradeTime:
    (user.courtSettlement?.level || 1) >= 20
      ? 0
      : getCourtSettlementUpgradeTime(user.courtSettlement?.level || 1),
  upgradeEndTime: user.courtSettlement?.upgradeEndTime || null
         },
 /* ================= AMBASSADOR PROGRAM ================= */
      ambassadorProgram: {
  level: user.ambassadorProgram?.level || 1,
  upgrading: user.ambassadorProgram?.upgrading || false,
  currentBonus: getAmbassadorProgramBonus(user.ambassadorProgram?.level || 1),
  effectiveExtraProfit: getAmbassadorProgramExtraProfit(
    user.referrals || 0,
    user.ambassadorProgram?.level || 1
  ),
  nextBonus:
    (user.ambassadorProgram?.level || 1) >= 20
      ? getAmbassadorProgramBonus(user.ambassadorProgram?.level || 1)
      : getAmbassadorProgramBonus((user.ambassadorProgram?.level || 1) + 1),
  nextCost:
    (user.ambassadorProgram?.level || 1) >= 20
      ? 0
      : getAmbassadorProgramCost(user.ambassadorProgram?.level || 1),
  upgradeTime:
    (user.ambassadorProgram?.level || 1) >= 20
      ? 0
      : getAmbassadorProgramUpgradeTime(user.ambassadorProgram?.level || 1),
  upgradeEndTime: user.ambassadorProgram?.upgradeEndTime || null
         },
/* ================= VIP PARTNERS ================= */
      vipPartners: {
  level: user.vipPartners?.level || 1,
  upgrading: user.vipPartners?.upgrading || false,
  currentBoost: getVipPartnersBoost(user.vipPartners?.level || 1),
  effectiveExtraProfit: getVipPartnersExtraProfit(
    user.referrals || 0,
    user.communityManager?.level || 1,
    user.ambassadorProgram?.level || 1,
    user.vipPartners?.level || 1
  ),
  nextBoost:
    (user.vipPartners?.level || 1) >= 20
      ? getVipPartnersBoost(user.vipPartners?.level || 1)
      : getVipPartnersBoost((user.vipPartners?.level || 1) + 1),
  nextCost:
    (user.vipPartners?.level || 1) >= 20
      ? 0
      : getVipPartnersCost(user.vipPartners?.level || 1),
  upgradeTime:
    (user.vipPartners?.level || 1) >= 20
      ? 0
      : getVipPartnersUpgradeTime(user.vipPartners?.level || 1),
  upgradeEndTime: user.vipPartners?.upgradeEndTime || null
          },
/* ================= TAX OPTIMIZATION ================= */ 
       taxOptimization: {
  level: user.taxOptimization?.level || 1,
  upgrading: user.taxOptimization?.upgrading || false,
  currentReduction: getTaxOptimizationReduction(user.taxOptimization?.level || 1),
  currentTax: getCurrentTaxPercent(user.taxOptimization?.level || 1),
  nextReduction:
    (user.taxOptimization?.level || 1) >= 20
      ? getTaxOptimizationReduction(user.taxOptimization?.level || 1)
      : getTaxOptimizationReduction((user.taxOptimization?.level || 1) + 1),
  savedProfit: getTaxOptimizationSavedProfit(user.profitPerHour, user.taxOptimization?.level || 1),
  nextCost:
  (user.taxOptimization?.level || 1) >= 20
    ? 0
    : applyLegalAdvisoryDiscount(
        getTaxOptimizationCost(user.taxOptimization?.level || 1),
        user.legalAdvisory?.level || 1
      ),
  upgradeTime:
    (user.taxOptimization?.level || 1) >= 20
      ? 0
      : getTaxOptimizationUpgradeTime(user.taxOptimization?.level || 1),
  upgradeEndTime: user.taxOptimization?.upgradeEndTime || null
       },
/* ================= TURBO CHARGER ================= */
      turboCharger: {
  level: user.turboCharger?.level || 1,
  upgrading: user.turboCharger?.upgrading || false,
  currentBonus: getTurboTapBonus(user.turboCharger?.level || 1),
  nextBonus:
    (user.turboCharger?.level || 1) >= 20
      ? getTurboTapBonus(user.turboCharger?.level || 1)
      : getTurboTapBonus((user.turboCharger?.level || 1) + 1),
  nextCost:
    (user.turboCharger?.level || 1) >= 20
      ? 0
      : getTurboChargerCost(user.turboCharger?.level || 1),
  upgradeTime:
    (user.turboCharger?.level || 1) >= 20
      ? 0
      : getTurboChargerUpgradeTime(user.turboCharger?.level || 1),
  upgradeEndTime: user.turboCharger?.upgradeEndTime || null
      },
/* ================= ENERGY CORE ================= */
      energyCore: {
  level: user.energyCore?.level || 1,
  upgrading: user.energyCore?.upgrading || false,
  currentBonus: getEnergyCoreBonus(user.energyCore?.level || 1),
  currentMax: getEnergyCoreMax(user.energyCore?.level || 1),
  nextBonus:
    (user.energyCore?.level || 1) >= 20
      ? getEnergyCoreBonus(user.energyCore?.level || 1)
      : getEnergyCoreBonus((user.energyCore?.level || 1) + 1),
  nextCost:
    (user.energyCore?.level || 1) >= 20
      ? 0
      : getEnergyCoreCost(user.energyCore?.level || 1),
  upgradeTime:
    (user.energyCore?.level || 1) >= 20
      ? 0
      : getEnergyCoreUpgradeTime(user.energyCore?.level || 1),
  upgradeEndTime: user.energyCore?.upgradeEndTime || null
      },
/* ================= POWER SURGE ================= */
      powerSurge: {
  level: user.powerSurge?.level || 1,
  upgrading: user.powerSurge?.upgrading || false,
  currentBoost: getPowerSurgeBoost(user.powerSurge?.level || 1),
  recoveryMultiplier: (() => {
  const baseRecovery = getPowerSurgeRecoveryMultiplier(user.powerSurge?.level || 1);
  return baseRecovery * (1 + getNeuralSyncBoost(user.neuralSync?.level || 1) / 100);
})(),
  nextBoost:
    (user.powerSurge?.level || 1) >= 20
      ? getPowerSurgeBoost(user.powerSurge?.level || 1)
      : getPowerSurgeBoost((user.powerSurge?.level || 1) + 1),
  nextCost:
    (user.powerSurge?.level || 1) >= 20
      ? 0
      : getPowerSurgeCost(user.powerSurge?.level || 1),
  upgradeTime:
    (user.powerSurge?.level || 1) >= 20
      ? 0
      : getPowerSurgeUpgradeTime(user.powerSurge?.level || 1),
  upgradeEndTime: user.powerSurge?.upgradeEndTime || null
      },
/* ================= OVERCLOCK ENGINE ================= */
      overclockEngine: {
  level: user.overclockEngine?.level || 1,
  upgrading: user.overclockEngine?.upgrading || false,
  currentTapBoost: getOverclockTapBoost(user.overclockEngine?.level || 1),
  currentProfitBoost: getOverclockProfitBoost(user.overclockEngine?.level || 1),
  effectiveTapPower: (() => {
  const turboBase = getTurboTapBonus(user.turboCharger?.level || 1);
  const turboBonus = applyNeuralBoost(turboBase, user.neuralSync?.level || 1);
  const baseTapPower = user.tapPower + turboBonus;
  const baseTap = getOverclockTapPower(baseTapPower, user.overclockEngine?.level || 1);
  return applyNeuralBoost(baseTap, user.neuralSync?.level || 1);
})(),
  effectiveExtraProfit: getOverclockExtraProfit(user.profitPerHour, user.overclockEngine?.level || 1),
  nextTapBoost:
    (user.overclockEngine?.level || 1) >= 20
      ? getOverclockTapBoost(user.overclockEngine?.level || 1)
      : getOverclockTapBoost((user.overclockEngine?.level || 1) + 1),
  nextProfitBoost:
    (user.overclockEngine?.level || 1) >= 20
      ? getOverclockProfitBoost(user.overclockEngine?.level || 1)
      : getOverclockProfitBoost((user.overclockEngine?.level || 1) + 1),
  nextCost:
    (user.overclockEngine?.level || 1) >= 20
      ? 0
      : getOverclockEngineCost(user.overclockEngine?.level || 1),
  upgradeTime:
    (user.overclockEngine?.level || 1) >= 20
      ? 0
      : getOverclockEngineUpgradeTime(user.overclockEngine?.level || 1),
  upgradeEndTime: user.overclockEngine?.upgradeEndTime || null
      },
/* ================= NEURAL SYNCE ================= */
      neuralSync: {
  level: user.neuralSync?.level || 1,
  upgrading: user.neuralSync?.upgrading || false,
  currentBoost: getNeuralSyncBoost(user.neuralSync?.level || 1),
  nextBoost:
    (user.neuralSync?.level || 1) >= 20
      ? getNeuralSyncBoost(user.neuralSync?.level || 1)
      : getNeuralSyncBoost((user.neuralSync?.level || 1) + 1),
  nextCost:
    (user.neuralSync?.level || 1) >= 20
      ? 0
      : getNeuralSyncCost(user.neuralSync?.level || 1),
  upgradeTime:
    (user.neuralSync?.level || 1) >= 20
      ? 0
      : getNeuralSyncUpgradeTime(user.neuralSync?.level || 1),
  upgradeEndTime: user.neuralSync?.upgradeEndTime || null
    },
/* ================= NEURAL SYNCE ================= */
      quantumCore: {
  level: user.quantumCore?.level || 1,
  upgrading: user.quantumCore?.upgrading || false,
  currentBoost: getQuantumCoreBoost(user.quantumCore?.level || 1),
  multiplier: getQuantumMultiplier(user.quantumCore?.level || 1),
  nextBoost:
    (user.quantumCore?.level || 1) >= 20
      ? getQuantumCoreBoost(user.quantumCore?.level || 1)
      : getQuantumCoreBoost((user.quantumCore?.level || 1) + 1),
  nextCost:
    (user.quantumCore?.level || 1) >= 20
      ? 0
      : getQuantumCost(user.quantumCore?.level || 1),
  upgradeTime:
    (user.quantumCore?.level || 1) >= 20
      ? 0
      : getQuantumUpgradeTime(user.quantumCore?.level || 1),
  upgradeEndTime: user.quantumCore?.upgradeEndTime || null
      }
    });
  } catch (e) {
    console.log("/load error", e);
    res.json({ success: false });
  }
});

/* ================= ACTIVATE BOOST X2 ================= */

app.post("/activate-boost-x2", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    normalizeBoostX2(user);

    if (isBoostX2Active(user)) {
      return res.json({ success: false, message: "Boost X2 already active" });
    }

    /* 
      Abhi gems system real nahi hai.
      Top bar me gem UI hai lekin backend wallet/gem economy ready nahi hai.
      Isliye filhaal safe mode me coin cost use kar rahe hain.
      Later coin launch ke time isko gems/wallet se replace kar dena.
    */
    const coinCost = 400;

    if (user.coins < coinCost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= coinCost;
    user.boostX2.active = true;
    user.boostX2.multiplier = BOOST_X2_MULTIPLIER;
    user.boostX2.priceGems = BOOST_X2_PRICE_GEMS;
    user.boostX2.durationMinutes = BOOST_X2_DURATION_MINUTES;
    user.boostX2.endTime = new Date(
      Date.now() + BOOST_X2_DURATION_MINUTES * 60 * 1000
    );

    await user.save();

    return res.json({
      success: true,
      coins: user.coins,
      boostX2: getBoostX2State(user)
    });
  } catch (e) {
    console.log("/activate-boost-x2 error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= TAP ================= */
app.post("/tap", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) return res.json({ success: false, message: "Invalid user" });

    await applyOfflineMining(user);

    if (user.energy < user.tapPower) {
      return res.json({
        success: false,
        message: "Not enough energy"
      });
    }

normalizeBoostX2(user);

const turboBase = getTurboTapBonus(user.turboCharger?.level || 1);
const turboBonus = applyNeuralBoost(turboBase, user.neuralSync?.level || 1);

const baseTapPower = user.tapPower + turboBonus;

let finalTapPower = applyNeuralBoost(
  getOverclockTapPower(baseTapPower, user.overclockEngine?.level || 1),
  user.neuralSync?.level || 1
);

if (isBoostX2Active(user)) {
  finalTapPower = finalTapPower * (user.boostX2?.multiplier || 2);
}

const quantumTap = applyQuantum(finalTapPower, user.quantumCore?.level || 1);
user.coins += quantumTap;
user.energy -= user.tapPower;
    user.lastActive = new Date();
    user.league = getLeague(user.coins);

    await user.save();

    return res.json({
  success: true,
  coins: user.coins,
  energy: user.energy,
  maxEnergy: getEnergyCoreMax(user.energyCore?.level || 1),
tapPower: applyQuantum(
  getOverclockTapPower(
    user.tapPower + getTurboTapBonus(user.turboCharger?.level || 1),
    user.overclockEngine?.level || 1
  ),
  user.quantumCore?.level || 1
),
  profitPerHour: user.profitPerHour,
  league: user.league,
  boostX2: getBoostX2State(user)
});
  } catch (e) {
    console.log("/tap error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE TAP ================= */
app.post("/upgrade-tap", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
if (!user) return res.json({ success: false, message: "Invalid user" });

await finalizeBtcPairsUpgrade(user);
await finalizeEthPairsUpgrade(user);
await finalizeFuturesTradingUpgrade(user);
await finalizeLiquidityPoolUpgrade(user);
await finalizeArbitrageBotUpgrade(user);
await finalizeSignalNetworkUpgrade(user);
await finalizeMyTeamUpgrade(user);
await finalizeMarketingUpgrade(user);
await finalizeCommunityManagerUpgrade(user);
await finalizePartnershipDealsUpgrade(user);
await finalizeAmbassadorProgramUpgrade(user);
await finalizeVipPartnersUpgrade(user);
await finalizeTaxOptimizationUpgrade(user);
await finalizeComplianceLicenseUpgrade(user);
await finalizeAuditProtectionUpgrade(user);
await finalizeRegulatoryLicenseUpgrade(user);
await finalizeLegalAdvisoryUpgrade(user);
await finalizeCourtSettlementUpgrade(user);
await finalizeTurboChargerUpgrade(user);
await finalizeEnergyCoreUpgrade(user);
await finalizePowerSurgeUpgrade(user);
await finalizeOverclockEngineUpgrade(user);
await finalizeNeuralSyncUpgrade(user);
await finalizeQuantumUpgrade(user);
    
    const cost = Math.floor(40 * Math.pow(1.7, user.tapLevel));

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.tapLevel += 1;

    if (user.tapLevel % 2 === 0) {
      user.tapPower += 1;
    }

    user.league = getLeague(user.coins);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      tapLevel: user.tapLevel,
      tapPower: user.tapPower
    });
  } catch (e) {
    console.log("/upgrade-tap error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE PROFIT ================= */
app.post("/upgrade-profit", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
if (!user) return res.json({ success: false, message: "Invalid user" });

await finalizeBtcPairsUpgrade(user);
await finalizeEthPairsUpgrade(user);
await finalizeFuturesTradingUpgrade(user);
await finalizeLiquidityPoolUpgrade(user);
await finalizeArbitrageBotUpgrade(user);
await finalizeSignalNetworkUpgrade(user);
await finalizeMyTeamUpgrade(user);
await finalizeMarketingUpgrade(user);
await finalizeCommunityManagerUpgrade(user);
await finalizePartnershipDealsUpgrade(user);
await finalizeAmbassadorProgramUpgrade(user);
await finalizeVipPartnersUpgrade(user);
await finalizeTaxOptimizationUpgrade(user);
await finalizeComplianceLicenseUpgrade(user);
await finalizeAuditProtectionUpgrade(user);
await finalizeRegulatoryLicenseUpgrade(user);
await finalizeLegalAdvisoryUpgrade(user);
await finalizeCourtSettlementUpgrade(user);
await finalizeTurboChargerUpgrade(user);
await finalizeEnergyCoreUpgrade(user);
await finalizePowerSurgeUpgrade(user);
await finalizeOverclockEngineUpgrade(user);
await finalizeNeuralSyncUpgrade(user);
await finalizeQuantumUpgrade(user);
    
    const cost = Math.floor(60 * Math.pow(1.8, user.upgradeLevel));

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.profitPerHour += 5;
    user.upgradeLevel += 1;
    user.league = getLeague(user.coins);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      profitPerHour: user.profitPerHour
    });
  } catch (e) {
    console.log("/upgrade-profit error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE BTC PAIRS ================= */

app.post("/upgrade-btc-pairs", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.btcPairs) {
      user.btcPairs = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizeBtcPairsUpgrade(user);

    const level = user.btcPairs.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.btcPairs.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = getBtcPairsCost(level);
    const baseUpgradeTime = getBtcPairsUpgradeTime(level);
const upgradeTime = applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1);
    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.btcPairs.upgrading = true;
    user.btcPairs.upgradeStartTime = new Date();
    user.btcPairs.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      btcPairs: {
        level: user.btcPairs.level,
        upgrading: true,
        currentProfit: getBtcPairsProfit(user.btcPairs.level),
        nextCost: getBtcPairsCost(user.btcPairs.level),
        upgradeTime,
        upgradeEndTime: user.btcPairs.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-btc-pairs error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE ETH PAIRS ================= */

app.post("/upgrade-eth-pairs", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.ethPairs) {
      user.ethPairs = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizeEthPairsUpgrade(user);

    const level = user.ethPairs.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.ethPairs.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = getEthPairsCost(level);
const baseUpgradeTime = getEthPairsUpgradeTime(level);
const upgradeTime = applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1);

if (user.coins < cost) {
  return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.ethPairs.upgrading = true;
    user.ethPairs.upgradeStartTime = new Date();
    user.ethPairs.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      ethPairs: {
        level: user.ethPairs.level,
        upgrading: true,
        currentProfit: getEthPairsProfit(user.ethPairs.level),
        nextCost: getEthPairsCost(user.ethPairs.level),
        upgradeTime,
        upgradeEndTime: user.ethPairs.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-eth-pairs error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE FUTURES TRADING ================= */

app.post("/upgrade-futures-trading", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.futuresTrading) {
      user.futuresTrading = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizeFuturesTradingUpgrade(user);

    const level = user.futuresTrading.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.futuresTrading.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = getFuturesTradingCost(level);
    const baseUpgradeTime = getFuturesTradingUpgradeTime(level);
    const upgradeTime =
      typeof applyComplianceReduction === "function"
        ? applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1)
        : baseUpgradeTime;

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.futuresTrading.upgrading = true;
    user.futuresTrading.upgradeStartTime = new Date();
    user.futuresTrading.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      futuresTrading: {
        level: user.futuresTrading.level,
        upgrading: true,
        currentProfit: getFuturesTradingProfit(user.futuresTrading.level),
        nextCost: getFuturesTradingCost(user.futuresTrading.level),
        upgradeTime,
        upgradeEndTime: user.futuresTrading.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-futures-trading error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE LIQUIDITY POOL ================= */

app.post("/upgrade-liquidity-pool", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.liquidityPool) {
      user.liquidityPool = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizeLiquidityPoolUpgrade(user);

    const level = user.liquidityPool.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.liquidityPool.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = getLiquidityPoolCost(level);
    const baseUpgradeTime = getLiquidityPoolUpgradeTime(level);
    const upgradeTime =
      typeof applyComplianceReduction === "function"
        ? applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1)
        : baseUpgradeTime;

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.liquidityPool.upgrading = true;
    user.liquidityPool.upgradeStartTime = new Date();
    user.liquidityPool.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      liquidityPool: {
        level: user.liquidityPool.level,
        upgrading: true,
        currentProfit: getLiquidityPoolProfit(user.liquidityPool.level),
        nextCost: getLiquidityPoolCost(user.liquidityPool.level),
        upgradeTime,
        upgradeEndTime: user.liquidityPool.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-liquidity-pool error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE ARBITRAGE BOT ================= */

app.post("/upgrade-arbitrage-bot", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.arbitrageBot) {
      user.arbitrageBot = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizeArbitrageBotUpgrade(user);

    const level = user.arbitrageBot.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.arbitrageBot.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = getArbitrageBotCost(level);
    const baseUpgradeTime = getArbitrageBotUpgradeTime(level);
    const upgradeTime =
      typeof applyComplianceReduction === "function"
        ? applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1)
        : baseUpgradeTime;

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.arbitrageBot.upgrading = true;
    user.arbitrageBot.upgradeStartTime = new Date();
    user.arbitrageBot.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      arbitrageBot: {
        level: user.arbitrageBot.level,
        upgrading: true,
        currentProfit: getArbitrageBotProfit(user.arbitrageBot.level),
        nextCost: getArbitrageBotCost(user.arbitrageBot.level),
        upgradeTime,
        upgradeEndTime: user.arbitrageBot.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-arbitrage-bot error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE SIGNAL NETWORK ================= */

app.post("/upgrade-signal-network", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.signalNetwork) {
      user.signalNetwork = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizeSignalNetworkUpgrade(user);

    const level = user.signalNetwork.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.signalNetwork.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = getSignalNetworkCost(level);
    const baseUpgradeTime = getSignalNetworkUpgradeTime(level);
    const upgradeTime =
      typeof applyComplianceReduction === "function"
        ? applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1)
        : baseUpgradeTime;

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.signalNetwork.upgrading = true;
    user.signalNetwork.upgradeStartTime = new Date();
    user.signalNetwork.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      signalNetwork: {
        level: user.signalNetwork.level,
        upgrading: true,
        currentProfit: getSignalNetworkProfit(user.signalNetwork.level),
        nextCost: getSignalNetworkCost(user.signalNetwork.level),
        upgradeTime,
        upgradeEndTime: user.signalNetwork.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-signal-network error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE MY TEAM ================= */

app.post("/upgrade-my-team", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.myTeam) {
      user.myTeam = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null,
        members: user.referrals || 0
      };
    }

    await finalizeMyTeamUpgrade(user);

    const level = user.myTeam.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.myTeam.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = getMyTeamCost(level);
    const baseUpgradeTime = getMyTeamUpgradeTime(level);
const upgradeTime = applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1);

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.myTeam.upgrading = true;
    user.myTeam.upgradeStartTime = new Date();
    user.myTeam.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);
    user.myTeam.members = user.referrals || 0;

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      myTeam: {
        level: user.myTeam.level,
        upgrading: true,
        currentBonus: getMyTeamBonus(user.myTeam.level),
        nextCost: getMyTeamCost(user.myTeam.level),
        upgradeTime,
        upgradeEndTime: user.myTeam.upgradeEndTime,
        members: user.referrals || 0
      }
    });
  } catch (e) {
    console.log("/upgrade-my-team error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE TURBO CHARGER ================= */

app.post("/upgrade-turbo-charger", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.turboCharger) {
      user.turboCharger = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizeTurboChargerUpgrade(user);

    const level = user.turboCharger.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.turboCharger.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = applyLegalAdvisoryDiscount(
      getTurboChargerCost(level),
      user.legalAdvisory?.level || 1
    );

    const baseUpgradeTime = getTurboChargerUpgradeTime(level);
    const upgradeTime =
      typeof applyComplianceReduction === "function"
        ? applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1)
        : baseUpgradeTime;

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.turboCharger.upgrading = true;
    user.turboCharger.upgradeStartTime = new Date();
    user.turboCharger.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      turboCharger: {
        level: user.turboCharger.level,
        upgrading: true,
        currentBonus: getTurboTapBonus(user.turboCharger.level),
        nextBonus:
          user.turboCharger.level >= 20
            ? getTurboTapBonus(user.turboCharger.level)
            : getTurboTapBonus(user.turboCharger.level + 1),
        nextCost: applyLegalAdvisoryDiscount(
          getTurboChargerCost(user.turboCharger.level),
          user.legalAdvisory?.level || 1
        ),
        upgradeTime,
        upgradeEndTime: user.turboCharger.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-turbo-charger error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE ENERGY CORE ================= */

app.post("/upgrade-energy-core", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.energyCore) {
      user.energyCore = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizeEnergyCoreUpgrade(user);

    const level = user.energyCore.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.energyCore.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = applyLegalAdvisoryDiscount(
      getEnergyCoreCost(level),
      user.legalAdvisory?.level || 1
    );

    const baseUpgradeTime = getEnergyCoreUpgradeTime(level);
    const upgradeTime =
      typeof applyComplianceReduction === "function"
        ? applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1)
        : baseUpgradeTime;

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.energyCore.upgrading = true;
    user.energyCore.upgradeStartTime = new Date();
    user.energyCore.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    user.maxEnergy = getEnergyCoreMax(user.energyCore.level);
user.energy = Math.min(user.maxEnergy, user.energy);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      energyCore: {
        level: user.energyCore.level,
        upgrading: true,
        currentBonus: getEnergyCoreBonus(user.energyCore.level),
        currentMax: getEnergyCoreMax(user.energyCore.level),
        nextBonus:
          user.energyCore.level >= 20
            ? getEnergyCoreBonus(user.energyCore.level)
            : getEnergyCoreBonus(user.energyCore.level + 1),
        nextCost: applyLegalAdvisoryDiscount(
          getEnergyCoreCost(user.energyCore.level),
          user.legalAdvisory?.level || 1
        ),
        upgradeTime,
        upgradeEndTime: user.energyCore.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-energy-core error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE POWER SURGE ================= */

app.post("/upgrade-power-surge", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.powerSurge) {
      user.powerSurge = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizePowerSurgeUpgrade(user);

    const level = user.powerSurge.level || 1;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.powerSurge.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = applyLegalAdvisoryDiscount(
      getPowerSurgeCost(level),
      user.legalAdvisory?.level || 1
    );

    const baseUpgradeTime = getPowerSurgeUpgradeTime(level);
    const upgradeTime =
      typeof applyComplianceReduction === "function"
        ? applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1)
        : baseUpgradeTime;

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.powerSurge.upgrading = true;
    user.powerSurge.upgradeStartTime = new Date();
    user.powerSurge.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      powerSurge: {
        level: user.powerSurge.level,
        upgrading: true,
        currentBoost: getPowerSurgeBoost(user.powerSurge.level),
        recoveryMultiplier: (() => {
          const baseRecovery = getPowerSurgeRecoveryMultiplier(user.powerSurge.level);
          return baseRecovery * (1 + getNeuralSyncBoost(user.neuralSync?.level || 1) / 100);
        })(),
        nextBoost:
          user.powerSurge.level >= 20
            ? getPowerSurgeBoost(user.powerSurge.level)
            : getPowerSurgeBoost(user.powerSurge.level + 1),
        nextCost: applyLegalAdvisoryDiscount(
          getPowerSurgeCost(user.powerSurge.level),
          user.legalAdvisory?.level || 1
        ),
        upgradeTime,
        upgradeEndTime: user.powerSurge.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-power-surge error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= UPGRADE OVERCLOCK ENGINE ================= */

app.post("/upgrade-overclock-engine", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.overclockEngine) {
      user.overclockEngine = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizeOverclockEngineUpgrade(user);

    const level = user.overclockEngine.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.overclockEngine.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = getOverclockEngineCost(level);
    const baseUpgradeTime = getOverclockEngineUpgradeTime(level);
    const upgradeTime =
      typeof applyComplianceReduction === "function"
        ? applyComplianceReduction(baseUpgradeTime, user.complianceLicense?.level || 1)
        : baseUpgradeTime;

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.overclockEngine.upgrading = true;
    user.overclockEngine.upgradeStartTime = new Date();
    user.overclockEngine.upgradeEndTime = new Date(Date.now() + upgradeTime * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      overclockEngine: {
        level: user.overclockEngine.level,
        upgrading: true,
        currentTapBoost: getOverclockTapBoost(user.overclockEngine.level),
        currentProfitBoost: getOverclockProfitBoost(user.overclockEngine.level),
        effectiveTapPower: (() => {
  const turboBase = getTurboTapBonus(user.turboCharger?.level || 1);
  const turboBonus = applyNeuralBoost(turboBase, user.neuralSync?.level || 1);
  const baseTapPower = user.tapPower + turboBonus;
  const baseTap = getOverclockTapPower(baseTapPower, user.overclockEngine.level);
  return applyNeuralBoost(baseTap, user.neuralSync?.level || 1);
})(),
        effectiveExtraProfit: getOverclockExtraProfit(user.profitPerHour, user.overclockEngine.level),
        nextTapBoost:
          user.overclockEngine.level >= 20
            ? getOverclockTapBoost(user.overclockEngine.level)
            : getOverclockTapBoost(user.overclockEngine.level + 1),
        nextProfitBoost:
          user.overclockEngine.level >= 20
            ? getOverclockProfitBoost(user.overclockEngine.level)
            : getOverclockProfitBoost(user.overclockEngine.level + 1),
        nextCost: getOverclockEngineCost(user.overclockEngine.level),
        upgradeTime,
        upgradeEndTime: user.overclockEngine.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-overclock-engine error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= NEURAL SYNC UPGRADE ================= */

app.post("/upgrade-neural-sync", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);

    if (!user.neuralSync) {
      user.neuralSync = {
        level: 1,
        upgrading: false
      };
    }

    await finalizeNeuralSyncUpgrade(user);

    const level = user.neuralSync.level;

    if (level >= 20) return res.json({ success: false, message: "Max level" });

    const cost = getNeuralSyncCost(level);
    const time = getNeuralSyncUpgradeTime(level);

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.neuralSync.upgrading = true;
    user.neuralSync.upgradeEndTime = new Date(Date.now() + time * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      neuralSync: {
        level,
        upgrading: true,
        currentBoost: getNeuralSyncBoost(level),
        nextBoost: getNeuralSyncBoost(level + 1),
        nextCost: getNeuralSyncCost(level),
        upgradeTime: time,
        upgradeEndTime: user.neuralSync.upgradeEndTime
      }
    });
  } catch (e) {
  console.log("/upgrade-neural-sync error", e);
  res.json({ success: false, message: "Server error" });
}
});

/* ================= QUANTUM CORE UPGRADE ================= */

app.post("/upgrade-quantum-core", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;
    const user = await getValidUser(String(telegramId), initData);

    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    if (!user.quantumCore) {
      user.quantumCore = {
        level: 1,
        upgrading: false,
        upgradeStartTime: null,
        upgradeEndTime: null
      };
    }

    await finalizeQuantumUpgrade(user);

    const level = user.quantumCore.level;

    if (level >= 20) {
      return res.json({ success: false, message: "Max level reached" });
    }

    if (user.quantumCore.upgrading) {
      return res.json({ success: false, message: "Upgrade already in progress" });
    }

    const cost = getQuantumCost(level);
    const time = getQuantumUpgradeTime(level);

    if (user.coins < cost) {
      return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= cost;
    user.quantumCore.upgrading = true;
    user.quantumCore.upgradeStartTime = new Date();
    user.quantumCore.upgradeEndTime = new Date(Date.now() + time * 1000);

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      quantumCore: {
        level: user.quantumCore.level,
        upgrading: true,
        currentBoost: getQuantumCoreBoost(user.quantumCore.level),
        multiplier: getQuantumMultiplier(user.quantumCore.level),
        nextBoost:
          user.quantumCore.level >= 20
            ? getQuantumCoreBoost(user.quantumCore.level)
            : getQuantumCoreBoost(user.quantumCore.level + 1),
        nextCost: getQuantumCost(user.quantumCore.level),
        upgradeTime: time,
        upgradeEndTime: user.quantumCore.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-quantum-core error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= WATCH REWARDED AD ================= */

app.post("/watch-rewarded-ad", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }

    normalizeRewardAdState(user);

    if ((user.rewardAdsWatched || 0) >= REWARDED_AD_DAILY_LIMIT) {
      return res.json({
        success: false,
        message: "Daily ad limit reached"
      });
    }

    const cooldownLeftMs = getRewardAdCooldownLeft(user);
    if (cooldownLeftMs > 0) {
      return res.json({
        success: false,
        message: `Wait ${Math.ceil(cooldownLeftMs / 1000)} sec`
      });
    }

    user.coins += REWARDED_AD_COINS;
    user.rewardAdsWatched = (user.rewardAdsWatched || 0) + 1;
    user.lastRewardAdAt = new Date();
    user.lastActive = new Date();
    user.league = getLeague(user.coins);

    await user.save();

    return res.json({
      success: true,
      reward: REWARDED_AD_COINS,
      coins: user.coins,
      rewardedAds: {
        reward: REWARDED_AD_COINS,
        watchedToday: user.rewardAdsWatched,
        dailyLimit: REWARDED_AD_DAILY_LIMIT,
        remaining: getRewardAdsRemaining(user),
        cooldownLeftMs: getRewardAdCooldownLeft(user)
      }
    });
  } catch (e) {
    console.log("/watch-rewarded-ad error", e);
    return res.json({ success: false, message: "Server error" });
  }
});

/* ================= DAILY REWARD ================= */
app.post("/daily-reward", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) return res.json({ success: false, message: "Invalid user" });

    const rewards = [500, 1000, 2500, 5000, 15000, 25000, 100000, 500000, 1000000, 5000000];
    const now = new Date();

    if (user.lastClaim) {
      const diff = (now - user.lastClaim) / (1000 * 60 * 60);

      if (diff < 24) {
        return res.json({ success: false, message: "Come tomorrow" });
      }

      if (diff > 48) {
        user.streakDay = 0;
      }
    }

    user.streakDay += 1;
    if (user.streakDay > 10) user.streakDay = 1;

    const reward = rewards[user.streakDay - 1];

    user.coins += reward;
    user.totalClaims += 1;
    user.lastClaim = now;
    user.lastActive = now;
    user.league = getLeague(user.coins);

    await user.save();

    res.json({
      success: true,
      reward,
      day: user.streakDay,
      totalClaims: user.totalClaims,
      coins: user.coins
    });
  } catch (e) {
    console.log("/daily-reward error", e);
    res.json({ success: false });
  }
});

/* ================= GLOBAL TOP ================= */
app.get("/top-global", async (req, res) => {
  try {
    const users = await User.find({}).sort({ coins: -1 }).limit(10);
    res.json(users);
  } catch (e) {
    console.log("/top-global error", e);
    res.json([]);
  }
});

/* ================= TASK ================= */
app.post("/complete-task", async (req, res) => {
  try {
    const { telegramId, taskId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) return res.json({ success: false, message: "Invalid user" });

    if (user.completedTasks.includes(taskId)) {
      return res.json({ success: false, message: "Already done" });
    }

    user.coins += 1000;
    user.completedTasks.push(taskId);
    user.league = getLeague(user.coins);

    await user.save();

    res.json({ success: true, reward: 1000 });
  } catch (e) {
    console.log("/complete-task error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= TASK REWARDS DATA ================= */

const LEAGUE_REWARDS = [
  { league: "Wood", reward: 1000 },
  { league: "Bronze", reward: 10000 },
  { league: "Silver", reward: 20000 },
  { league: "Gold", reward: 50000 },
  { league: "Platinum", reward: 100000 },
  { league: "Diamond", reward: 200000 },
  { league: "Master", reward: 300000 },
  { league: "Elite", reward: 500000 },
  { league: "Champion", reward: 700000 },
  { league: "Legend", reward: 1000000 },
  { league: "Grandmaster", reward: 1500000 },
  { league: "Immortal", reward: 2500000 }
];

const REF_REWARDS = [
  { refs: 2, reward: 2000, key: "ref_2" },
  { refs: 5, reward: 5000, key: "ref_5" },
  { refs: 10, reward: 10000, key: "ref_10" }
];

/* ================= TASK STATUS ================= */

app.get("/task-status/:telegramId", async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      return res.json({
        success: false,
        specialDone: false,
        leagueRewards: [],
        refRewards: [],
        referrals: 0,
        league: "Wood"
      });
    }

    const leagueRewards = LEAGUE_REWARDS.map(item => ({
  league: item.league,
  reward: item.reward,
  claimed: user.leagueRewardsClaimed.includes(item.league),
  unlocked: LEAGUES.findIndex(x => x.name === user.league) > LEAGUES.findIndex(x => x.name === item.league)
}));

    const refRewards = REF_REWARDS.map(item => ({
      refs: item.refs,
      reward: item.reward,
      key: item.key,
      claimed: (user.refRewardsClaimed || []).includes(item.key),
      unlocked: user.referrals >= item.refs
    }));

    res.json({
      success: true,
      specialDone: user.completedTasks.includes("special_socials"),
      leagueRewards,
      refRewards,
      referrals: user.referrals,
      league: user.league
    });
  } catch (e) {
    res.json({ success: false });
  }
});

/* ================= SPECIAL TASK STATUS ================= */

app.get("/special-task-status/:telegramId", async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: String(req.params.telegramId) });

    if (!user) {
      return res.json({
        success: false,
        claimed: false
      });
    }

    return res.json({
      success: true,
      claimed: user.completedTasks.includes("special_socials")
    });
  } catch (e) {
    console.log("special-task-status error", e);
    res.json({ success: false, claimed: false });
  }
});

/* ================= CLAIM SPECIAL TASK ================= */

app.post("/claim-special-task", async (req, res) => {
  try {
    const { telegramId, initData, clickedTasks } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const requiredTasks = [
      "telegram_channel",
      "instagram",
      "x",
      "discord",
      "telegram_group"
    ];

    const done = Array.isArray(clickedTasks) ? clickedTasks : [];

    const allDone = requiredTasks.every(task => done.includes(task));

    if (!allDone) {
      return res.json({ success: false, message: "Complete all social tasks first" });
    }

    const taskId = "special_socials";

    if (user.completedTasks.includes(taskId)) {
      return res.json({ success: false, message: "Already claimed" });
    }

    user.completedTasks.push(taskId);
    user.coins += 5000;
    user.league = getLeague(user.coins);

    await user.save();

    res.json({
      success: true,
      reward: 5000,
      coins: user.coins
    });
  } catch (e) {
    console.log("claim-special-task error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= CLAIM LEAGUE REWARD ================= */

app.post("/claim-league-reward", async (req, res) => {
  try {
    const { telegramId, leagueName, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const rewardItem = LEAGUE_REWARDS.find(x => x.league === leagueName);
    if (!rewardItem) {
      return res.json({ success: false, message: "Invalid league" });
    }

    const currentIndex = LEAGUES.findIndex(x => x.name === user.league);
    const targetIndex = LEAGUES.findIndex(x => x.name === leagueName);

    if (currentIndex < targetIndex) {
      return res.json({ success: false, message: "League not completed yet" });
    }

    if (user.leagueRewardsClaimed.includes(leagueName)) {
      return res.json({ success: false, message: "Already claimed" });
    }

    user.leagueRewardsClaimed.push(leagueName);
    user.coins += rewardItem.reward;
    user.league = getLeague(user.coins);

    await user.save();

    res.json({
      success: true,
      reward: rewardItem.reward,
      coins: user.coins
    });
  } catch (e) {
    console.log("claim-league-reward error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= CLAIM REF REWARD ================= */

app.post("/claim-ref-reward", async (req, res) => {
  try {
    const { telegramId, rewardKey, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.refRewardsClaimed) {
      user.refRewardsClaimed = [];
    }

    const rewardItem = REF_REWARDS.find(x => x.key === rewardKey);
    if (!rewardItem) {
      return res.json({ success: false, message: "Invalid reward" });
    }

    if (user.referrals < rewardItem.refs) {
      return res.json({ success: false, message: "Referral target not completed" });
    }

    if (user.refRewardsClaimed.includes(rewardKey)) {
      return res.json({ success: false, message: "Already claimed" });
    }

    user.refRewardsClaimed.push(rewardKey);
    user.coins += rewardItem.reward;
    user.league = getLeague(user.coins);

    await user.save();

    res.json({
      success: true,
      reward: rewardItem.reward,
      coins: user.coins
    });
  } catch (e) {
    console.log("claim-ref-reward error", e);
    res.json({ success: false, message: "Server error" });
  }
});

/* ================= DAILY COMBO ================= */
app.get("/daily-combo", async (req, res) => {
  res.json({ combo: ["A", "B", "C"] });
});

/* ================= LEAGUE API ================= */
app.get("/league/:telegramId", async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: String(req.params.telegramId) });
    if (!user) return res.json({ league: "Wood", coins: 0 });

    const league = getLeague(user.coins);

    res.json({
      league,
      coins: user.coins
    });
  } catch (e) {
    console.log("/league error", e);
    res.json({ league: "Wood", coins: 0 });
  }
});

/* ================= TOP LEAGUE ================= */
app.get("/top-league/:league", async (req, res) => {
  try {
    const users = await User.find({ league: req.params.league })
      .sort({ coins: -1 })
      .limit(10);

    res.json(users);
  } catch (e) {
    console.log("/top-league error", e);
    res.json([]);
  }
});

/* ================= USER RANK ================= */
app.get("/rank/:telegramId", async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: String(req.params.telegramId) });
    if (!user) return res.json({ rank: 0, coins: 0, referrals: 0 });

    const rank = await User.countDocuments({ coins: { $gt: user.coins } }) + 1;

    res.json({
      rank,
      coins: user.coins,
      referrals: user.referrals
    });
  } catch (e) {
    console.log("/rank error", e);
    res.json({ rank: 0, coins: 0, referrals: 0 });
  }
});

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

/* ================= CRON ================= */
cron.schedule("0 0 * * 0", async () => {
  try {
    await User.updateMany({}, { suspiciousCount: 0 });
  } catch (e) {
    console.log("cron error", e);
  }
});

/* ================= START ================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
