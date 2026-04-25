import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', password: '',
    street: user?.address?.street || '', city: user?.address?.city || '',
    state: user?.address?.state || '', zip: user?.address?.zip || '', country: user?.address?.country || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        name: form.name, email: form.email,
        ...(form.password && { password: form.password }),
        address: { street: form.street, city: form.city, state: form.state, zip: form.zip, country: form.country }
      });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1>My Profile</h1>
        <div className="profile-grid">
          <div className="profile-avatar-card card p-5">
            <div className="avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <h3>{user?.name}</h3>
            <p className="text-gray">{user?.email}</p>
            {user?.isAdmin && <span className="badge badge-primary mt-2">Admin</span>}
          </div>

          <form className="card p-5" onSubmit={handleSubmit}>
            <h2>Personal Information</h2>
            <div className="grid-2">
              <div className="form-group">
                <label>Full Name</label>
                <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
            </div>
            <div className="form-group">
              <label>New Password <span className="text-gray fs-sm">(leave blank to keep current)</span></label>
              <input type="password" className="form-control" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" minLength={6} />
            </div>

            <h2 className="mt-4">Shipping Address</h2>
            <div className="form-group">
              <label>Street</label>
              <input className="form-control" value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>City</label>
                <input className="form-control" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>State</label>
                <input className="form-control" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>ZIP</label>
                <input className="form-control" value={form.zip} onChange={e => setForm(f => ({ ...f, zip: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input className="form-control" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
