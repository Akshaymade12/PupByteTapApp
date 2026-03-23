const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const BOT_TOKEN = "YOUR_BOT_TOKEN";
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

let users = {};

/* ================= TELEGRAM START ================= */

bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id,
        "🚀 Tap Game Start\nClick below 👇",
        {
            reply_markup: {
                inline_keyboard: [[
                    {
                        text: "🎮 Play Game",
                        web_app: {
                            url: "https://your-domain.com"
                        }
                    }
                ]]
            }
        }
    );
});

/* ================= LOAD USER ================= */

app.get("/load/:id", (req, res) => {

    const id = req.params.id;

    if (!users[id]) {
        users[id] = {
            coins: 0,
            energy: 100,
            profitPerHour: 10,
            tapPower: 1,
            tapLevel: 1,
            referrals: 0
        };
    }

    res.json(users[id]);
});

/* ================= TAP ================= */

app.post("/tap", (req, res) => {

    const { telegramId } = req.body;

    const user = users[telegramId];
    if (!user) return res.json({ success: false });

    if (user.energy <= 0) {
        return res.json({ success: false, message: "No energy" });
    }

    user.coins += user.tapPower;
    user.energy -= user.tapPower;

    res.json({
        success: true,
        coins: user.coins,
        energy: user.energy
    });
});

/* ================= DAILY ================= */

app.post("/daily-reward", (req, res) => {

    const { telegramId } = req.body;
    const user = users[telegramId];

    if (!user) return res.json({ success: false });

    if (user.lastDaily && Date.now() - user.lastDaily < 86400000) {
        return res.json({ success: false, message: "Already claimed" });
    }

    user.lastDaily = Date.now();
    user.coins += 1000;

    res.json({
        success: true,
        reward: 1000
    });
});

/* ================= SPIN ================= */

app.post("/spin", (req, res) => {

    const { telegramId } = req.body;
    const user = users[telegramId];

    if (!user) return res.json({ success: false });

    const rewards = [100,200,300,500,1000];
    const reward = rewards[Math.floor(Math.random()*rewards.length)];

    user.coins += reward;

    res.json({
        success: true,
        reward
    });
});

/* ================= ENERGY AUTO REFILL ================= */

setInterval(() => {

    Object.values(users).forEach(user => {
        if (user.energy < 100) {
            user.energy += 1;
        }
    });

}, 2000);

/* ================= SERVER ================= */

app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
});
