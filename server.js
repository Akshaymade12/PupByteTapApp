const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("Mongo Error ❌", err));

// User Schema
const User = mongoose.model("User", {
    userId: String,
    coins: { type: Number, default: 0 },
    profitPerHour: { type: Number, default: 3600 }, // 1 coin per second
    lastUpdated: { type: Date, default: Date.now }
});

// SAVE
app.post("/save", async (req, res) => {
    const { userId, coins } = req.body;

    if (!userId) return res.json({ success: false });

    let user = await User.findOne({ userId });

    if (!user) {
        user = await User.create({ userId });
    }

    user.coins = coins;
    user.lastUpdated = new Date();
    await user.save();

    res.json({ success: true });
});

// LOAD + AUTO MINING
app.get("/load/:id", async (req, res) => {

    let user = await User.findOne({ userId: req.params.id });

    if (!user) {
        user = await User.create({ userId: req.params.id });
    }

    const now = new Date();
    const secondsPassed = (now - user.lastUpdated) / 1000;

    const earned = (user.profitPerHour / 3600) * secondsPassed;

    user.coins += earned;
    user.lastUpdated = now;

    await user.save();

    res.json({
        coins: Math.floor(user.coins),
        profitPerHour: user.profitPerHour
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
