const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const TelegramBot = require("node-telegram-bot-api");
const cron = require("node-cron");

const app = express();
app.use(express.json());
app.set("trust proxy", 1);

/* ================= ENV ================= */

const BOT_TOKEN = process.env.BOT_TOKEN;
const MONGO_URI = process.env.MONGO_URI;

if(!BOT_TOKEN){
console.log("BOT TOKEN missing");
process.exit(1);
}

if(!MONGO_URI){
console.log("Mongo URI missing");
process.exit(1);
}

/* ================= TELEGRAM BOT ================= */

const bot = new TelegramBot(BOT_TOKEN);

app.post(`/bot${BOT_TOKEN}`, (req,res)=>{
bot.processUpdate(req.body);
res.sendStatus(200);
});

/* ================= RATE LIMIT ================= */

const limiter = rateLimit({
windowMs: 60 * 1000,
max: 120,
message:{success:false,message:"Too many requests"}
});

app.use(limiter);

/* ================= STATIC ================= */

app.use(express.static(__dirname));

/* ================= DATABASE ================= */

mongoose.connect(MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log("Mongo Error",err));

/* ================= USER SCHEMA ================= */

userSchema.index({coins:-1});

const userSchema = new mongoose.Schema({

telegramId:{
type:String,
required:true,
unique:true
},

username:{
type:String,
default:"player"
},

coins:{
type:Number,
default:0
},

energy:{
type:Number,
default:100
},

maxEnergy:{
type:Number,
default:100
},

tapPower:{
type:Number,
default:1
},

tapLevel:{
type:Number,
default:1
},

profitPerHour:{
type:Number,
default:10
},

lastActive:{
type:Date,
default:Date.now
},

lastTap:{
type:Number,
default:0
},

tapCount:{
type:Number,
default:0
},

tapReset:{
type:Number,
default:Date.now
},

suspicious:{
type:Number,
default:0
},

isBlocked:{
type:Boolean,
default:false
},

/* ===== REFERRAL ===== */

referredBy:{
type:String,
default:null
},

referrals:{
type:Number,
default:0
},

/* ===== TASK ===== */

completedTasks:{
type:[String],
default:[]
},

/* ===== DAILY ===== */

lastDaily:{
type:Date,
default:null
},

/* ===== SPIN ===== */

lastSpin:{
type:Date,
default:null
},

/* ===== LEAGUE ===== */

league:{
type:String,
default:"Wood"
},

/* ===== MINE CARDS ===== */

gpuLevel:{type:Number,default:1},
gpuProfit:{type:Number,default:10},
gpuCost:{type:Number,default:1000},

marketingLevel:{type:Number,default:1},
marketingProfit:{type:Number,default:15},
marketingCost:{type:Number,default:1500}

});

const User = mongoose.model("User",userSchema);

/* ================= LEAGUE SYSTEM ================= */

const LEAGUES = [

{name:"Wood",min:0,max:1000},
{name:"Bronze",min:1000,max:5000},
{name:"Silver",min:5000,max:15000},
{name:"Gold",min:15000,max:50000},
{name:"Platinum",min:50000,max:100000},
{name:"Diamond",min:100000,max:250000},
{name:"Master",min:250000,max:500000},
{name:"Elite",min:500000,max:1000000},
{name:"Champion",min:1000000,max:2500000},
{name:"Legend",min:2500000,max:5000000}

];

function getLeague(coins){

const league = LEAGUES.find(
l => coins >= l.min && coins < l.max
);

if(!league) return "Legend";

return league.name;

}

/* ================= TELEGRAM START ================= */

bot.onText(/\/start(?: (.+))?/, async (msg, match)=>{

const telegramId = msg.from.id.toString();
const username = msg.from.username || "player";

const refId = match[1];

let user = await User.findOne({telegramId});

if(!user){

user = await User.create({

telegramId,
username,
referredBy: refId && refId !== telegramId ? refId : null

});

/* ===== REFERRAL REWARD ===== */

if(refId && refId !== telegramId){

const refUser = await User.findOne({telegramId:refId});

if(refUser){

refUser.coins += 1000;
refUser.referrals += 1;

await refUser.save();

}

}

}

/* ===== OPEN WEBAPP ===== */

bot.sendMessage(

msg.chat.id,

"🚀 Welcome to PupByte Tap Bot!\n\nTap the button below to start mining coins.",

{

reply_markup:{
inline_keyboard:[

[{

text:"🔥 Open PupByte App",

web_app:{
url:"https://pupbytetapapp.onrender.com"
}

}]

]

}

}

);

});

/* ================= OFFLINE MINING ================= */

async function applyOfflineMining(user){

const now = new Date();

const seconds = (now - user.lastActive) / 1000;

if(seconds <= 0) return;

const earned = (user.profitPerHour / 3600) * seconds;

user.coins += Math.floor(earned);

user.league = getLeague(user.coins);

user.lastActive = now;

await user.save();

}

/* ================= ENERGY RECHARGE ================= */

setInterval(async ()=>{

const users = await User.find({energy:{$lt:100}});

for(let user of users){

if(user.energy < user.maxEnergy){

user.energy += 2;

if(user.energy > user.maxEnergy){

user.energy = user.maxEnergy;

}

await user.save();

}

}

},3000);

/* ================= LOAD USER ================= */

app.get("/load/:id", async (req,res)=>{

const telegramId = req.params.id;

if(!telegramId){

return res.json({success:false});

}

let user = await User.findOne({telegramId});

if(!user){

user = await User.create({telegramId});

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

if(!initData){
return res.json({success:false});
}

if(!telegramId){

return res.json({success:false});

}

const user = await User.findOne({telegramId});

if(!user){

return res.json({success:false});

}

if(user.isBlocked){

return res.json({success:false,message:"Blocked"});

}

await applyOfflineMining(user);

const now = Date.now();

const gap = now - user.lastTap;

/* ===== AUTO CLICK DETECT ===== */

if(gap < 80){

user.suspicious += 2;

}else if(gap < 150){

user.suspicious += 1;

}else{

user.suspicious = Math.max(0,user.suspicious - 1);

}

/* ===== SOFT BLOCK ===== */

if(user.suspicious >= 20){

return res.json({success:false,message:"Slow down"});

}

/* ===== HARD BLOCK ===== */

if(user.suspicious >= 40){

user.isBlocked = true;

await user.save();

return res.json({success:false,message:"User blocked"});

}

/* ===== TAP LIMIT PER MINUTE ===== */

if(Date.now() - user.tapReset > 60000){

user.tapCount = 0;

user.tapReset = Date.now();

}

if(user.tapCount >= 120){

return res.json({success:false,message:"Too fast"});

}

user.tapCount += 1;

/* ===== ENERGY CHECK ===== */

if(user.energy < user.tapPower){

return res.json({success:false});

}

/* ===== TAP REWARD ===== */

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

const { telegramId } = req.body;

if(!telegramId){

return res.json({success:false});

}

const user = await User.findOne({telegramId});

if(!user){

return res.json({success:false});

}

await applyOfflineMining(user);

/* ===== COST ===== */

const cost = Math.floor(40 * Math.pow(1.7,user.tapLevel));

if(user.coins < cost){

return res.json({success:false,required:cost});

}

/* ===== UPGRADE ===== */

user.coins -= cost;

user.tapLevel += 1;

/* ===== TAP POWER INCREASE ===== */

if(user.tapLevel % 2 === 0){

user.tapPower += 1;

}

await user.save();

res.json({

success:true,

coins:user.coins,

tapLevel:user.tapLevel,

tapPower:user.tapPower,

nextCost:Math.floor(40 * Math.pow(1.7,user.tapLevel))

});

});


/* ================= PROFIT UPGRADE ================= */

app.post("/upgrade-profit", async (req,res)=>{

const { telegramId } = req.body;

if(!telegramId){

return res.json({success:false});

}

const user = await User.findOne({telegramId});

if(!user){

return res.json({success:false});

}

await applyOfflineMining(user);

/* ===== MAX LEVEL PROTECTION ===== */

if(user.tapLevel >= 100){

return res.json({success:false,message:"Max level reached"});

}

/* ===== COST ===== */

const cost = Math.floor(60 * Math.pow(1.8,user.tapLevel));

if(user.coins < cost){

return res.json({success:false,required:cost});

}

/* ===== UPGRADE ===== */

user.coins -= cost;

user.profitPerHour += 3 + user.tapLevel;

await user.save();

res.json({

success:true,

coins:user.coins,

profitPerHour:user.profitPerHour,

nextCost:Math.floor(60 * Math.pow(1.8,user.tapLevel))

});

});

/* ================= SPIN SYSTEM ================= */

app.post("/spin", async (req,res)=>{

const { telegramId } = req.body;

if(!telegramId){

return res.json({success:false});

}

const user = await User.findOne({telegramId});

if(!user){

return res.json({success:false});

}

const now = new Date();

/* ===== 24H LIMIT ===== */

if(user.lastSpin){

const diff = now - user.lastSpin;

const hours = diff / (1000 * 60 * 60);

if(hours < 24){

return res.json({

success:false,

message:"Already spin today"

});

}

}

/* ===== RANDOM REWARD ===== */

const rewards = [100,200,300,500,800,1000];

const reward = rewards[Math.floor(Math.random() * rewards.length)];

/* ===== CHEAT PROTECTION ===== */

if(!rewards.includes(reward)){

return res.json({success:false});

}

/* ===== ADD COINS ===== */

user.coins += reward;

user.lastSpin = now;

/* ===== UPDATE LEAGUE ===== */

user.league = getLeague(user.coins);

await user.save();

res.json({

success:true,

reward,

coins:user.coins

});

});

/* ================= DAILY REWARD ================= */

app.post("/daily-reward", async (req,res)=>{

const { telegramId } = req.body;

if(!telegramId){

return res.json({success:false});

}

const user = await User.findOne({telegramId});

if(!user){

return res.json({success:false});

}

const now = new Date();

/* ===== CHECK 24 HOURS ===== */

if(user.lastDaily){

const diff = now - user.lastDaily;

const hours = diff / (1000 * 60 * 60);

if(hours < 24){

return res.json({

success:false,

message:"Already claimed today"

});

}

}

/* ===== REWARD ===== */

const reward = 1000;

user.coins += reward;

user.lastDaily = now;

/* ===== UPDATE LEAGUE ===== */

user.league = getLeague(user.coins);

await user.save();

res.json({

success:true,

reward,

coins:user.coins

});

});

/* ================= SOCIAL TASK ================= */

app.post("/complete-task", async (req,res)=>{

const { telegramId, taskId } = req.body;

if(!telegramId || !taskId){

return res.json({success:false});

}

const user = await User.findOne({telegramId});

if(!user){

return res.json({success:false});

}

/* ===== ALREADY COMPLETED ===== */

if(user.completedTasks.includes(taskId)){

return res.json({

success:false,

message:"Task already completed"

});

}

/* ===== TASK REWARDS ===== */

let reward = 0;

if(taskId === "telegram_join") reward = 1000;

if(taskId === "twitter_follow") reward = 500;

if(taskId === "instagram_follow") reward = 500;

if(taskId === "discord_join") reward = 500;

/* ===== INVALID TASK ===== */

if(reward === 0){

return res.json({success:false});

}

/* ===== ADD REWARD ===== */

user.coins += reward;

user.completedTasks.push(taskId);

/* ===== UPDATE LEAGUE ===== */

user.league = getLeague(user.coins);

await user.save();

res.json({

success:true,

reward,

coins:user.coins

});

});


/* ================= GLOBAL TOP ================= */

app.get("/top-global", async (req,res)=>{

const users = await User.find({})
.sort({coins:-1})
.limit(10)
.select("telegramId coins league");

res.json(users);

});


/* ================= LEAGUE TOP ================= */

app.get("/top-league/:league", async (req,res)=>{

const league = req.params.league;

const users = await User.find({league})
.sort({coins:-1})
.limit(10)
.select("telegramId coins");

res.json(users);

});


/* ================= PLAYER RANK ================= */

app.get("/rank/:id", async (req,res)=>{

const telegramId = req.params.id;

const user = await User.findOne({telegramId});

if(!user){

return res.json({});

}

/* ===== CALCULATE RANK ===== */

const rank = await User.countDocuments({
coins:{$gt:user.coins}
}) + 1;

res.json({

rank,
coins:user.coins,
league:user.league

});

});

/* ================= MINE CARD UPGRADE ================= */

app.post("/upgrade-card", async (req,res)=>{

const { telegramId, type } = req.body;

if(!telegramId || !type){
return res.json({success:false});
}

const user = await User.findOne({telegramId});

if(!user){
return res.json({success:false});
}

/* ===== GET CARD DATA ===== */

let level = user[type+"Level"];
let profit = user[type+"Profit"];
let cost = user[type+"Cost"];

/* ===== MAX LEVEL ===== */

if(level >= 20){
return res.json({
success:false,
message:"Max level reached"
});
}

/* ===== COIN CHECK ===== */

if(user.coins < cost){
return res.json({
success:false,
message:"Not enough coins"
});
}

/* ===== UPGRADE ===== */

user.coins -= cost;

level += 1;

profit += 10;

cost = Math.floor(cost * 1.6);

/* ===== SAVE NEW VALUES ===== */

user[type+"Level"] = level;

user[type+"Profit"] = profit;

user[type+"Cost"] = cost;

/* ===== INCREASE TOTAL PROFIT ===== */

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

/* ================= USER VALIDATION ================= */

async function getValidUser(telegramId){

if(!telegramId) return null;

if(telegramId.length < 5) return null;

const user = await User.findOne({telegramId});

if(!user) return null;

if(user.isBlocked) return null;

return user;

}


/* ================= TAP SPAM CLEANUP ================= */

setInterval(async ()=>{

const users = await User.find({});

for(const user of users){

if(user.tapCount > 120){

user.tapCount = 120;

}

if(user.suspicious > 0){

user.suspicious -= 1;

}

await user.save();

}

},30000);


/* ================= ENERGY SAFETY ================= */

function safeEnergy(user){

if(user.energy < 0){

user.energy = 0;

}

if(user.energy > user.maxEnergy){

user.energy = user.maxEnergy;

}

}


/* ================= COIN SAFETY ================= */

function safeCoins(user){

if(user.coins < 0){

user.coins = 0;

}

if(user.coins > 1000000000){

user.coins = 1000000000;

}

}


/* ================= SAVE SAFE USER ================= */

async function saveUserSafe(user){

safeEnergy(user);

safeCoins(user);

await user.save();

}

/* ================= LEAGUE REWARD ================= */

app.post("/claim-league", async (req,res)=>{

const { telegramId } = req.body;

if(!telegramId){
return res.json({success:false});
}

const user = await User.findOne({telegramId});

if(!user){
return res.json({success:false});
}

/* ===== ALREADY CLAIMED ===== */

if(!user.leagueRewardsClaimed){
user.leagueRewardsClaimed = [];
}

const league = user.league;

if(user.leagueRewardsClaimed.includes(league)){

return res.json({
success:false,
message:"Already claimed"
});

}

/* ===== REWARD ===== */

let reward = 0;

if(league === "Bronze") reward = 2000;

if(league === "Silver") reward = 5000;

if(league === "Gold") reward = 10000;

if(league === "Platinum") reward = 20000;

if(league === "Diamond") reward = 50000;

/* ===== NO REWARD ===== */

if(reward === 0){
return res.json({success:false});
}

/* ===== GIVE REWARD ===== */

user.coins += reward;

user.leagueRewardsClaimed.push(league);

await user.save();

res.json({

success:true,
reward,
coins:user.coins

});

});

/* ================= GLOBAL TOP 50 ================= */

app.get("/leaderboard/global", async (req,res)=>{

try{

const users = await User.find({})
.sort({coins:-1})
.limit(50)
.select("telegramId coins league");

res.json(users);

}catch(err){

res.json([]);

}

});


/* ================= LEAGUE LEADERBOARD ================= */

app.get("/leaderboard/league/:league", async (req,res)=>{

const league = req.params.league;

try{

const users = await User.find({league})
.sort({coins:-1})
.limit(50)
.select("telegramId coins");

res.json(users);

}catch(err){

res.json([]);

}

});


/* ================= PLAYER PROFILE ================= */

app.get("/player/:id", async (req,res)=>{

const telegramId = req.params.id;

const user = await User.findOne({telegramId});

if(!user){
return res.json({});
}

res.json({

telegramId:user.telegramId,
coins:user.coins,
energy:user.energy,
league:user.league,
tapLevel:user.tapLevel,
tapPower:user.tapPower,
profitPerHour:user.profitPerHour,
referrals:user.referrals

});

});

/* ================= WEEKLY TAP RESET ================= */

cron.schedule("0 0 * * 0", async ()=>{

console.log("Weekly reset started");

try{

await User.updateMany({},{
tapCount:0
});

console.log("Weekly reset completed");

}catch(e){

console.log("Weekly reset error",e);

}

});



/* ================= CLEAN SUSPICIOUS USERS ================= */

cron.schedule("0 */6 * * *", async ()=>{

try{

const users = await User.find({});

for(let user of users){

if(user.suspicious > 0){

user.suspicious -= 1;

if(user.suspicious < 0){
user.suspicious = 0;
}

await user.save();

}

}

}catch(e){

console.log("Security cleanup error");

}

});



/* ================= OFFLINE MINING UPDATE ================= */

cron.schedule("*/5 * * * *", async ()=>{

try{

const users = await User.find({});

for(let user of users){

const now = new Date();

const seconds = (now - user.lastActive) / 1000;

if(seconds > 0){

const earned = (user.profitPerHour / 3600) * seconds;

user.coins += Math.floor(earned);

user.lastActive = now;

await user.save();

}

}

}catch(e){

console.log("Offline mining error");

}

});

/* ================= ROOT ================= */

app.get("/", (req,res)=>{

res.send("🚀 PupByte Tap Bot Server Running");

});


/* ================= HEALTH CHECK ================= */

app.get("/health", (req,res)=>{

res.json({
status:"ok",
time:new Date()
});

});


/* ================= ERROR HANDLER ================= */

app.use((err,req,res,next)=>{

console.log("Server Error:",err);

res.status(500).json({
success:false,
message:"Server error"
});

});


/* ================= 404 HANDLER ================= */

app.use((req,res)=>{

res.status(404).json({
success:false,
message:"API not found"
});

});


/* ================= SERVER START ================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT,"0.0.0.0",()=>{

console.log("================================");
console.log("🚀 PupByte Tap Bot Server Started");
console.log("PORT:",PORT);
console.log("================================");

});
