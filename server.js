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

    const cost = getTaxOptimizationCost(level);
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

    const cost = getComplianceLicenseCost(level);
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

/* ================= ENERGY ================= */
function rechargeEnergy(user) {
  const now = Date.now();
  const diff = (now - user.lastEnergyUpdate) / 1000;
  const add = Math.floor(diff * 2);
  const maxEnergy = getEnergyCoreMax(user.energyCore?.level || 1);

  if (add > 0) {
    user.energy = Math.min(maxEnergy, user.energy + add);
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

  if (seconds > 0) {
    const earned = (user.profitPerHour / 3600) * seconds;
    user.coins += Math.floor(earned);
    user.lastActive = now;
    user.league = getLeague(user.coins);
    await user.save();
  }
}

/* ================= LOAD ================= */
app.post("/load", async (req, res) => {
  try {
    const { telegramId, initData } = req.body;

    const user = await getValidUser(String(telegramId), initData);
    if (!user) return res.json({ success: false, message: "Invalid user" });

    await applyOfflineMining(user);
    await finalizeBtcPairsUpgrade(user);
    await finalizeFuturesTradingUpgrade(user);
    await finalizeEthPairsUpgrade(user);
    await finalizeMyTeamUpgrade(user);
    await finalizeMarketingUpgrade(user);
    await finalizeTaxOptimizationUpgrade(user);
    await finalizeComplianceLicenseUpgrade(user);
    await finalizeTurboChargerUpgrade(user);
    await finalizeEnergyCoreUpgrade(user);

    user.maxEnergy = getEnergyCoreMax(user.energyCore?.level || 1);
user.energy = Math.min(user.maxEnergy, user.energy);
    
    return res.json({
      success: true,
      coins: user.coins,
      energy: user.energy,
      maxEnergy: getEnergyCoreMax(user.energyCore?.level || 1),
      profitPerHour:
  user.profitPerHour +
  getMarketingExtraProfit(user.profitPerHour, user.marketing?.level || 1) +
  getTaxOptimizationSavedProfit(user.profitPerHour, user.taxOptimization?.level || 1),
      tapLevel: user.tapLevel,
      tapPower: user.tapPower,
      league: user.league,
      referrals: user.referrals,
      streak: user.streakDay,
      totalClaims: user.totalClaims,
      nextTapCost: Math.floor(40 * Math.pow(1.7, user.tapLevel)),
      nextProfitCost: Math.floor(60 * Math.pow(1.8, user.upgradeLevel)),

      btcPairs: {
        level: user.btcPairs?.level || 1,
        upgrading: user.btcPairs?.upgrading || false,
        currentProfit: getBtcPairsProfit(user.btcPairs?.level || 1),
        nextCost: (user.btcPairs?.level || 1) >= 20 ? 0 : getBtcPairsCost(user.btcPairs?.level || 1),
        upgradeTime: (user.btcPairs?.level || 1) >= 20 ? 0 : getBtcPairsUpgradeTime(user.btcPairs?.level || 1),
        upgradeEndTime: user.btcPairs?.upgradeEndTime || null
      },

      ethPairs: {
  level: user.ethPairs?.level || 1,
  upgrading: user.ethPairs?.upgrading || false,
  currentProfit: getEthPairsProfit(user.ethPairs?.level || 1),
  nextCost: (user.ethPairs?.level || 1) >= 20 ? 0 : getEthPairsCost(user.ethPairs?.level || 1),
  upgradeTime: (user.ethPairs?.level || 1) >= 20 ? 0 : getEthPairsUpgradeTime(user.ethPairs?.level || 1),
  upgradeEndTime: user.ethPairs?.upgradeEndTime || null
      },

      futuresTrading: {
  level: user.futuresTrading?.level || 1,
  upgrading: user.futuresTrading?.upgrading || false,
  currentProfit: getFuturesTradingProfit(user.futuresTrading?.level || 1),
  nextCost: (user.futuresTrading?.level || 1) >= 20 ? 0 : getFuturesTradingCost(user.futuresTrading?.level || 1),
  upgradeTime: (user.futuresTrading?.level || 1) >= 20 ? 0 : getFuturesTradingUpgradeTime(user.futuresTrading?.level || 1),
  upgradeEndTime: user.futuresTrading?.upgradeEndTime || null
},

      myTeam: {
  level: user.myTeam?.level || 1,
  upgrading: user.myTeam?.upgrading || false,
  currentBonus: getMyTeamBonus(user.myTeam?.level || 1),
  nextCost: (user.myTeam?.level || 1) >= 20 ? 0 : getMyTeamCost(user.myTeam?.level || 1),
  upgradeTime: (user.myTeam?.level || 1) >= 20 ? 0 : getMyTeamUpgradeTime(user.myTeam?.level || 1),
  upgradeEndTime: user.myTeam?.upgradeEndTime || null,
  members: user.referrals || 0
      },

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
      : getComplianceLicenseCost(user.complianceLicense?.level || 1),
  upgradeTime:
    (user.complianceLicense?.level || 1) >= 20
      ? 0
      : applyComplianceReduction(
          getComplianceLicenseUpgradeTime(user.complianceLicense?.level || 1),
          user.complianceLicense?.level || 1
        ),
  upgradeEndTime: user.complianceLicense?.upgradeEndTime || null
      },
      
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
      : getTaxOptimizationCost(user.taxOptimization?.level || 1),
  upgradeTime:
    (user.taxOptimization?.level || 1) >= 20
      ? 0
      : getTaxOptimizationUpgradeTime(user.taxOptimization?.level || 1),
  upgradeEndTime: user.taxOptimization?.upgradeEndTime || null
       },

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
      }
    });
  } catch (e) {
    console.log("/load error", e);
    res.json({ success: false });
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

    const turboBonus = getTurboTapBonus(user.turboCharger?.level || 1);
const finalTapPower = user.tapPower + turboBonus;

user.coins += finalTapPower;
user.energy -= user.tapPower;
    user.lastActive = new Date();
    user.league = getLeague(user.coins);

    await user.save();

    return res.json({
  success: true,
  coins: user.coins,
  energy: user.energy,
  maxEnergy: getEnergyCoreMax(user.energyCore?.level || 1),
  tapPower: user.tapPower + getTurboTapBonus(user.turboCharger?.level || 1),
  profitPerHour: user.profitPerHour,
  league: user.league
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
await finalizeMyTeamUpgrade(user);
await finalizeMarketingUpgrade(user);
await finalizeTaxOptimizationUpgrade(user);
await finalizeComplianceLicenseUpgrade(user);
await finalizeTurboChargerUpgrade(user);
await finalizeEnergyCoreUpgrade(user);
    
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
await finalizeMyTeamUpgrade(user);
await finalizeMarketingUpgrade(user);
await finalizeTaxOptimizationUpgrade(user);
await finalizeComplianceLicenseUpgrade(user);
await finalizeTurboChargerUpgrade(user);
await finalizeEnergyCoreUpgrade(user);
    
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

    const cost = getTurboChargerCost(level);
    const upgradeTime = getTurboChargerUpgradeTime(level);

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
        nextCost: getTurboChargerCost(user.turboCharger.level),
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

    const cost = getEnergyCoreCost(level);
    const upgradeTime = getEnergyCoreUpgradeTime(level);

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
        nextCost: getEnergyCoreCost(user.energyCore.level),
        upgradeTime,
        upgradeEndTime: user.energyCore.upgradeEndTime
      }
    });
  } catch (e) {
    console.log("/upgrade-energy-core error", e);
    res.json({ success: false, message: "Server error" });
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
