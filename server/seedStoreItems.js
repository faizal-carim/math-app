require("dotenv").config();
const mongoose = require("mongoose");
const StoreItem = require("./src/models/StoreItem");


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await StoreItem.deleteMany(); // optional: clear existing items
    await StoreItem.insertMany([
      { name: "Wizard Hat", category: "hat", price: 50, imageUrl: "" },
      { name: "Cool Glasses", category: "glasses", price: 30, imageUrl: "" },
      { name: "Cape", category: "shirt", price: 70, imageUrl: "" }
    ]);
    console.log("✅ Store items seeded.");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("Error seeding items:", err);
  });
