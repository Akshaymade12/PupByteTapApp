const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("Mongo Error ❌", err));

// User Schema
const User = mongoose.model("User", {
  telegramId: String,
  coins: { type: Number, default: 0 },
  profitPerHour: { type: Number, default: 0 },
  level: { type: Number, default: 1 }
});

// SAVE
app.post("/save", async (req, res) => {
  const { telegramId, coins } = req.body;
  if (!telegramId) return res.json({ success: false });

  let user = await User.findOne({ telegramId });

  if (!user) {
  user = new User({ telegramId, coins });
} else {
  user.coins = coins;
  }

  // 🔥 LEVEL LOGIC
  if (user.coins >= 1000) user.level = 2;
  if (user.coins >= 5000) user.level = 3;
  if (user.coins >= 10000) user.level = 4;
  if (user.coins >= 25000) user.level = 5;
  if (user.coins >= 50000) user.level = 6;
  if (user.coins >= 100000) user.level = 7;
  if (user.coins >= 250000) user.level = 8;
  if (user.coins >= 500000) user.level = 9;
  if (user.coins >= 1000000) user.level = 10;

  await user.save();

  res.json({
    success: true,
    level: user.level
  });
});

// LOAD + AUTO MINING
app.get("/load/:id", async (req, res) => {
  const user = await User.findOne({ telegramId: req.params.id });

  res.json({
    coins: user ? user.coins : 0,
    profitPerHour: user ? user.profitPerHour : 0,
    level: user ? user.level : 1
  });
});
    
    // UPGRADE MINING
app.post("/upgrade", async (req, res) => {
    const { userId } = req.body;

    let user = await User.findOne({ telegramId: userId });

    if (!user) return res.json({ success: false });

    const upgradeCost = user.level * 1000;

    if (user.coins < upgradeCost) {
        return res.json({ success: false, message: "Not enough coins" });
    }

    user.coins -= upgradeCost;
    user.level += 1;
    user.profitPerHour += 1000; // increase mining speed

    await user.save();

    res.json({
        success: true,
        coins: user.coins,
        profitPerHour: user.profitPerHour,
        level: user.level
    });
});

    let user = await User.findOne({ userId: req.params.id });

    if (!user) {
        user = await User.create({ userId: req.params.id });
    }

    const now = new Date();
    const secondsPassed = (now - user.lastUpdated) / 1000;

    const earned = (user.profitPerHour / 3600) * secondsPassed;

    user.coins += earned;
    user.lastUpdated = now;

    await user.save();

    res.json({
        coins: Math.floor(user.coins),
        profitPerHour: user.profitPerHour
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
