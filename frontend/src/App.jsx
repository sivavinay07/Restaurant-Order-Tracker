import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { fetchOrders, createOrder, updateOrderStatus } from './api';
import OrderCard from './components/OrderCard';
import OrderForm from './components/OrderForm';

function App() {
  const [orders, setOrders] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // Optional polling could be added here
    const interval = setInterval(loadOrders, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const handleCreateOrder = async (orderData) => {
    try {
      const newOrder = await createOrder(orderData);
      setOrders([newOrder, ...orders]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to create order', error);
      alert('Failed to create order. Please try again.');
    }
  };

  const handleUpdateStatus = async (id) => {
    try {
      const updatedOrder = await updateOrderStatus(id);
      setOrders(orders.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      ));
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update order status.');
    }
  };

  // Filter orders by search term and category
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          JSON.stringify(o.items).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || o.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Group orders by status
  const preparingOrders = filteredOrders.filter(o => o.status === 'Preparing');
  const readyOrders = filteredOrders.filter(o => o.status === 'Ready');
  const completedOrders = filteredOrders.filter(o => o.status === 'Completed');

  return (
    <div className="app-container">
      <header className="header">
    <h1>OrderTracker</h1>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="form-control search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="dashboard-filters">
          {['All', 'Veg', 'Non-Veg'].map(cat => (
            <button
              key={cat}
              className={`cat-btn ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <button className="btn" onClick={() => setIsFormOpen(true)}>
          <PlusCircle size={20} /> New Order
        </button>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
          Loading orders...
        </div>
      ) : (
        <div className="dashboard-grid">
          {/* Preparing Column */}
          <div className="status-column">
            <div className="column-header">
              <h2>Preparing</h2>
              <span className="badge preparing">{preparingOrders.length}</span>
            </div>
            {preparingOrders.map(order => (
              <OrderCard key={order.id} order={order} onUpdateStatus={handleUpdateStatus} />
            ))}
            {preparingOrders.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No orders preparing.</div>}
          </div>

          {/* Ready Column */}
          <div className="status-column">
            <div className="column-header">
              <h2>Ready</h2>
              <span className="badge ready">{readyOrders.length}</span>
            </div>
            {readyOrders.map(order => (
              <OrderCard key={order.id} order={order} onUpdateStatus={handleUpdateStatus} />
            ))}
            {readyOrders.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No orders ready.</div>}
          </div>

          {/* Completed Column */}
          <div className="status-column">
            <div className="column-header">
              <h2>Completed</h2>
              <span className="badge completed">{completedOrders.length}</span>
            </div>
            {completedOrders.map(order => (
              <OrderCard key={order.id} order={order} onUpdateStatus={handleUpdateStatus} />
            ))}
            {completedOrders.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No completed orders.</div>}
          </div>
        </div>
      )}

      {isFormOpen && (
        <OrderForm 
          onSubmit={handleCreateOrder} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
}

export default App;
