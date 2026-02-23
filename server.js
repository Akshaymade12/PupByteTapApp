const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("Mongo Error ❌", err));

// ===== Test Route =====
app.get("/", (req, res) => {
  res.send("PupByte Server Running 🚀");
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
