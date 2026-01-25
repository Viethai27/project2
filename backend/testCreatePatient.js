async function testCreatePatient() {
  try {
    const patientData = {
      full_name: 'Test Emergency Patient',
      gender: 'Nam',
      phone: '0912345678',
      dob: '1990-01-01',
      id_card: '001234567890',
      address: '123 Test Street',
      email: 'test@email.com'
    };

    console.log('📤 Sending request with data:', patientData);
    
    const response = await fetch('http://localhost:5000/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientData)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error:', data);
      console.error('Status:', response.status);
    } else {
      console.log('✅ Success:', data);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCreatePatient();
