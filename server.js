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
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);


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
}, 5000); // every 10 seconds

// ===== Create / Get User =====
app.get("/test-user/:id", async (req, res) => {
  try {
    const telegramId = req.params.id;

    let user = await User.findOne({ telegramId });

    if (!user) {
      user = await User.create({ telegramId });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: true });
  }
});


// ===== TAP (POST) =====
app.post("/tap", async (req, res) => {
  try {
    const { telegramId } = req.body;

    const user = await User.findOne({ telegramId });
    if (!user) return res.json({ success: false });

    if (user.energy <= 0) {
      return res.json({ success: false, message: "No energy" });
    }

    user.coins += 1;
    user.energy -= 1;

    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      energy: user.energy
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// ===== TAP TEST (GET for mobile testing) =====
app.get("/test-user/:id", async (req, res) => {
  try {
    const telegramId = req.params.id;

    let user = await User.findOne({ telegramId });

    if (!user) {
      user = await User.create({ telegramId });
    }

    const now = new Date();
    const secondsPassed = (now - user.createdAt) / 1000;

    user.coins += (user.profitPerHour / 3600) * secondsPassed;

    user.createdAt = now;

    await user.save();

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: true });
  }
});


// ===== Root Test Route =====
app.get("/", (req, res) => {
  res.send("PupByte Server Running 🚀");
});


// ===== Start Server =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
