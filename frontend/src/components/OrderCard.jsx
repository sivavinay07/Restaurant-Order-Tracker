import React from 'react';
import { ChefHat, CheckCircle, ArrowRight, PackageCheck } from 'lucide-react';

const OrderCard = ({ order, onUpdateStatus }) => {
  const getNextStatusLabel = (currentStatus) => {
    if (currentStatus === 'Preparing') return 'Mark Ready';
    if (currentStatus === 'Ready') return 'Complete';
    return null;
  };

  const getStatusIcon = (status) => {
    if (status === 'Preparing') return <ChefHat size={18} />;
    if (status === 'Ready') return <PackageCheck size={18} />;
    return <CheckCircle size={18} />;
  };

  return (
    <div className="order-card">
      <div className="order-card-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h3 className="order-card-title">{order.customerName}</h3>
          <div className={`category-badge ${order.category === 'Veg' ? 'veg' : 'non-veg'}`}>
            <span className="category-dot"></span>
            {order.category}
          </div>
        </div>
        <span className="order-id">#{order.id}</span>
      </div>
      
      <ul className="order-items">
        {order.items.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>

      <div className="order-actions">
        {order.status !== 'Completed' && (
          <button 
            className="btn" 
            onClick={() => onUpdateStatus(order.id)}
          >
            {getNextStatusLabel(order.status)} <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
