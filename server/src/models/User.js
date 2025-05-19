const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  grade: { type: String, required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
  currency: { type: Number, default: 0 },
  itemsOwned: [{ type: mongoose.Schema.Types.ObjectId, ref: "StoreItem" }],
  coins: { type: Number, default: 0 },
  gameStats: {
    totalCorrect: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    averageTime: { type: Number, default: 0 },
  },  
  stats: {
    correctAnswers: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 } // in seconds
  },  
  avatar: {
    equipped: {
      hat: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreItem', default: null },
      glasses: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreItem', default: null },
      shirt: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreItem', default: null }
    },
    ownedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StoreItem' }]
  },
  currency: {
    type: Number,
    default: 0
  }
  
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
