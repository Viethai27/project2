import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

async function testSearchAPI() {
  try {
    // First login to get token
    console.log('1. Logging in...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'mai.hoang@pamec.com',
        password: 'Doctor123'
      })
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful');
    console.log('Token:', token.substring(0, 50) + '...');
    console.log('User:', loginData.user);
    
    // Test search endpoint
    console.log('\n2. Testing search patient API...');
    const searchResponse = await fetch(`${API_URL}/patients/search?q=0934567890`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const searchData = await s, error.message);onsole.error('\n❌ Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testSearchAPI();
