# Customer International Payments Portal

A secure React-based frontend for the International Payment System, implementing comprehensive security measures and a modern, professional user interface.

## 🎬 Demo Video

The demo video for this project can be found at:
[https://github.com/IIEWFL/insy7314-part-2-syntax-syndicate-1/blob/main/insy7314_demo.mp4](https://github.com/IIEWFL/insy7314-part-2-syntax-syndicate-1/blob/main/insy7314_demo.mp4)


## 🛡️ Security Features

### Password Security

* **Bcrypt Hashing**: Passwords hashed with salt and pepper on the backend
* **Client-side Validation**: Real-time password strength indicator
* **Secure Storage**: JWT tokens stored securely in localStorage
* **Password Requirements**: Complex password policy enforced

### Input Whitelisting

* **RegEx Patterns**: Comprehensive whitelist patterns for all inputs
* **Client-side Validation**: Real-time input sanitization
* **Server-side Validation**: Backend validation mirrors frontend patterns
* **XSS Prevention**: Input sanitization prevents script injection

### SSL/TLS Security

* **HTTPS Enforcement**: All traffic served over SSL
* **Certificate Integration**: Uses backend SSL certificates
* **Secure Headers**: CSP and security headers implemented
* **Mixed Content Prevention**: All resources loaded over HTTPS

### Attack Protection

* **Rate Limiting**: Express rate limiting on authentication endpoints
* **Helmet.js**: Security headers and CSP policies
* **CORS Protection**: Strict CORS configuration
* **Input Sanitization**: MongoDB injection prevention
* **JWT Security**: Secure token management and validation

## 🎨 UI Features

### Design Theme

* **Orange & White**: Professional orange (#ff6b35) and white color scheme
* **Modern Typography**: Inter font family for clean readability
* **Responsive Design**: Mobile-first responsive layout
* **Smooth Animations**: CSS transitions and animations

### 3-Step Registration Process

1. **Personal Information**: Name and ID number validation
2. **Account Details**: Username selection with availability check
3. **Security Setup**: Password creation with strength indicator

### Pages Implemented

* **Home Page**: Landing page with features and team information
* **Registration**: 3-step secure registration process
* **Login**: Dual login (username/account number) with security notices
* **Dashboard**: Transaction overview with R10,000 dummy balance

## 🚀 Getting Started

### Prerequisites

* Node.js 16+ installed
* Backend server running on [https://localhost:5000](https://localhost:5000)
* SSL certificates in backend/keys/ directory

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm start
```

The application will start on [https://localhost:3000](https://localhost:3000)

### Environment Variables

Create a `.env` file in the frontend directory:

```
HTTPS=true
SSL_CRT_FILE=../backend/keys/server.crt
SSL_KEY_FILE=../backend/keys/privatekey.pem
REACT_APP_API_URL=https://localhost:5000
PORT=3000
```

## 🗁 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   └── SecurityNotice.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── Dashboard.js
│   ├── utils/
│   │   └── validation.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── .env
```

## 🔒 Security Implementation Details

### Input Validation Patterns

```javascript
const validationPatterns = {
  name: /^[A-Za-z \-]{2,60}$/,
  idNumber: /^[0-9]{1,13}$/,
  username: /^[A-Za-z0-9_]{3,20}$/,
  accountNumber: /^[0-9]{8,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,72}$/,
};
```

### Authentication Flow

1. User submits credentials
2. Client-side validation and sanitization
3. HTTPS request to backend API
4. JWT token received and stored
5. Automatic token inclusion in subsequent requests
6. Token validation on protected routes

### Security Headers

* Content Security Policy (CSP)
* HTTP Strict Transport Security (HSTS)
* X-Frame-Options
* X-Content-Type-Options
* Referrer-Policy

## 🎯 Task 3 Preparation

The dashboard includes placeholders for:

* Transaction management interface
* Payment processing forms
* Account analytics
* Export functionality

All components are designed to be easily extended for full transaction capabilities.

## 📱 Responsive Design

The application is fully responsive and works on:

* Desktop (1200px+)
* Tablet (768px - 1199px)
* Mobile (320px - 767px)

## 🧪 Testing

To test the security features:

1. Try registering with invalid inputs (should be blocked)
2. Test password strength requirements
3. Verify HTTPS enforcement
4. Check JWT token handling
5. Test rate limiting on login attempts

## 📋 Compliance

This implementation meets all project requirements:

* Password hashing and salting
* RegEx input whitelisting
* SSL/TLS encryption
* Comprehensive attack protection
* Professional UI design
* 3-step registration process
* Secure authentication system


## 👥 Team Members

* **Kitso Modise** — ST10203704
* **Nhlanhipho Nhlengethwa** — ST10203637
* **Mabitsela Malatji** — ST10203658
* **Tshedza Maluleke** — ST10203296
