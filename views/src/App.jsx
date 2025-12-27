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

import './App.css';


function App() {
  const { permission, coords } = useSelector((s) => s.location);
  console.log('Location state in App:', { permission, coords });
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route path="/location" element={<LocationPermissionScreen/>} />
          <Route path="/interests" element={<InterestsSelectionScreen/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
