const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

const pepper = process.env.PASSWORD_PEPPER || '';

// Pre-configured users for Task 3
const users = [
  // Customer accounts
  {
    name: 'John Customer',
    idNumber: '9001015800081',
    username: 'john_customer',
    accountNumber: '6200000001',
    password: 'Customer@123',
    role: 'customer'
  },
  {
    name: 'Sarah Client',
    idNumber: '8505125800082',
    username: 'sarah_client',
    accountNumber: '6200000002',
    password: 'Client@456',
    role: 'customer'
  },
  {
    name: 'Mike Payer',
    idNumber: '9203145800083',
    username: 'mike_payer',
    accountNumber: '6200000003',
    password: 'Payer@789',
    role: 'customer'
  },
  // Employee accounts
  {
    name: 'Alice Employee',
    idNumber: '8807085800084',
    username: 'alice_employee',
    accountNumber: '6200000101',
    password: 'Employee@123',
    role: 'employee'
  },
  {
    name: 'Bob Staff',
    idNumber: '9112155800085',
    username: 'bob_staff',
    accountNumber: '6200000102',
    password: 'Staff@456',
    role: 'employee'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Hash passwords and create users
    for (const userData of users) {
      const passwordHash = await bcrypt.hash(userData.password + pepper, 12);
      
      const user = new User({
        name: userData.name,
        idNumber: userData.idNumber,
        username: userData.username,
        accountNumber: userData.accountNumber,
        password: passwordHash,
        role: userData.role
      });

      await user.save();
      console.log(`✅ Created ${userData.role}: ${userData.username} (Account: ${userData.accountNumber})`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('\n--- CUSTOMER ACCOUNTS ---');
    users.filter(u => u.role === 'customer').forEach(u => {
      console.log(`Username: ${u.username} | Account: ${u.accountNumber} | Password: ${u.password}`);
    });
    console.log('\n--- EMPLOYEE ACCOUNTS ---');
    users.filter(u => u.role === 'employee').forEach(u => {
      console.log(`Username: ${u.username} | Account: ${u.accountNumber} | Password: ${u.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

