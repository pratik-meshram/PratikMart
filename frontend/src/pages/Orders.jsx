import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import './Orders.css';

const statusColors = {
  placed: 'badge-info', confirmed: 'badge-primary', processing: 'badge-warning',
  shipped: 'badge-warning', delivered: 'badge-success', cancelled: 'badge-danger'
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then(r => { setOrders(r.data); setLoading(false); });
  }, []);

  if (loading) return <div className="flex-center" style={{ padding: '100px' }}><div className="spinner" /></div>;

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>
        {orders.length === 0 ? (
          <div className="empty-state">
            <Package size={80} color="#ddd" />
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here</p>
            <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <Link key={order._id} to={`/orders/${order._id}`} className="order-card">
                <div className="order-card-header">
                  <div>
                    <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="order-card-right">
                    <span className={`badge ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span>
                    <ChevronRight size={18} color="#aaa" />
                  </div>
                </div>
                <div className="order-items-preview">
                  {order.items.slice(0, 3).map((item, i) => (
                    <img key={i} src={item.image} alt={item.name} title={item.name} />
                  ))}
                  {order.items.length > 3 && <span className="more-items">+{order.items.length - 3}</span>}
                  <span className="order-items-count">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                </div>
                <div className="order-card-footer">
                  <span>Total: <strong>₹{order.total?.toLocaleString()}</strong></span>
                  <span className="text-gray fs-sm">{order.paymentMethod}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
