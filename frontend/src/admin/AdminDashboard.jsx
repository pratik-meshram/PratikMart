import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, Users, DollarSign } from 'lucide-react';
import api from '../api/axios';
import './Admin.css';

const statusColors = { placed: 'badge-info', confirmed: 'badge-primary', processing: 'badge-warning', shipped: 'badge-warning', delivered: 'badge-success', cancelled: 'badge-danger' };

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(r => { setStats(r.data); setLoading(false); });
  }, []);

  if (loading) return <div className="flex-center" style={{ padding: '80px' }}><div className="spinner" /></div>;

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats.revenue?.toLocaleString()}`, icon: <DollarSign size={24} />, color: '#e8f5e9', iconColor: '#28a745' },
    { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag size={24} />, color: '#e8e6ff', iconColor: 'var(--primary)' },
    { label: 'Products', value: stats.totalProducts, icon: <Package size={24} />, color: '#fff3e0', iconColor: '#ff9800' },
    { label: 'Customers', value: stats.totalUsers, icon: <Users size={24} />, color: '#fce4ec', iconColor: '#e91e63' },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <span className="text-gray fs-sm">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      <div className="stats-grid">
        {statCards.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.color, color: s.iconColor }}>{s.icon}</div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Recent Orders */}
        <div className="admin-table-wrap">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: '700' }}>Recent Orders</h3>
            <Link to="/admin/orders" style={{ color: 'var(--primary)', fontSize: '13px' }}>View All</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {stats.recentOrders?.map(o => (
                  <tr key={o._id}>
                    <td>#{o._id.slice(-6).toUpperCase()}</td>
                    <td>{o.user?.name}</td>
                    <td>₹{o.total?.toLocaleString()}</td>
                    <td><span className={`badge ${statusColors[o.orderStatus]}`}>{o.orderStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Orders by Status */}
        <div className="admin-table-wrap">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontWeight: '700' }}>Orders by Status</h3>
          </div>
          <div style={{ padding: '20px' }}>
            {stats.ordersByStatus?.map(s => (
              <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className={`badge ${statusColors[s._id]}`}>{s._id}</span>
                <div style={{ flex: 1, margin: '0 12px', height: '8px', background: 'var(--light-gray)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--primary)', width: `${(s.count / stats.totalOrders) * 100}%`, borderRadius: '4px' }} />
                </div>
                <span style={{ fontWeight: '700', fontSize: '14px' }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-page-header { flex-direction: column; align-items: flex-start; }
          .admin-page-header h1 { font-size: 20px; }
          .admin-page-header span { font-size: 12px; }
          div[style*="grid-template-columns: 1fr 1fr"] { 
            grid-template-columns: 1fr !important; 
          }
        }
      `}</style>
    </div>
  );
}
