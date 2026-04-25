import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Checkout.css';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [address, setAddress] = useState({
    name: user?.name || '', 
    street: '', 
    city: '', 
    state: '', 
    zip: '', 
    country: 'India', 
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const shipping = cartTotal > 500 ? 0 : 50;
  const tax = +(cartTotal * 0.1).toFixed(2);
  const total = +(cartTotal + shipping + tax).toFixed(2);

  // Check if user is logged in
  if (!user) {
    toast.error('Please login to continue');
    navigate('/login');
    return null;
  }

  const handleAddress = (e) => {
    const { name, value } = e.target;
    setAddress(a => ({ ...a, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateAddress = () => {
    const newErrors = {};
    
    if (!address.name || address.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!address.phone || !/^[0-9]{10}$/.test(address.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!address.street || address.street.trim().length < 5) {
      newErrors.street = 'Street address must be at least 5 characters';
    }
    if (!address.city || address.city.trim().length < 2) {
      newErrors.city = 'City is required';
    }
    if (!address.state || address.state.trim().length < 2) {
      newErrors.state = 'State is required';
    }
    if (!address.zip || !/^[0-9]{5,6}$/.test(address.zip)) {
      newErrors.zip = 'Please enter a valid ZIP code';
    }
    if (!address.country || address.country.trim().length < 2) {
      newErrors.country = 'Country is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateAddress()) {
      setStep(2);
    } else {
      toast.error('Please fill all required fields correctly');
    }
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const items = cart.map(i => ({
        product: i._id, 
        name: i.name, 
        image: i.image, 
        price: i.price, 
        quantity: i.quantity
      }));

      // If payment method is online (UPI/Card), initiate Razorpay
      if (paymentMethod === 'UPI' || paymentMethod === 'Card') {
        await handleRazorpayPayment(items);
      } else {
        // COD - direct order placement
        await createOrder(items, { paymentStatus: 'pending' });
      }
    } catch (err) {
      console.error('Order placement error:', err);
      toast.error(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async (items) => {
    try {
      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        toast.error('Payment gateway not loaded. Please refresh the page.');
        setLoading(false);
        return;
      }

      // Check if user is authenticated
      if (!user || !user.token) {
        toast.error('Please login to continue with payment');
        navigate('/login');
        setLoading(false);
        return;
      }

      console.log('Creating Razorpay order for amount:', total);

      // Create Razorpay order
      const { data: orderData } = await api.post('/payment/create-order', { 
        amount: total,
        currency: 'INR'
      });

      console.log('Razorpay order created:', orderData);

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'PratikMart',
        description: 'Order Payment',
        order_id: orderData.orderId,
        handler: async function (response) {
          console.log('Payment successful:', response);
          try {
            // Verify payment
            const { data: verifyData } = await api.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyData.success) {
              // Create order with payment details
              await createOrder(items, {
                paymentStatus: 'paid',
                paymentDetails: {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature
                }
              });
            } else {
              toast.error('Payment verification failed');
              setLoading(false);
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            toast.error('Payment verification failed');
            setLoading(false);
          }
        },
        prefill: {
          name: address.name,
          email: user?.email || '',
          contact: address.phone
        },
        theme: { 
          color: '#6c63ff',
          backdrop_color: 'rgba(0, 0, 0, 0.5)'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment cancelled by user');
            toast.error('Payment cancelled');
            setLoading(false);
          }
        }
      };

      console.log('Opening Razorpay with options:', options);
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      razorpay.open();
    } catch (err) {
      console.error('Razorpay error:', err);
      
      // Handle 401 Unauthorized
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        toast.error(err.response?.data?.message || 'Payment initialization failed');
      }
      
      setLoading(false);
    }
  };

  const createOrder = async (items, paymentInfo = {}) => {
    try {
      const { data } = await api.post('/orders', {
        items,
        shippingAddress: address,
        paymentMethod,
        ...paymentInfo
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      console.error('Order creation error:', err);
      toast.error(err.response?.data?.message || 'Failed to create order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          {['Shipping', 'Payment', 'Review'].map((s, i) => (
            <div key={s} className={`step ${step > i + 1 ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <div className="step-num">{step > i + 1 ? <CheckCircle size={18} /> : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-form">
            {step === 1 && (
              <div className="card p-5">
                <h2><Truck size={20} /> Shipping Address</h2>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      name="name" 
                      className={`form-control ${errors.name ? 'error' : ''}`}
                      value={address.name} 
                      onChange={handleAddress} 
                      placeholder="John Doe"
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input 
                      name="phone" 
                      type="tel"
                      className={`form-control ${errors.phone ? 'error' : ''}`}
                      value={address.phone} 
                      onChange={handleAddress}
                      placeholder="9876543210"
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label>Street Address *</label>
                  <input 
                    name="street" 
                    className={`form-control ${errors.street ? 'error' : ''}`}
                    value={address.street} 
                    onChange={handleAddress}
                    placeholder="123 Main Street, Apartment 4B"
                  />
                  {errors.street && <span className="error-text">{errors.street}</span>}
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label>City *</label>
                    <input 
                      name="city" 
                      className={`form-control ${errors.city ? 'error' : ''}`}
                      value={address.city} 
                      onChange={handleAddress}
                      placeholder="Mumbai"
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input 
                      name="state" 
                      className={`form-control ${errors.state ? 'error' : ''}`}
                      value={address.state} 
                      onChange={handleAddress}
                      placeholder="Maharashtra"
                    />
                    {errors.state && <span className="error-text">{errors.state}</span>}
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input 
                      name="zip" 
                      className={`form-control ${errors.zip ? 'error' : ''}`}
                      value={address.zip} 
                      onChange={handleAddress}
                      placeholder="400001"
                    />
                    {errors.zip && <span className="error-text">{errors.zip}</span>}
                  </div>
                  <div className="form-group">
                    <label>Country *</label>
                    <input 
                      name="country" 
                      className={`form-control ${errors.country ? 'error' : ''}`}
                      value={address.country} 
                      onChange={handleAddress}
                      placeholder="India"
                    />
                    {errors.country && <span className="error-text">{errors.country}</span>}
                  </div>
                </div>
                <button 
                  className="btn btn-primary btn-lg" 
                  onClick={handleContinueToPayment}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="card p-5">
                <h2><CreditCard size={20} /> Payment Method</h2>
                <div className="payment-options">
                  {[
                    { value: 'COD', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
                    { value: 'UPI', label: 'UPI Payment', icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
                    { value: 'Card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, Amex' },
                  ].map(opt => (
                    <label key={opt.value} className={`payment-option ${paymentMethod === opt.value ? 'active' : ''}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value={opt.value} 
                        checked={paymentMethod === opt.value}
                        onChange={() => setPaymentMethod(opt.value)} 
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <span className="pay-icon">{opt.icon}</span>
                        <div>
                          <div style={{ fontWeight: '600' }}>{opt.label}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{opt.desc}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {(paymentMethod === 'UPI' || paymentMethod === 'Card') && (
                  <div style={{ 
                    background: '#f0eeff', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    marginTop: '16px',
                    fontSize: '13px',
                    color: '#6c63ff'
                  }}>
                    <strong>Test Mode:</strong> Use test credentials for payment
                  </div>
                )}
                <div className="checkout-nav">
                  <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                  <button className="btn btn-primary btn-lg" onClick={() => setStep(3)}>Review Order</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card p-5">
                <h2>Review Your Order</h2>
                <div className="review-address">
                  <h4>Shipping to:</h4>
                  <p><strong>{address.name}</strong> • {address.phone}</p>
                  <p>{address.street}</p>
                  <p>{address.city}, {address.state} {address.zip}</p>
                  <p>{address.country}</p>
                </div>
                <div className="review-payment">
                  <h4>Payment Method: {paymentMethod}</h4>
                  {paymentMethod === 'COD' && <p style={{ fontSize: '13px', color: '#666' }}>Pay ₹{total} when you receive your order</p>}
                  {(paymentMethod === 'UPI' || paymentMethod === 'Card') && (
                    <p style={{ fontSize: '13px', color: '#666' }}>You will be redirected to payment gateway</p>
                  )}
                </div>
                <div className="review-items">
                  <h4>Order Items:</h4>
                  {cart.map(item => (
                    <div key={item._id} className="review-item">
                      <img src={item.image} alt={item.name} />
                      <span className="review-item-name">{item.name} × {item.quantity}</span>
                      <span className="review-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="checkout-nav">
                  <button className="btn btn-outline" onClick={() => setStep(2)} disabled={loading}>Back</button>
                  <button 
                    className="btn btn-primary btn-lg" 
                    onClick={placeOrder} 
                    disabled={loading}
                    style={{ minWidth: '200px' }}
                  >
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                        Processing...
                      </span>
                    ) : (
                      `Place Order — ₹${total.toLocaleString()}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="checkout-summary card p-5">
            <h3>Order Summary</h3>
            {cart.map(item => (
              <div key={item._id} className="summary-item">
                <img src={item.image} alt={item.name} />
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="summary-divider" />
            <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span className="text-success">Free</span> : `₹${shipping}`}</span></div>
            <div className="summary-row"><span>Tax (10%)</span><span>₹{tax.toLocaleString()}</span></div>
            <div className="summary-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
