// backend/server.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db, initDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'nexora_tech_hyper_secret_jwt_key_2026';

app.use(cors());
app.use(express.json());

// Initialize DB schema & seed data
initDatabase();

// Helper: Parse JSON fields in product
function parseProduct(p) {
  if (!p) return null;
  return {
    ...p,
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [],
    specs: typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs || {},
    key_features: typeof p.key_features === 'string' ? JSON.parse(p.key_features) : p.key_features || []
  };
}

// Helper: Parse order JSON fields
function parseOrder(o) {
  if (!o) return null;
  return {
    ...o,
    shipping_address: typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : o.shipping_address || {},
    items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items || []
  };
}

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalid or expired' });
    req.user = user;
    next();
  });
}

function optionalToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    req.user = null;
    return next();
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err) req.user = user;
    next();
  });
}

// ---------------- PRODUCTS ENDPOINTS ---------------- //

// GET /api/products - query filter, search, sort, pagination
app.get('/api/products', (req, res) => {
  try {
    const {
      search,
      category,
      condition,
      brand,
      minPrice,
      maxPrice,
      inStock,
      isFeatured,
      isDeal,
      sort = 'featured',
      limit = 50,
      page = 1
    } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (search) {
      query += ` AND (title LIKE ? OR description LIKE ? OR brand LIKE ? OR category LIKE ? OR subcategory LIKE ?)`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam, searchParam);
    }

    if (category && category !== 'All') {
      query += ` AND category = ?`;
      params.push(category);
    }

    if (condition && condition !== 'All') {
      if (condition === 'New') {
        query += ` AND condition = 'New'`;
      } else if (condition.includes('Refurbished')) {
        query += ` AND condition LIKE '%Refurbished%'`;
      } else {
        query += ` AND condition = ?`;
        params.push(condition);
      }
    }

    if (brand && brand !== 'All') {
      query += ` AND brand = ?`;
      params.push(brand);
    }

    if (minPrice) {
      query += ` AND price >= ?`;
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      query += ` AND price <= ?`;
      params.push(Number(maxPrice));
    }

    if (inStock === 'true' || inStock === '1') {
      query += ` AND stock > 0`;
    }

    if (isFeatured === 'true' || isFeatured === '1') {
      query += ` AND is_featured = 1`;
    }

    if (isDeal === 'true' || isDeal === '1') {
      query += ` AND is_deal = 1`;
    }

    // Sort order
    if (sort === 'price-asc') {
      query += ` ORDER BY price ASC`;
    } else if (sort === 'price-desc') {
      query += ` ORDER BY price DESC`;
    } else if (sort === 'rating-desc') {
      query += ` ORDER BY rating DESC, reviews_count DESC`;
    } else if (sort === 'newest') {
      query += ` ORDER BY id DESC`;
    } else {
      // featured
      query += ` ORDER BY is_featured DESC, rating DESC, id ASC`;
    }

    const offset = (Number(page) - 1) * Number(limit);
    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const rows = db.prepare(query).all(...params);
    const parsedProducts = rows.map(parseProduct);

    // Get total count matching same criteria
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams = params.slice(0, params.length - 2); // omit limit & offset
    // re-build count query from params if needed
    // quick count
    const totalCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;

    res.json({
      products: parsedProducts,
      count: parsedProducts.length,
      total: totalCount
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/:identifier (id or slug)
app.get('/api/products/:identifier', (req, res) => {
  try {
    const { identifier } = req.params;
    let product;

    if (!isNaN(identifier)) {
      product = db.prepare('SELECT * FROM products WHERE id = ?').get(identifier);
    } else {
      product = db.prepare('SELECT * FROM products WHERE slug = ?').get(identifier);
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const parsed = parseProduct(product);

    // Fetch reviews
    const reviews = db.prepare('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC').all(product.id);

    // Fetch related products (same category or condition, excluding this one)
    const related = db.prepare(`
      SELECT * FROM products 
      WHERE category = ? AND id != ? 
      ORDER BY rating DESC LIMIT 4
    `).all(product.category, product.id).map(parseProduct);

    res.json({
      product: parsed,
      reviews,
      related
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/products (Admin create)
app.post('/api/products', (req, res) => {
  try {
    const {
      title,
      description,
      short_description,
      category,
      subcategory,
      condition,
      condition_notes,
      brand,
      price,
      original_price,
      stock,
      sku,
      deal_badge,
      images,
      specs,
      key_features,
      warranty
    } = req.body;

    if (!title || !price || !category || !condition || !brand) {
      return res.status(400).json({ error: 'Title, price, category, condition, and brand are required' });
    }

    // Slug generation
    const slugBase = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slug = `${slugBase}-${Date.now().toString().slice(-4)}`;

    const discount_pct = original_price && original_price > price
      ? Math.round(((original_price - price) / original_price) * 100)
      : 0;

    const insert = db.prepare(`
      INSERT INTO products (
        title, slug, description, short_description, category, subcategory,
        condition, condition_notes, brand, price, original_price, discount_pct,
        stock, sku, rating, reviews_count, is_featured, is_deal, deal_badge,
        images, specs, key_features, warranty
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      title,
      slug,
      description || '',
      short_description || '',
      category,
      subcategory || '',
      condition,
      condition_notes || '',
      brand,
      Number(price),
      original_price ? Number(original_price) : Number(price),
      discount_pct,
      stock ? Number(stock) : 10,
      sku || `NEX-${Date.now().toString().slice(-6)}`,
      5.0,
      0,
      req.body.is_featured ? 1 : 0,
      req.body.is_deal ? 1 : 0,
      deal_badge || '',
      JSON.stringify(images || []),
      JSON.stringify(specs || {}),
      JSON.stringify(key_features || []),
      warranty || '1 Year Nexora Warranty'
    );

    const created = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(parseProduct(created));
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/products/:id (Admin update)
app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const {
      title,
      description,
      short_description,
      category,
      subcategory,
      condition,
      condition_notes,
      brand,
      price,
      original_price,
      stock,
      sku,
      is_featured,
      is_deal,
      deal_badge,
      images,
      specs,
      key_features,
      warranty
    } = req.body;

    const discount_pct = original_price && original_price > price
      ? Math.round(((original_price - price) / original_price) * 100)
      : 0;

    const update = db.prepare(`
      UPDATE products SET
        title = ?,
        description = ?,
        short_description = ?,
        category = ?,
        subcategory = ?,
        condition = ?,
        condition_notes = ?,
        brand = ?,
        price = ?,
        original_price = ?,
        discount_pct = ?,
        stock = ?,
        sku = ?,
        is_featured = ?,
        is_deal = ?,
        deal_badge = ?,
        images = ?,
        specs = ?,
        key_features = ?,
        warranty = ?
      WHERE id = ?
    `);

    update.run(
      title !== undefined ? title : existing.title,
      description !== undefined ? description : existing.description,
      short_description !== undefined ? short_description : existing.short_description,
      category !== undefined ? category : existing.category,
      subcategory !== undefined ? subcategory : existing.subcategory,
      condition !== undefined ? condition : existing.condition,
      condition_notes !== undefined ? condition_notes : existing.condition_notes,
      brand !== undefined ? brand : existing.brand,
      price !== undefined ? Number(price) : existing.price,
      original_price !== undefined ? Number(original_price) : existing.original_price,
      discount_pct,
      stock !== undefined ? Number(stock) : existing.stock,
      sku !== undefined ? sku : existing.sku,
      is_featured !== undefined ? (is_featured ? 1 : 0) : existing.is_featured,
      is_deal !== undefined ? (is_deal ? 1 : 0) : existing.is_deal,
      deal_badge !== undefined ? deal_badge : existing.deal_badge,
      images !== undefined ? JSON.stringify(images) : existing.images,
      specs !== undefined ? JSON.stringify(specs) : existing.specs,
      key_features !== undefined ? JSON.stringify(key_features) : existing.key_features,
      warranty !== undefined ? warranty : existing.warranty,
      id
    );

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.json(parseProduct(updated));
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/products/:id/stock (Quick Stock Update)
app.patch('/api/products/:id/stock', (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    if (stock === undefined || isNaN(stock)) {
      return res.status(400).json({ error: 'Valid stock number is required' });
    }

    db.prepare('UPDATE products SET stock = ? WHERE id = ?').run(Number(stock), id);
    const updated = db.prepare('SELECT id, stock, title FROM products WHERE id = ?').get(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/products/:id (Admin delete)
app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM reviews WHERE product_id = ?').run(id);
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = [
      { name: 'Laptops', count: 0, icon: 'Laptop', desc: 'Gaming Rigs & Pro Ultrabooks' },
      { name: 'Desktop PCs', count: 0, icon: 'Cpu', desc: 'Custom Liquid Cooled & Mac Workstations' },
      { name: 'Monitors', count: 0, icon: 'Monitor', desc: 'QD-OLED, 4K & UltraWide Displays' },
      { name: 'Components', count: 0, icon: 'HardDrive', desc: 'RTX 4090s, Gen5 SSDs, X3D CPUs & RAM' },
      { name: 'Printers', count: 0, icon: 'Printer', desc: 'Supertank Inkjets & Enterprise Lasers' },
      { name: 'Accessories', count: 0, icon: 'Headphones', desc: 'Pro Mice, Keyboards & Studio Audio' }
    ];

    const counts = db.prepare(`
      SELECT category, COUNT(*) as count FROM products GROUP BY category
    `).all();

    const countMap = {};
    counts.forEach(c => { countMap[c.category] = c.count; });

    const result = categories.map(cat => ({
      ...cat,
      count: countMap[cat.name] || 0
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/brands
app.get('/api/brands', (req, res) => {
  try {
    const brands = db.prepare('SELECT DISTINCT brand, COUNT(*) as count FROM products GROUP BY brand ORDER BY count DESC').all();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- AUTH ENDPOINTS ---------------- //

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const insert = db.prepare(`
      INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'customer')
    `);
    const result = insert.run(name.trim(), email.toLowerCase().trim(), hash);

    const user = db.prepare('SELECT id, name, email, role, phone, street, city, state, zip, country FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userSafe } = user;

    res.json({ token, user: userSafe });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, role, phone, street, city, state, zip, country, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/auth/profile
app.put('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    const { name, phone, street, city, state, zip, country } = req.body;
    db.prepare(`
      UPDATE users SET
        name = COALESCE(?, name),
        phone = COALESCE(?, phone),
        street = COALESCE(?, street),
        city = COALESCE(?, city),
        state = COALESCE(?, state),
        zip = COALESCE(?, zip),
        country = COALESCE(?, country)
      WHERE id = ?
    `).run(name, phone, street, city, state, zip, country, req.user.id);

    const updated = db.prepare('SELECT id, name, email, role, phone, street, city, state, zip, country FROM users WHERE id = ?').get(req.user.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- ORDERS ENDPOINTS ---------------- //

// GET /api/orders
app.get('/api/orders', optionalToken, (req, res) => {
  try {
    const { user_id, email, status } = req.query;
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    // If logged in customer and not explicitly admin requesting all
    if (req.user && req.user.role !== 'admin') {
      query += ' AND (user_id = ? OR customer_email = ?)';
      params.push(req.user.id, req.user.email);
    } else if (user_id) {
      query += ' AND user_id = ?';
      params.push(user_id);
    } else if (email) {
      query += ' AND customer_email = ?';
      params.push(email);
    }

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';
    const orders = db.prepare(query).all(...params).map(parseOrder);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/:identifier
app.get('/api/orders/:identifier', (req, res) => {
  try {
    const { identifier } = req.params;
    let order;
    if (!isNaN(identifier)) {
      order = db.prepare('SELECT * FROM orders WHERE id = ?').get(identifier);
    } else {
      order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(identifier);
    }

    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(parseOrder(order));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/orders (Create Order)
app.post('/api/orders', optionalToken, (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_method,
      payment_method,
      items,
      subtotal,
      shipping_fee = 0,
      discount = 0,
      tax = 0,
      total
    } = req.body;

    if (!customer_name || !customer_email || !items || !items.length) {
      return res.status(400).json({ error: 'Customer information and order items are required' });
    }

    const orderNumber = `NEX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `NEX-EXP-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const userId = req.user ? req.user.id : null;

    // Use transaction to insert order and decrement inventory
    const createOrderTx = db.transaction(() => {
      const insert = db.prepare(`
        INSERT INTO orders (
          order_number, user_id, customer_name, customer_email, customer_phone,
          shipping_address, shipping_method, payment_method, payment_status,
          status, subtotal, shipping_fee, discount, tax, total, items,
          tracking_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Paid', 'Processing', ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = insert.run(
        orderNumber,
        userId,
        customer_name,
        customer_email,
        customer_phone || '',
        JSON.stringify(shipping_address || {}),
        shipping_method || 'Standard Insured Shipping',
        payment_method || 'Credit Card',
        subtotal,
        shipping_fee,
        discount,
        tax,
        total,
        JSON.stringify(items),
        trackingNumber
      );

      // Decrement stock for items
      const updateStock = db.prepare(`
        UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?
      `);
      for (const item of items) {
        if (item.id) {
          updateStock.run(item.quantity || 1, item.id);
        }
      }

      return result.lastInsertRowid;
    });

    const orderId = createOrderTx();
    const createdOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    res.status(201).json(parseOrder(createdOrder));
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/orders/:id/status
app.patch('/api/orders/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, tracking_number } = req.body;

    const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Order not found' });

    db.prepare(`
      UPDATE orders SET 
        status = COALESCE(?, status),
        tracking_number = COALESCE(?, tracking_number),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, tracking_number, id);

    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    res.json(parseOrder(updated));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- REVIEWS ENDPOINTS ---------------- //

// POST /api/reviews
app.post('/api/reviews', (req, res) => {
  try {
    const { product_id, user_name, user_email, rating, title, comment } = req.body;
    if (!product_id || !user_name || !rating) {
      return res.status(400).json({ error: 'Product ID, user name, and rating are required' });
    }

    const insert = db.prepare(`
      INSERT INTO reviews (product_id, user_name, user_email, rating, title, comment, verified_purchase)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `);
    insert.run(product_id, user_name, user_email || 'shopper@nexora.com', rating, title || '', comment || '');

    // Recompute product rating
    const stats = db.prepare(`
      SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id = ?
    `).get(product_id);

    const newRating = Number((stats.avg_rating || 5.0).toFixed(1));
    const newCount = stats.count;

    db.prepare(`
      UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?
    `).run(newRating, newCount, product_id);

    res.status(201).json({
      success: true,
      new_rating: newRating,
      reviews_count: newCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- COUPONS ENDPOINT ---------------- //

// POST /api/coupons/validate
app.post('/api/coupons/validate', (req, res) => {
  try {
    const { code, subtotal = 0 } = req.body;
    if (!code) return res.status(400).json({ error: 'Coupon code is required' });

    const coupon = db.prepare('SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND active = 1').get(code.trim());
    if (!coupon) {
      return res.status(404).json({ error: 'Invalid or expired coupon code' });
    }

    if (subtotal < coupon.min_order) {
      return res.status(400).json({
        error: `Coupon ${coupon.code} requires a minimum order of ₹${coupon.min_order.toLocaleString('en-IN')}`
      });
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'pct') {
      discountAmount = (subtotal * coupon.value) / 100;
    } else {
      discountAmount = Math.min(coupon.value, subtotal);
    }

    res.json({
      code: coupon.code,
      discount_type: coupon.discount_type,
      value: coupon.value,
      discount_amount: Number(discountAmount.toFixed(2))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- ADMIN ANALYTICS ENDPOINT ---------------- //

// GET /api/admin/stats
app.get('/api/admin/stats', (req, res) => {
  try {
    const revenueRow = db.prepare("SELECT SUM(total) as total_revenue, COUNT(*) as total_orders FROM orders WHERE status != 'Cancelled'").get();
    const productCountRow = db.prepare("SELECT COUNT(*) as count FROM products").get();
    const lowStockRow = db.prepare("SELECT COUNT(*) as count FROM products WHERE stock <= 5").get();
    const outOfStockRow = db.prepare("SELECT COUNT(*) as count FROM products WHERE stock = 0").get();

    // Refurbished vs New breakdown
    const conditionSplit = db.prepare(`
      SELECT 
        CASE 
          WHEN condition LIKE '%Refurbished%' THEN 'Refurbished'
          ELSE 'Brand New'
        END as condition_type,
        COUNT(*) as count
      FROM products
      GROUP BY condition_type
    `).all();

    // Category distribution
    const categoryDist = db.prepare(`
      SELECT category, COUNT(*) as count FROM products GROUP BY category
    `).all();

    // Recent 5 orders
    const recentOrders = db.prepare(`
      SELECT * FROM orders ORDER BY created_at DESC LIMIT 5
    `).all().map(parseOrder);

    // Low stock product alerts
    const lowStockAlerts = db.prepare(`
      SELECT id, title, sku, category, condition, stock, price FROM products WHERE stock <= 10 ORDER BY stock ASC LIMIT 8
    `).all();

    res.json({
      total_revenue: revenueRow.total_revenue || 0,
      total_orders: revenueRow.total_orders || 0,
      total_products: productCountRow.count,
      low_stock_count: lowStockRow.count,
      out_of_stock_count: outOfStockRow.count,
      condition_split: conditionSplit,
      category_distribution: categoryDist,
      recent_orders: recentOrders,
      low_stock_alerts: lowStockAlerts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'Nexora Tech API', timestamp: new Date().toISOString() });
});

// Serve frontend build if dist exists
const path = require('path');
const fs = require('fs');
const distPath = path.join(__dirname, '../frontend/dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Nexora Server] API running on http://0.0.0.0:${PORT} (PORT=${PORT})`);
});
