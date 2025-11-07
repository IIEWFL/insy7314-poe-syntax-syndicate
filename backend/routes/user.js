const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');

// Password pepper for enhanced security
const pepper = process.env.PASSWORD_PEPPER || '';

// Server-side whitelist patterns
const patterns = {
  name: /^[A-Za-z \-]{2,60}$/,
  idNumber: /^[0-9]{1,13}$/,
  username: /^[A-Za-z0-9_]{3,20}$/,
  accountNumber: /^[0-9]{8,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,72}$/,
};



// Helper function for standardized error responses
const createErrorResponse = (res, code, message, details) => {
  if (details) {
    console.error(`${code}: ${message} - Details:`, details); // Log full error details if available
  } else {
    console.error(`${code}: ${message}`);
  }
  return res.status(code).json({ error: message });
};

// REGISTRATION DISABLED FOR TASK 3 - Users are pre-configured
router.post('/register', async (req, res) => {
  return res.status(403).json({
    error: 'Registration is disabled. Please contact your administrator for account access.'
  });
});


// Login - MongoDB version
router.post('/login', async (req, res) => {
  const { username, accountNumber, password } = req.body;

  // Accept username OR accountNumber with password
  if (!password || (!username && !accountNumber)) {
    return res.status(400).json({ error: 'Provide username or account number, and password' });
  }
  if (username && !patterns.username.test(username)) {
    return res.status(400).json({ error: 'Invalid username format' });
  }
  if (accountNumber && !patterns.accountNumber.test(accountNumber)) {
    return res.status(400).json({ error: 'Invalid account number format' });
  }
  if (!patterns.password.test(password)) {
    return res.status(400).json({ error: 'Invalid password format' });
  }

  try {
    // Find user in MongoDB
    const user = accountNumber
      ? await User.findOne({ accountNumber })
      : await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Validate password with pepper enhancement
    const isMatch = await bcrypt.compare(password + pepper, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate a JWT token with role information
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        accountNumber: user.accountNumber,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Return the JWT token, role, and success message
    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role,
      username: user.username,
      accountNumber: user.accountNumber
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Profile - Get user profile from MongoDB
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Protected Route
router.get('/protected', (req, res) => {
  const token = req.headers['authorization'];

  console.log('Protected route accessed.');

  if (!token) {
    console.log('Access denied: No token provided.');
    return createErrorResponse(res, 401, 'You need to log in to access this area.');
  }

  console.log('Verifying JWT token...');
  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Token verification failed or expired:', err);
      return createErrorResponse(res, 403, 'Your session has expired. Please log in again.', err);
    }

    console.log(`Token valid. User authenticated: ID: ${decoded.idNumber}, User ID: ${decoded.id}`);
    res.status(200).json({ message: 'You have successfully accessed the protected route!', decoded });
  });
});

module.exports = router;
