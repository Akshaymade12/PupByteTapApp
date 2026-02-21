const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect(process.env.MONGO_URI);

const User = mongoose.model("User", {
  telegramId: String,
  coins: { type: Number, default: 0 },
  profitPerHour: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
});

app.get("/load/:id", async (req,res)=>{
  let user = await User.findOne({ telegramId:req.params.id });
  if(!user){
    user = await User.create({ telegramId:req.params.id });
  }
  res.json(user);
});

app.post("/tap", async (req,res)=>{
  const { telegramId, coins } = req.body;
  await User.updateOne({ telegramId }, { coins, lastActive:new Date() });
  res.json({ success:true });
});

app.post("/upgrade", async (req,res)=>{
  const { telegramId } = req.body;
  await User.updateOne({ telegramId }, { $inc:{ profitPerHour:100 } });
  res.json({ success:true });
});

app.get("/leaderboard", async (req,res)=>{
  const users = await User.find().sort({ coins:-1 }).limit(10);
  res.json(users);
});

app.get("/", (req,res)=>{
  res.sendFile(path.join(__dirname,"index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log("Server running"));
