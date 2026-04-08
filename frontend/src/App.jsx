import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, UtensilsCrossed } from 'lucide-react';
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
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateOrder = async (orderData) => {
    try {
      const newOrder = await createOrder(orderData);
      setOrders(prev => [newOrder, ...prev]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to create order', error);
      alert('Failed to create order. Please try again.');
    }
  };

  const handleUpdateStatus = async (id) => {
    try {
      const updatedOrder = await updateOrderStatus(id);
      setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update order status.');
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(o.items).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || o.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const preparingOrders = filteredOrders.filter(o => o.status === 'Preparing');
  const readyOrders     = filteredOrders.filter(o => o.status === 'Ready');
  const completedOrders = filteredOrders.filter(o => o.status === 'Completed');

  const columns = [
    {
      key: 'preparing',
      label: 'Preparing',
      subtitle: 'Orders being cooked',
      cls: 'col-preparing',
      badgeCls: 'preparing',
      icon: '🔥',
      orders: preparingOrders,
      emptyMsg: 'No orders in the kitchen',
    },
    {
      key: 'ready',
      label: 'Ready',
      subtitle: 'Awaiting pickup',
      cls: 'col-ready',
      badgeCls: 'ready',
      icon: '✅',
      orders: readyOrders,
      emptyMsg: 'No orders ready yet',
    },
    {
      key: 'completed',
      label: 'Completed',
      subtitle: 'Successfully served',
      cls: 'col-completed',
      badgeCls: 'completed',
      icon: '🏁',
      orders: completedOrders,
      emptyMsg: 'No completed orders',
    },
  ];

  return (
    <div className="app-container">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="header">
        <div className="header-logo">
          <div className="logo-icon">
            <UtensilsCrossed size={18} color="white" />
          </div>
          <h1>OrderTracker</h1>
        </div>

        <div className="header-divider" />

        {/* Search */}
        <div className="search-container">
          <Search size={15} className="search-icon-inner" />
          <input
            type="text"
            placeholder="Search orders…"
            className="search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category filters */}
        <div className="dashboard-filters">
          {['All', 'Veg', 'Non-Veg'].map(cat => (
            <button
              key={cat}
              className={`cat-btn ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat === 'Veg' && <span className="veg-dot" />}
              {cat === 'Non-Veg' && <span className="non-veg-dot" />}
              {cat}
            </button>
          ))}
        </div>

        <button className="btn" onClick={() => setIsFormOpen(true)}>
          <PlusCircle size={18} />
          New Order
        </button>
      </header>

      {/* ── Board ──────────────────────────────────────────────── */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <span>Loading orders…</span>
        </div>
      ) : (
        <div className="dashboard-grid">
          {columns.map(col => (
            <div key={col.key} className={`status-column ${col.cls}`}>
              {/* Column header */}
              <div className="column-header">
                <div className="column-icon">
                  <span style={{ fontSize: '1.1rem' }}>{col.icon}</span>
                </div>
                <div className="column-title-group">
                  <h2>{col.label}</h2>
                  <div className="column-subtitle">{col.subtitle}</div>
                </div>
                <span className={`badge ${col.badgeCls}`}>{col.orders.length}</span>
              </div>

              {/* Cards */}
              {col.orders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}

              {/* Empty state */}
              {col.orders.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">
                    <span style={{ fontSize: '1.25rem' }}>{col.icon}</span>
                  </div>
                  <p>{col.emptyMsg}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ──────────────────────────────────────────────── */}
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
