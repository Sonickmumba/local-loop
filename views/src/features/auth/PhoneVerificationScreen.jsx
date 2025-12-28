// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// export const PhoneVerificationScreen = () => {
//   const navigate = useNavigate();
//   const [otp, setOtp] = useState('');
//   const [countdown, setCountdown] = useState(60);

//   useEffect(() => {
//     if (countdown <= 0) return;
//     const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//     return () => clearTimeout(timer);
//   }, [countdown]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // call verify OTP API
//     navigate('/welcome');
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg space-y-4">
//         <input
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//           placeholder="Enter OTP"
//           required
//         />
//         <button type="submit" className="w-full bg-blue-600 text-white py-3">
//           Verify
//         </button>
//         <p>Resend OTP in {countdown}s</p>
//       </form>
//     </div>
//   );
// };



import { useState } from 'react';
import { Smartphone } from 'lucide-react';

export function PhoneVerificationScreen({ onNext }) {
  const [step, setStep] = useState('phone'); // 'phone' | 'code'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setStep('code');
  };

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleVerify = () => {
    onNext();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Smartphone className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="mb-3">
            {step === 'phone' ? 'Verify Your Phone' : 'Enter Verification Code'}
          </h1>
          <p className="text-gray-600">
            {step === 'phone'
              ? "We'll send you a verification code"
              : `Code sent to ${phoneNumber}`}
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm mb-2 text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-full hover:bg-blue-700 transition-colors"
            >
              Send Code
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-2 justify-center">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleCodeChange(index, e.target.value)
                  }
                  className="w-12 h-14 text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={code.some((d) => !d)}
              className={`w-full py-4 rounded-full transition-colors ${
                code.every((d) => d)
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Verify
            </button>

            <button
              onClick={() => setStep('phone')}
              className="w-full text-gray-600 hover:text-gray-800 text-sm"
            >
              Resend Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
