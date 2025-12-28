// import { useState } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  // useNavigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';

import { WelcomeScreen } from './features/welcome/WelcomeScreen';
import { LocationPermissionScreen } from './features/location/LocationPermissionScreen';
import { InterestsSelectionScreen } from './features/interests/InterestsSelectionScreen';
import { LoginLayout } from './features/auth/LoginLayout';
import { SignupScreen } from './features/auth/SignupScreen';
import { SigninScreen } from './features/auth/SigninScreen';
import { PhoneVerificationScreen } from './features/auth/PhoneVerificationScreen';
import { RequireAuth } from './features/auth/RequireAuth';

// import { LoginSignupScreen } from './features/auth/LoginSignupScreen';

import './App.css';

function App() {
  // Location permission and coordinates from Redux store
  const { permission, coords } = useSelector((s) => s.location);
  console.log('Location permission:', permission, 'Coords:', coords);

  return (
    // <Router>
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/location" element={<LocationPermissionScreen />} />
        <Route path="/interests" element={<InterestsSelectionScreen />} />
        {/* <Route path="/login" element={<LoginSignupScreen />} /> */}

        <Route path="/auth" element={<LoginLayout />}>
          <Route index element={<Navigate to="signup" replace />} />
          <Route path="signup" element={<SignupScreen coords={coords} />} />
          <Route path="signin" element={<SigninScreen />} />
        </Route>

        <Route path="/phone" element={<PhoneVerificationScreen />} />
      </Routes>
    </div>
    // </Router>
  );
}

export default App;
