const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const products = [
  { name: 'Wireless Headphones', description: 'Premium noise-cancelling wireless headphones with 30hr battery life.', price: 2999, originalPrice: 3999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', stock: 50, featured: true, rating: 4.5, numReviews: 12, tags: ['audio', 'wireless'] },
  { name: 'Smart Watch', description: 'Feature-packed smartwatch with health tracking and GPS.', price: 4999, originalPrice: 6999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', stock: 30, featured: true, rating: 4.3, numReviews: 8, tags: ['wearable', 'fitness'] },
  { name: 'Running Shoes', description: 'Lightweight and comfortable running shoes for all terrains.', price: 1499, originalPrice: 1999, category: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', stock: 100, featured: true, rating: 4.7, numReviews: 25, tags: ['sports', 'running'] },
  { name: 'Leather Wallet', description: 'Slim genuine leather wallet with RFID protection.', price: 799, originalPrice: 999, category: 'Accessories', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400', stock: 75, featured: false, rating: 4.2, numReviews: 15 },
  { name: 'Backpack', description: 'Durable 30L backpack with laptop compartment and USB charging port.', price: 1999, originalPrice: 2499, category: 'Bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', stock: 40, featured: true, rating: 4.6, numReviews: 20, tags: ['travel', 'laptop'] },
  { name: 'Sunglasses', description: 'UV400 polarized sunglasses with stylish frame.', price: 999, originalPrice: 1299, category: 'Accessories', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', stock: 60, featured: false, rating: 4.1, numReviews: 9 },
  { name: 'Bluetooth Speaker', description: 'Portable waterproof speaker with 360° sound and 12hr battery.', price: 1799, originalPrice: 2299, category: 'Electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', stock: 35, featured: true, rating: 4.4, numReviews: 18, tags: ['audio', 'portable'] },
  { name: 'Yoga Mat', description: 'Non-slip eco-friendly yoga mat with alignment lines.', price: 699, originalPrice: 899, category: 'Sports', image: 'https://images.unsplash.com/photo-1601925228008-f5e4c5e5e5e5?w=400', stock: 80, featured: false, rating: 4.5, numReviews: 30 },
  { name: 'Coffee Mug', description: 'Insulated stainless steel travel mug, keeps drinks hot for 6 hours.', price: 499, originalPrice: 699, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400', stock: 120, featured: false, rating: 4.3, numReviews: 22 },
  { name: 'Desk Lamp', description: 'LED desk lamp with adjustable brightness and USB charging port.', price: 1299, originalPrice: 1599, category: 'Home', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', stock: 45, featured: false, rating: 4.2, numReviews: 11 },
  { name: 'Mechanical Keyboard', description: 'Compact TKL mechanical keyboard with RGB backlight.', price: 3499, originalPrice: 4499, category: 'Electronics', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', stock: 25, featured: true, rating: 4.8, numReviews: 35, tags: ['gaming', 'typing'] },
  { name: 'Water Bottle', description: '1L BPA-free stainless steel water bottle with leak-proof lid.', price: 399, originalPrice: 599, category: 'Sports', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', stock: 150, featured: false, rating: 4.6, numReviews: 40 }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Create admin
  const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!adminExists) {
    await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      isAdmin: true
    });
    console.log('Admin created:', process.env.ADMIN_EMAIL);
  }

  // Seed products
  await Product.deleteMany();
  await Product.insertMany(products);
  console.log(`${products.length} products seeded`);

  mongoose.disconnect();
  console.log('Done!');
}

seed().catch(console.error);
