# INSY7314 Task 3 - Employee Portal & International Payment System

A full-stack secure payment portal with customer and employee interfaces, implementing comprehensive security measures, DevSecOps pipeline, and complete payment workflow functionality.

## 🎬 Demo Video

The demo video for this project can be found at:
[https://github.com/IIEWFL/insy7314-poe-syntax-syndicate/blob/main/insy7314_task3_demo.mp4](https://github.com/IIEWFL/insy7314-poe-syntax-syndicate/blob/main/insy7314_task3_demo.mp4)


## 🛡️ Security Features

### Password Security (20 Marks)

* **Bcrypt + Salt + Pepper**: Passwords hashed with bcrypt (12 rounds) + automatic salt + environment-based pepper
* **JWT Authentication**: 8-hour token expiry with role-based access control
* **Input Validation**: RegEx whitelisting on both client and server
* **HTTPS/SSL**: All traffic encrypted with SSL certificates
* **Brute Force Protection**: Express Brute with configurable retry limits
* **Rate Limiting**: 300 requests per 10 minutes globally, 10 per 15 minutes on auth endpoints
* **Security Headers**: Helmet.js with CSP, HSTS, X-Frame-Options, X-Content-Type-Options
* **NoSQL Injection Prevention**: mongo-sanitize middleware
* **XSS Prevention**: Input sanitization and Content Security Policy
* **CORS Configuration**: Strict origin and credentials control

### DevSecOps Pipeline (30 Marks)

* **Static Application Security Testing (SAST)**: SonarCloud integration for code vulnerability scanning
* **Software Composition Analysis (SCA)**: npm audit + OWASP Dependency Check for dependency vulnerabilities
* **API Security Testing**: Automated endpoint testing, rate limiting verification, security header validation
* **CI/CD Integration**: GitHub Actions workflow on push/PR to main branch
* **Automated Build**: Frontend build verification on successful security scans

### Static Login (10 Marks)

* **Pre-configured Accounts**: No registration process - accounts seeded via script
* **Customer Accounts**: Thabo Mokoena, Lerato Dlamini, Sipho Ndlovu
* **Employee Accounts**: Nomsa Khumalo, Mandla Mthembu
* **Password Format**: `Name@2024` (e.g., `Thabo@2024`)
* **Role-Based Access**: Customers and employees have different portal access

## 💼 Overall Functioning (20 Marks)

### Customer Portal

* **Login**: Secure authentication with username or account number
* **Dashboard**: Payment history overview with quick actions
* **Send Money**: Create internal transfers or international payments
* **Payment Types**:
  - **Internal Transfer**: Send money to other users by account number
  - **International Payment**: Send money via SWIFT with full beneficiary details
* **Payment History**: View all submitted payments with status (Pending/Approved/Rejected)

### Employee Portal

* **Login**: Secure authentication for staff members
* **Dashboard**: View all customer payment requests
* **Payment Management**:
  - View pending, approved, and rejected payments
  - Filter payments by status
  - Approve or reject payment requests
  - View payment type (Internal/International)
* **Real-time Updates**: Payment status changes reflect immediately

### Payment Workflow

1. **Customer** logs in and creates payment (internal or international)
2. Payment status set to **Pending**
3. **Employee** logs in and views pending payments
4. Employee **approves** or **rejects** payment
5. Payment status updates to **Approved** or **Rejected**
6. Customer can view updated status in payment history

### Design Theme

* **Purple Gradient**: Modern purple gradient (#8b5cf6 to #6366f1) with glassmorphism
* **Professional UI**: Clean, modern interface with React Bootstrap
* **Responsive Design**: Mobile-first responsive layout
* **Smooth Animations**: CSS transitions and hover effects

## 🚀 Getting Started

### Prerequisites

* Node.js 18+ installed
* MongoDB Atlas account with connection string
* SSL certificates in backend/keys/ directory

### Installation

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Environment Variables

Create a `.env` file in the root directory:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/paymentportal?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
PASSWORD_PEPPER=your_pepper_value_here
PORT=5000
HTTPS=true
```

### Generate SSL Certificates

```bash
node generate-certs.js
```

### Seed Database

```bash
node backend/scripts/seedUsers.js
```

### Running the Application

```bash
# Start backend (Terminal 1)
npm start

# Start frontend (Terminal 2)
npm run frontend
```

* Backend: [https://localhost:5000](https://localhost:5000)
* Frontend: [https://localhost:3000](https://localhost:3000)

## 🗁 Project Structure

```
insy7314-poe-syntax-syndicate/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── devsecops.yml          # DevSecOps pipeline
├── backend/
│   ├── keys/
│   │   ├── server.crt             # SSL certificate
│   │   └── privatekey.pem         # SSL private key
│   ├── middleware/
│   │   └── auth.js                # JWT authentication
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── payment.js             # Payment schema
│   ├── routes/
│   │   ├── user.js                # Auth routes
│   │   └── payment.js             # Payment routes
│   ├── scripts/
│   │   └── seedUsers.js           # Database seeding
│   └── server.js                  # Express server
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── contexts/
│       │   └── AuthContext.js     # Auth state management
│       ├── pages/
│       │   ├── Login.js           # Login page
│       │   ├── Dashboard.js       # Customer dashboard
│       │   ├── Payment.js         # Payment creation
│       │   └── EmployeeDashboard.js  # Employee portal
│       ├── App.js
│       └── index.js
├── .env                           # Environment variables
├── package.json
├── generate-certs.js              # SSL certificate generator
├── sonar-project.properties       # SonarCloud config
└── README.md
```

## 🔒 Security Implementation Details

### Input Validation Patterns

```javascript
const validationPatterns = {
  name: /^[A-Za-z \-]{2,60}$/,
  username: /^[A-Za-z0-9_]{3,20}$/,
  accountNumber: /^[0-9]{8,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,72}$/,
  amount: /^[0-9]+(\.[0-9]{1,2})?$/,
  swiftCode: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
  beneficiaryName: /^[A-Za-z \-]{2,100}$/,
};
```

### Authentication Flow

1. User submits credentials (username/account number + password)
2. Client-side validation and sanitization
3. HTTPS request to backend `/api/user/login`
4. Backend validates with bcrypt + pepper
5. JWT token generated with user ID and role
6. Token stored in localStorage
7. Automatic token inclusion in subsequent requests via axios interceptor
8. Protected routes verify token and role

### Security Headers (Helmet.js)

* **Content Security Policy (CSP)**: Restricts resource loading
* **HTTP Strict Transport Security (HSTS)**: Forces HTTPS
* **X-Frame-Options**: Prevents clickjacking
* **X-Content-Type-Options**: Prevents MIME sniffing
* **Referrer-Policy**: Controls referrer information

### Rate Limiting Configuration

```javascript
// Global rate limit: 300 requests per 10 minutes
// Auth endpoints: 10 requests per 15 minutes
// Brute force protection: 5 free retries, then exponential backoff
```

## 🧪 Testing

### Test Accounts

**Customer Accounts:**
* Username: `thabo_mokoena` | Password: `Thabo@2024` | Account: `6200000101`
* Username: `lerato_dlamini` | Password: `Lerato@2024` | Account: `6200000102`
* Username: `sipho_ndlovu` | Password: `Sipho@2024` | Account: `6200000103`

**Employee Accounts:**
* Username: `nomsa_khumalo` | Password: `Nomsa@2024` | Account: `6200000201`
* Username: `mandla_mthembu` | Password: `Mandla@2024` | Account: `6200000202`

### Testing Payment Workflow

1. **Login as Customer** (`thabo_mokoena` / `Thabo@2024`)
2. Click **"Send Money"** button
3. Select **"Internal Transfer"** or **"International"**
4. Fill payment form:
   - Internal: Account `6200000102`, Amount `500`, Description
   - International: Full beneficiary details + SWIFT code
5. Submit payment (status: Pending)
6. **Logout** and login as **Employee** (`nomsa_khumalo` / `Nomsa@2024`)
7. View pending payment in employee dashboard
8. Click **"Approve"** or **"Reject"**
9. Logout and login as customer to see updated status

### Testing Security Features

1. **Rate Limiting**: Try 10+ login attempts rapidly (should be blocked)
2. **Input Validation**: Try invalid characters in forms (should be rejected)
3. **HTTPS**: Verify all traffic uses SSL (check browser lock icon)
4. **JWT Expiry**: Token expires after 8 hours
5. **Role-Based Access**: Customers can't access `/employee-dashboard`

## 📋 Rubric Compliance

### ✅ Password Security [20 Marks]
* Bcrypt + salt + pepper hashing
* JWT authentication with role-based access
* Input validation (RegEx whitelisting)
* HTTPS/SSL encryption
* Rate limiting and brute force protection
* Security headers (Helmet, CSP, HSTS)
* NoSQL injection prevention

### ✅ DevSecOps Pipeline [30 Marks]
* **SAST**: SonarCloud code analysis
* **SCA**: npm audit + OWASP Dependency Check
* **API Testing**: Endpoint testing, rate limiting, security headers
* **CI/CD**: GitHub Actions on push/PR
* **Automated Build**: Frontend build verification

### ✅ Static Login [10 Marks]
* Pre-configured accounts (no registration)
* Seeded via `backend/scripts/seedUsers.js`
* 3 customers + 2 employees

### ✅ Overall Functioning [20 Marks]
* Customer portal → Employee portal integration
* Payment creation → approval workflow
* Internal + international payment types
* Real-time status updates
* Role-based access control
* All security measures active

## 📱 Responsive Design

The application is fully responsive and works on:

* Desktop (1200px+)
* Tablet (768px - 1199px)
* Mobile (320px - 767px)

## 👥 Team Members

* **Kitso Modise** — ST10203704
* **Nhlanhipho Nhlengethwa** — ST10203637
* **Mabitsela Malatji** — ST10203658
* **Tshedza Maluleke** — ST10203296
