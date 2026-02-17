const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

mongoose.connect("mongodb+srv://akshaymade111:<db_password>@cluster0.hr62blf.mongodb.net/?appName=Cluster0");

const User = mongoose.model("User", {
  telegramId: String,
  coins: Number
});

app.post("/save", async (req,res)=>{
  const { telegramId, coins } = req.body;

  await User.findOneAndUpdate(
    { telegramId },
    { coins },
    { upsert:true }
  );

  res.send("Saved");
});

app.get("/user/:id", async (req,res)=>{
  const user = await User.findOne({ telegramId: req.params.id });
  res.json(user);
});

app.listen(3000);
