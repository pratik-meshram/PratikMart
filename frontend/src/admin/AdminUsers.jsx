import { useState, useEffect } from 'react';
import { User, Shield } from 'lucide-react';
import api from '../api/axios';
import './Admin.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users').then(r => { setUsers(r.data); setLoading(false); });
  }, []);

  return (
    <div>
      <div className="admin-page-header">
        <h1>Users</h1>
        <span className="text-gray">{users.length} total users</span>
      </div>

      {loading ? <div className="flex-center" style={{ padding: '60px' }}><div className="spinner" /></div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: u.isAdmin ? 'var(--primary)' : 'var(--light-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: u.isAdmin ? 'white' : '#555' }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <strong>{u.name}</strong>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    {u.isAdmin
                      ? <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Shield size={12} /> Admin</span>
                      : <span className="badge" style={{ background: 'var(--light-gray)', color: '#555', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><User size={12} /> Customer</span>
                    }
                  </td>
                  <td className="text-gray fs-sm">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
