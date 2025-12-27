import { useDispatch, useSelector } from 'react-redux';
import { signinUser, setFormData } from './authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export const SigninScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const formData = useSelector((s) => s.auth.formData);
  const from = location.state?.from?.pathname || '/phone';

  const handleChange = (e) => {
    dispatch(setFormData({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(signinUser({ email: formData.email, password: formData.password }));
    navigate(from, { replace: true });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg space-y-4">
      <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      <button type="submit" className="w-full bg-blue-600 text-white py-3">Sign In</button>
    </form>
  );
};
