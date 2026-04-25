# Fix 401 Unauthorized Error

## 🔍 What's the Issue?

The 401 error means you're not authenticated (not logged in) when trying to access the payment endpoint.

## ✅ Quick Fix Steps

### Step 1: Make Sure You're Logged In

1. **Go to the app**: http://localhost:5173
2. **Click "Login"** in the navbar
3. **Login with**:
   - Email: `admin@shop.com`
   - Password: `admin123`
4. **Verify you're logged in**: You should see your name in the navbar

### Step 2: Test Authentication

Open `test-auth.html` in your browser and:

1. **Click "Check User in LocalStorage"**
   - Should show: ✅ User found in localStorage
   - Should show: ✅ Token exists

2. **If no user found, click "Login"**
   - Should show: ✅ Login successful

3. **Click "Test Payment API"**
   - Should show: ✅ Payment order created successfully
   - If you see 401, your token is invalid

### Step 3: Try Checkout Again

1. **Add products to cart**
2. **Go to checkout** (you should already be logged in)
3. **Fill address**
4. **Select payment method**
5. **Click "Place Order"**
6. **Razorpay modal should open** ✅

## 🐛 Troubleshooting

### Issue: Still getting 401 error

**Solution 1: Clear localStorage and login again**
```javascript
// Open browser console (F12)
localStorage.clear();
// Then login again
```

**Solution 2: Check if token exists**
```javascript
// Open browser console (F12)
const user = JSON.parse(localStorage.getItem('user'));
console.log(user);
// Should show: { _id, name, email, token, isAdmin }
```

**Solution 3: Verify backend is running**
```bash
# Should be running on port 3000
curl http://localhost:3000/api/payment/key
# Should return: {"key":"rzp_test_..."}
```

### Issue: Token expired

**Solution: Login again**
1. Logout (click your name → Logout)
2. Login again
3. Try checkout

### Issue: User not found in localStorage

**Solution: Register or Login**
1. Go to http://localhost:5173/login
2. Login or Register
3. Try checkout again

## 🔧 What I Fixed

### 1. Added User Check in Checkout
```javascript
// Check if user is logged in
if (!user) {
  toast.error('Please login to continue');
  navigate('/login');
  return null;
}
```

### 2. Added Token Check Before Payment
```javascript
// Check if user is authenticated
if (!user || !user.token) {
  toast.error('Please login to continue with payment');
  navigate('/login');
  setLoading(false);
  return;
}
```

### 3. Added Better 401 Error Handling
```javascript
// Handle 401 Unauthorized
if (err.response?.status === 401) {
  toast.error('Session expired. Please login again.');
  localStorage.removeItem('user');
  navigate('/login');
}
```

## 📋 Complete Test Flow

### Test 1: COD (No Razorpay)
1. ✅ Login
2. ✅ Add to cart
3. ✅ Checkout
4. ✅ Fill address
5. ✅ Select COD
6. ✅ Place order
7. ✅ Order created

### Test 2: Online Payment (Razorpay)
1. ✅ Login
2. ✅ Add to cart
3. ✅ Checkout
4. ✅ Fill address
5. ✅ Select UPI/Card
6. ✅ Place order
7. ✅ Razorpay modal opens
8. ✅ Complete payment
9. ✅ Order created

## 🎯 Expected Behavior

### When Logged In:
- ✅ Can access checkout
- ✅ Can place COD orders
- ✅ Can initiate online payments
- ✅ Razorpay modal opens

### When Not Logged In:
- ❌ Redirected to login page
- ❌ Cannot access checkout
- ❌ Cannot place orders

## 🔑 Authentication Flow

```
1. User logs in
   ↓
2. Token saved to localStorage
   ↓
3. Axios interceptor adds token to requests
   ↓
4. Backend verifies token
   ↓
5. Request succeeds ✅
```

## 📝 Debug Commands

### Check if logged in:
```javascript
// Browser console (F12)
const user = JSON.parse(localStorage.getItem('user'));
console.log('User:', user);
console.log('Token:', user?.token);
```

### Check token in request:
```javascript
// Browser console → Network tab
// Look for: Authorization: Bearer <token>
```

### Test backend auth:
```bash
# Get your token from localStorage
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/payment/create-order \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"currency":"INR"}'
```

## ✅ Success Indicators

### Authentication Working:
- ✅ User name shows in navbar
- ✅ Can access checkout page
- ✅ Token exists in localStorage
- ✅ No 401 errors in console

### Payment Working:
- ✅ No 401 errors
- ✅ Razorpay modal opens
- ✅ Can complete payment
- ✅ Order created successfully

## 🚨 Common Mistakes

1. **Not logged in** → Login first
2. **Token expired** → Login again
3. **Wrong credentials** → Use admin@shop.com / admin123
4. **Backend not running** → Start backend
5. **Old token in localStorage** → Clear and login again

## 🎉 Summary

The 401 error happens when:
- You're not logged in
- Your token is expired
- Your token is invalid

**Solution**: Just login and try again!

Use `test-auth.html` to diagnose authentication issues quickly.
