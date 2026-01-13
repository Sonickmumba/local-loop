// import { Screen } from '../App';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Lock, MapPin, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../auth/authSlice';

// interface SettingsScreenProps {
//   navigate: (screen: Screen, state?: any) => void;
// }

export const UserSettings = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
  const settingSections = [
    {
      title: 'Account',
      items: [
        { icon: Bell, label: 'Notifications', description: 'Manage notification preferences' },
        { icon: Lock, label: 'Privacy', description: 'Control your privacy settings' },
        { icon: MapPin, label: 'Location', description: 'Update your neighborhood' }
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', description: 'Get help and support' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            // onClick={() => navigate('/user-profile', { selectedUserId: 'me' })}
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2>Settings</h2>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {settingSections.map((section, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm">{section.title}</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  className="w-full px-4 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="mb-1">{item.label}</div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* App Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-1">LocalLoop v1.0.0</p>
            <p>Building stronger communities</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            dispatch(logoutUser());
            navigate('/auth/signin');
          }}
          className="w-full bg-white border border-red-300 text-red-600 py-4 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}
