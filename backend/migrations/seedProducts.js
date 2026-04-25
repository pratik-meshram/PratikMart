const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const products = [
  {
    name: 'Apple iPhone 15 Pro',
    description: '6.1-inch Super Retina XDR display with ProMotion. A17 Pro chip with 6-core GPU. Pro camera system with 48MP Main, Ultra Wide, and Telephoto cameras. Action button for quick access to favorite features.',
    price: 134900,
    originalPrice: 144900,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1696446702183-cbd50c2a8d95?w=500',
    images: [
      'https://images.unsplash.com/photo-1696446702183-cbd50c2a8d95?w=500',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
      'https://images.unsplash.com/photo-1695048064942-d04e1a2c5c0c?w=500'
    ],
    stock: 25,
    featured: true,
    rating: 4.8,
    numReviews: 156,
    tags: ['smartphone', 'apple', '5g', 'premium']
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones. Up to 30-hour battery life with quick charging.',
    price: 29990,
    originalPrice: 34990,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500',
      'https://images.unsplash.com/photo-1545127398-14699f92334b?w=500'
    ],
    stock: 40,
    featured: true,
    rating: 4.9,
    numReviews: 203,
    tags: ['audio', 'wireless', 'noise-cancelling', 'sony']
  },
  {
    name: 'Samsung Galaxy Watch 6',
    description: 'Advanced health monitoring with sleep tracking, heart rate, and body composition. Personalized HR Zone for optimized workouts. Sapphire crystal glass display.',
    price: 27999,
    originalPrice: 32999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500',
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500'
    ],
    stock: 30,
    featured: true,
    rating: 4.6,
    numReviews: 89,
    tags: ['smartwatch', 'fitness', 'samsung', 'wearable']
  },
  {
    name: 'Nike Air Zoom Pegasus 40',
    description: 'Responsive cushioning with Nike Air Zoom units. Engineered mesh upper for breathability. Waffle-inspired pattern for traction. Perfect for daily runs.',
    price: 10995,
    originalPrice: 12995,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500'
    ],
    stock: 75,
    featured: true,
    rating: 4.7,
    numReviews: 342,
    tags: ['running', 'nike', 'sports', 'shoes']
  },
  {
    name: 'Adidas Ultraboost 23',
    description: 'BOOST midsole for incredible energy return. Primeknit+ upper adapts to your foot. Continental rubber outsole for superior grip in all conditions.',
    price: 16999,
    originalPrice: 18999,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500'
    ],
    stock: 60,
    featured: true,
    rating: 4.8,
    numReviews: 278,
    tags: ['running', 'adidas', 'boost', 'premium']
  },
  {
    name: 'Ray-Ban Aviator Classic',
    description: 'Iconic teardrop shape with metal frame. 100% UV protection with crystal lenses. Adjustable nose pads for comfort. Timeless style since 1937.',
    price: 8990,
    originalPrice: 10990,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'
    ],
    stock: 50,
    featured: false,
    rating: 4.5,
    numReviews: 167,
    tags: ['sunglasses', 'rayban', 'fashion', 'uv-protection']
  },
  {
    name: 'Fossil Gen 6 Smartwatch',
    description: 'Wear OS by Google with thousands of apps. Heart rate tracking, SpO2, and sleep monitoring. Fast charging - 80% in 30 minutes. Customizable watch faces.',
    price: 21995,
    originalPrice: 24995,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500'
    ],
    stock: 35,
    featured: false,
    rating: 4.4,
    numReviews: 124,
    tags: ['smartwatch', 'fossil', 'wearos', 'fitness']
  },
  {
    name: 'The North Face Borealis Backpack',
    description: '28L capacity with laptop sleeve fits up to 15". FlexVent suspension system for comfort. Multiple compartments and external bungee system. Water-resistant finish.',
    price: 7999,
    originalPrice: 9499,
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500'
    ],
    stock: 45,
    featured: true,
    rating: 4.7,
    numReviews: 198,
    tags: ['backpack', 'travel', 'laptop', 'outdoor']
  },
  {
    name: 'Levi\'s 511 Slim Fit Jeans',
    description: 'Classic slim fit through hip and thigh. Sits below waist. Premium stretch denim for comfort and flexibility. Timeless 5-pocket styling.',
    price: 3999,
    originalPrice: 4999,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=500'
    ],
    stock: 100,
    featured: false,
    rating: 4.6,
    numReviews: 456,
    tags: ['jeans', 'levis', 'denim', 'casual']
  },
  {
    name: 'Canon EOS R6 Mark II',
    description: '24.2MP full-frame CMOS sensor. Up to 40 fps continuous shooting. 6K video recording. Advanced subject detection AF. In-body image stabilization.',
    price: 239990,
    originalPrice: 259990,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1606980707986-1b0e1d7f2e1e?w=500',
    images: [
      'https://images.unsplash.com/photo-1606980707986-1b0e1d7f2e1e?w=500',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500'
    ],
    stock: 15,
    featured: true,
    rating: 4.9,
    numReviews: 87,
    tags: ['camera', 'canon', 'photography', 'professional']
  },
  {
    name: 'JBL Flip 6 Bluetooth Speaker',
    description: 'Powerful JBL Original Pro Sound. IP67 waterproof and dustproof. 12 hours of playtime. PartyBoost for pairing multiple speakers. Bold design.',
    price: 11999,
    originalPrice: 13999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500'
    ],
    stock: 55,
    featured: false,
    rating: 4.6,
    numReviews: 234,
    tags: ['speaker', 'bluetooth', 'portable', 'waterproof']
  },
  {
    name: 'Manduka PRO Yoga Mat',
    description: 'High-performance 6mm thick mat. Closed-cell surface prevents sweat absorption. Superior grip and cushioning. Lifetime guarantee. Eco-friendly materials.',
    price: 8999,
    originalPrice: 10999,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1601925228008-f5e4c5b5c5e5?w=500',
    images: [
      'https://images.unsplash.com/photo-1601925228008-f5e4c5b5c5e5?w=500'
    ],
    stock: 70,
    featured: false,
    rating: 4.8,
    numReviews: 312,
    tags: ['yoga', 'fitness', 'mat', 'exercise']
  },
  {
    name: 'Yeti Rambler 30oz Tumbler',
    description: 'Double-wall vacuum insulation keeps drinks cold for 24 hours, hot for 6 hours. Dishwasher safe. MagSlider lid prevents spills. 18/8 stainless steel.',
    price: 3499,
    originalPrice: 3999,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500'
    ],
    stock: 90,
    featured: false,
    rating: 4.7,
    numReviews: 523,
    tags: ['tumbler', 'insulated', 'yeti', 'drinkware']
  },
  {
    name: 'Dyson V15 Detect Cordless Vacuum',
    description: 'Laser reveals invisible dust. Intelligent suction adjusts to floor type. Up to 60 minutes runtime. Advanced filtration captures 99.99% of particles.',
    price: 58900,
    originalPrice: 64900,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500',
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500'
    ],
    stock: 20,
    featured: true,
    rating: 4.8,
    numReviews: 145,
    tags: ['vacuum', 'dyson', 'cordless', 'cleaning']
  },
  {
    name: 'Logitech MX Master 3S Mouse',
    description: 'Quiet clicks with 90% noise reduction. 8K DPI sensor tracks on any surface. Customizable buttons. USB-C quick charging. Multi-device connectivity.',
    price: 8995,
    originalPrice: 10495,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500'
    ],
    stock: 65,
    featured: false,
    rating: 4.7,
    numReviews: 289,
    tags: ['mouse', 'logitech', 'wireless', 'productivity']
  },
  {
    name: 'Keychron K8 Mechanical Keyboard',
    description: 'Hot-swappable switches. Wireless and wired modes. Mac and Windows compatible. RGB backlight with 18 effects. Compact tenkeyless design.',
    price: 7999,
    originalPrice: 9499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500'
    ],
    stock: 40,
    featured: false,
    rating: 4.6,
    numReviews: 178,
    tags: ['keyboard', 'mechanical', 'wireless', 'gaming']
  },
  {
    name: 'Herschel Little America Backpack',
    description: '25L capacity with padded laptop sleeve. Signature striped fabric liner. Adjustable drawstring closure. Classic mountaineering style with modern functionality.',
    price: 8999,
    originalPrice: 10999,
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=500',
    images: [
      'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=500',
      'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=500'
    ],
    stock: 50,
    featured: false,
    rating: 4.5,
    numReviews: 267,
    tags: ['backpack', 'herschel', 'laptop', 'fashion']
  },
  {
    name: 'Bellroy Slim Sleeve Wallet',
    description: 'Premium leather construction. Holds 4-12 cards plus cash. RFID protection. Slim profile fits comfortably in pocket. Environmentally certified leather.',
    price: 6999,
    originalPrice: 7999,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500'
    ],
    stock: 80,
    featured: false,
    rating: 4.7,
    numReviews: 412,
    tags: ['wallet', 'leather', 'rfid', 'minimalist']
  },
  {
    name: 'Anker PowerCore 20000mAh',
    description: 'High-capacity portable charger. PowerIQ and VoltageBoost technology. Charges iPhone 13 almost 5 times. Dual USB ports. MultiProtect safety system.',
    price: 3999,
    originalPrice: 4999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500'
    ],
    stock: 100,
    featured: false,
    rating: 4.6,
    numReviews: 678,
    tags: ['powerbank', 'charger', 'portable', 'anker']
  },
  {
    name: 'Philips Hue White & Color Starter Kit',
    description: '4 smart bulbs with bridge. 16 million colors. Voice control with Alexa, Google, Siri. Set schedules and routines. Sync with music and movies.',
    price: 16999,
    originalPrice: 19999,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
    ],
    stock: 30,
    featured: false,
    rating: 4.7,
    numReviews: 234,
    tags: ['smart-home', 'lighting', 'philips', 'iot']
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany();
    console.log('Cleared existing products');

    // Insert new products
    const inserted = await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${inserted.length} products!`);

    // Show summary by category
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Products by Category:');
    categories.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} products`);
    });

    console.log(`\n💰 Price Range: ₹${Math.min(...products.map(p => p.price))} - ₹${Math.max(...products.map(p => p.price))}`);
    console.log(`⭐ Featured Products: ${products.filter(p => p.featured).length}`);

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
