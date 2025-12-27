import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const PhoneVerificationScreen = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // call verify OTP API
    navigate('/welcome');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg space-y-4">
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-3">
          Verify
        </button>
        <p>Resend OTP in {countdown}s</p>
      </form>
    </div>
  );
};
