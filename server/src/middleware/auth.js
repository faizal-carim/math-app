const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user; // ✅ attaches the user object
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};

module.exports = authenticate;
