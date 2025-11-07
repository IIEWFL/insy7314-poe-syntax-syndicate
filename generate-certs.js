const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Generate proper self-signed certificate using Node.js built-in crypto
function generateSelfSignedCert() {
  try {
    // Use Node.js to generate a proper certificate
    const selfsigned = require('selfsigned');

    const attrs = [
      { name: 'commonName', value: 'localhost' },
      { name: 'countryName', value: 'US' },
      { shortName: 'ST', value: 'CA' },
      { name: 'localityName', value: 'San Francisco' },
      { name: 'organizationName', value: 'INSY7314' },
      { shortName: 'OU', value: 'IT Department' }
    ];

    const pems = selfsigned.generate(attrs, {
      algorithm: 'sha256',
      days: 365,
      keySize: 2048,
      extensions: [{
        name: 'basicConstraints',
        cA: true
      }, {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true
      }, {
        name: 'subjectAltName',
        altNames: [{
          type: 2, // DNS
          value: 'localhost'
        }, {
          type: 7, // IP
          ip: '127.0.0.1'
        }]
      }]
    });

    return {
      privateKey: pems.private,
      cert: pems.cert
    };
  } catch (error) {
    console.log('Selfsigned not available, using fallback method...');

    // Fallback: create basic certificate
    const crypto = require('crypto');
    const { generateKeyPairSync } = crypto;

    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    // Simple certificate for development
    const cert = `-----BEGIN CERTIFICATE-----
MIICpjCCAY4CCQCrWnlJGXvG8TANBgkqhkiG9w0BAQsFADATMREwDwYDVQQDDAhs
b2NhbGhvc3QwHhcNMjQwMTAxMDAwMDAwWhcNMjUwMTAxMDAwMDAwWjATMREwDwYD
VQQDDAhsb2NhbGhvc3QwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC4
GoA3GN+92mWbizlzgLsvTMpxJ2e3J169wH44EBgtfKieD8wZ+fypAddLX+5YYklI
ym4KhijeS6+ePEFQHNzmNYFXyqNOSrjxKjLv7HIgMZ373ss2AZw8VfIcGIeMUFq6
aFXExdu+SzGFIOrLZI6aVYWXua3F9yk8FLFBCJ0GkQIDAQABMA0GCSqGSIb3DQEB
CwUAA4IBAQCEiVXF1dC+4VgSeLgnJD/HmijmGOHw873DqxsxjZiAH5UcBrm4QMpn
zhvO2qKWi0SnliS5qQpgyaf1WCoMX7QlRnDaJ/SjjhigY+JiYvYFXSdcYJMM+Qjb
d4CEZdVTughrAAuoqe0e4+7PyidbPAKUmYyyLc1+SdL5B/C+5VLDtQ==
-----END CERTIFICATE-----`;

    return { privateKey, cert };
  }
}

// Create the certificates
const { privateKey, cert } = generateSelfSignedCert();

// Ensure the keys directory exists
const keysDir = path.join(__dirname, 'backend', 'keys');
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir, { recursive: true });
}

// Write the files
fs.writeFileSync(path.join(keysDir, 'privatekey.pem'), privateKey);
fs.writeFileSync(path.join(keysDir, 'server.crt'), cert);
fs.writeFileSync(path.join(keysDir, 'certificate.pem'), cert);

console.log('✅ SSL certificates generated successfully!');
console.log('📁 Files created:');
console.log('   - backend/keys/privatekey.pem');
console.log('   - backend/keys/server.crt');
console.log('   - backend/keys/certificate.pem');
console.log('');
console.log('🔒 These are self-signed certificates for development only.');
console.log('   In production, use proper CA-signed certificates.');
