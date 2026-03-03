const rateLimit = require("express-rate-limit");
const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.set("trust proxy", 1);
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const MONGO_URI = process.env.MONGO_URI;

const bot = new TelegramBot(BOT_TOKEN);

app.post(`/bot${BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // 120 requests per minute per IP
  message: { success: false, message: "Too many requests" }
});

app.use(apiLimiter);

app.use(express.static(__dirname));

/* ================= ENV ================= */

if (!BOT_TOKEN) {
  console.error("BOT_TOKEN missing ❌");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("Mongo Error ❌", err));

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
  upgradeLevel: { type: Number, default: 0 },
  lastTap: { type: Number, default: 0 },
  referredBy: { type: String, default: null },
referrals: { type: Number, default: 0 },
  completedTasks: { type: [String], default: [] },
leagueRewardsClaimed: { type: [String], default: [] },
  league: { type: String, default: "Wood" },
  lastActive: { type: Date, default: Date.now },
  lastDailyClaim: { type: Date, default: null },
  lastSpin: { type: Date, default: null }
  
});

const User = mongoose.model("User", userSchema);

/* ================= TELEGRAM VERIFY ================= */

function verifyTelegram(initData) {

  if (!initData) return false;

  const secret = crypto
    .createHash("sha256")
    .update(BOT_TOKEN)
    .digest();

  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get("hash");
  urlParams.delete("hash");

  const dataCheckString = [...urlParams.entries()]
    .sort()
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const hmac = crypto
    .createHmac("sha256", secret)
    .update(dataCheckString)
    .digest("hex");

  return hmac === hash;
}

/* ================= COMMON USER VALIDATION ================= */

async function getValidUser(telegramId, initData) {

  if (!verifyTelegram(initData)) {
    return null;
  }

  if (!telegramId || telegramId.length < 5) {
    return null;
  }

  const user = await User.findOne({ telegramId });

  if (!user) return null;

  if (user.isBlocked) {
    return null;
  }

  return user;
}

/* ================= LEAGUE SYSTEM ================= */

const leagues = [
  { name: "Wood", min: 0, max: 10000 },
  { name: "Bronze", min: 10000, max: 30000 },
  { name: "Silver", min: 30000, max: 70000 },
  { name: "Golden", min: 70000, max: 150000 },
  { name: "Platinum", min: 150000, max: 300000 },
  { name: "Diamond", min: 300000, max: 600000 },
  { name: "Master", min: 600000, max: 1200000 },
  { name: "Grandmaster", min: 1200000, max: 2500000 },
  { name: "Elite", min: 2500000, max: 5000000 },
  { name: "Legendary", min: 5000000, max: 10000000 },
  { name: "Mythic", min: 10000000, max: Infinity }
];

function getLeague(coins) {

  for (let league of leagues) {
    if (coins >= league.min && coins < league.max) {
      return league.name;
    }
  }

  return "Wood";
}

/* ================= OFFLINE MINING ================= */

async function applyOfflineMining(user) {
  const now = new Date();
  const seconds = (now - user.lastActive) / 1000;

  if (seconds > 0) {
    const earned = (user.profitPerHour / 3600) * seconds;
    user.coins += Math.floor(earned);
    user.league = getLeague(user.coins);
    user.lastActive = now;
    await user.save();
  }
}

/* ================= TELEGRAM START HANDLER ================= */

bot.onText(/\/start(?: (.+))?/, async (msg, match) => {

  const telegramId = msg.from.id.toString();
  const refId = match[1];

  let user = await User.findOne({ telegramId });

  if (!user) {

    user = await User.create({
      telegramId,
      referredBy: refId && refId !== telegramId ? refId : null
    });

    if (refId && refId !== telegramId) {
      const refUser = await User.findOne({ telegramId: refId });

      if (refUser) {
        refUser.coins += 500;
        refUser.referrals += 1;
        await refUser.save();
      }
    }
  }

  bot.sendMessage(
    msg.chat.id,
    "🚀 Welcome to PupByte Tap Bot!\nTap to earn coins!",
    {
      reply_markup: {
        inline_keyboard: [[
          {
            text: "🔥 Open App",
            web_app: {
              url: "https://pupbytetapapp.onrender.com"
            }
          }
        ]]
      }
    }
  );

});

/* ================= ENERGY RECHARGE ================= */

setInterval(async () => {
  const users = await User.find({});
  for (let user of users) {
    if (user.energy < user.maxEnergy) {
      user.energy += 2;
      if (user.energy > user.maxEnergy)
        user.energy = user.maxEnergy;
      await user.save();
    }
  }
}, 3000);

/* ================= LOAD USER ================= */

app.get("/load/:id", async (req, res) => {
  const telegramId = req.params.id;

  if (!telegramId || telegramId.length < 5) {
  return res.json({ success: false });
  }
  
  let user = await User.findOne({ telegramId });

  if (!user) {
    user = await User.create({ telegramId });
  }

  await applyOfflineMining(user);

  res.json({
    coins: user.coins,
    energy: user.energy,
    profitPerHour: user.profitPerHour,
    tapLevel: user.tapLevel,
    tapPower: user.tapPower,
    league: user.league,
    referrals: user.referrals,
    nextTapCost: Math.floor(40 * Math.pow(1.7, user.tapLevel)),
    nextProfitCost: Math.floor(60 * Math.pow(1.8, user.upgradeLevel))
  });
});

/* ================= TAP ================= */

app.post("/tap", async (req, res) => {

  const { telegramId, initData } = req.body;
const user = await getValidUser(telegramId, initData);
if (!user) return res.json({ success: false });


  await applyOfflineMining(user);

  // 🛡 Suspicious Tap Detection

if (Date.now() - user.lastTap < 200) {
  user.suspiciousCount += 1;
} else {
  user.suspiciousCount = 0;
}

if (user.suspiciousCount >= 10) {
  user.isBlocked = true;
  await user.save();
  return res.json({ success: false, message: "User blocked" });
}
  
// FAST TAP BLOCK
if (Date.now() - user.lastTap < 400) {
  return res.json({ success: false });
}

// ENERGY CHECK
if (user.energy < user.tapPower) {
  return res.json({ success: false });
}

// RESET COUNTER
if (Date.now() - user.tapResetTime > 60000) {
  user.tapCount = 0;
  user.tapResetTime = Date.now();
}

// LIMIT
if (user.tapCount >= 120) {
  return res.json({ success: false, message: "Too fast" });
}

user.tapCount += 1;

  const now = new Date();

// limit max coin gain per second (anti script spam)
if (user.lastCoinUpdate) {
  const diff = (now - user.lastCoinUpdate) / 1000;
  if (diff < 1 && user.tapPower > 20) {
    return res.json({ success: false });
  }
}

user.coins += user.tapPower;
user.lastCoinUpdate = now;
  user.energy -= user.tapPower;
  user.league = getLeague(user.coins);
  user.lastTap = Date.now();

  await user.save();

  res.json({
    success: true,
    coins: user.coins,
    energy: user.energy,
    tapPower: user.tapPower,
    profitPerHour: user.profitPerHour
  });
});

/* ================= TAP UPGRADE ================= */

app.post("/upgrade-tap", async (req, res) => {
  const { telegramId, initData } = req.body;
const user = await getValidUser(telegramId, initData);
if (!user) return res.json({ success: false });

  await applyOfflineMining(user);

  const cost = Math.floor(40 * Math.pow(1.7, user.tapLevel));

  if (user.coins < cost)
    return res.json({ success: false, required: cost });

  user.coins -= cost;
  user.tapLevel += 1;

  if (user.tapLevel % 2 === 0)
    user.tapPower += 1;

  await user.save();

  res.json({
    success: true,
    coins: user.coins,
    nextCost: Math.floor(40 * Math.pow(1.7, user.tapLevel))
  });
});

/* ================= PROFIT UPGRADE ================= */

app.post("/upgrade-profit", async (req, res) => {
  const { telegramId, initData } = req.body;
const user = await getValidUser(telegramId, initData);
if (!user) return res.json({ success: false });

  await applyOfflineMining(user);

  // 🔒 Profit exploit protection
  
if (user.upgradeLevel >= 100) {
  return res.json({ success: false, message: "Max level reached" });
}
  
  const cost = Math.floor(60 * Math.pow(1.8, user.upgradeLevel));

  if (user.coins < cost)
    return res.json({ success: false, required: cost });

  user.coins -= cost;
  user.profitPerHour += 3 + user.upgradeLevel;
  user.upgradeLevel += 1;

  await user.save();

  res.json({
    success: true,
    coins: user.coins,
    profitPerHour: user.profitPerHour,
    nextCost: Math.floor(60 * Math.pow(1.8, user.upgradeLevel))
  });
});

/* ================= TOP 10 LEAGUE ================= */

app.get("/top/:league", async (req, res) => {
  const league = req.params.league;

  const topUsers = await User.find({ league })
  .sort({ coins: -1 })
  .limit(10)
  .select("telegramId coins");
  
  res.json(topUsers);
});

/* ================= SPECIAL TASK ================= */

app.post("/complete-task", async (req, res) => {
  const { telegramId, initData, taskId } = req.body;

  const user = await getValidUser(telegramId, initData);
  if (!user) return res.json({ success: false });

  if (!taskId) return res.json({ success: false });

  if (user.completedTasks.includes(taskId)) {
    return res.json({ success: false, message: "Already completed" });
  }

  let reward = 0;

  if (taskId === "telegram_join") reward = 1000;
  if (taskId === "twitter_follow") reward = 500;

  if (reward === 0) return res.json({ success: false });

  user.coins += reward;
  user.completedTasks.push(taskId);

  await user.save();

  res.json({ success: true, reward });
});

/* ================= LEAGUE REWARD ================= */

app.post("/claim-league", async (req, res) => {
  const { telegramId, initData } = req.body;
const user = await getValidUser(telegramId, initData);
if (!user) return res.json({ success: false });

  const league = user.league;

  if (user.leagueRewardsClaimed.includes(league)) {
    return res.json({ success: false });
  }

  let reward = 0;

  if (league === "Bronze") reward = 2000;
  if (league === "Silver") reward = 5000;
  if (league === "Golden") reward = 10000;

  if (reward === 0) return res.json({ success: false });

  user.coins += reward;
  user.leagueRewardsClaimed.push(league);

  await user.save();

  res.json({ success: true, reward });
});

/* ================= SPIN ================= */

app.post("/spin", async (req, res) => {
  const { telegramId, initData } = req.body;
const user = await getValidUser(telegramId, initData);
if (!user) return res.json({ success: false });

  const now = new Date();

  // 24 hour restriction
  if (user.lastSpin && (now - user.lastSpin) < 24 * 60 * 60 * 1000) {
    return res.json({ success: false, message: "Already spun today" });
  }

  // random reward
  const rewards = [100, 200, 300, 500, 800, 1000];
  const reward = rewards[Math.floor(Math.random() * rewards.length)];

  // 🔒 Cheat protection
if (!rewards.includes(reward)) {
  return res.json({ success: false });
}
  
  user.coins += reward;
  user.lastSpin = now;
  user.league = getLeague(user.coins);
  
  await user.save();

  res.json({ success: true, reward, coins: user.coins });
});

/* ================= DAILY REWARD ================= */

app.post("/daily-reward", async (req, res) => {
  const { telegramId, initData } = req.body;
const user = await getValidUser(telegramId, initData);
if (!user) return res.json({ success: false });

  const now = new Date();

  if (user.lastDailyClaim) {
    const diff = now - user.lastDailyClaim;
    const hours = diff / (1000 * 60 * 60);

    if (hours < 24) {
      return res.json({ success: false, message: "Already claimed" });
    }
  }

  const reward = 1000;

  user.coins += reward;
  user.lastDailyClaim = now;
  user.league = getLeague(user.coins);
  
  await user.save();

  res.json({ success: true, reward });
});

/* ================= GLOBAL TOP ================= */

app.get("/top-global", async (req, res) => {

  const topUsers = await User.find({})
    .sort({ coins: -1 })
    .limit(10)
    .select("telegramId coins league");

  res.json(topUsers);
});


/* ================= LEAGUE TOP ================= */

app.get("/top-league/:league", async (req, res) => {

  const league = req.params.league;

  const topUsers = await User.find({ league })
    .sort({ coins: -1 })
    .limit(10)
    .select("telegramId coins");

  res.json(topUsers);
});


/* ================= USER RANK ================= */

app.get("/rank/:id", async (req, res) => {

  const telegramId = req.params.id;

  const user = await User.findOne({ telegramId });
  if (!user) return res.json({});

  const rank =
    await User.countDocuments({ coins: { $gt: user.coins } }) + 1;

  res.json({
    rank,
    league: user.league,
    coins: user.coins
  });
});

/* ================= ROOT ================= */

app.get("/", (req, res) => {
  res.send("PupByte Server Running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
