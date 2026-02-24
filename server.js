const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("Mongo Error ❌", err));

/* ================= SCHEMA ================= */

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  coins: { type: Number, default: 0 },
  profitPerHour: { type: Number, default: 10 },
  energy: { type: Number, default: 100 },
  maxEnergy: { type: Number, default: 100 },
  tapLevel: { type: Number, default: 1 },
  tapPower: { type: Number, default: 1 },
  upgradeLevel: { type: Number, default: 0 },
  league: { type: String, default: "Wood" },
  lastActive: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

/* ================= LEAGUE SYSTEM ================= */

const leagues = [
  { name: "Wood", min: 0 },
  { name: "Bronze", min: 5000 },
  { name: "Silver", min: 20000 },
  { name: "Gold", min: 50000 },
  { name: "Platinum", min: 250000 },
  { name: "Diamond", min: 500000 },
  { name: "Master", min: 1000000 },
  { name: "Grandmaster", min: 2500000 },
  { name: "Elite", min: 5000000 },
  { name: "Legendary", min: 10000000 }
];

function getLeague(coins) {
  let currentLeague = leagues[0].name;

  for (let league of leagues) {
    if (coins >= league.min) {
      currentLeague = league.name;
    }
  }

  return currentLeague;
}

/* ================= OFFLINE MINING ================= */

async function applyOfflineMining(user) {
  const now = new Date();
  const seconds = (now - user.lastActive) / 1000;

  if (seconds > 0) {
    const earned = (user.profitPerHour / 3600) * seconds;
    user.coins += earned;
    user.lastActive = now;
    await user.save();
  }
}

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

  let user = await User.findOne({ telegramId });
  if (!user) user = await User.create({ telegramId });

  await applyOfflineMining(user);

  res.json({
    coins: user.coins,
    energy: user.energy,
    profitPerHour: user.profitPerHour,
    tapLevel: user.tapLevel,
    tapPower: user.tapPower,
    nextTapCost: Math.floor(40 * Math.pow(1.7, user.tapLevel)),
    nextProfitCost: Math.floor(60 * Math.pow(1.8, user.upgradeLevel))
  });
});

/* ================= TAP ================= */

app.post("/tap", async (req, res) => {
  const { telegramId } = req.body;

  const user = await User.findOne({ telegramId });
  if (!user) return res.json({ success: false });

  await applyOfflineMining(user);

  if (user.energy < user.tapPower)
    return res.json({ success: false });

  user.coins += user.tapPower;
  user.energy -= user.tapPower;
  user.league = getLeague(user.coins);

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
  const { telegramId } = req.body;
  const user = await User.findOne({ telegramId });
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
  const { telegramId } = req.body;
  const user = await User.findOne({ telegramId });
  if (!user) return res.json({ success: false });

  await applyOfflineMining(user);

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

/* ================= ROOT ================= */

app.get("/", (req, res) => {
  res.send("PupByte Server Running 🚀");
});

app.listen(process.env.PORT || 3000);
