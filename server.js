const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("Mongo Error ❌", err));

/* =========================
   LEVEL CONFIG
========================= */

const levels = [
  { name: "Bronze", min: 0, tap: 1 },
  { name: "Silver", min: 5000, tap: 2 },
  { name: "Gold", min: 25000, tap: 3 },
  { name: "Platinum", min: 100000, tap: 5 },
  { name: "Diamond", min: 1000000, tap: 10 },
  { name: "Epic", min: 2000000, tap: 20 },
  { name: "Legendary", min: 10000000, tap: 50 },
  { name: "Master", min: 50000000, tap: 100 },
  { name: "Grandmaster", min: 100000000, tap: 200 },
  { name: "Lord", min: 1000000000, tap: 500 }
];

/* =========================
   USER SCHEMA
========================= */

const User = mongoose.model("User", {
  telegramId: String,
  username: String,
  coins: { type: Number, default: 0 },
  profitPerHour: { type: Number, default: 0 },
  level: { type: String, default: "Bronze" },
  tapPower: { type: Number, default: 1 },
  lastActive: { type: Date, default: Date.now }
});

/* =========================
   SAVE COINS + LEVEL UPDATE
========================= */

app.post("/save", async (req, res) => {

  const { telegramId, username, coins } = req.body;
  if (!telegramId) return res.json({ success: false });

  let user = await User.findOne({ telegramId });

  if (!user) {
    user = new User({
      telegramId,
      username,
      coins: 0
    });
  }

  user.username = username;
  user.coins = coins;
  user.lastActive = new Date();

  // LEVEL CALCULATION (IMPORTANT: YAHI ANDAR RAHEGA)
  let currentLevel = levels[0];
  for (let lvl of levels) {
    if (user.coins >= lvl.min) {
      currentLevel = lvl;
    }
  }

  user.level = currentLevel.name;
  user.tapPower = currentLevel.tap;
  user.profitPerHour = user.tapPower * 100;

  await user.save();

  res.json({
    success: true,
    level: user.level,
    tapPower: user.tapPower
  });

});

/* =========================
   LOAD DATA + OFFLINE EARN
========================= */

app.get("/load/:id", async (req, res) => {

  const user = await User.findOne({ telegramId: req.params.id });

  if (!user) {
    return res.json({
      coins: 0,
      profitPerHour: 0,
      level: "Bronze",
      tapPower: 1
    });
  }

  // 🔥 TIME BASED MINING
   
  const now = new Date();
  const maxOfflineSeconds = 6 * 3600; // 6 hours max
const rawSeconds = (now - user.lastActive) / 1000;
const secondsPassed = Math.min(rawSeconds, maxOfflineSeconds);
  const earned = (user.profitPerHour / 3600) * secondsPassed;

  user.coins += earned;
  user.lastActive = now;

  await user.save();

  res.json({
    coins: user.coins,
    profitPerHour: user.profitPerHour,
    level: user.level,
    tapPower: user.tapPower
  });
});

/* =========================
   UPGRADE MINING
========================= */

app.post("/upgrade", async (req, res) => {
  const { telegramId } = req.body;
   
let user = await User.findOne({ telegramId });
  if (!user) return res.json({ success: false });

  const cost = 1000;

  if (user.coins < cost) {
    return res.json({ success: false });
  }

  user.coins -= cost;
  user.profitPerHour += 1000;

  await user.save();

  res.json({
    success: true,
    coins: user.coins,
    profitPerHour: user.profitPerHour
  });
});

app.get("/leaderboard", async (req, res) => {
   const topUsers = await User.find({})
      .sort({ coins: -1 })
      .limit(10);

   res.json(topUsers);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server running 🚀"));
