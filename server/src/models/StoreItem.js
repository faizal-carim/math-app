const mongoose = require("mongoose");

const storeItemSchema = new mongoose.Schema({
  name: String,
  category: String, // e.g. "hat", "glasses", "shirt"
  price: Number,
  imageUrl: String // optional, for front-end
});

module.exports = mongoose.model("StoreItem", storeItemSchema);
