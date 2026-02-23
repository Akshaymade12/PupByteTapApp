const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("Mongo Error ❌", err));

// ================= USER SCHEMA =================

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  coins: { type: Number, default: 0 },
  profitPerHour: { type: Number, default: 10 },

  energy: { type: Number, default: 100 },
  maxEnergy: { type: Number, default: 100 },

  upgradeLevel: { type: Number, default: 0 },
  tapLevel: { type: Number, default: 0 },
  energyLevel: { type: Number, default: 0 },
  rechargeLevel: { type: Number, default: 0 },

  lastRewardLevel: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

// ================= LOAD =================

app.get("/load/:id", async (req, res) => {
  try {
    const telegramId = req.params.id;
    let user = await User.findOne({ telegramId });

    if (!user) user = await User.create({ telegramId });

    const now = new Date();
    const secondsPassed = (now - user.lastActive) / 1000;

    // Offline Mining
    user.coins += (user.profitPerHour / 3600) * secondsPassed;

    // Recharge Energy
    user.maxEnergy = 100 + (user.energyLevel * 20);
    user.energy += secondsPassed * (1 + user.rechargeLevel);

    if (user.energy > user.maxEnergy)
      user.energy = user.maxEnergy;

    // Level Rewards
    const rewardLevels = [
      { min: 500, bonus: 200 },
      { min: 2000, bonus: 500 },
      { min: 5000, bonus: 1000 },
      { min: 15000, bonus: 3000 }
    ];

    let bonusGiven = false;

    rewardLevels.forEach((lvl, index) => {
      if (user.coins >= lvl.min && user.lastRewardLevel === index) {
        user.coins += lvl.bonus;
        user.lastRewardLevel++;
        bonusGiven = true;
      }
    });

    user.lastActive = now;
    await user.save();

    res.json({
      coins: user.coins,
      profitPerHour: user.profitPerHour,
      energy: user.energy,
      maxEnergy: user.maxEnergy,
      nextCost: 100 * Math.pow(2, user.upgradeLevel),
      bonusGiven
    });

  } catch (err) {
    res.status(500).json({ error: true });
  }
});

// ================= TAP =================

app.post("/tap", async (req, res) => {
  try {
    const { telegramId } = req.body;
    let user = await User.findOne({ telegramId });
    if (!user) user = await User.create({ telegramId });

    if (user.energy <= 0)
      return res.json({ success: false });

    const tapReward = 1 + user.tapLevel;

    user.energy -= 1;
    user.coins += tapReward;

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      energy: user.energy,
      tapReward
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ================= UPGRADE PROFIT =================

app.post("/upgrade", async (req, res) => {
  try {
    const { telegramId } = req.body;
    let user = await User.findOne({ telegramId });
    if (!user) return res.json({ success: false });

    const cost = 100 * Math.pow(2, user.upgradeLevel);

    if (user.coins < cost)
      return res.json({ success: false, required: cost });

    user.coins -= cost;
    user.profitPerHour += 10;
    user.upgradeLevel++;

    await user.save();

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ================= UPGRADE TAP =================

app.post("/upgrade-tap", async (req, res) => {
  const { telegramId } = req.body;
  let user = await User.findOne({ telegramId });

  const cost = 200 * Math.pow(2, user.tapLevel);

  if (user.coins < cost)
    return res.json({ success: false, required: cost });

  user.coins -= cost;
  user.tapLevel++;

  await user.save();
  res.json({ success: true });
});

// ================= UPGRADE ENERGY =================

app.post("/upgrade-energy", async (req, res) => {
  const { telegramId } = req.body;
  let user = await User.findOne({ telegramId });

  const cost = 300 * Math.pow(2, user.energyLevel);

  if (user.coins < cost)
    return res.json({ success: false, required: cost });

  user.coins -= cost;
  user.energyLevel++;
  user.maxEnergy = 100 + (user.energyLevel * 20);

  await user.save();
  res.json({ success: true });
});

// ================= UPGRADE RECHARGE =================

app.post("/upgrade-recharge", async (req, res) => {
  const { telegramId } = req.body;
  let user = await User.findOne({ telegramId });

  const cost = 500 * Math.pow(2, user.rechargeLevel);

  if (user.coins < cost)
    return res.json({ success: false, required: cost });

  user.coins -= cost;
  user.rechargeLevel++;

  await user.save();
  res.json({ success: true });
});

// ================= HOME =================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ================= START =================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
