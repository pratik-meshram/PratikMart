import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import './OrderDetail.css';

const statusSteps = ['placed', 'confirmed', 'processing', 'shipped', 'delivered'];
const statusColors = { placed: 'badge-info', confirmed: 'badge-primary', processing: 'badge-warning', shipped: 'badge-warning', delivered: 'badge-success', cancelled: 'badge-danger' };

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => { setOrder(r.data); setLoading(false); });
  }, [id]);

  const cancelOrder = async () => {
    if (!confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      const { data } = await api.put(`/orders/${id}/cancel`);
      setOrder(data);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="flex-center" style={{ padding: '100px' }}><div className="spinner" /></div>;
  if (!order) return <div className="flex-center" style={{ padding: '100px' }}>Order not found</div>;

  const stepIndex = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="order-detail-page">
      <div className="container">
        <Link to="/orders" className="back-link"><ArrowLeft size={16} /> Back to Orders</Link>

        <div className="order-detail-header">
          <div>
            <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="text-gray">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
          </div>
          <div className="order-header-right">
            <span className={`badge ${statusColors[order.orderStatus]}`} style={{ fontSize: '14px', padding: '6px 14px' }}>
              {order.orderStatus}
            </span>
            {!['shipped', 'delivered', 'cancelled'].includes(order.orderStatus) && (
              <button className="btn btn-danger btn-sm" onClick={cancelOrder} disabled={cancelling}>
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        {order.orderStatus !== 'cancelled' && (
          <div className="order-progress card p-5">
            <div className="progress-steps">
              {statusSteps.map((s, i) => (
                <div key={s} className={`progress-step ${i <= stepIndex ? 'done' : ''} ${i === stepIndex ? 'current' : ''}`}>
                  <div className="progress-dot"><Package size={14} /></div>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="order-detail-grid">
          <div>
            {/* Items */}
            <div className="card p-5 mb-4">
              <h3>Items Ordered</h3>
              {order.items.map((item, i) => (
                <div key={i} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="order-item-info">
                    <Link to={`/products/${item.product}`}><strong>{item.name}</strong></Link>
                    <span className="text-gray fs-sm">Qty: {item.quantity}</span>
                  </div>
                  <span className="order-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Shipping */}
            <div className="card p-5">
              <h3>Shipping Address</h3>
              <p><strong>{order.shippingAddress?.name}</strong></p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
              <p>{order.shippingAddress?.country}</p>
              {order.shippingAddress?.phone && <p>📞 {order.shippingAddress.phone}</p>}
            </div>
          </div>

          {/* Summary */}
          <div className="card p-5 order-summary-box">
            <h3>Payment Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString()}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{order.shippingCost === 0 ? 'Free' : `₹${order.shippingCost}`}</span></div>
            <div className="summary-row"><span>Tax</span><span>₹{order.tax}</span></div>
            <div className="summary-total"><span>Total</span><span>₹{order.total?.toLocaleString()}</span></div>
            <div className="payment-method-box">
              <span>Payment Method</span>
              <strong>{order.paymentMethod}</strong>
            </div>
            <div className="payment-method-box">
              <span>Payment Status</span>
              <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>{order.paymentStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
