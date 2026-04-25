# Testing Guide - Razorpay & Validation

## 🧪 How to Test Razorpay Payment Gateway

### Step 1: Verify Razorpay Script is Loaded
1. Open browser console (F12)
2. Type: `window.Razorpay`
3. Should show: `ƒ Razorpay(options)`
4. If undefined, refresh the page

### Step 2: Test COD (Cash on Delivery)
1. Add products to cart
2. Go to checkout
3. Fill shipping address (all fields required)
4. Select "Cash on Delivery"
5. Click "Place Order"
6. ✅ Order should be created immediately

### Step 3: Test UPI Payment
1. Add products to cart
2. Go to checkout
3. Fill shipping address
4. Select "UPI Payment"
5. Click "Place Order"
6. **Razorpay modal should open**
7. Use test UPI: `success@razorpay`
8. Click Pay
9. ✅ Payment should succeed and order created

### Step 4: Test Card Payment
1. Add products to cart
2. Go to checkout
3. Fill shipping address
4. Select "Credit / Debit Card"
5. Click "Place Order"
6. **Razorpay modal should open**
7. Enter test card details:
   - Card: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: `12/25`
   - Name: `Test User`
8. Click Pay
9. ✅ Payment should succeed and order created

## 🔍 Troubleshooting Razorpay

### Issue: Razorpay modal not opening

**Check 1: Script loaded?**
```javascript
// In browser console
console.log(window.Razorpay);
// Should show function, not undefined
```

**Check 2: Backend running?**
```bash
# Terminal should show:
Server running on port 3000
```

**Check 3: Check browser console for errors**
```
F12 → Console tab
Look for red errors
```

**Check 4: Verify .env file**
```env
RAZORPAY_KEY_ID=rzp_test_xgEX35fP55p1Lk
RAZORPAY_SECRET=LAaF2o1kYTFfcoi0pU0qJma5
```

**Check 5: Test API endpoint**
```bash
# In terminal
curl http://localhost:3000/api/payment/key
# Should return: {"key":"rzp_test_xgEX35fP55p1Lk"}
```

### Issue: Payment verification fails

**Solution**: Check backend logs
```bash
# Backend terminal should show:
Razorpay order created: { orderId: 'order_xxx', ... }
Payment successful: { razorpay_order_id: 'order_xxx', ... }
```

### Issue: Order not created after payment

**Check**: Browser console for errors
```javascript
// Should see:
Payment successful: {...}
Order placed successfully!
```

## ✅ Form Validation Testing

### Test Address Validation

**Test 1: Empty fields**
1. Go to checkout
2. Leave all fields empty
3. Click "Continue to Payment"
4. ✅ Should show error: "Please fill all required fields correctly"
5. ✅ Red borders on empty fields
6. ✅ Error messages below fields

**Test 2: Invalid phone**
1. Enter phone: `123`
2. Click "Continue to Payment"
3. ✅ Should show: "Please enter a valid 10-digit phone number"

**Test 3: Invalid ZIP**
1. Enter ZIP: `12`
2. Click "Continue to Payment"
3. ✅ Should show: "Please enter a valid ZIP code"

**Test 4: Short name**
1. Enter name: `A`
2. Click "Continue to Payment"
3. ✅ Should show: "Name must be at least 2 characters"

**Test 5: Short street**
1. Enter street: `123`
2. Click "Continue to Payment"
3. ✅ Should show: "Street address must be at least 5 characters"

**Test 6: Valid data**
1. Fill all fields correctly:
   - Name: `John Doe`
   - Phone: `9876543210`
   - Street: `123 Main Street`
   - City: `Mumbai`
   - State: `Maharashtra`
   - ZIP: `400001`
   - Country: `India`
2. Click "Continue to Payment"
3. ✅ Should move to step 2 (Payment Method)

### Test Real-time Validation
1. Enter invalid phone: `123`
2. See error message
3. Type correct phone: `9876543210`
4. ✅ Error should disappear immediately

## 📊 Complete Test Checklist

### Frontend Tests
- [ ] Razorpay script loads
- [ ] COD order works
- [ ] UPI payment modal opens
- [ ] Card payment modal opens
- [ ] Payment success creates order
- [ ] Payment cancel shows error
- [ ] Form validation shows errors
- [ ] Error messages clear on input
- [ ] All fields validated
- [ ] Loading states work
- [ ] Toast notifications show

### Backend Tests
- [ ] `/api/payment/key` returns key
- [ ] `/api/payment/create-order` creates order
- [ ] `/api/payment/verify-payment` verifies signature
- [ ] `/api/orders` creates order with payment details
- [ ] Validation errors returned properly
- [ ] Console logs show payment flow

### Mobile Tests
- [ ] Razorpay modal works on mobile
- [ ] Form validation works on mobile
- [ ] Touch interactions work
- [ ] Responsive layout correct

## 🎯 Expected Behavior

### COD Flow:
```
1. Fill address → 2. Select COD → 3. Review → 4. Place Order
→ Order created immediately
→ Payment status: pending
```

### Online Payment Flow:
```
1. Fill address → 2. Select UPI/Card → 3. Review → 4. Place Order
→ Razorpay modal opens
→ Enter payment details
→ Payment processed
→ Signature verified
→ Order created
→ Payment status: paid
```

## 🔧 Debug Commands

### Check if backend is running:
```bash
curl http://localhost:3000/api/payment/key
```

### Check MongoDB connection:
```bash
mongo
> use ecommerceDB
> db.orders.find().pretty()
```

### Check browser console:
```javascript
// Check Razorpay
console.log(window.Razorpay);

// Check API calls
// Network tab → Filter: XHR
// Should see: create-order, verify-payment
```

### Backend logs to watch:
```
Razorpay order created: {...}
Payment successful: {...}
Order created: {...}
```

## 📝 Test Data

### Valid Address:
```
Name: John Doe
Phone: 9876543210
Street: 123 Main Street, Apartment 4B
City: Mumbai
State: Maharashtra
ZIP: 400001
Country: India
```

### Test Payment Credentials:

**Card (Success):**
```
Card: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
Name: Test User
```

**UPI (Success):**
```
UPI ID: success@razorpay
```

**UPI (Failure):**
```
UPI ID: failure@razorpay
```

## ✅ Success Indicators

### Payment Success:
- ✅ Razorpay modal closes
- ✅ Toast: "Order placed successfully!"
- ✅ Redirects to order detail page
- ✅ Cart is cleared
- ✅ Order shows in "My Orders"
- ✅ Payment status: "paid"

### Validation Success:
- ✅ No error messages
- ✅ No red borders
- ✅ Moves to next step
- ✅ Form submits successfully

## 🚨 Common Errors & Solutions

### Error: "Payment gateway not loaded"
**Solution**: Refresh page, check internet connection

### Error: "Payment verification failed"
**Solution**: Check RAZORPAY_SECRET in .env

### Error: "Failed to create order"
**Solution**: Check MongoDB is running, check backend logs

### Error: "Please fill all required fields"
**Solution**: Fill all fields with valid data

### Error: Network request failed
**Solution**: Check backend is running on port 3000

## 📞 Need Help?

1. Check browser console (F12)
2. Check backend terminal logs
3. Verify .env file
4. Test with curl commands
5. Check MongoDB connection
6. Restart backend server
7. Clear browser cache
8. Try incognito mode

## 🎉 All Tests Passing?

If all tests pass:
- ✅ Razorpay integration working
- ✅ Form validation working
- ✅ Order creation working
- ✅ Payment verification working
- ✅ Ready for production!

Remember to switch to **live Razorpay keys** before going to production! 🚀
