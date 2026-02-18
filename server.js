const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();   // ✅ app pehle banao

app.use(cors());         // ✅ phir use karo
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("Mongo Error ❌", err));

// Schema
const User = mongoose.model("User", {
  telegramId: String,
  coins: Number
});

// Save API
app.post("/save", async (req, res) => {

  console.log("SAVE HIT 👉", req.body);

  const { telegramId, coins } = req.body;

  if (!telegramId) {
    return res.json({ success: false });
  }

  await User.findOneAndUpdate(
    { telegramId },
    { coins },
    { upsert: true }
  );

  res.json({ success: true });
});

// Load API
app.get("/load/:id", async (req, res) => {

  const user = await User.findOne({
    telegramId: req.params.id
  });

  if (user) {
    res.json({ coins: user.coins });
  } else {
    res.json({ coins: 0 });
  }
});

// Home Test

// Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
