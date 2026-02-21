const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(express.static(__dirname));

// ===== MongoDB Connect =====
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("Mongo Error ❌", err));

// ===== User Schema =====
const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  coins: { type: Number, default: 0 }
});

const User = mongoose.model("User", userSchema);

// ===== LOAD COINS =====
app.get("/load/:id", async (req, res) => {
  try {
    const telegramId = req.params.id;

    let user = await User.findOne({ telegramId });

    // Agar user exist nahi karta to create karo
    if (!user) {
      user = await User.create({ telegramId });
    }

    res.json({ coins: user.coins });

  } catch (err) {
    console.log("Load Error:", err);
    res.status(500).json({ coins: 0 });
  }
});

// ===== TAP =====
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

    user.coins += 1;
    await user.save();

    res.json({ coins: user.coins });

  } catch (err) {
    console.log("Tap Error:", err);
    res.status(500).json({ success: false });
  }
});

// ===== Home Route =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ===== Server Start =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
