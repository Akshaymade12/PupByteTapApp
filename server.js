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
  tapResetTime: { type: Number, default: Date.now() },
  dailyComboClaimed: { type: String, default: "" },
  upgradeLevel: { type: Number, default: 0 },
  lastTap: { type: Number, default: 0 },
  referredBy: { type: String, default: null },
  referrals: { type: Number, default: 0 },
  completedTasks: { type: [String], default: [] },
  leagueRewardsClaimed: { type: [String], default: [] },
  league: { type: String, default: "Wood" },
  lastActive: { type: Date, default: Date.now },
  lastDailyClaim: { type: Date, default: null },
  lastSpin: { type: Date, default: null },
  lastEnergyUpdate: { type: Number, default: Date.now },
  rewardClaimed: { type: Boolean, default: false },
  streakDay: { type: Number, default: 0 },
  lastClaim: { type: Date, default: null },
  totalClaims: { type: Number, default: 0 }
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
    user = await User.create({ telegramId });
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

/* ================= ENERGY ================= */
function rechargeEnergy(user) {
  const now = Date.now();
  const diff = (now - user.lastEnergyUpdate) / 1000;
  const add = Math.floor(diff * 2);

  if (add > 0) {
    user.energy = Math.min(user.maxEnergy, user.energy + add);
    user.lastEnergyUpdate = now;
  }
}

/* ================= OFFLINE ================= */
async function applyOfflineMining(user) {
  rechargeEnergy(user);

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

    return res.json({
      success: true,
      coins: user.coins,
      energy: user.energy,
      profitPerHour: user.profitPerHour,
      tapLevel: user.tapLevel,
      tapPower: user.tapPower,
      league: user.league,
      referrals: user.referrals,
      streak: user.streakDay,
      totalClaims: user.totalClaims,
      nextTapCost: Math.floor(40 * Math.pow(1.7, user.tapLevel)),
      nextProfitCost: Math.floor(60 * Math.pow(1.8, user.upgradeLevel))
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

    user.coins += user.tapPower;
    user.energy -= user.tapPower;
    user.lastActive = new Date();
    user.league = getLeague(user.coins);

    await user.save();

    return res.json({
      success: true,
      coins: user.coins,
      energy: user.energy,
      tapPower: user.tapPower,
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

app.listen(PORT, () => {
  console.log("Server running 🚀");
});
