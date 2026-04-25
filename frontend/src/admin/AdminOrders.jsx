import { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import './Admin.css';

const statusColors = { placed: 'badge-info', confirmed: 'badge-primary', processing: 'badge-warning', shipped: 'badge-warning', delivered: 'badge-success', cancelled: 'badge-danger' };
const statuses = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  const load = (status = '') => {
    setLoading(true);
    api.get('/admin/orders', { params: { status, limit: 50 } })
      .then(r => { setOrders(r.data.orders); setLoading(false); });
  };

  useEffect(() => { load(filter); }, [filter]);

  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      const { data } = await api.put(`/admin/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o._id === id ? data : o));
      if (selected?._id === id) setSelected(data);
      toast.success('Status updated');
    } catch {
      toast.error('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Orders</h1>
        <select className="form-control" style={{ width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Orders</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <div className="flex-center" style={{ padding: '60px' }}><div className="spinner" /></div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id}>
                  <td><strong>#{o._id.slice(-8).toUpperCase()}</strong></td>
                  <td>
                    <div>{o.user?.name}</div>
                    <div className="text-gray fs-sm">{o.user?.email}</div>
                  </td>
                  <td>{o.items?.length} item{o.items?.length > 1 ? 's' : ''}</td>
                  <td><strong>₹{o.total?.toLocaleString()}</strong></td>
                  <td>{o.paymentMethod}</td>
                  <td>
                    <select
                      className="form-control"
                      style={{ padding: '4px 8px', fontSize: '13px', width: 'auto' }}
                      value={o.orderStatus}
                      onChange={e => updateStatus(o._id, e.target.value)}
                      disabled={updating}
                    >
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="text-gray fs-sm">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => setSelected(o)}><Eye size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal">
            <div className="modal-header">
              <h2>Order #{selected._id.slice(-8).toUpperCase()}</h2>
              <button onClick={() => setSelected(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '16px' }}>
                <strong>Customer:</strong> {selected.user?.name} ({selected.user?.email})
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Shipping:</strong><br />
                {selected.shippingAddress?.name}<br />
                {selected.shippingAddress?.street}, {selected.shippingAddress?.city}<br />
                {selected.shippingAddress?.state} {selected.shippingAddress?.zip}, {selected.shippingAddress?.country}
              </div>
              <table className="admin-table" style={{ marginBottom: '16px' }}>
                <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
                <tbody>
                  {selected.items?.map((item, i) => (
                    <tr key={i}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={item.image} alt={item.name} />
                        {item.name}
                      </td>
                      <td>{item.quantity}</td>
                      <td>₹{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '16px' }}>
                <span>Total</span><span>₹{selected.total?.toLocaleString()}</span>
              </div>
              <div style={{ marginTop: '16px' }}>
                <label style={{ fontWeight: '600', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Update Status</label>
                <select className="form-control" value={selected.orderStatus}
                  onChange={e => updateStatus(selected._id, e.target.value)} disabled={updating}>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
