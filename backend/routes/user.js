const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken'); // Import the middleware

// In-memory user store for INSY7314 Task 2 - No MongoDB required
// This demonstrates all security features without external database dependencies
const useMemory = true;
const pepper = process.env.PASSWORD_PEPPER || '';
const memStore = { users: [] };
const nextId = () => (Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
const memExistsAccountNumber = async (acc) => memStore.users.some(u => u.accountNumber === acc);
const memFindByUsername = async (un) => memStore.users.find(u => u.username === un) || null;
const memFindByAccountNumber = async (acc) => memStore.users.find(u => u.accountNumber === acc) || null;

// Server-side whitelist patterns
const patterns = {
  name: /^[A-Za-z \-]{2,60}$/,
  idNumber: /^[0-9]{1,13}$/,
  username: /^[A-Za-z0-9_]{3,20}$/,
  accountNumber: /^[0-9]{8,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,72}$/,
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

// Register
router.post('/register', async (req, res) => {
  const { name, idNumber, username, password, confirmPassword } = req.body;

  if (!name || !idNumber || !username || !password || !confirmPassword) {
    return createErrorResponse(res, 400, 'Please fill out all the fields before registering.');
  }

  if (password !== confirmPassword) {
    return createErrorResponse(res, 400, 'Passwords do not match. Please try again.');
  }

  // Whitelist validation
  if (!patterns.name.test(name)) return createErrorResponse(res, 400, 'Name contains invalid characters.');
  if (!patterns.idNumber.test(idNumber)) return createErrorResponse(res, 400, 'ID number must be up to 13 digits.');
  if (!patterns.username.test(username)) return createErrorResponse(res, 400, 'Username must be 3-20 letters/digits/_.');
  if (!patterns.password.test(password)) return createErrorResponse(res, 400, 'Password does not meet complexity requirements.');

  try {
    const generateCandidate = () => {
      const base = Date.now().toString().slice(-8);
      const rand = Math.floor(Math.random() * 9000 + 1000).toString();
      return '62' + base + rand.slice(0, 2); // 12-digit account number
    };

    let generatedAccountNumber = null;
    for (let i = 0; i < 5; i++) {
      const candidate = generateCandidate();
      const exists = await memExistsAccountNumber(candidate);
      if (!exists) { generatedAccountNumber = candidate; break; }
    }
    if (!generatedAccountNumber) {
      return createErrorResponse(res, 500, 'Could not generate account number, please try again.');
    }

    // Store user in memory with enhanced security (bcrypt + salt + pepper)
    const passwordHash = await bcrypt.hash(password + pepper, 12);
    const newUser = {
      _id: nextId(),
      name,
      idNumber,
      username,
      accountNumber: generatedAccountNumber,
      password: passwordHash,
    };
    memStore.users.push(newUser);

    res.status(201).json({ message: 'You have successfully registered! You can now log in.', accountNumber: generatedAccountNumber });
  } catch (error) {
    console.error('Error occurred during registration:', error);

    // Send the full error message back for debugging (temporarily)
    return res.status(500).json({
      error: 'Something went wrong during registration.',
      details: error.message, // Include more details about the error
    });
  }
});


// Login
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
    // Find user in memory store
    const user = accountNumber
      ? await memFindByAccountNumber(accountNumber)
      : await memFindByUsername(username);

    if (!user) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Validate password with pepper enhancement
    const isMatch = await bcrypt.compare(password + pepper, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, accountNumber: user.accountNumber },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return the JWT token and a success message
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

// Profile - Get user profile from memory store
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = memStore.users.find(u => u._id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user data without password
    const { password, ...safeUserData } = user;
    res.json(safeUserData);
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
