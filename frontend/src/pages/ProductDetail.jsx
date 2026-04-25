import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Truck, Shield, ArrowLeft, Plus, Minus } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/products/${id}`).then(r => { setProduct(r.data); setLoading(false); });
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to review');
    try {
      await api.post(`/products/${id}/reviews`, review);
      toast.success('Review submitted!');
      const r = await api.get(`/products/${id}`);
      setProduct(r.data);
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  if (loading) return <div className="flex-center" style={{ padding: '100px' }}><div className="spinner" /></div>;
  if (!product) return <div className="flex-center" style={{ padding: '100px' }}>Product not found</div>;

  const images = product.images?.length ? product.images : [product.image];
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  return (
    <div className="product-detail">
      <div className="container">
        <Link to="/products" className="back-link"><ArrowLeft size={16} /> Back to Products</Link>

        <div className="detail-grid">
          {/* Images */}
          <div className="detail-images">
            <div className="main-image">
              <img src={images[activeImg]} alt={product.name} />
              {discount && <span className="discount-badge">-{discount}%</span>}
            </div>
            {images.length > 1 && (
              <div className="thumb-list">
                {images.map((img, i) => (
                  <img key={i} src={img} alt="" className={activeImg === i ? 'active' : ''} onClick={() => setActiveImg(i)} />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            <span className="product-category">{product.category}</span>
            <h1>{product.name}</h1>
            <div className="detail-rating">
              {[1,2,3,4,5].map(s => <Star key={s} size={18} fill={s <= product.rating ? '#ffc107' : 'none'} color="#ffc107" />)}
              <span>{product.rating?.toFixed(1)}</span>
              <span className="text-gray">({product.numReviews} reviews)</span>
            </div>
            <div className="detail-price">
              <span className="price">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>}
              {discount && <span className="badge badge-success">{discount}% OFF</span>}
            </div>
            <p className="detail-desc">{product.description}</p>

            {product.tags?.length > 0 && (
              <div className="tags">
                {product.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            )}

            <div className="stock-info">
              {product.stock > 0
                ? <span className="text-success">✓ In Stock ({product.stock} available)</span>
                : <span className="text-danger">✗ Out of Stock</span>}
            </div>

            {product.stock > 0 && (
              <div className="qty-selector">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={16} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}><Plus size={16} /></button>
              </div>
            )}

            <div className="detail-actions">
              <button className="btn btn-primary btn-lg" onClick={() => addToCart(product, qty)} disabled={product.stock === 0}>
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button className={`btn btn-outline wishlist-toggle ${isInWishlist(product._id) ? 'active' : ''}`} onClick={() => toggleWishlist(product)}>
                <Heart size={20} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="detail-features">
              <div><Truck size={18} /> Free shipping on orders over ₹500</div>
              <div><Shield size={18} /> 30-day return policy</div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          {product.reviews?.length === 0 && <p className="text-gray">No reviews yet. Be the first!</p>}
          <div className="reviews-list">
            {product.reviews?.map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-header">
                  <strong>{r.name}</strong>
                  <div className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                  <span className="text-gray fs-sm">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p>{r.comment}</p>
              </div>
            ))}
          </div>

          {user && (
            <form className="review-form" onSubmit={submitReview}>
              <h3>Write a Review</h3>
              <div className="form-group">
                <label>Rating</label>
                <select className="form-control" value={review.rating} onChange={e => setReview(r => ({ ...r, rating: Number(e.target.value) }))}>
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea className="form-control" rows={3} value={review.comment}
                  onChange={e => setReview(r => ({ ...r, comment: e.target.value }))} placeholder="Share your experience..." />
              </div>
              <button type="submit" className="btn btn-primary">Submit Review</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
