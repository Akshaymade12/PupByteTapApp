const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());


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
app.get("/tap-test/:id", async (req, res) => {
  try {
    const telegramId = req.params.id;

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


// ===== Root Test Route =====
app.get("/", (req, res) => {
  res.send("PupByte Server Running 🚀");
});


// ===== Start Server =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
