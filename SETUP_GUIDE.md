# Complete Setup Guide

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally)
- Git

### Step-by-Step Setup

#### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

#### 2. Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

#### 3. Seed Database
```bash
cd backend
node seed.js
```
This creates:
- Admin user (admin@shop.com / admin123)
- 20 sample products

#### 4. Start Backend
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:3000

#### 5. Start Frontend (new terminal)
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

## ✅ Verify Installation

### Test Customer Flow:
1. Go to http://localhost:5173
2. Browse products
3. Add to cart
4. Register/Login
5. Complete checkout with COD

### Test Admin Panel:
1. Go to http://localhost:5173/login
2. Login: admin@shop.com / admin123
3. Click "Admin Panel" in dropdown
4. Add a product with image upload
5. View orders and stats

### Test Razorpay Payment:
1. Add items to cart
2. Go to checkout
3. Select UPI or Card
4. Use test credentials:
   - Card: 4111 1111 1111 1111
   - UPI: success@razorpay
5. Complete payment

## 📱 Test Responsive Design

### Desktop (> 768px)
- Open in browser
- All features visible
- Multi-column layouts

### Mobile (< 768px)
- Open DevTools (F12)
- Toggle device toolbar
- Select iPhone/Android
- Test hamburger menu
- Test admin floating menu

## 🔧 Configuration

### Environment Variables (.env)
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/ecommerceDB
JWT_SECRET=PRATIK0021
ADMIN_EMAIL=admin@shop.com
ADMIN_PASSWORD=admin123
RAZORPAY_KEY_ID=rzp_test_xgEX35fP55p1Lk
RAZORPAY_SECRET=LAaF2o1kYTFfcoi0pU0qJma5
```

### Change Admin Credentials
Edit `.env` file:
```env
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=yourpassword
```
Then run:
```bash
npm run migrate:admin
```

### Change Razorpay Keys
1. Get keys from https://dashboard.razorpay.com/
2. Update `.env` file
3. Restart backend

## 📦 Project Structure

```
ecommerce/
├── backend/
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── migrations/
│   │   ├── createAdmin.js
│   │   └── seedProducts.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── admin.js
│   │   └── payment.js
│   ├── uploads/          # Product images
│   ├── .env
│   ├── server.js
│   └── seed.js
│
└── frontend/
    ├── src/
    │   ├── admin/
    │   │   ├── AdminLayout.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminProducts.jsx
    │   │   ├── AdminOrders.jsx
    │   │   ├── AdminUsers.jsx
    │   │   └── Admin.css
    │   ├── api/
    │   │   └── axios.js
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ProductCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Products.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Orders.jsx
    │   │   ├── OrderDetail.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Profile.jsx
    │   │   └── Wishlist.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🎯 Features Checklist

### Customer Features
- [x] Product browsing with filters
- [x] Search functionality
- [x] Product details with reviews
- [x] Shopping cart
- [x] Wishlist
- [x] User authentication
- [x] Checkout process
- [x] Multiple payment methods
- [x] Order tracking
- [x] Order cancellation
- [x] Profile management
- [x] Responsive design

### Admin Features
- [x] Dashboard with stats
- [x] Product management (CRUD)
- [x] Image upload
- [x] Order management
- [x] User list
- [x] Order status updates
- [x] Responsive admin panel
- [x] Mobile menu

### Technical Features
- [x] JWT authentication
- [x] Input validation
- [x] Image upload
- [x] Payment gateway
- [x] Responsive design
- [x] Error handling
- [x] Loading states
- [x] Toast notifications

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB
```bash
mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Kill process or change port in .env

### Razorpay Modal Not Opening
**Solution**: Check if script is loaded in index.html
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Images Not Uploading
**Solution**: Check uploads folder exists
```bash
mkdir backend/uploads
```

### Admin Can't Login
**Solution**: Run admin migration
```bash
cd backend
npm run migrate:admin
```

## 📊 Database Collections

### users
- name, email, password (hashed)
- isAdmin (boolean)
- address (object)

### products
- name, description, price
- category, stock, image
- reviews, rating
- featured, tags

### orders
- user (ref), items (array)
- shippingAddress (object)
- paymentMethod, paymentStatus
- paymentDetails (Razorpay)
- orderStatus, total

## 🔒 Security Notes

1. **Never commit .env** file
2. **Use strong JWT_SECRET** in production
3. **Enable HTTPS** in production
4. **Use live Razorpay keys** in production
5. **Validate all inputs** (already implemented)
6. **Sanitize user data** (already implemented)
7. **Rate limit API** (recommended for production)

## 🚀 Deployment Checklist

### Backend
- [ ] Set environment variables
- [ ] Use production MongoDB
- [ ] Enable HTTPS
- [ ] Set up CORS properly
- [ ] Use live Razorpay keys
- [ ] Set up logging
- [ ] Configure error handling
- [ ] Set up monitoring

### Frontend
- [ ] Build for production
- [ ] Configure API URL
- [ ] Optimize images
- [ ] Enable caching
- [ ] Set up CDN
- [ ] Configure SEO
- [ ] Test on real devices

## 📞 Support

For issues:
1. Check troubleshooting section
2. Review documentation files
3. Check console for errors
4. Verify environment variables
5. Test on different browsers

## 🎓 Learning Resources

- React: https://react.dev/
- Node.js: https://nodejs.org/
- MongoDB: https://www.mongodb.com/docs/
- Razorpay: https://razorpay.com/docs/
- Express: https://expressjs.com/

## 📝 Next Steps

After setup:
1. Customize branding (colors, logo)
2. Add more products
3. Configure email notifications
4. Set up payment webhooks
5. Add analytics
6. Implement SEO
7. Add more payment methods
8. Set up automated backups
9. Configure CDN for images
10. Deploy to production

## 🎉 You're Ready!

Your ecommerce platform is now fully functional with:
- ✅ Customer shopping experience
- ✅ Admin management panel
- ✅ Payment processing
- ✅ Responsive design
- ✅ Image uploads
- ✅ Form validation

Happy selling! 🛍️
