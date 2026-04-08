import React from 'react';
import { ArrowRight, CheckCheck, Clock } from 'lucide-react';

const STATUS_LABELS = {
  Preparing: 'Mark Ready',
  Ready: 'Complete Order',
};

const STATUS_ICONS = {
  Preparing: <ArrowRight size={14} />,
  Ready: <CheckCheck size={14} />,
};

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const OrderCard = ({ order, onUpdateStatus }) => {
  const nextLabel = STATUS_LABELS[order.status];
  const nextIcon  = STATUS_ICONS[order.status];
  const isVeg     = order.category === 'Veg';

  return (
    <div className="order-card">
      {/* Header row */}
      <div className="order-card-header">
        <div className="order-card-meta">
          <div className="order-card-title">{order.customerName}</div>
          <div className="order-timestamp">
            <Clock size={11} />
            {formatTime(order.createdAt)}
          </div>
        </div>
        <span className="order-id">#{order.id}</span>
      </div>

      {/* Category badge */}
      <div style={{ marginBottom: '0.75rem' }}>
        <span className={`category-badge ${isVeg ? 'veg' : 'non-veg'}`}>
          <span className="category-dot" />
          {order.category}
        </span>
      </div>

      {/* Items */}
      <ul className="order-items">
        {order.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      {/* Action button */}
      {nextLabel && (
        <div className="order-actions">
          <button
            className="btn-advance"
            onClick={() => onUpdateStatus(order.id)}
          >
            {nextIcon}
            {nextLabel}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
