const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const schoolRoutes = require("./routes/school");
const gameRoutes = require("./routes/game");
const leaderboardRoutes = require("./routes/leaderboard");
const storeRoutes = require("./routes/store");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");



const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("DB connection error:", err));

app.use("/api/auth", authRoutes);

app.use("/api/schools", schoolRoutes);

app.use("/api/game", gameRoutes);

app.use("/api/leaderboard", leaderboardRoutes);

app.use("/api/store", storeRoutes);

app.use("/api/user", userRoutes);

app.use("/api/admin", adminRoutes);

app.listen(3001, () => {
  console.log("Server running on port 3001");
});