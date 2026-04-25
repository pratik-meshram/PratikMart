# Quick Reference Card

## 🚀 Start Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Admin: http://localhost:5173/admin

## 🔑 Login Credentials

**Admin:**
- Email: `admin@shop.com`
- Password: `admin123`

## 💳 Test Payment

**Card (Success):**
```
Card: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
```

**UPI (Success):**
```
UPI ID: success@razorpay
```

## ✅ Quick Tests

### Test Razorpay:
```bash
# 1. Open check-razorpay.html in browser
# 2. Click "Check Script" → Should be ✅
# 3. Click "Test Payment" → Modal should open
```

### Test Validation:
```
1. Go to checkout
2. Leave fields empty
3. Click "Continue"
4. Should show red borders + errors
```

### Test Order Flow:
```
1. Add products to cart
2. Checkout → Fill address
3. Select payment method
4. Place order
5. Check "My Orders"
```

## 🔍 Debug Commands

**Check Razorpay Script:**
```javascript
// Browser console
console.log(window.Razorpay);
// Should show: ƒ Razorpay(options)
```

**Check Backend:**
```bash
curl http://localhost:3000/api/payment/key
# Should return: {"key":"rzp_test_..."}
```

**Check MongoDB:**
```bash
mongo
> use ecommerceDB
> db.orders.find().pretty()
```

## 🐛 Common Fixes

**Razorpay not opening?**
```
1. Refresh page (Ctrl+R)
2. Check console for errors (F12)
3. Verify backend is running
4. Check .env file
```

**Validation not working?**
```
1. Clear browser cache
2. Check console for errors
3. Verify CSS is loaded
4. Try incognito mode
```

**Backend not starting?**
```
1. Check MongoDB is running
2. Check port 3000 is free
3. Run: npm install
4. Check .env file exists
```

## 📁 Important Files

**Backend:**
- `backend/.env` - Environment variables
- `backend/routes/payment.js` - Razorpay routes
- `backend/server.js` - Main server

**Frontend:**
- `frontend/src/pages/Checkout.jsx` - Checkout page
- `frontend/index.html` - Razorpay script
- `frontend/src/api/axios.js` - API config

## 🔧 Environment Variables

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/ecommerceDB
JWT_SECRET=PRATIK0021
ADMIN_EMAIL=admin@shop.com
ADMIN_PASSWORD=admin123
RAZORPAY_KEY_ID=rzp_test_xgEX35fP55p1Lk
RAZORPAY_SECRET=LAaF2o1kYTFfcoi0pU0qJma5
```

## 📚 Documentation

- **README.md** - Main documentation
- **SETUP_GUIDE.md** - Setup instructions
- **TESTING_GUIDE.md** - Testing instructions
- **FIXES_APPLIED.md** - Recent fixes
- **RAZORPAY_INTEGRATION.md** - Payment guide
- **RESPONSIVE_DESIGN.md** - Responsive details

## 🎯 Feature Checklist

- [x] Product browsing
- [x] Shopping cart
- [x] User authentication
- [x] Checkout process
- [x] Form validation
- [x] Razorpay payment (COD/UPI/Card)
- [x] Order tracking
- [x] Admin panel
- [x] Image upload
- [x] Responsive design

## 📱 Mobile Testing

**Open DevTools:**
```
F12 → Toggle Device Toolbar
Select: iPhone 12 Pro
Test: Menu, Cart, Checkout, Admin
```

## 🚨 Emergency Commands

**Kill port 3000:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

**Reset database:**
```bash
cd backend
node seed.js
```

**Reinstall dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## ✅ Success Indicators

**Razorpay Working:**
- ✅ Modal opens
- ✅ Can enter payment details
- ✅ Payment succeeds
- ✅ Order created

**Validation Working:**
- ✅ Red borders on errors
- ✅ Error messages show
- ✅ Errors clear on input
- ✅ Can't submit invalid data

## 📞 Quick Help

**Issue:** Razorpay not loading
**Fix:** Refresh page, check internet

**Issue:** Validation not showing
**Fix:** Clear cache, check console

**Issue:** Backend error
**Fix:** Check MongoDB, restart server

**Issue:** Can't login
**Fix:** Run `npm run migrate:admin`

## 🎉 All Working?

If everything works:
- ✅ Products load
- ✅ Cart works
- ✅ Checkout validates
- ✅ Razorpay opens
- ✅ Orders created
- ✅ Admin panel works

**You're ready to sell! 🛍️**

---

**Need detailed help?** Check TESTING_GUIDE.md
**Need setup help?** Check SETUP_GUIDE.md
**Need payment help?** Check RAZORPAY_INTEGRATION.md
