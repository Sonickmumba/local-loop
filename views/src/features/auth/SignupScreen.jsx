import { useDispatch, useSelector } from 'react-redux';
import { setFormData, signupUser } from './authSlice';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export const SignupScreen = ({ coords }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formData = useSelector((s) => s.auth.formData);

  const handleChange = (e) => {
    dispatch(setFormData({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(
      signupUser({
        ...formData,
        latitude: coords?.latitude,
        longitude: coords?.longitude,
      })
    );
    navigate('/phone');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="mb-2">Join LocalLoop</h1>
          <p className="text-gray-600">Connect with your neighborhood</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg border border-gray-200 space-y-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm mb-2 text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email-signup"
              className="block text-sm mb-2 text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email-signup"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password-signup"
              className="block text-sm mb-2 text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password-signup"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="neighborhood"
              className="block text-sm mb-2 text-gray-700"
            >
              Neighborhood
            </label>
            <input
              type="text"
              id="neighborhood"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Downtown, West End"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm mb-2 text-gray-700">
              Phone Number
            </label>
            <PhoneInput
              id="phone"
              defaultCountry="ZM"
              name="phone"
              value={formData.phone}
              onChange={(value) => dispatch(setFormData({ phone: value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};
