const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));

mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
   telegramId: String,
   username: String,
   coins: { type: Number, default: 0 },
   profitPerHour: { type: Number, default: 100 },
   level: { type: String, default: "Bronze" },
   tapPower: { type: Number, default: 1 },
   lastActive: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

const levels = [
   { name: "Bronze", min: 0 },
   { name: "Silver", min: 1000 },
   { name: "Gold", min: 5000 },
   { name: "Diamond", min: 20000 }
];

function calculateLevel(coins) {
   let current = "Bronze";
   for (let i = 0; i < levels.length; i++) {
      if (coins >= levels[i].min) {
         current = levels[i].name;
      }
   }
   return current;
}

app.post("/register", async (req, res) => {
   const { telegramId, username } = req.body;

   let user = await User.findOne({ telegramId });

   if (!user) {
      user = new User({
         telegramId,
         username
      });
      await user.save();
   }

   res.json({ success: true });
});

app.get("/load/:id", async (req, res) => {
   let user = await User.findOne({ telegramId: req.params.id });

   if (!user) {
      return res.json({
         coins: 0,
         profitPerHour: 100,
         level: "Bronze",
         tapPower: 1
      });
   }

        const now = new Date();
   const maxOffline = 6 * 3600;
   const seconds = Math.min((now - user.lastActive) / 1000, maxOffline);

   const earned = (user.profitPerHour / 3600) * seconds;

   user.coins += earned;
   user.level = calculateLevel(user.coins);
   user.lastActive = now;

   await user.save();

   res.json({
      coins: user.coins,
      profitPerHour: user.profitPerHour,
      level: user.level,
      tapPower: user.tapPower
   });
});

app.post("/upgrade", async (req, res) => {
   const { telegramId } = req.body;

   let user = await User.findOne({ telegramId });
   if (!user) return res.json({ success: false });

   const cost = 1000;

   if (user.coins < cost) {
      return res.json({ success: false });
   }

   user.coins -= cost;
   user.profitPerHour += 100;
   user.level = calculateLevel(user.coins);

   await user.save();

   res.json({
      success: true,
      coins: user.coins,
      profitPerHour: user.profitPerHour,
      level: user.level
   });
});

app.get("/leaderboard/:level", async (req, res) => {
   const level = req.params.level;

   const topUsers = await User.find({ level })
      .sort({ coins: -1 })
      .limit(10);

   res.json(topUsers);
});

app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running 🚀"));
