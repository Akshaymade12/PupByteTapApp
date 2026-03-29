require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Load user
app.get("/load/:id", async (req, res) => {
    let user = await User.findOne({ userId: req.params.id });

    if (!user) {
        user = new User({ userId: req.params.id });
        await user.save();
    }

    res.json(user);
});

// Tap
app.post("/tap/:id", async (req, res) => {
    let user = await User.findOne({ userId: req.params.id });

    if (!user) {
        user = new User({ userId: req.params.id });
    }

    user.coins += 1;
    await user.save();

    res.json({ coins: user.coins });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running...");
});
