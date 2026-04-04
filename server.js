const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

const BOT_TOKEN = process.env.BOT_TOKEN || "YOUR_TOKEN_HERE";
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

let users = {};

/* START + REFERRAL */
bot.onText(/\/start(.*)/, (msg, match) => {
    const chatId = msg.chat.id;
    const refId = match[1]?.trim();

    if (!users[chatId]) {
        users[chatId] = {
            coins: 0,
            energy: 100,
            maxEnergy: 100,
            power: 1,
            name: msg.from.first_name,
            username: msg.from.username,
            referredBy: null
        };

        if (refId && refId !== chatId.toString() && users[refId]) {
            users[chatId].referredBy = refId;
            users[chatId].coins += 50;
            users[refId].coins += 100;
        }
    }

    const botUsername = "PupByteTapBot";
    const refLink = `https://t.me/${botUsername}?start=${chatId}`;

    bot.sendMessage(chatId, `🐶 Welcome ${msg.from.first_name}\n\nInvite & Earn 💰\n\n${refLink}`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🚀 Play Game", web_app: { url: "https://pupbytetapapp.onrender.com" } }]
            ]
        }
    });
});

/* SAVE TELEGRAM USER DATA */
app.post("/saveUser", (req, res) => {
    const { id, name, username } = req.body;

    if (!users[id]) {
        users[id] = {
            coins: 0,
            energy: 100,
            maxEnergy: 100,
            power: 1
        };
    }

    users[id].name = name;
    users[id].username = username;

    res.json({ status: "saved" });
});

/* GET USER */
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

/* TAP */
app.post("/tap/:id", (req, res) => {
    const id = req.params.id;

    if (!users[id]) return res.json({});

    let user = users[id];

    if (user.energy <= 0) return res.json(user);

    user.coins += user.power;
    user.energy -= 1;

    res.json(user);
});

/* UPGRADE */
app.post("/upgrade/power/:id", (req, res) => {
    const user = users[req.params.id];

    if (!user) return res.json({});

    const cost = user.power * 50;

    if (user.coins >= cost) {
        user.coins -= cost;
        user.power += 1;
    }

    res.json(user);
});

/* ENERGY SYSTEM */
setInterval(() => {
    for (let id in users) {
        let u = users[id];

        if (!u.lastEnergyTime) u.lastEnergyTime = Date.now();

        if (Date.now() - u.lastEnergyTime > 5000) {
            if (u.energy < u.maxEnergy) {
                u.energy++;
                u.lastEnergyTime = Date.now();
            }
        }
    }
}, 1000);

app.listen(PORT, () => console.log("Server running"));
