import textflow from '../services/textflow.js';

/**
 * Send OTP
 */
export const sendPhoneOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // TEMPORARY: Mock successful response for testing
    // console.log(`MOCK: Would send OTP to ${phone}`);
    // res.json({
    //   message: 'OTP sent successfully',
    // });

    // ORIGINAL CODE (commented out for testing):
    const result = await textflow.sendVerificationSMS(phone, {
      service_name: 'LocalLoop',
      seconds: 600, // 10 minutes
    });

    if (!result.ok) {
      return res.status(result.status).json({
        message: result.message,
      });
    }

    res.json({
      message: 'OTP sent successfully',
    });
  } catch (err) {
    console.error('Textflow send OTP error:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

/**
 * Verify OTP
 */
export const verifyPhoneOtp = async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ message: 'Phone and code are required' });
    }

    // TEMPORARY: Mock successful verification for testing
    // console.log(`MOCK: Would verify OTP ${code} for ${phone}`);
    // if (code === '123456') { // Accept any 6-digit code for testing
    //   res.json({
    //     message: 'Phone number verified successfully',
    //   });
    // } else {
    //   return res.status(400).json({ message: 'Invalid or expired OTP' });
    // }

    // ORIGINAL CODE (commented out for testing):
    const result = await textflow.verifyCode(phone, code);

    if (!result.ok) {
      return res.status(result.status).json({
        message: result.message,
      });
    }

    if (!result.valid) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.json({
      message: 'Phone number verified successfully',
    });
  } catch (err) {
    console.error('Textflow verify OTP error:', err);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};
