require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');

const Product = require('./models/Product');
const Visit = require('./models/Visit');
const auth = require('./middleware/auth');

const app = express();

// Middleware
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Storage Engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = './uploads';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});
const upload = multer({ storage: storage });

// Database Connection
mongoose.connect(process.env.CONECTION_STRING)
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log('DB Connection Error: ', err));

// Routes

// 1. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  // Hardcoded check based on instructions
  if (password === 'Asamoah9531.') {
    const payload = { admin: { id: 'admin1' } };
    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } else {
    res.status(400).json({ msg: 'Invalid Credentials' });
  }
});

// 2. Get All Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 3. Add Product (Protected)
app.post('/api/products', auth, upload.single('imageFile'), async (req, res) => {
  try {
    const { name, price, description, benefits, science, imageUrlUrl } = req.body;
    
    // Determine Image Path
    let finalImage = "";
    if (req.file) {
      const baseUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 5000}`;
      finalImage = `${baseUrl}/uploads/${req.file.filename}`;
    } else if (imageUrlUrl) {
      finalImage = imageUrlUrl;
    } else {
      return res.status(400).json({ msg: "Image file or URL is required" });
    }

    const parsedBenefits = typeof benefits === 'string' ? JSON.parse(benefits) : benefits;

    const newProduct = new Product({
      name,
      price: parseFloat(price),
      image: finalImage,
      description,
      benefits: parsedBenefits,
      science
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 4. Update Product (Protected)
app.put('/api/products/:id', auth, upload.single('imageFile'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    const { name, price, description, benefits, science, imageUrlUrl } = req.body;

    // Determine new image (if any)
    let finalImage = product.image; // keep existing by default
    if (req.file) {
      const baseUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 5000}`;
      finalImage = `${baseUrl}/uploads/${req.file.filename}`;
    } else if (imageUrlUrl) {
      finalImage = imageUrlUrl;
    }

    const parsedBenefits = benefits
      ? (typeof benefits === 'string' ? JSON.parse(benefits) : benefits)
      : product.benefits;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name || product.name,
        price: price !== undefined ? parseFloat(price) : product.price,
        image: finalImage,
        description: description || product.description,
        benefits: parsedBenefits,
        science: science !== undefined ? science : product.science,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Product not found' });
    res.status(500).send('Server Error');
  }
});

// 5. Delete Product (Protected)
app.delete('/api/products/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
});

// 5. Manage Visits
app.get('/api/visits', async (req, res) => {
  try {
    let visitDoc = await Visit.findOne();
    if (!visitDoc) {
      visitDoc = new Visit({ count: 0 });
      await visitDoc.save();
    }
    res.json({ count: visitDoc.count });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.post('/api/visits/track', async (req, res) => {
  try {
    let visitDoc = await Visit.findOne();
    if (!visitDoc) {
      visitDoc = new Visit({ count: 1 });
    } else {
      visitDoc.count += 1;
    }
    await visitDoc.save();
    res.json({ count: visitDoc.count });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
