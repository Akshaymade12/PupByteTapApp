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
  telegramId: String,
  coins: Number
});

app.post("/save", async (req, res) => {

    console.log("🔥 SAVE HIT:", req.body);

    const { telegramId, coins } = req.body;

    if (!telegramId) {
        console.log("❌ Telegram ID missing");
        return res.json({ success: false });
    }

    await User.findOneAndUpdate(
        { telegramId },
        { coins },
        { upsert: true }
    );

    console.log("✅ Coins Saved:", coins);

    res.json({ success: true });
});

app.get("/load/:id", async (req, res) => {
  const user = await User.findOne({ telegramId: req.params.id });
  res.json({ coins: user ? user.coins : 0 });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
