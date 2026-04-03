const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

/* 🔑 BOT TOKEN */
const BOT_TOKEN = "YOUR_TOKEN_HERE";

/* 🤖 BOT INIT */
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

/* 🧠 DATABASE */
let users = {};

/* /start command */
bot.onText(/\/start(.*)/, (msg, match) => {
    const chatId = msg.chat.id;
    const refId = match[1]?.trim();

    const userId = chatId;

    if (!users[userId]) {
        users[userId] = {
            coins: 0,
            energy: 100,
            maxEnergy: 100,
            power: 1,
            referredBy: null
        };

        // 🎁 Referral reward
        if (refId && refId !== userId.toString() && users[refId]) {
            users[userId].referredBy = refId;

            users[userId].coins += 50; // new user bonus
            users[refId].coins += 100; // inviter bonus
        }
    }

    const botUsername = "PupByteTapBot";

    const refLink = `https://t.me/${botUsername}?start=${userId}`;

    bot.sendMessage(chatId, `🐶 Welcome to PupByte!\n\nInvite friends & earn 💰\n\nYour Link:\n${refLink}`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🚀 Play Game", web_app: { url: "https://pupbytetapapp.onrender.com" } }]
            ]
        }
    });
});

/* API: GET USER */
app.get("/user/:id", (req, res) => {
    const id = req.params.id;

    if (!users[id]) {
        users[id] = {
            coins: 0,
            energy: 100,
            maxEnergy: 100,
            power: 1
        };
    }

    res.json(users[id]);
});

/* UPGRADE API */

app.post("/upgrade/power/:id", (req, res) => {
    const id = req.params.id;

    if (!users[id]) return res.json({ error: "user not found" });

    let user = users[id];

    const cost = user.power * 50;

    if (user.coins >= cost) {
        user.coins -= cost;
        user.power += 1;
    }

    res.json(user);
});

/* API: TAP */
app.post("/tap/:id", (req, res) => {
   const id = req.params.id;

if (!users[id]) {
    users[id] = {
        coins: 0,
        energy: 100,
        maxEnergy: 100,
        power: 1
    };
}

let user = users[id];

if (user.energy <= 0) return res.json(user);

    user.coins += user.power;
    user.energy -= 1;

    res.json(user);
});

/* ENERGY AUTO RECHARGE */
setInterval(() => {
    for (let id in users) {
        let u = users[id];

        if (!u.lastEnergyTime) u.lastEnergyTime = Date.now();

        const now = Date.now();

        if (now - u.lastEnergyTime > 5000) {
            if (u.energy < u.maxEnergy) {
                u.energy += 1;
                u.lastEnergyTime = now;
            }
        }
    }
}, 1000);

app.listen(PORT, () => console.log("Server running"));
