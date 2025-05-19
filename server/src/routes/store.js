const express = require("express");
const router = express.Router();
const StoreItem = require("../models/StoreItem");
const User = require("../models/User");
const authenticate = require("../middleware/auth");

// GET all store items
router.get("/items", authenticate, async (req, res) => {
  try {
    const items = await StoreItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to load store items" });
  }
});

// POST to buy an item
router.post("/buy", authenticate, async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.body;

  try {
    const user = await User.findById(userId);
    const item = await StoreItem.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (user.avatar.ownedItems.includes(itemId)) {
      return res.status(400).json({ message: "You already own this item" });
    }

    if (user.currency < item.price) {
      return res.status(400).json({ message: "Not enough currency" });
    }

    user.currency -= item.price;
    user.avatar.ownedItems.push(itemId);
    await user.save();

    res.json({ message: "Item purchased successfully", currency: user.currency });
  } catch (err) {
    res.status(500).json({ message: "Purchase failed", error: err.message });
  }
});

router.post("/purchase", authenticate, async (req, res) => {
    try {
      const { itemId } = req.body;
  
      const item = await Item.findById(itemId);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
  
      const user = req.user;
  
      if (user.currency < item.price) {
        return res.status(400).json({ message: "Not enough currency to purchase item" });
      }
  
      // Deduct currency and add item to avatar
      user.currency -= item.price;
  
      // Add item to avatar (simple implementation)
      user.avatar = {
        ...(user.avatar || {}),
        [item.type]: item.name
      };
  
      await user.save();
  
      res.json({
        message: `Successfully purchased ${item.name}`,
        currency: user.currency,
        avatar: user.avatar,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to purchase item", error: error.message });
    }
  });

// POST /api/store/equip
router.post("/equip", authenticate, async (req, res) => {
    const userId = req.user.id;
    const { itemId } = req.body;
  
    try {
      const user = await User.findById(userId);
      const item = await StoreItem.findById(itemId);
  
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
  
      if (!user.avatar.ownedItems.includes(itemId)) {
        return res.status(403).json({ message: "You don't own this item" });
      }
  
      const category = item.category;
  
      // Equip item in correct slot (hat, glasses, shirt, etc.)
      user.avatar.equipped[category] = itemId;
      await user.save();
  
      res.json({ message: `Equipped ${category} item successfully` });
    } catch (err) {
      res.status(500).json({ message: "Equip failed", error: err.message });
    }
  });

  // GET /api/store/avatar
router.get("/avatar", authenticate, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate([
        "avatar.equipped.hat",
        "avatar.equipped.glasses",
        "avatar.equipped.shirt"
      ]);
  
      res.json({
        equipped: user.avatar.equipped,
        currency: user.currency
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch avatar", error: err.message });
    }
  });
  
  

module.exports = router;
