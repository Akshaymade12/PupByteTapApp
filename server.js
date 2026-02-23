const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("Mongo Error ❌", err));

// ===== User Schema =====
const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  coins: { type: Number, default: 0 },
  profitPerHour: { type: Number, default: 10 },
  energy: { type: Number, default: 100 },
  maxEnergy: { type: Number, default: 100 },
  tapLevel: { type: Number, default: 1 },
tapPower: { type: Number, default: 1 },
  upgradeLevel: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

// ===== Energy Auto Recharge =====
setInterval(async () => {
  try {
    const users = await User.find({});
    for (let user of users) {
      if (user.energy < user.maxEnergy) {
        user.energy += 1;
        await user.save();
      }
    }
  } catch (err) {
    console.log("Energy recharge error");
  }
}, 5000);

// ===== Create / Get User + Offline Mining =====
app.get("/test-user/:id", async (req, res) => {
  try {
    const telegramId = req.params.id;

    let user = await User.findOne({ telegramId });
    if (!user) {
      user = await User.create({ telegramId });
    }

    const now = new Date();
    const secondsPassed = (now - user.lastActive) / 1000;

    // Offline mining
    user.coins += (user.profitPerHour / 3600) * secondsPassed;

    user.lastActive = now;
    await user.save();

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: true });
  }
});

// ===== TAP =====
app.post("/tap", async (req, res) => {
  try {
    const { telegramId } = req.body;

    const user = await User.findOne({ telegramId });
    if (!user) return res.json({ success: false });

    if (user.energy < user.tapPower) {
  return res.json({ success: false });
}

user.coins += user.tapPower;
user.energy -= user.tapPower;

    await user.save();

    res.json({
  success: true,
  coins: user.coins,
  energy: user.energy,
  tapPower: user.tapPower
});

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// =============== UPGRADE ================

app.post("/upgrade", async (req, res) => {
  try {
    const { telegramId } = req.body;

    const user = await User.findOne({ telegramId });
    if (!user) return res.json({ success: false });

    const cost = 100 * Math.pow(2, user.tapLevel - 1);

    if (user.coins < cost) {
      return res.json({ success: false, required: cost });
    }

    user.coins -= cost;
    user.tapLevel += 1;
    user.tapPower += 1;

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      tapLevel: user.tapLevel,
      tapPower: user.tapPower,
      nextCost: 100 * Math.pow(2, user.tapLevel - 1)
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ===== UPGRADE PROFIT =====
app.post("/upgrade", async (req, res) => {
  try {
    const { telegramId } = req.body;

    const user = await User.findOne({ telegramId });
    if (!user) return res.json({ success: false });

    const cost = 100 * Math.pow(2, user.upgradeLevel);

    if (user.coins < cost) {
      return res.json({ success: false, required: cost });
    }

    user.coins -= cost;
    user.profitPerHour += 10;
    user.upgradeLevel += 1;

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      profitPerHour: user.profitPerHour,
      nextCost: 100 * Math.pow(2, user.upgradeLevel)
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.get("/upgrade-test/:id", async (req, res) => {
  try {
    const telegramId = req.params.id;

    const user = await User.findOne({ telegramId });
    if (!user) return res.json({ success: false });

    const cost = 100 * Math.pow(2, user.upgradeLevel);

    if (user.coins < cost) {
      return res.json({ success: false, required: cost });
    }

    user.coins -= cost;
    user.profitPerHour += 10;
    user.upgradeLevel += 1;

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      profitPerHour: user.profitPerHour,
      level: user.upgradeLevel
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ===== Root Route =====
app.get("/", (req, res) => {
  res.send("PupByte Server Running 🚀");
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

