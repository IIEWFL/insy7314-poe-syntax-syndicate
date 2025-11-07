const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');

const pepper = process.env.PASSWORD_PEPPER || '';
console.log('🌶️  Using pepper:', pepper ? 'YES' : 'NO');

// Pre-configured users for Task 3 - South African names
const users = [
  // Customer accounts
  {
    name: 'Thabo Mokoena',
    idNumber: '9001015800081',
    username: 'thabo_mokoena',
    accountNumber: '6200000001',
    password: 'Thabo@2024',
    role: 'customer'
  },
  {
    name: 'Lerato Dlamini',
    idNumber: '8505125800082',
    username: 'lerato_dlamini',
    accountNumber: '6200000002',
    password: 'Lerato@2024',
    role: 'customer'
  },
  {
    name: 'Sipho Ndlovu',
    idNumber: '9203145800083',
    username: 'sipho_ndlovu',
    accountNumber: '6200000003',
    password: 'Sipho@2024',
    role: 'customer'
  },
  // Employee accounts
  {
    name: 'Nomsa Khumalo',
    idNumber: '8807085800084',
    username: 'nomsa_khumalo',
    accountNumber: '6200000101',
    password: 'Nomsa@2024',
    role: 'employee'
  },
  {
    name: 'Mandla Mthembu',
    idNumber: '9112155800085',
    username: 'mandla_mthembu',
    accountNumber: '6200000102',
    password: 'Mandla@2024',
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

