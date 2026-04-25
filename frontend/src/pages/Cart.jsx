import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const shipping = cartTotal > 500 ? 0 : 50;
  const tax = +(cartTotal * 0.1).toFixed(2);
  const total = +(cartTotal + shipping + tax).toFixed(2);

  if (cart.length === 0) return (
    <div className="empty-cart">
      <ShoppingBag size={80} color="#ddd" />
      <h2>Your cart is empty</h2>
      <p>Add some products to get started</p>
      <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart <span>({cart.length} items)</span></h1>
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <Link to={`/products/${item._id}`}><h3>{item.name}</h3></Link>
                  <span className="text-gray fs-sm">{item.category}</span>
                  <div className="cart-item-price">₹{item.price.toLocaleString()}</div>
                </div>
                <div className="cart-item-qty">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)}><Minus size={14} /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, Math.min(item.stock, item.quantity + 1))}><Plus size={14} /></button>
                </div>
                <div className="cart-item-total">₹{(item.price * item.quantity).toLocaleString()}</div>
                <button className="remove-btn" onClick={() => removeFromCart(item._id)}><Trash2 size={18} /></button>
              </div>
            ))}
          </div>

          <div className="cart-summary card p-5">
            <h2>Order Summary</h2>
            <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span className="text-success">Free</span> : `₹${shipping}`}</span></div>
            <div className="summary-row"><span>Tax (10%)</span><span>₹{tax}</span></div>
            {shipping > 0 && <p className="free-ship-note">Add ₹{(500 - cartTotal).toFixed(0)} more for free shipping!</p>}
            <div className="summary-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
              Proceed to Checkout <ArrowRight size={18} />
            </Link>
            <Link to="/products" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
