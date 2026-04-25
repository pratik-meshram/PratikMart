import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand"><Package size={22} /> PratikMart</div>
          <p>Your one-stop shop for quality products at great prices.</p>
          <div className="footer-contact">
            <span><Mail size={14} /> support@pratikmart.com</span>
            <span><Phone size={14} /> +1 800 123 4567</span>
            <span><MapPin size={14} /> 123 Market St, NY</span>
          </div>
        </div>
        <div>
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/products?category=Electronics">Electronics</Link>
          <Link to="/products?category=Footwear">Footwear</Link>
          <Link to="/products?category=Accessories">Accessories</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/profile">Profile</Link>
        </div>
        <div>
          <h4>Help</h4>
          <a href="#">FAQ</a>
          <a href="#">Shipping Policy</a>
          <a href="#">Return Policy</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 PratikMart. All rights reserved.</p>
      </div>
    </footer>
  );
}
