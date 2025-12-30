import { useDispatch, useSelector } from 'react-redux';
import { signinUser, setFormData } from './authSlice';
import { useNavigate } from 'react-router-dom';
import { resetFormData } from './authSlice';
import { startSignin } from './authSlice';

export const SigninScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const location = useLocation();
  const formData = useSelector((s) => s.auth.formData);

  // const from = location.state?.from?.pathname || '/phone';

  const handleChange = (e) => {
    dispatch(setFormData({ [e.target.name]: e.target.value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const result = await dispatch(
  //     signinUser({
  //       email: formData.email,
  //       password: formData.password,
  //     })
  //   );

  //   if (signinUser.fulfilled.match(result)) {
  //     dispatch(resetFormData());
  //     navigate('/home/feed', { replace: true });
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  dispatch(startSignin());

  try {
    const result = await dispatch(
      signinUser({
        email: formData.email,
        password: formData.password,
      })
    ).unwrap(); // <-- unwrap automatically throws if rejected

    // If login successful
    dispatch(resetFormData());
    navigate('/home/feed', { replace: true });
  } catch (err) {
    console.error('Signin failed:', err);
  }
};


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg border border-gray-200 space-y-4"
    >
      <div>
        <label className="block text-sm mb-2 text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-2 text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
      >
        Sign In
      </button>
    </form>
  );
};
