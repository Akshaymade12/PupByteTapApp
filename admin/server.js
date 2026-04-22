const jwt = require("jsonwebtoken");
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    const token = jwt.sign(
      { role: "admin", username: process.env.ADMIN_USER },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid admin credentials",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

/* ================= ADMIN AUTH ================= */

function generateAdminToken() {
  return jwt.sign(
    { role: "admin" },
    process.env.ADMIN_JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function verifyAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

/* ================= ADMIN LOGIN ================= */

app.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials"
      });
    }

    const token = generateAdminToken();

    return res.json({
      success: true,
      token
    });
  } catch (e) {
    console.log("/admin/login error", e);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* ================= ADMIN USERS LIST ================= */

app.get("/admin/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ coins: -1 })
      .limit(200)
      .select(
        "telegramId name username coins profitPerHour referrals league walletConnected isBanned"
      );

    const formattedUsers = users.map(user => ({
      userId: String(user.telegramId || user._id),
      dbId: String(user._id),
      name: user.name || "Unknown",
      username: user.username ? `@${user.username}` : "-",
      coins: user.coins || 0,
      profitPerHour: user.profitPerHour || 0,
      referrals: user.referrals || 0,
      league: user.league || "Wood",
      status: user.isBanned ? "Banned" : "Active",
      walletConnected: !!user.walletConnected
    }));

    return res.json({
      success: true,
      users: formattedUsers
    });
  } catch (e) {
    console.log("/admin/users error", e);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* ================= ADMIN USER DETAIL ================= */

app.get("/admin/users/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      $or: [
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { telegramId: id }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      user: {
        userId: String(user.telegramId || user._id),
        dbId: String(user._id),
        name: user.name || "Unknown",
        username: user.username ? `@${user.username}` : "-",
        coins: user.coins || 0,
        profitPerHour: user.profitPerHour || 0,
        referrals: user.referrals || 0,
        league: user.league || "Wood",
        status: user.isBanned ? "Banned" : "Active",
        walletConnected: !!user.walletConnected,
        energy: user.energy || 0,
        maxEnergy: user.maxEnergy || 0,
        tapPower: user.tapPower || 0,
        streakDay: user.streakDay || 0,
        totalClaims: user.totalClaims || 0
      }
    });
  } catch (e) {
    console.log("/admin/users/:id error", e);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* ================= ADMIN ADD COINS ================= */

app.post("/admin/users/add-coins", verifyAdmin, async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const coinsToAdd = Number(amount);

    if (!userId || !coinsToAdd || coinsToAdd <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId or amount"
      });
    }

    const user = await User.findOne({
      $or: [
        { _id: userId.match(/^[0-9a-fA-F]{24}$/) ? userId : null },
        { telegramId: String(userId) }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.coins += coinsToAdd;
    user.league = getLeague(user.coins);
    await user.save();

    return res.json({
      success: true,
      coins: user.coins,
      league: user.league
    });
  } catch (e) {
    console.log("/admin/users/add-coins error", e);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* ================= ADMIN DEDUCT COINS ================= */

app.post("/admin/users/deduct-coins", verifyAdmin, async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const coinsToDeduct = Number(amount);

    if (!userId || !coinsToDeduct || coinsToDeduct <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId or amount"
      });
    }

    const user = await User.findOne({
      $or: [
        { _id: userId.match(/^[0-9a-fA-F]{24}$/) ? userId : null },
        { telegramId: String(userId) }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.coins = Math.max(0, user.coins - coinsToDeduct);
    user.league = getLeague(user.coins);
    await user.save();

    return res.json({
      success: true,
      coins: user.coins,
      league: user.league
    });
  } catch (e) {
    console.log("/admin/users/deduct-coins error", e);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
