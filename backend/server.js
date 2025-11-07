const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const ExpressBrute = require('express-brute');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');

dotenv.config();
const app = express();

console.log('🚀 INSY7314 Task 3 - Employee Portal with MongoDB');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

// Middlewares
app.set('trust proxy', 1);

// Strict CORS for the React dev origin
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://localhost:3000', 'https://localhost:3001'],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

// Security headers
app.use(helmet());
app.use(helmet.hsts({ maxAge: 60 * 60 * 24 * 30, includeSubDomains: false })); // 30 days dev HSTS

// Basic CSP suitable for dev
app.use(helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:'],
    connectSrc: ["'self'", 'https://localhost:5001', 'https://localhost:3000', 'https://localhost:3001'],
  },
}));

// Input parsing and sanitization
app.use(bodyParser.json({ limit: '200kb' }));
app.use(mongoSanitize());
app.use(hpp());

// HTTPS enforce (in case app is behind a proxy)
app.use((req, res, next) => {
  if (req.secure) return next();
  return res.redirect('https://' + req.headers.host + req.originalUrl);
});

// Global rate limit and tighter auth limits
const globalLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 300 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
app.use(globalLimiter);

// Express Brute for brute-force protection
const store = new ExpressBrute.MemoryStore(); // In production, use Redis or MongoDB store

// Brute force protection for authentication endpoints
const bruteforce = new ExpressBrute(store, {
  freeRetries: 3, // Allow 3 free attempts
  minWait: 5 * 60 * 1000, // 5 minutes initial delay
  maxWait: 60 * 60 * 1000, // 1 hour maximum delay
  lifetime: 24 * 60 * 60, // 24 hours lifetime
  failCallback: function (req, res, next, nextValidRequestDate) {
    res.status(429).json({
      error: 'Too many failed attempts. Please try again later.',
      nextValidRequestDate: nextValidRequestDate
    });
  }
});

// More aggressive brute force protection for specific user accounts
const userBruteforce = new ExpressBrute(store, {
  freeRetries: 5, // Allow 5 attempts per user
  minWait: 10 * 60 * 1000, // 10 minutes initial delay
  maxWait: 2 * 60 * 60 * 1000, // 2 hours maximum delay
  lifetime: 24 * 60 * 60, // 24 hours lifetime
  failCallback: function (req, res, next, nextValidRequestDate) {
    res.status(429).json({
      error: 'Account temporarily locked due to too many failed login attempts.',
      nextValidRequestDate: nextValidRequestDate
    });
  }
});

// INSY7314 Task 2: Using in-memory storage only
// All user data stored in RAM - perfect for security demonstration
console.log('💾 Using in-memory storage for user data');

// Routes (apply stricter limits and brute force protection on auth)
app.use('/api/user/login', authLimiter, bruteforce.prevent, userBruteforce.getMiddleware({
  key: function(req, res, next) {
    // Use username or account number as key for user-specific brute force protection
    next(req.body.username || req.body.accountNumber);
  }
}));
app.use('/api/user/register', authLimiter, bruteforce.prevent);
app.use('/api/user', userRoutes);

// Alias mounts to support dev proxy paths without /api prefix
app.use('/user/login', authLimiter, bruteforce.prevent, userBruteforce.getMiddleware({
  key: function(req, res, next) {
    // Use username or account number as key for user-specific brute force protection
    next(req.body.username || req.body.accountNumber);
  }
}));
app.use('/user/register', authLimiter, bruteforce.prevent);
app.use('/user', userRoutes);

// Start the server (HTTPS or HTTP based on environment)
const PORT = process.env.PORT || 5000;
const useHTTPS = process.env.HTTPS === 'true';

if (useHTTPS) {
  try {
    const keyPath = process.env.SSL_KEY_FILE && fs.existsSync(process.env.SSL_KEY_FILE)
      ? process.env.SSL_KEY_FILE
      : path.resolve(__dirname, 'keys/privatekey.pem');
    const certPath = process.env.SSL_CRT_FILE && fs.existsSync(process.env.SSL_CRT_FILE)
      ? process.env.SSL_CRT_FILE
      : path.resolve(__dirname, 'keys/server.crt');

    const tryStart = (certFile) => {
      const credentials = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certFile),
      };
      https.createServer(credentials, app).listen(PORT, () => {
        console.log(`HTTPS server running on https://localhost:${PORT}`);
        console.log(`Using cert: ${certFile}`);
      });
    };

    try {
      tryStart(certPath);
    } catch (e1) {
      console.warn('Primary cert failed, trying alternate certificate.pem...', e1?.code || e1?.message);
      const altCert = path.resolve(__dirname, 'keys/certificate.pem');
      if (fs.existsSync(altCert)) {
        tryStart(altCert);
      } else {
        throw e1;
      }
    }
  } catch (error) {
    console.error('Error starting HTTPS server:', error);
    console.log('Falling back to HTTP server...');
    app.listen(PORT, () => {
      console.log(`HTTP server running on http://localhost:${PORT}`);
      console.log('⚠️  WARNING: Running in HTTP mode - not secure for production!');
    });
  }
} else {
  app.listen(PORT, () => {
    console.log(`HTTP server running on http://localhost:${PORT}`);
    console.log('⚠️  WARNING: Running in HTTP mode - not secure for production!');
  });
}
