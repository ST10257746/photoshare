// src/server.js
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import morgan from 'morgan';

import connectDB from './config/db.js';
import routes from './routes/index.js';
import { configure } from './utils/cloudinary.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(morgan('dev'));

// Rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// Connect to MongoDB Atlas with debug
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI not defined in environment variables!');
  process.exit(1);
}

connectDB(mongoUri)
  .then(() => console.log('MongoDB connection established'))
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

// Configure Cloudinary
configure({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Start server (HTTP or HTTPS)
const PORT = process.env.PORT || 5000;

if (process.env.USE_HTTPS === 'true' || process.env.USE_HTTPS === '1') {
  const keyPath = process.env.SSL_KEY_PATH || path.resolve('certs/localhost-key.pem');
  const certPath = process.env.SSL_CERT_PATH || path.resolve('certs/localhost.pem');

  try {
    const key = fs.readFileSync(keyPath);
    const cert = fs.readFileSync(certPath);

    https.createServer({ key, cert }, app).listen(PORT, () => {
      console.log(`HTTPS server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start HTTPS server:', err);
    process.exit(1);
  }
} else {
  http.createServer(app).listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT}`);
  });
}
