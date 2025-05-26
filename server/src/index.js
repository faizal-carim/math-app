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
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add OPTIONS handling for preflight requests
app.options('*', cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("DB connection error:", err));

app.use("/api/auth", authRoutes);

app.use("/api/school", schoolRoutes);

app.use("/api/game", gameRoutes);

app.use("/api/leaderboard", leaderboardRoutes);

app.use("/api/store", storeRoutes);

app.use("/api/user", userRoutes);

app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});