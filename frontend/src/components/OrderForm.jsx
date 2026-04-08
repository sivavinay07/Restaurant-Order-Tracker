import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const OrderForm = ({ onSubmit, onClose }) => {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState('');
  const [category, setCategory] = useState('Veg');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (currentItem.trim()) {
      setItems([...items, currentItem.trim()]);
      setCurrentItem('');
    }
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName || items.length === 0) return;
    
    onSubmit({ customerName, items, category });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Order</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="e.g., John Doe"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label>Order Type</label>
            <div className="category-toggles">
              {['Veg', 'Non-Veg'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`cat-btn ${category === cat ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCategory(cat);
                  }}
                >
                  <span className={`category-dot ${cat === 'Veg' ? 'veg-bg' : 'non-veg-bg'}`}></span>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Add Items</label>
            <div className="items-input">
              <input 
                type="text" 
                className="form-control"
                value={currentItem}
                onChange={e => setCurrentItem(e.target.value)}
                placeholder="e.g., 2x Burger"
                onKeyPress={e => e.key === 'Enter' ? handleAddItem(e) : null}
              />
              <button type="button" className="btn btn-secondary" onClick={handleAddItem}>
                <Plus size={20} />
              </button>
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              {items.map((item, index) => (
                <div key={index} className="item-chip">
                  {item}
                  <button type="button" onClick={() => handleRemoveItem(index)}>
                    <X size={14} />
                  </button>
                </div>
              ))}
              {items.length === 0 && <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No items added yet.</span>}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn" disabled={!customerName || items.length === 0}>
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
