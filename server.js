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

  // 🔥 Offline coin mining
    const earnedCoins = (user.profitPerHour / 3600) * secondsPassed;
    user.coins += earnedCoins;

    // 🔥 Energy restore (1 per second)
    user.energy += secondsPassed;
    if (user.energy > user.maxEnergy) {
      user.energy = user.maxEnergy;
    }

    user.lastActive = now;

    await user.save();

    res.json({
      coins: user.coins,
      profitPerHour: user.profitPerHour,
      energy: user.energy,
      maxEnergy: user.maxEnergy
    });

  } catch (err) {
    console.log("Load Error:", err);
    res.status(500).json({
      coins: 0,
      profitPerHour: 0,
      energy: 0,
      maxEnergy: 100
    });
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

    const upgradeCost = 100;

    if (user.coins < upgradeCost) {
      return res.json({ success: false });
    }

    user.coins -= upgradeCost;
    user.profitPerHour += 10;

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      profitPerHour: user.profitPerHour,
      energy: user.energy,
      maxEnergy: user.maxEnergy
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
