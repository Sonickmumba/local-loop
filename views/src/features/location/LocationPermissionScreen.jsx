import { MapPin } from 'lucide-react';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { reverseGeocode } from '../../features/util/geocoding';
import {
  setPermission,
  setCoords,
  setCityCountry,
} from '../../features/location/locationPermissionSlice';


export const LocationPermissionScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAllow = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      dispatch(setPermission('denied'));
      navigate('/');
      return;
    }
    // request geolocation
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        console.log('Geolocation success:', pos.coords);
        setLoading(false);
        const { latitude, longitude } = pos.coords;
        
        dispatch(setPermission('granted'));
        dispatch(setCoords({ lat: latitude, lng: longitude }));

        // Reverse-geocode to get the sit and country
        try {
          const { city, country } = await reverseGeocode(latitude, longitude);
          dispatch(setCityCountry({ city, country }));
        } catch (err) {
          console.warn('Reverse geocode failed:', err);
        }
        
        navigate('/interests');
      },
      (error) => {
        setLoading(false);
        console.warn('Location permission denied or error:', error.message);
        setErrorMsg('Location access was denied. You can still use the app.');
        dispatch(setPermission('denied'));
        navigate('/interests');
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSkip = () => {
    dispatch(setPermission('denied'));
    // navigate('/interests');
    onNext();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="mb-4">Enable Location</h1>
          <p className="text-lg text-gray-600">
            We need your location to connect you with neighbors in your area
          </p>
          {errorMsg && <p className="mt-2 text-sm text-red-500">{errorMsg}</p>}
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl">🎯</div>
            <div>
              <div className="mb-1">Find nearby requests</div>
              <p className="text-sm text-gray-600">
                See what's happening in your neighborhood
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl">🗺️</div>
            <div>
              <div className="mb-1">Map view</div>
              <p className="text-sm text-gray-600">
                Browse requests on an interactive map
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl">🔒</div>
            <div>
              <div className="mb-1">Privacy protected</div>
              <p className="text-sm text-gray-600">
                Your exact location is never shared
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleAllow}
            disabled={loading}
            className={`w-full py-4 rounded-full text-white transition-colors ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
            // className="w-full bg-blue-600 text-white py-4 rounded-full hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Allowing...' : 'Allow Location Access'}
          </button>

          <button
            onClick={handleSkip}
            className="w-full bg-white text-gray-700 py-4 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
};
