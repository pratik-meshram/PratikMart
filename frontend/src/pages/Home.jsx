import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import './Home.css';

const categories = [
  { name: 'Electronics', icon: '💻', color: '#e8e6ff' },
  { name: 'Footwear', icon: '👟', color: '#ffe8e8' },
  { name: 'Accessories', icon: '👜', color: '#e8f5e9' },
  { name: 'Bags', icon: '🎒', color: '#fff3e0' },
  { name: 'Sports', icon: '⚽', color: '#e3f2fd' },
  { name: 'Home', icon: '🏠', color: '#fce4ec' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/featured').then(r => { setFeatured(r.data); setLoading(false); });
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-tag">New Arrivals 2024</span>
            <h1>Discover Amazing Products at Great Prices</h1>
            <p>Shop the latest trends in electronics, fashion, and more. Free shipping on orders over ₹500.</p>
            <div className="hero-btns">
              <Link to="/products" className="btn btn-primary btn-lg">Shop Now <ArrowRight size={18} /></Link>
              <Link to="/products?featured=true" className="btn btn-outline btn-lg">View Deals</Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600" alt="Shopping" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container features-grid">
          {[
            { icon: <Truck size={28} />, title: 'Free Shipping', desc: 'On orders over ₹500' },
            { icon: <Shield size={28} />, title: 'Secure Payment', desc: '100% secure transactions' },
            { icon: <RefreshCw size={28} />, title: 'Easy Returns', desc: '30-day return policy' },
            { icon: <Headphones size={28} />, title: '24/7 Support', desc: 'Always here to help' },
          ].map((f, i) => (
            <div key={i} className="feature-item">
              <div className="feature-icon">{f.icon}</div>
              <div><h4>{f.title}</h4><p>{f.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <Link to="/products" className="see-all">See All <ArrowRight size={16} /></Link>
          </div>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link key={cat.name} to={`/products?category=${cat.name}`} className="category-card" style={{ background: cat.color }}>
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products" className="see-all">View All <ArrowRight size={16} /></Link>
          </div>
          {loading ? (
            <div className="flex-center" style={{ padding: '60px' }}><div className="spinner" /></div>
          ) : (
            <div className="grid-4">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Banner */}
      <section className="promo-banner">
        <div className="container promo-content">
          <div>
            <h2>Special Offer — Up to 50% Off!</h2>
            <p>Limited time deals on top products. Don't miss out.</p>
            <Link to="/products" className="btn btn-primary btn-lg">Shop the Sale</Link>
          </div>
          <img src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400" alt="Sale" />
        </div>
      </section>
    </div>
  );
}
