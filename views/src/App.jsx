import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  // useNavigate,
} from 'react-router-dom';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bootstrapSession } from './features/auth/authSlice';

import { WelcomeScreen } from './features/welcome/WelcomeScreen';
import { LocationPermissionScreen } from './features/location/LocationPermissionScreen';
import { InterestsSelectionScreen } from './features/interests/InterestsSelectionScreen';
import { LoginLayout } from './features/auth/LoginLayout';
import { SignupScreen } from './features/auth/SignupScreen';
import { SigninScreen } from './features/auth/SigninScreen';
import { PhoneVerificationScreen } from './features/auth/PhoneVerificationScreen';
import { RequireAuth } from './features/auth/RequireAuth';
import { HomeFeedScreen } from './features/home/HomeFeedScreen';
import { CreateListing } from './features/listings/CreateListing';
import { HomeSearchScreen } from './features/home/HomeSearchScreen';

import './App.css';

function App() {
  const dispatch = useDispatch();
  const initialized = useSelector(s => s.auth.initialized);

  // Location permission and coordinates from Redux store
  const { coords } = useSelector((s) => s.location);

  useEffect(() => {
    dispatch(bootstrapSession());
  }, [dispatch]);

  if (!initialized) return <div>Loading...</div>;

  return (
    // <Router>
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/location" element={<LocationPermissionScreen />} />
        <Route path="/interests" element={<InterestsSelectionScreen />} />

        <Route path="/auth" element={<LoginLayout />}>
          <Route index element={<Navigate to="signup" replace />} />
          <Route path="signup" element={<SignupScreen coords={coords} />} />
          <Route path="signin" element={<SigninScreen />} />
        </Route>

        <Route path="/phone" element={<PhoneVerificationScreen />} />
        {/* Protected routes */}
        <Route
          path="/home/feed"
          element={
            <RequireAuth>             
              <HomeFeedScreen />
            </RequireAuth>
          }
        />  
        <Route path='/create-listing' element={<RequireAuth><CreateListing /></RequireAuth>} />
        <Route path="/home/feed/search" element={<RequireAuth><HomeSearchScreen /></RequireAuth>} />
      </Routes>
    </div>
    // </Router>
  );
}

export default App;
