// Simple script to check experts in database and test the API
import http from 'http';

// First, let's test the API endpoint directly
const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/industry-experts/experts',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
}, (res) => {
  console.log(`statusCode: ${res.statusCode}`);
  console.log(`headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:', data);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();