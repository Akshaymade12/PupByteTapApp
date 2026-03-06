const rateLimit = require("express-rate-limit");
const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const TelegramBot = require("node-telegram-bot-api");
const cron = require("node-cron");

const app = express();
app.set("trust proxy", 1);
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const MONGO_URI = process.env.MONGO_URI;

if (!BOT_TOKEN) {
  console.error("BOT_TOKEN missing ❌");
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN);

/* ================= RATE LIMIT ================= */

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: { success: false, message: "Too many requests" }
});

app.use(apiLimiter);
app.use(express.static(__dirname));

/* ================= MONGO ================= */

mongoose.connect(MONGO_URI)
.then(()=>console.log("MongoDB Connected ✅"))
.catch(err=>console.log("Mongo Error ❌",err));

/* ================= USER SCHEMA ================= */

const userSchema = new mongoose.Schema({

telegramId:{ type:String, unique:true },

coins:{ type:Number, default:0 },

profitPerHour:{ type:Number, default:10 },

energy:{ type:Number, default:100 },
maxEnergy:{ type:Number, default:100 },

tapLevel:{ type:Number, default:1 },
tapPower:{ type:Number, default:1 },

tapCount:{ type:Number, default:0 },
tapResetTime:{ type:Number, default:Date.now },

upgradeLevel:{ type:Number, default:0 },

lastTap:{ type:Number, default:0 },

suspiciousCount:{ type:Number, default:0 },
isBlocked:{ type:Boolean, default:false },

referredBy:{ type:String, default:null },
referrals:{ type:Number, default:0 },

completedTasks:{ type:[String], default:[] },

leagueRewardsClaimed:{ type:[String], default:[] },

league:{ type:String, default:"Wood" },

lastActive:{ type:Date, default:Date.now },

lastDailyClaim:{ type:Date, default:null },
lastSpin:{ type:Date, default:null },

rewardClaimed:{ type:Boolean, default:false },

gpuLevel:{ type:Number, default:1 },
gpuProfit:{ type:Number, default:10 },
gpuCost:{ type:Number, default:1000 },

marketingLevel:{ type:Number, default:1 },
marketingProfit:{ type:Number, default:15 },
marketingCost:{ type:Number, default:1500 }

});

const User = mongoose.model("User", userSchema);

/* ================= TELEGRAM VERIFY ================= */

function verifyTelegram(initData){

if(!initData) return false;

const urlParams = new URLSearchParams(initData);
const hash = urlParams.get("hash");

urlParams.delete("hash");

const dataCheckString = [...urlParams.entries()]
.sort()
.map(([key,value])=>`${key}=${value}`)
.join("\n");

const secretKey = crypto
.createHmac("sha256","WebAppData")
.update(BOT_TOKEN)
.digest();

const hmac = crypto
.createHmac("sha256",secretKey)
.update(dataCheckString)
.digest("hex");

return hmac === hash;

}

/* ================= VALID USER ================= */

async function getValidUser(telegramId,initData){

if(!verifyTelegram(initData)) return null;

if(!telegramId || telegramId.length < 5) return null;

const user = await User.findOne({ telegramId });

if(!user) return null;

if(user.isBlocked) return null;

return user;

}

/* ================= LEAGUE SYSTEM ================= */

const LEAGUES = [
  { name: "Wood", min: 0, max: 1000 },
  { name: "Bronze", min: 1000, max: 5000 },
  { name: "Silver", min: 5000, max: 15000 },
  { name: "Gold", min: 15000, max: 50000 },
  { name: "Platinum", min: 50000, max: 100000 },
  { name: "Diamond", min: 100000, max: 250000 },
  { name: "Master", min: 250000, max: 500000 },
  { name: "Elite", min: 500000, max: 1000000 },
  { name: "Champion", min: 1000000, max: 2500000 },
  { name: "Legend", min: 2500000, max: 5000000 },
  { name: "Grandmaster", min: 5000000, max: 10000000 },
  { name: "Immortal", min: 10000000, max: Infinity }
];

function getLeague(coins){

const league = LEAGUES.find(
league => coins >= league.min && coins < league.max
);

return league ? league.name : "Wood";

}

/* ================= OFFLINE MINING ================= */

async function applyOfflineMining(user){

const now = new Date();

const seconds = (now - user.lastActive) / 1000;

if(seconds > 0){

const earned = (user.profitPerHour / 3600) * seconds;

user.coins += Math.floor(earned);

user.league = getLeague(user.coins);

user.lastActive = now;

await user.save();

}

}

/* ================= TELEGRAM START ================= */

bot.onText(/\/start(?: (.+))?/, async (msg, match) => {

const telegramId = msg.from.id.toString();

const refId = match[1];

let user = await User.findOne({ telegramId });

if(!user){

user = await User.create({
telegramId,
referredBy: refId && refId !== telegramId ? refId : null
});

if(refId && refId !== telegramId){

const refUser = await User.findOne({ telegramId: refId });

if(refUser){

refUser.coins += 500;

refUser.referrals += 1;

await refUser.save();

}

}

}

bot.sendMessage(

msg.chat.id,

"🚀 Welcome to PupByte Tap Bot!\nTap to earn coins!",

{

reply_markup: {

inline_keyboard: [[

{

text: "🔥 Open App",

web_app: {

url: "https://pupbytetapapp.onrender.com"

}

}

]]

}

}

);

});

/* ================= ENERGY RECHARGE ================= */

setInterval(async () => {

try{

await User.updateMany(

{ energy: { $lt: 100 } },

{ $inc: { energy: 2 } }

);

}catch(e){

console.log("Energy recharge error", e);

}

}, 3000);

/* ================= LOAD USER ================= */

app.get("/load/:id", async (req, res) => {

const telegramId = req.params.id;

if(!telegramId || telegramId.length < 5){
return res.json({ success:false });
}

let user = await User.findOne({ telegramId });

if(!user){
user = await User.create({ telegramId });
}

await applyOfflineMining(user);

res.json({

coins:user.coins,
energy:user.energy,
profitPerHour:user.profitPerHour,

tapLevel:user.tapLevel,
tapPower:user.tapPower,

league:user.league,

referrals:user.referrals,

nextTapCost: Math.floor(40 * Math.pow(1.7, user.tapLevel)),

nextProfitCost: Math.floor(60 * Math.pow(1.8, user.upgradeLevel)),

gpuLevel:user.gpuLevel,
gpuProfit:user.gpuProfit,
gpuCost:user.gpuCost,

marketingLevel:user.marketingLevel,
marketingProfit:user.marketingProfit,
marketingCost:user.marketingCost

});

});

/* ================= TAP ================= */

app.post("/tap", async (req,res)=>{

const { telegramId, initData } = req.body;

const user = await getValidUser(telegramId, initData);

if(!user) return res.json({ success:false });

await applyOfflineMining(user);

const now = Date.now();

const tapGap = now - user.lastTap;

/* ===== ANTI AUTO CLICK ===== */

if(tapGap < 80){
user.suspiciousCount += 2;
}
else if(tapGap < 150){
user.suspiciousCount += 1;
}
else{
user.suspiciousCount = Math.max(0, user.suspiciousCount - 1);
}

/* ===== SOFT BLOCK ===== */

if(user.suspiciousCount >= 20){
return res.json({ success:false, message:"Slow down" });
}

/* ===== HARD BLOCK ===== */

if(user.suspiciousCount >= 40){

user.isBlocked = true;

await user.save();

return res.json({ success:false, message:"User blocked" });

}

/* ===== ENERGY CHECK ===== */

if(user.energy < user.tapPower){
return res.json({ success:false });
}

/* ===== TAP LIMIT ===== */

if(Date.now() - user.tapResetTime > 60000){

user.tapCount = 0;

user.tapResetTime = Date.now();

}

if(user.tapCount >= 120){

return res.json({ success:false, message:"Too fast" });

}

user.tapCount += 1;

/* ===== COINS ADD ===== */

user.coins += user.tapPower;

user.energy -= user.tapPower;

user.lastTap = now;

user.league = getLeague(user.coins);

await user.save();

res.json({

success:true,

coins:user.coins,

energy:user.energy,

tapPower:user.tapPower,

profitPerHour:user.profitPerHour

});

});

/* ================= TAP UPGRADE ================= */

app.post("/upgrade-tap", async (req,res)=>{

const { telegramId, initData } = req.body;

const user = await getValidUser(telegramId, initData);

if(!user) return res.json({ success:false });

await applyOfflineMining(user);

const cost = Math.floor(40 * Math.pow(1.7, user.tapLevel));

if(user.coins < cost){

return res.json({ success:false, required:cost });

}

user.coins -= cost;

user.tapLevel += 1;

if(user.tapLevel % 2 === 0){

user.tapPower += 1;

}

await user.save();

res.json({

success:true,

coins:user.coins,

nextCost: Math.floor(40 * Math.pow(1.7, user.tapLevel))

});

});

/* ================= PROFIT UPGRADE ================= */

app.post("/upgrade-profit", async (req,res)=>{

const { telegramId, initData } = req.body;

const user = await getValidUser(telegramId, initData);

if(!user) return res.json({ success:false });

await applyOfflineMining(user);

if(user.upgradeLevel >= 100){

return res.json({ success:false, message:"Max level reached" });

}

const cost = Math.floor(60 * Math.pow(1.8, user.upgradeLevel));

if(user.coins < cost){

return res.json({ success:false, required:cost });

}

user.coins -= cost;

user.profitPerHour += 3 + user.upgradeLevel;

user.upgradeLevel += 1;

await user.save();

res.json({

success:true,

coins:user.coins,

profitPerHour:user.profitPerHour,

nextCost: Math.floor(60 * Math.pow(1.8, user.upgradeLevel))

});

});

/* ================= TASK SYSTEM ================= */

const TASKS = {
telegram_join:1000,
twitter_follow:500
};

app.post("/complete-task", async (req,res)=>{

const { telegramId, initData, taskId } = req.body;

const user = await getValidUser(telegramId, initData);

if(!user) return res.json({ success:false });

if(!taskId) return res.json({ success:false });

if(user.completedTasks.includes(taskId)){
return res.json({ success:false, message:"Already completed"});
}

const reward = TASKS[taskId];

if(!reward) return res.json({ success:false });

user.coins += reward;

user.completedTasks.push(taskId);

await user.save();

res.json({ success:true, reward });

});

/* ================= LEAGUE REWARD ================= */

app.post("/claim-league", async (req,res)=>{

const { telegramId, initData } = req.body;

const user = await getValidUser(telegramId, initData);

if(!user) return res.json({ success:false });

const league = user.league;

if(user.leagueRewardsClaimed.includes(league)){
return res.json({ success:false });
}

let reward = 0;

if(league === "Bronze") reward = 2000;
if(league === "Silver") reward = 5000;
if(league === "Gold") reward = 10000;

if(reward === 0) return res.json({ success:false });

user.coins += reward;

user.leagueRewardsClaimed.push(league);

await user.save();

res.json({ success:true, reward });

});

/* ================= SPIN ================= */

app.post("/spin", async (req,res)=>{

const { telegramId, initData } = req.body;

const user = await getValidUser(telegramId, initData);

if(!user) return res.json({ success:false });

const now = new Date();

if(user.lastSpin && (now - user.lastSpin) < 86400000){
return res.json({ success:false, message:"Already spun today"});
}

const rewards = [100,200,300,500,800,1000];

const reward = rewards[Math.floor(Math.random()*rewards.length)];

user.coins += reward;

user.lastSpin = now;

user.league = getLeague(user.coins);

await user.save();

res.json({ success:true, reward, coins:user.coins });

});

/* ================= DAILY REWARD ================= */

app.post("/daily-reward", async (req,res)=>{

const { telegramId, initData } = req.body;

const user = await getValidUser(telegramId, initData);

if(!user) return res.json({ success:false });

const now = new Date();

if(user.lastDailyClaim){

const diff = now - user.lastDailyClaim;

if(diff < 86400000){
return res.json({ success:false, message:"Already claimed"});
}

}

const reward = 1000;

user.coins += reward;

user.lastDailyClaim = now;

user.league = getLeague(user.coins);

await user.save();

res.json({ success:true, reward });

});

/* ================= GLOBAL TOP ================= */

app.get("/top-global", async (req,res)=>{

const topUsers = await User.find({})
.sort({ coins:-1 })
.limit(10)
.select("telegramId coins league");

res.json(topUsers);

});

/* ================= LEAGUE TOP ================= */

app.get("/top-league/:league", async (req,res)=>{

const league = req.params.league;

const topUsers = await User.find({ league })
.sort({ coins:-1 })
.limit(10)
.select("telegramId coins");

res.json(topUsers);

});

/* ================= UPGRADE CARD ================= */

app.post("/upgrade-card", async (req,res)=>{

const { telegramId, type, initData } = req.body;

const user = await getValidUser(telegramId, initData);

if(!user) return res.json({ success:false });

let level = user[type+"Level"];

let profit = user[type+"Profit"];

let cost = user[type+"Cost"];

if(level >= 20){
return res.json({ success:false, message:"Max level reached"});
}

if(user.coins < cost){
return res.json({ success:false, message:"Not enough coins"});
}

user.coins -= cost;

level += 1;

profit += 10;

cost = Math.floor(cost * 1.6);

user[type+"Level"] = level;

user[type+"Profit"] = profit;

user[type+"Cost"] = cost;

user.profitPerHour += 10;

await user.save();

res.json({

success:true,

coins:user.coins,

level,

profit,

cost,

totalProfit:user.profitPerHour

});

});

/* ================= USER RANK ================= */

app.get("/rank/:id", async (req,res)=>{

const telegramId = req.params.id;

const user = await User.findOne({ telegramId });

if(!user) return res.json({});

const rank =
await User.countDocuments({ coins:{ $gt:user.coins }}) + 1;

res.json({

rank,

league:user.league,

coins:user.coins

});

});

/* ================= ROOT ================= */

app.get("/", (req,res)=>{

res.send("PupByte Server Running 🚀");

});

/* ================= WEEKLY RESET ================= */

cron.schedule("0 0 * * 0", async ()=>{

console.log("Weekly reset running...");

await User.updateMany({},{

tapCount:0

});

console.log("Weekly reset completed");

});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT,"0.0.0.0",()=>{

console.log(`Server running on port ${PORT}`);

});
