// Client-side validation patterns that match backend whitelist patterns
export const validationPatterns = {
  name: /^[A-Za-z -]{2,60}$/,
  idNumber: /^[0-9]{1,13}$/,
  username: /^[A-Za-z0-9_]{3,20}$/,
  accountNumber: /^[0-9]{8,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,72}$/,
};

export const validationMessages = {
  name: 'Name must contain only letters, spaces, and hyphens (2-60 characters)',
  idNumber: 'ID number must contain only digits (1-13 characters)',
  username: 'Username must be 3-20 characters (letters, numbers, underscore only)',
  accountNumber: 'Account number must be 8-20 digits',
  password: 'Password must be 8-72 characters with at least one lowercase, uppercase, digit, and special character',
  confirmPassword: 'Passwords do not match',
  required: 'This field is required'
};

export const validateField = (fieldName, value, confirmValue = null) => {
  if (!value || value.trim() === '') {
    return validationMessages.required;
  }

  if (fieldName === 'confirmPassword') {
    if (value !== confirmValue) {
      return validationMessages.confirmPassword;
    }
    return null;
  }

  const pattern = validationPatterns[fieldName];
  if (pattern && !pattern.test(value)) {
    return validationMessages[fieldName];
  }

  return null;
};

export const validateForm = (formData, step = null) => {
  const errors = {};

  // Step 1 validation (Personal Information)
  if (step === null || step === 1) {
    const nameError = validateField('name', formData.name);
    if (nameError) errors.name = nameError;

    const idError = validateField('idNumber', formData.idNumber);
    if (idError) errors.idNumber = idError;
  }

  // Step 2 validation (Account Information)
  if (step === null || step === 2) {
    const usernameError = validateField('username', formData.username);
    if (usernameError) errors.username = usernameError;
  }

  // Step 3 validation (Security)
  if (step === null || step === 3) {
    const passwordError = validateField('password', formData.password);
    if (passwordError) errors.password = passwordError;

    const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword, formData.password);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  }

  return errors;
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, text: 'Enter a password', color: '#6c757d' };
  
  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[^\w\s]/.test(password),
    longLength: password.length >= 12
  };

  // Calculate score
  Object.values(checks).forEach(check => {
    if (check) score++;
  });

  // Determine strength
  if (score < 3) {
    return { score, text: 'Weak', color: '#dc3545' };
  } else if (score < 5) {
    return { score, text: 'Medium', color: '#ffc107' };
  } else if (score < 6) {
    return { score, text: 'Strong', color: '#28a745' };
  } else {
    return { score, text: 'Very Strong', color: '#20c997' };
  }
};
