const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(express.static(__dirname));

// ===== MongoDB Connect =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("Mongo Error ❌", err));

// ===== User Schema =====
const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  coins: { type: Number, default: 0 },
  profitPerHour: { type: Number, default: 10 },

  // 🔥 ENERGY SYSTEM
  energy: { type: Number, default: 100 },
  maxEnergy: { type: Number, default: 100 },

  // 🔥 UPGRADE LEVEL
  upgradeLevel: { type: Number, default: 0 },
  lastRewardLevel: { type: Number, default: 0 },
  
  lastActive: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

// =====================================================
// ===== LOAD (Offline Mining + Energy Restore) =====
// =====================================================
app.get("/load/:id", async (req, res) => {
  try {
    const telegramId = req.params.id;
    let user = await User.findOne({ telegramId });

    if (!user) {
      user = await User.create({ telegramId });
    }

    const now = new Date();
    const secondsPassed = (now - user.lastActive) / 1000;

    user.coins += (user.profitPerHour / 3600) * secondsPassed;
    user.energy += secondsPassed;

    if (user.energy > user.maxEnergy) {
      user.energy = user.maxEnergy;
    }

    // 🔥 LEVEL REWARD LOGIC

    let bonusGiven = false;
    
    const rewardLevels = [
      { min: 500, bonus: 200 },
      { min: 2000, bonus: 500 },
      { min: 5000, bonus: 1000 },
      { min: 15000, bonus: 3000 }
    ];

    rewardLevels.forEach((lvl, index) => {
  if (user.coins >= lvl.min && user.lastRewardLevel === index) {
    user.coins += lvl.bonus;
    user.lastRewardLevel += 1;
    bonusGiven = true;   // 🔥 add this
  }
});
    
    user.lastActive = now;
    await user.save();

    res.json({
      coins: user.coins,
      profitPerHour: user.profitPerHour,
      energy: user.energy,
      maxEnergy: user.maxEnergy,
      upgradeLevel: user.upgradeLevel,
      nextCost: 100 * Math.pow(2, user.upgradeLevel),
      bonusGiven: bonusGiven
    });

  } catch (err) {
    res.status(500).json({ error: true });
  }
});

// =====================================================
// ====================== TAP ==========================
// =====================================================
app.post("/tap", async (req, res) => {
  try {
    const { telegramId } = req.body;

    if (!telegramId) {
      return res.status(400).json({ success: false });
    }

    let user = await User.findOne({ telegramId });

    if (!user) {
      user = await User.create({ telegramId });
    }

    // ❌ No Energy
    if (user.energy <= 0) {
      return res.json({ success: false, message: "No energy" });
    }

    user.energy -= 1;
    user.coins += 1;

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      energy: user.energy
    });

  } catch (err) {
    console.log("Tap Error:", err);
    res.status(500).json({ success: false });
  }
});

// =====================================================
// ==================== UPGRADE ========================
// =====================================================
app.post("/upgrade", async (req, res) => {
  try {
    const { telegramId } = req.body;

    let user = await User.findOne({ telegramId });
    if (!user) return res.json({ success: false });

    // 🔥 Exponential cost
    const upgradeCost = 100 * Math.pow(2, user.upgradeLevel);

    if (user.coins < upgradeCost) {
      return res.json({
        success: false,
        required: upgradeCost
      });
    }

    user.coins -= upgradeCost;
    user.profitPerHour += 10;
    user.upgradeLevel += 1;

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      profitPerHour: user.profitPerHour,
      energy: user.energy,
      maxEnergy: user.maxEnergy,
      upgradeLevel: user.upgradeLevel,
      nextCost: 100 * Math.pow(2, user.upgradeLevel)
    });

  } catch (err) {
    console.log("Upgrade Error:", err);
    res.status(500).json({ success: false });
  }
});

// =====================================================
// ================= HOME ROUTE ========================
// =====================================================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// =====================================================
// ================= START SERVER ======================
// =====================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
