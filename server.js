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

// Schema
const User = mongoose.model("User", {
    telegramId: String,
    coins: Number
});

// Save Coins
app.post("/save", async (req, res) => {
    const { telegramId, coins } = req.body;

    if (!telegramId) {
        return res.json({ success: false });
    }

    await User.findOneAndUpdate(
        { telegramId },
        { coins },
        { upsert: true }
    );

    res.json({ success: true });
});

// Load Coins
app.get("/load/:id", async (req, res) => {
    const user = await User.findOne({ telegramId: req.params.id });

    if (user) {
        res.json({ coins: user.coins });
    } else {
        res.json({ coins: 0 });
    }
});

// Home
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
