# Razorpay Payment Gateway Integration

## ✅ Features Implemented

### 1. **Payment Methods**
- **COD (Cash on Delivery)** - Direct order placement
- **UPI** - Razorpay payment gateway
- **Card** - Credit/Debit card via Razorpay

### 2. **Payment Flow**
1. User selects payment method in checkout
2. For online payments (UPI/Card):
   - Creates Razorpay order on backend
   - Opens Razorpay payment modal
   - User completes payment
   - Backend verifies payment signature
   - Order created with payment details
3. For COD:
   - Direct order placement
   - Payment status: pending

### 3. **Security**
- Payment signature verification using HMAC SHA256
- Secure key storage in environment variables
- Payment details stored in order model
- Protected API routes (authentication required)

## 🔧 Configuration

### Backend (.env)
```env
RAZORPAY_KEY_ID=rzp_test_xgEX35fP55p1Lk
RAZORPAY_SECRET=LAaF2o1kYTFfcoi0pU0qJma5
JWT_SECRET=PRATIK0021
```

### Frontend
Razorpay checkout script automatically loaded in `index.html`

## 📦 Installation

```bash
# Backend
cd backend
npm install

# This installs: razorpay@^2.9.2
```

## 🚀 Usage

### For Customers:

1. **Add items to cart**
2. **Go to checkout**
3. **Fill shipping address**
4. **Select payment method**:
   - **COD**: Order placed immediately
   - **UPI/Card**: Razorpay modal opens
5. **Complete payment** (for online methods)
6. **Order confirmed** with payment details

### Testing Razorpay (Test Mode):

**Test Card Details:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

**Test UPI:**
- UPI ID: `success@razorpay`
- This will simulate successful payment

**Test Failure:**
- UPI ID: `failure@razorpay`
- This will simulate failed payment

## 📁 File Structure

```
backend/
├── routes/
│   └── payment.js           # Razorpay routes
├── models/
│   └── Order.js            # Updated with payment details
└── .env                    # Razorpay credentials

frontend/
├── src/
│   └── pages/
│       └── Checkout.jsx    # Razorpay integration
└── index.html              # Razorpay script
```

## 🔌 API Endpoints

### POST `/api/payment/create-order`
Creates Razorpay order
```json
Request: { "amount": 1000, "currency": "INR" }
Response: {
  "orderId": "order_xxx",
  "amount": 100000,
  "currency": "INR",
  "keyId": "rzp_test_xxx"
}
```

### POST `/api/payment/verify-payment`
Verifies payment signature
```json
Request: {
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
Response: {
  "success": true,
  "message": "Payment verified successfully",
  "paymentId": "pay_xxx"
}
```

### GET `/api/payment/key`
Returns Razorpay key for frontend
```json
Response: { "key": "rzp_test_xxx" }
```

## 💾 Order Model Updates

```javascript
{
  paymentMethod: String,        // 'COD', 'UPI', 'Card'
  paymentStatus: String,        // 'pending', 'paid', 'failed'
  paymentDetails: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String
  }
}
```

## 📱 Responsive Design

### Mobile Optimizations:
- ✅ Responsive navbar with hamburger menu
- ✅ Mobile-friendly product grid (1 column on mobile)
- ✅ Touch-optimized buttons and forms
- ✅ Collapsible filters on mobile
- ✅ Responsive admin panel with floating menu button
- ✅ Mobile-optimized tables with horizontal scroll
- ✅ Responsive checkout flow
- ✅ Mobile-friendly payment modal

### Breakpoints:
- **Desktop**: > 768px
- **Tablet**: 481px - 768px
- **Mobile**: ≤ 480px

### Admin Panel Mobile Features:
- Floating menu button (bottom right)
- Slide-in sidebar
- Overlay backdrop
- Touch-friendly navigation
- Responsive tables with scroll
- Single column layouts on mobile

## 🎨 Payment UI

### Razorpay Modal Features:
- Brand name: "PratikMart"
- Brand color: #6c63ff (primary color)
- Pre-filled customer details
- Multiple payment options
- Secure payment processing
- Success/failure callbacks

## 🔒 Security Best Practices

1. **Never expose Razorpay secret** in frontend
2. **Always verify payment** on backend
3. **Use HTTPS** in production
4. **Store payment details** securely
5. **Validate amounts** before creating orders
6. **Handle payment failures** gracefully

## 🧪 Testing Checklist

- [ ] COD order placement works
- [ ] Razorpay modal opens for UPI/Card
- [ ] Test card payment succeeds
- [ ] Payment verification works
- [ ] Order created with payment details
- [ ] Payment failure handled properly
- [ ] Mobile responsive on all pages
- [ ] Admin panel mobile menu works
- [ ] Tables scroll on mobile
- [ ] Forms work on touch devices

## 🚨 Common Issues

### Issue: Razorpay modal not opening
**Solution**: Check if Razorpay script is loaded in index.html

### Issue: Payment verification fails
**Solution**: Verify RAZORPAY_SECRET is correct in .env

### Issue: Amount mismatch
**Solution**: Ensure amount is in paise (multiply by 100)

### Issue: Mobile menu not working
**Solution**: Check z-index and overlay click handler

## 📞 Support

For Razorpay issues:
- Docs: https://razorpay.com/docs/
- Dashboard: https://dashboard.razorpay.com/
- Support: support@razorpay.com

## 🎯 Production Checklist

Before going live:
1. Replace test keys with live keys
2. Enable HTTPS
3. Test with real payment methods
4. Set up webhooks for payment notifications
5. Implement refund handling
6. Add payment failure retry logic
7. Set up payment analytics
8. Test on multiple devices and browsers
9. Verify mobile responsiveness
10. Test admin panel on mobile devices
