const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("Mongo Error ❌", err));

const User = mongoose.model("User", {
  userId: String,
  coins: { type: Number, default: 0 },
  profitPerHour: { type: Number, default: 0 },
  level: { type: Number, default: 1 }
});

// SAVE COINS
app.post("/save", async (req, res) => {
  const { userId, coins } = req.body;
  if (!userId) return res.json({ success: false });

  let user = await User.findOne({ userId });

  if (!user) {
    user = new User({ userId, coins });
  } else {
    user.coins = coins;
  }

  await user.save();

  res.json({ success: true });
});

// LOAD DATA
app.get("/load/:id", async (req, res) => {
  const userId = req.params.id;

  let user = await User.findOne({ userId });

  if (!user) {
    user = new User({ userId });
    await user.save();
  }

  res.json({
    coins: user.coins,
    profitPerHour: user.profitPerHour,
    level: user.level
  });
});

// UPGRADE
app.post("/upgrade", async (req, res) => {
  const { userId } = req.body;

  let user = await User.findOne({ userId });
  if (!user) return res.json({ success: false });

  const upgradeCost = user.level * 1000;

  if (user.coins < upgradeCost) {
    return res.json({ success: false, message: "Not enough coins" });
  }

  user.coins -= upgradeCost;
  user.level += 1;
  user.profitPerHour += 1000;

  await user.save();

  res.json({
    success: true,
    coins: user.coins,
    profitPerHour: user.profitPerHour,
    level: user.level
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running 🚀"));
