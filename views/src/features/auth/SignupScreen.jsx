import { useDispatch, useSelector } from 'react-redux';
import { setFormData, signupUser } from './authSlice';
import { useNavigate } from 'react-router-dom';

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
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg space-y-4">
      <input
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <input
        name="neighborhood"
        placeholder="Neighborhood"
        value={formData.neighborhood}
        onChange={handleChange}
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-3">
        Sign Up
      </button>
    </form>
  );
};
