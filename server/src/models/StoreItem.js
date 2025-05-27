const mongoose = require("mongoose");

const storeItemSchema = new mongoose.Schema({
  name: String,
  category: String, // e.g. "hat", "glasses", "shirt"
  price: Number,
  iconName: String // name of the icon in Icons.jsx
});

module.exports = mongoose.model("StoreItem", storeItemSchema);