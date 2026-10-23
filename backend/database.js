// backend/database.js
const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');
const { initialProducts, initialReviews, initialCoupons } = require('./seedData');

const dbPath = path.join(__dirname, 'nexora.db');
const db = new Database(dbPath);

// Enable WAL mode for high concurrency
db.pragma('journal_mode = WAL');

function initDatabase() {
  // 1. Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'customer',
      avatar TEXT,
      phone TEXT,
      street TEXT,
      city TEXT,
      state TEXT,
      zip TEXT,
      country TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      short_description TEXT,
      category TEXT NOT NULL,
      subcategory TEXT,
      condition TEXT NOT NULL,
      condition_notes TEXT,
      brand TEXT NOT NULL,
      price REAL NOT NULL,
      original_price REAL,
      discount_pct INTEGER DEFAULT 0,
      stock INTEGER DEFAULT 10,
      sku TEXT UNIQUE,
      rating REAL DEFAULT 5.0,
      reviews_count INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      is_deal INTEGER DEFAULT 0,
      deal_badge TEXT,
      images TEXT,
      specs TEXT,
      key_features TEXT,
      warranty TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      user_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      shipping_address TEXT NOT NULL,
      shipping_method TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      payment_status TEXT DEFAULT 'Paid',
      status TEXT DEFAULT 'Processing',
      subtotal REAL NOT NULL,
      shipping_fee REAL DEFAULT 0,
      discount REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      total REAL NOT NULL,
      items TEXT NOT NULL,
      tracking_number TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);

  // 4. Reviews table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      rating INTEGER NOT NULL,
      title TEXT,
      comment TEXT,
      verified_purchase INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id)
    );
  `);

  // 5. Coupons table
  db.exec(`
    CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      discount_type TEXT NOT NULL,
      value REAL NOT NULL,
      min_order REAL DEFAULT 0,
      active INTEGER DEFAULT 1
    );
  `);

  seedDataIfEmpty();
}

function seedDataIfEmpty() {
  // Check users count
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    console.log('[DB] Seeding default accounts...');
    const salt = bcrypt.genSaltSync(10);
    const adminPass = bcrypt.hashSync('admin123', salt);
    const custPass = bcrypt.hashSync('customer123', salt);

    const insertUser = db.prepare(`
      INSERT INTO users (name, email, password, role, phone, street, city, state, zip, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run(
      'Admin Alex',
      'admin@nexoratech.com',
      adminPass,
      'admin',
      '+1 (800) 555-0199',
      '100 Cyber Tower Way, Suite 400',
      'San Francisco',
      'CA',
      '94105',
      'United States'
    );

    insertUser.run(
      'Jordan Lee',
      'customer@nexoratech.com',
      custPass,
      'customer',
      '+1 (555) 789-2041',
      '742 Evergreen Terrace',
      'Austin',
      'TX',
      '78701',
      'United States'
    );
  }

  // Check products count
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  if (productCount === 0) {
    console.log('[DB] Seeding products...');
    const insertProduct = db.prepare(`
      INSERT INTO products (
        title, slug, description, short_description, category, subcategory,
        condition, condition_notes, brand, price, original_price, discount_pct,
        stock, sku, rating, reviews_count, is_featured, is_deal, deal_badge,
        images, specs, key_features, warranty
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of initialProducts) {
      insertProduct.run(
        p.title,
        p.slug,
        p.description,
        p.short_description,
        p.category,
        p.subcategory || '',
        p.condition,
        p.condition_notes,
        p.brand,
        p.price,
        p.original_price,
        p.discount_pct || 0,
        p.stock,
        p.sku,
        p.rating || 5.0,
        p.reviews_count || 0,
        p.is_featured || 0,
        p.is_deal || 0,
        p.deal_badge || '',
        p.images,
        p.specs,
        p.key_features,
        p.warranty
      );
    }
  }

  // Check reviews
  const reviewCount = db.prepare('SELECT COUNT(*) as count FROM reviews').get().count;
  if (reviewCount === 0) {
    console.log('[DB] Seeding initial customer reviews...');
    const insertReview = db.prepare(`
      INSERT INTO reviews (product_id, user_name, user_email, rating, title, comment, verified_purchase, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const r of initialReviews) {
      const prod = db.prepare('SELECT id FROM products WHERE slug = ?').get(r.product_slug);
      if (prod) {
        insertReview.run(
          prod.id,
          r.user_name,
          r.user_email,
          r.rating,
          r.title,
          r.comment,
          r.verified_purchase,
          r.created_at
        );
      }
    }
  }

  // Check coupons
  const couponCount = db.prepare('SELECT COUNT(*) as count FROM coupons').get().count;
  if (couponCount === 0) {
    console.log('[DB] Seeding promotional coupons...');
    const insertCoupon = db.prepare(`
      INSERT INTO coupons (code, discount_type, value, min_order, active)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const c of initialCoupons) {
      insertCoupon.run(c.code, c.discount_type, c.value, c.min_order, c.active);
    }
  }

  // Check initial sample orders for Admin analytics
  const ordersCount = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
  if (ordersCount === 0) {
    console.log('[DB] Seeding realistic initial orders for analytics...');
    const insertOrder = db.prepare(`
      INSERT INTO orders (
        order_number, user_id, customer_name, customer_email, customer_phone,
        shipping_address, shipping_method, payment_method, payment_status,
        status, subtotal, shipping_fee, discount, tax, total, items,
        tracking_number, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertOrder.run(
      'NEX-2026-9041',
      2,
      'Jordan Lee',
      'customer@nexoratech.com',
      '+1 (555) 789-2041',
      JSON.stringify({
        street: '742 Evergreen Terrace',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
        country: 'United States'
      }),
      'Express Insured (2-3 Business Days)',
      'Credit Card (Visa ending in 4242)',
      'Paid',
      'Delivered',
      3299.99,
      0,
      100,
      263.99,
      3463.98,
      JSON.stringify([
        {
          id: 2,
          title: 'Apple MacBook Pro 16" M3 Max',
          price: 3299.99,
          quantity: 1,
          condition: 'Certified Refurbished - Grade A+',
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80'
        }
      ]),
      'NEX-FDX-88219412',
      '2026-10-18T14:22:00Z'
    );

    insertOrder.run(
      'NEX-2026-9042',
      2,
      'Jordan Lee',
      'customer@nexoratech.com',
      '+1 (555) 789-2041',
      JSON.stringify({
        street: '742 Evergreen Terrace',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
        country: 'United States'
      }),
      'Priority Overnight',
      'PayPal',
      'Paid',
      'Shipped',
      519.98,
      25,
      0,
      41.59,
      586.57,
      JSON.stringify([
        {
          id: 10,
          title: 'AMD Ryzen 7 7800X3D Desktop Processor',
          price: 389.99,
          quantity: 1,
          condition: 'New',
          image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80'
        },
        {
          id: 15,
          title: 'Razer DeathAdder V3 Pro Wireless Gaming Mouse',
          price: 149.99,
          quantity: 1,
          condition: 'New',
          image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80'
        }
      ]),
      'NEX-UPS-99431872',
      '2026-10-21T09:45:00Z'
    );

    insertOrder.run(
      'NEX-2026-9043',
      null,
      'Sophia Thorne',
      'sophia.t@cyber.io',
      '+1 (415) 332-9011',
      JSON.stringify({
        street: '120 Market St, Floor 14',
        city: 'San Francisco',
        state: 'CA',
        zip: '94103',
        country: 'United States'
      }),
      'Free Standard Shipping',
      'UPI / Digital Scan',
      'Paid',
      'Processing',
      1399.99,
      0,
      50,
      111.99,
      1461.98,
      JSON.stringify([
        {
          id: 6,
          title: 'Samsung Odyssey OLED G9 49" Curved',
          price: 1399.99,
          quantity: 1,
          condition: 'New',
          image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80'
        }
      ]),
      'NEX-EXP-11029482',
      '2026-10-22T19:30:00Z'
    );
  }
}

module.exports = {
  db,
  initDatabase
};
