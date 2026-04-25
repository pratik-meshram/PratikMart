import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { wishlist } = useCart();

  return (
    <div style={{ padding: '30px 0 60px' }}>
      <div className="container">
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>
          My Wishlist ({wishlist.length})
        </h1>
        {wishlist.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Heart size={80} color="#ddd" />
            <h2 style={{ marginTop: '16px', fontSize: '22px' }}>Your wishlist is empty</h2>
            <p style={{ color: 'var(--gray)', margin: '8px 0 20px' }}>Save products you love</p>
            <Link to="/products" className="btn btn-primary btn-lg">Browse Products</Link>
          </div>
        ) : (
          <div className="grid-4">
            {wishlist.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
