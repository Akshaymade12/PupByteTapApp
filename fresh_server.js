const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const TelegramBot = require("node-telegram-bot-api");
const cron = require("node-cron");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.set("trust proxy", 1);

/* ================= ENV ================= */
const BOT_TOKEN = process.env.BOT_TOKEN;
const MONGO_URI = process.env.MONGO_URI;

if (!BOT_TOKEN || !MONGO_URI) {
    console.error("Critical environment variables missing (BOT_TOKEN or MONGO_URI)");
    process.exit(1);
}

/* ================= TELEGRAM BOT ================= */
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

/* ================= RATE LIMIT ================= */
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 200, // Increased for high-frequency tapping
    message: { success: false, message: "Too many requests" }
});
app.use("/tap", limiter); // Only limit tap to prevent UI lag on other routes

/* ================= DATABASE SCHEMA ================= */
const userSchema = new mongoose.Schema({
    telegramId: { type: String, required: true, unique: true },
    username: { type: String, default: "player" },
    coins: { type: Number, default: 0 },
    energy: { type: Number, default: 1000 },
    maxEnergy: { type: Number, default: 1000 },
    tapPower: { type: Number, default: 1 },
    tapLevel: { type: Number, default: 1 },
    profitPerHour: { type: Number, default: 10 },
    lastActive: { type: Date, default: Date.now },
    lastTap: { type: Number, default: 0 },
    tapCount: { type: Number, default: 0 },
    tapReset: { type: Number, default: Date.now },
    suspicious: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
    referredBy: { type: String, default: null },
    referrals: { type: Number, default: 0 },
    completedTasks: { type: [String], default: [] },
    lastDaily: { type: Date, default: null },
    lastSpin: { type: Date, default: null },
    league: { type: String, default: "Wood" },
    gpuLevel: { type: Number, default: 1 },
    gpuProfit: { type: Number, default: 10 },
    gpuCost: { type: Number, default: 1000 },
    marketingLevel: { type: Number, default: 1 },
    marketingProfit: { type: Number, default: 15 },
    marketingCost: { type: Number, default: 1500 },
    leagueRewardsClaimed: { type: [String], default: [] }
});

userSchema.index({ coins: -1 });
const User = mongoose.model("User", userSchema);

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("Mongo Connection Error:", err));

/* ================= LEAGUE SYSTEM ================= */
const LEAGUES = [
    { name: "Wood", min: 0, max: 10000 },
    { name: "Bronze", min: 10000, max: 30000 },
    { name: "Silver", min: 30000, max: 70000 },
    { name: "Gold", min: 70000, max: 150000 },
    { name: "Platinum", min: 150000, max: 300000 },
    { name: "Diamond", min: 300000, max: 600000 },
    { name: "Master", min: 600000, max: 1200000 },
    { name: "Grandmaster", min: 1200000, max: 2500000 },
    { name: "Elite", min: 2500000, max: 5000000 },
    { name: "Legendary", min: 5000000, max: 10000000 },
    { name: "Mythic", min: 10000000, max: Infinity }
];

function getLeague(coins) {
    const league = LEAGUES.find(l => coins >= l.min && coins < l.max);
    return league ? league.name : "Mythic";
}

/* ================= UTILITIES ================= */
async function applyOfflineMining(user) {
    const now = new Date();
    const seconds = Math.max(0, (now - user.lastActive) / 1000);
    const earned = (user.profitPerHour / 3600) * seconds;
    user.coins += earned;
    
    // Also recharge energy offline
    const energyGained = seconds * (2 / 3); // 2 energy every 3 seconds
    user.energy = Math.min(user.maxEnergy, user.energy + energyGained);
    
    user.league = getLeague(user.coins);
    user.lastActive = now;
}

/* ================= BOT COMMANDS ================= */
bot.onText(/\/start(?: (.+))?/, async (msg, match) => {
    const telegramId = msg.from.id.toString();
    const username = msg.from.username || msg.from.first_name || "player";
    const refId = match[1];

    let user = await User.findOne({ telegramId });
    if (!user) {
        user = await User.create({
            telegramId,
            username,
            referredBy: refId && refId !== telegramId ? refId : null
        });

        if (refId && refId !== telegramId) {
            const refUser = await User.findOne({ telegramId: refId });
            if (refUser) {
                refUser.coins += 5000; // Referral bonus
                refUser.referrals += 1;
                await refUser.save();
            }
        }
    }

    bot.sendMessage(msg.chat.id, `🚀 Welcome to PupByte Tap Bot, ${username}!\n\nTap the button below to start mining.`, {
        reply_markup: {
            inline_keyboard: [[{
                text: "🔥 Open PupByte App",
                web_app: { url: "https://pupbytetapapp.onrender.com" } // Replace with your actual URL
            }]]
        }
    });
});

/* ================= API ROUTES ================= */

// Load User
app.get("/load/:id", async (req, res) => {
    try {
        const telegramId = req.params.id;
        let user = await User.findOne({ telegramId });
        if (!user) user = await User.create({ telegramId });

        await applyOfflineMining(user);
        await user.save();

        res.json({
            success: true,
            coins: user.coins,
            energy: user.energy,
            profitPerHour: user.profitPerHour,
            tapLevel: user.tapLevel,
            tapPower: user.tapPower,
            league: user.league,
            referrals: user.referrals,
            gpuLevel: user.gpuLevel,
            gpuProfit: user.gpuProfit,
            gpuCost: user.gpuCost,
            marketingLevel: user.marketingLevel,
            marketingProfit: user.marketingProfit,
            marketingCost: user.marketingCost,
            nextTapCost: Math.floor(100 * Math.pow(1.5, user.tapLevel)),
            nextProfitCost: Math.floor(200 * Math.pow(1.6, user.tapLevel))
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error loading user" });
    }
});

// Tap
app.post("/tap", async (req, res) => {
    try {
        const { telegramId } = req.body;
        const user = await User.findOne({ telegramId });
        if (!user || user.isBlocked) return res.json({ success: false, message: "Blocked or not found" });

        const now = Date.now();
        // Simple anti-cheat
        if (now - user.lastTap < 50) { // Max 20 taps per second
            user.suspicious += 1;
            if (user.suspicious > 50) user.isBlocked = true;
            await user.save();
            return res.json({ success: false, message: "Too fast" });
        }

        if (user.energy < user.tapPower) return res.json({ success: false, message: "No energy" });

        user.coins += user.tapPower;
        user.energy -= user.tapPower;
        user.lastTap = now;
        user.lastActive = new Date();
        user.league = getLeague(user.coins);
        await user.save();

        res.json({
            success: true,
            coins: user.coins,
            energy: user.energy,
            tapPower: user.tapPower,
            profitPerHour: user.profitPerHour
        });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// Upgrade Tap
app.post("/upgrade-tap", async (req, res) => {
    try {
        const { telegramId } = req.body;
        const user = await User.findOne({ telegramId });
        const cost = Math.floor(100 * Math.pow(1.5, user.tapLevel));

        if (user.coins < cost) return res.json({ success: false, message: "Not enough coins" });

        user.coins -= cost;
        user.tapLevel += 1;
        user.tapPower += 1;
        await user.save();

        res.json({ success: true, coins: user.coins, tapLevel: user.tapLevel, tapPower: user.tapPower });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// Upgrade Profit (Mine Cards)
app.post("/upgrade-card", async (req, res) => {
    try {
        const { telegramId, type } = req.body; // type: 'gpu' or 'marketing'
        const user = await User.findOne({ telegramId });
        const costKey = `${type}Cost`;
        const levelKey = `${type}Level`;
        const profitKey = `${type}Profit`;

        if (user.coins < user[costKey]) return res.json({ success: false, message: "Not enough coins" });

        user.coins -= user[costKey];
        user[levelKey] += 1;
        const addedProfit = type === 'gpu' ? 50 : 80;
        user[profitKey] += addedProfit;
        user.profitPerHour += addedProfit;
        user[costKey] = Math.floor(user[costKey] * 1.6);

        await user.save();
        res.json({ success: true, coins: user.coins, level: user[levelKey], profit: user[profitKey], cost: user[costKey], totalProfit: user.profitPerHour });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// Spin
app.post("/spin", async (req, res) => {
    try {
        const { telegramId } = req.body;
        const user = await User.findOne({ telegramId });
        const now = new Date();

        if (user.lastSpin && (now - user.lastSpin) < 24 * 60 * 60 * 1000) {
            return res.json({ success: false, message: "Wait 24h" });
        }

        const rewards = [100, 200, 500, 1000, 5000];
        const reward = rewards[Math.floor(Math.random() * rewards.length)];
        user.coins += reward;
        user.lastSpin = now;
        await user.save();

        res.json({ success: true, reward, coins: user.coins });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// Leaderboards
app.get("/top-global", async (req, res) => {
    const users = await User.find({}).sort({ coins: -1 }).limit(10).select("telegramId coins league");
    res.json(users);
});

app.get("/top-league/:league", async (req, res) => {
    const users = await User.find({ league: req.params.league }).sort({ coins: -1 }).limit(10).select("telegramId coins");
    res.json(users);
});

app.get("/rank/:id", async (req, res) => {
    const user = await User.findOne({ telegramId: req.params.id });
    if (!user) return res.json({});
    const rank = await User.countDocuments({ coins: { $gt: user.coins } }) + 1;
    res.json({ rank, coins: user.coins, league: user.league });
});

/* ================= BACKGROUND TASKS ================= */
// Energy recharge every 1 minute for all users (more efficient than 3s)
cron.schedule("* * * * *", async () => {
    try {
        await User.updateMany(
            { energy: { $lt: 1000 } },
            [
                {
                    $set: {
                        energy: {
                            $min: ["$maxEnergy", { $add: ["$energy", 40] }]
                        }
                    }
                }
            ]
        );
    } catch (e) {
        console.error("Energy recharge error");
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
