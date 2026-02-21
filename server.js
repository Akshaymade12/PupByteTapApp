const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect(process.env.MONGO_URI);

const User = mongoose.model("User", {
  telegramId: String,
  coins: { type: Number, default: 0 }
});

app.get("/load/:id", async (req, res) => {
  let user = await User.findOne({ telegramId: req.params.id });

  if (!user) {
    user = await User.create({ telegramId: req.params.id });
  }

  res.json({ coins: user.coins });
});

app.post("/tap", async (req, res) => {
  const { telegramId } = req.body;

  let user = await User.findOne({ telegramId });
  if (!user) return res.json({ success: false });

  user.coins += 1;
  await user.save();

  res.json({ coins: user.coins });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(process.env.PORT || 3000);
