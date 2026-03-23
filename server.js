const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const bot = new TelegramBot("YOUR_BOT_TOKEN", { polling: true });

let users = {};

/* TELEGRAM START */
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "🚀 Start Game", {
        reply_markup: {
            inline_keyboard: [[{
                text: "🎮 Play",
                web_app: { url: "https://your-domain.com" }
            }]]
        }
    });
});

/* LOAD USER */
app.get("/load/:id", (req, res) => {
    const id = req.params.id;

    if (!users[id]) {
        users[id] = { coins: 0 };
    }

    res.json(users[id]);
});

/* TAP */
app.post("/tap", (req, res) => {
    const { id } = req.body;

    if (!users[id]) return res.json({ success: false });

    users[id].coins += 1;

    res.json({
        success: true,
        coins: users[id].coins
    });
});

app.listen(3000, () => console.log("Server running 🚀"));
