import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu, X, Package, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${search}`);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <Package size={24} /> PratikMart
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text" placeholder="Search products..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
          <button type="submit"><Search size={18} /></button>
        </form>

        <div className="navbar-actions">
          <Link to="/wishlist" className="nav-icon-btn">
            <Heart size={22} />
          </Link>
          <Link to="/cart" className="nav-icon-btn cart-btn">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-dropdown" onMouseLeave={() => setDropdownOpen(false)}>
              <button className="nav-icon-btn user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <User size={22} />
                <span className="user-name">{user.name?.split(' ')[0] || 'User'}</span>
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}><User size={16} /> Profile</Link>
                  <Link to="/orders" onClick={() => setDropdownOpen(false)}><Package size={16} /> My Orders</Link>
                  {user.isAdmin && <Link to="/admin" onClick={() => setDropdownOpen(false)}><Settings size={16} /> Admin Panel</Link>}
                  <button onClick={() => { logout(); setDropdownOpen(false); }}><LogOut size={16} /> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
          )}

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <form onSubmit={handleSearch}>
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          <button type="submit">Search</button>
        </form>
        <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
        <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart ({cartCount})</Link>
        <Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
        {user ? (
          <>
            <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
            <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
            {user.isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
            <button onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
          </>
        ) : (
          <Link to="/login" onClick={() => setMenuOpen(false)}>Login / Register</Link>
        )}
      </div>
    </nav>
  );
}
