import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        <Link to={`/products/${product._id}`}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        {discount && <span className="discount-badge">-{discount}%</span>}
        {product.stock === 0 && <span className="out-of-stock-badge">Out of Stock</span>}
        <button
          className={`wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
          onClick={() => toggleWishlist(product)}
        >
          <Heart size={18} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/products/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <div className="product-rating">
          <Star size={14} fill="#ffc107" color="#ffc107" />
          <span>{product.rating?.toFixed(1)}</span>
          <span className="text-gray">({product.numReviews})</span>
        </div>
        <div className="product-price">
          <span className="price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        <button
          className="btn btn-primary add-cart-btn"
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
        >
          <ShoppingCart size={16} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
