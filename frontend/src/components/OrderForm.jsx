import React, { useState } from 'react';
import { Plus, X, ShoppingBag } from 'lucide-react';

const OrderForm = ({ onSubmit, onClose }) => {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState('');
  const [category, setCategory] = useState('Veg');

  const handleAddItem = (e) => {
    e?.preventDefault();
    if (currentItem.trim()) {
      setItems(prev => [...prev, currentItem.trim()]);
      setCurrentItem('');
    }
  };

  const handleRemoveItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName || items.length === 0) return;
    onSubmit({ customerName, items, category });
  };

  const canSubmit = customerName.trim() && items.length > 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <ShoppingBag size={20} color="#6366f1" />
            <h2>New Order</h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Customer Name */}
          <div className="form-group">
            <label htmlFor="customerName">Customer Name</label>
            <input
              id="customerName"
              type="text"
              className="form-control"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="e.g., John Doe"
              autoFocus
              required
            />
          </div>

          {/* Order Type */}
          <div className="form-group">
            <label>Order Type</label>
            <div className="category-toggles">
              <button
                type="button"
                className={`cat-btn-form ${category === 'Veg' ? 'active-veg' : ''}`}
                onClick={() => setCategory('Veg')}
              >
                <span className="veg-dot" />
                Veg
              </button>
              <button
                type="button"
                className={`cat-btn-form ${category === 'Non-Veg' ? 'active-non-veg' : ''}`}
                onClick={() => setCategory('Non-Veg')}
              >
                <span className="non-veg-dot" />
                Non-Veg
              </button>
            </div>
          </div>

          {/* Add Items */}
          <div className="form-group">
            <label>Items</label>
            <div className="items-input">
              <input
                type="text"
                className="form-control"
                value={currentItem}
                onChange={e => setCurrentItem(e.target.value)}
                placeholder="e.g., 2× Butter Chicken"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddItem(); } }}
              />
              <button type="button" className="add-item-btn" onClick={handleAddItem} title="Add item">
                <Plus size={18} />
              </button>
            </div>
            <div className="items-list">
              {items.map((item, i) => (
                <div key={i} className="item-chip">
                  {item}
                  <button type="button" onClick={() => handleRemoveItem(i)} aria-label="Remove">
                    <X size={12} />
                  </button>
                </div>
              ))}
              {items.length === 0 && (
                <span className="no-items-hint">No items added yet — press Enter or +</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={!canSubmit}
              style={!canSubmit ? { opacity: 0.45, cursor: 'not-allowed' } : {}}>
              <Plus size={16} />
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
