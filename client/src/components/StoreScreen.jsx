import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StoreScreen.css";
import { 
  CoinIcon, 
  BackIcon, 
  HatIcon, 
  GlassesIcon, 
  ShirtIcon 
} from './Icons';

export default function StoreScreen({ onBack }) {
  const [storeItems, setStoreItems] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [message, setMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [previewAvatar, setPreviewAvatar] = useState({
    hat: null,
    glasses: null,
    shirt: null
  });
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch store items
        const itemsRes = await axios.get("/api/store/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStoreItems(itemsRes.data);
        
        // Fetch user profile
        const profileRes = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(profileRes.data);
        
        // Set initial preview to current avatar
        if (profileRes.data.avatar && profileRes.data.avatar.equipped) {
          setPreviewAvatar(profileRes.data.avatar.equipped);
        }
      } catch (err) {
        console.error(err);
        setMessage("Failed to load store items or profile.");
      }
    }
    
    fetchData();
  }, [token]);

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    
    // Update preview
    if (item) {
      setPreviewAvatar({
        ...previewAvatar,
        [item.category]: item._id
      });
    }
  };

  const handlePurchase = async () => {
    if (!selectedItem) return;
    
    try {
      const res = await axios.post(
        "/api/store/buy",
        { itemId: selectedItem._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage(`Purchased ${selectedItem.name}!`);
      
      // Update user profile after purchase
      const profileRes = await axios.get("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile(profileRes.data);
      
      // Clear selection
      setSelectedItem(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "Purchase failed.");
    }
  };

  const handleEquip = async () => {
    if (!selectedItem) return;
    
    try {
      await axios.post(
        "/api/store/equip",
        { itemId: selectedItem._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage(`${selectedItem.name} equipped!`);
      
      // Update user profile after equipping
      const profileRes = await axios.get("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile(profileRes.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to equip item.");
    }
  };

  // Helper to check if user owns an item
  const userOwnsItem = (itemId) => {
    return userProfile?.avatar?.ownedItems?.includes(itemId);
  };

  // Filter items by category
  const filteredItems = activeCategory === "all" 
    ? storeItems 
    : storeItems.filter(item => item.category === activeCategory);

  // Get category icon
  const getCategoryIcon = (category) => {
    switch(category) {
      case "hat": return <HatIcon />;
      case "glasses": return <GlassesIcon />;
      case "shirt": return <ShirtIcon />;
      default: return null;
    }
  };

  // Render avatar preview
  const renderAvatarPreview = () => {
    return (
      <div className="avatar-preview">
        <h3>Preview</h3>
        <div className="avatar-figure">
          {previewAvatar.hat && (
            <div className="avatar-hat">
              <HatIcon />
            </div>
          )}
          <div className="avatar-head">😊</div>
          {previewAvatar.glasses && (
            <div className="avatar-glasses">
              <GlassesIcon />
            </div>
          )}
          {previewAvatar.shirt && (
            <div className="avatar-shirt">
              <ShirtIcon />
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!userProfile) return <div className="loading">Loading store...</div>;

  return (
    <div className="store-container">
      <div className="store-header">
        <button className="back-button icon-button" onClick={onBack}>
          <BackIcon />
          <span>Back</span>
        </button>
        <h2>Avatar Store</h2>
        <div className="store-currency">
          <CoinIcon />
          <span>{userProfile.currency || 0}</span>
        </div>
      </div>

      <div className="category-tabs">
        <button 
          className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        <button 
          className={`category-tab ${activeCategory === 'hat' ? 'active' : ''}`}
          onClick={() => setActiveCategory('hat')}
        >
          <HatIcon />
          <span>Hats</span>
        </button>
        <button 
          className={`category-tab ${activeCategory === 'glasses' ? 'active' : ''}`}
          onClick={() => setActiveCategory('glasses')}
        >
          <GlassesIcon />
          <span>Glasses</span>
        </button>
        <button 
          className={`category-tab ${activeCategory === 'shirt' ? 'active' : ''}`}
          onClick={() => setActiveCategory('shirt')}
        >
          <ShirtIcon />
          <span>Shirts</span>
        </button>
      </div>

      <div className="store-content">
        <div className="store-items-container card">
          <h3>Items</h3>
          <div className="items-grid">
            {filteredItems.map((item) => (
              <div 
                key={item._id} 
                className={`store-item ${selectedItem?._id === item._id ? 'selected' : ''} ${userOwnsItem(item._id) ? 'owned' : ''}`}
                onClick={() => handleItemSelect(item)}
              >
                <div className="item-icon">
                  {getCategoryIcon(item.category)}
                </div>
                <div className="item-details">
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">
                    <CoinIcon />
                    <span>{item.price}</span>
                  </div>
                </div>
                {userOwnsItem(item._id) && <div className="owned-badge">Owned</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="store-sidebar">
          {renderAvatarPreview()}

          {selectedItem && (
            <div className="item-actions card">
              <h3>{selectedItem.name}</h3>
              <div className="item-category">
                {getCategoryIcon(selectedItem.category)}
                <span>{selectedItem.category}</span>
              </div>
              <div className="item-price-large">
                <CoinIcon />
                <span>{selectedItem.price}</span>
              </div>
              
              {!userOwnsItem(selectedItem._id) ? (
                <button 
                  className="purchase-button"
                  onClick={handlePurchase}
                  disabled={userProfile.currency < selectedItem.price}
                >
                  Purchase
                </button>
              ) : (
                <button 
                  className="equip-button"
                  onClick={handleEquip}
                >
                  Equip
                </button>
              )}
            </div>
          )}
          
          {message && <div className="store-message">{message}</div>}
        </div>
      </div>
    </div>
  );
}