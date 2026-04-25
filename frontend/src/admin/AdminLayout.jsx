import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Store, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="admin-brand">
          <Store size={22} /> Admin Panel
        </div>
        <div className="admin-user">
          <div className="admin-avatar">{user?.name?.[0]}</div>
          <div>
            <div className="admin-user-name">{user?.name}</div>
            <div className="admin-user-role">Administrator</div>
          </div>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end onClick={closeMobileMenu}><LayoutDashboard size={18} /> Dashboard</NavLink>
          <NavLink to="/admin/products" onClick={closeMobileMenu}><Package size={18} /> Products</NavLink>
          <NavLink to="/admin/orders" onClick={closeMobileMenu}><ShoppingBag size={18} /> Orders</NavLink>
          <NavLink to="/admin/users" onClick={closeMobileMenu}><Users size={18} /> Users</NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <NavLink to="/" onClick={closeMobileMenu}><Store size={16} /> View Store</NavLink>
          <button onClick={handleLogout}><LogOut size={16} /> Logout</button>
        </div>
      </aside>
      
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.5)', 
            zIndex: 99 
          }} 
          onClick={closeMobileMenu}
        />
      )}
      
      {/* Mobile menu toggle */}
      <button className="admin-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
