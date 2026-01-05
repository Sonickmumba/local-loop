import textflow from './services/textflow.js';

async function testOTP() {
  try {
    console.log('Testing Textflow OTP service...');
    console.log('Textflow initialized:', !!textflow);

    const result = await textflow.sendVerificationSMS('+260XXXXXXXXX', {
      service_name: 'LocalLoop',
      seconds: 600
    });

    console.log('OTP Send Result:', result);
  } catch (error) {
    console.error('OTP Send Error:', error);
  }
}

testOTP();