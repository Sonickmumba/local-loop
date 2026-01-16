import { useState, useEffect } from 'react';
import {
  Home,
  Search,
  Map,
  PlusCircle,
  MessageSquare,
  User,
  Bell,
  SlidersHorizontal,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useHomeFeed } from '../../hooks/useHomeFeed';
import { ListingCard } from '../../components/ListingCard';
import { FilterTabs } from '../../components/FilterTabs';
import { addListingRealtime } from './homeFeedSlice';
import socket from '../util/socket';
// import { useAuth } from '../../hooks/useAuth';

export function HomeFeedScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { listings, status, error } = useHomeFeed();
  const user = useSelector((s) => s.auth.user);
  const [activeTab, setActiveTab] = useState('all');

  const filteredListings = listings.filter((listing) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'offers') return listing.type === 'offer';
    if (activeTab === 'needs') return listing.type === 'need';
    return true;
  });

  // 🔴 REAL-TIME SUBSCRIPTION
  useEffect(() => {
    const handler = (listing) => {
      dispatch(addListingRealtime(listing));
    };

    socket.on('listing:new', handler);

    return () => {
      socket.off('listing:new', handler);
    };
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-center text-gray-500">Loading feed...</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  console.log(listings)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎉</span>
              <h2>LocalLoop</h2>
            </div>
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate('search')}
              className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Search className="w-5 h-5" />
              <span>Search listings...</span>
            </button>
            <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => navigate('map')}
            className="flex flex-col items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Map className="w-6 h-6 text-blue-600" />
            <span className="text-xs text-blue-600">Map View</span>
          </button>

          <button
            onClick={() => navigate('/create-listing')}
            className="flex flex-col items-center gap-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <PlusCircle className="w-6 h-6 text-green-600" />
            <span className="text-xs text-green-600">Create</span>
          </button>

          <button
            onClick={() => navigate('/chat-list')}
            className="flex flex-col items-center gap-2 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <MessageSquare className="w-6 h-6 text-purple-600" />
            <span className="text-xs text-purple-600">Messages</span>
          </button>
        </div>
      </div>

      <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Listings Feed */}
      <div className="px-4 py-4 space-y-4">
        {filteredListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-3 px-4">
          <button
            onClick={() => {
              if (location.pathname !== '/home/feed') {
                navigate('/home/feed');
              }
            }}
            className="flex flex-col items-center gap-1 text-blue-600"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>

          <button
            onClick={() => navigate('search')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600"
          >
            <Search className="w-6 h-6" />
            <span className="text-xs">Search</span>
          </button>

          <button
            onClick={() => navigate('/create-listing')}
            className="flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full -mt-8 shadow-lg hover:bg-blue-700"
          >
            <PlusCircle className="w-7 h-7 text-white" />
          </button>

          <button
            onClick={() => {
              if (!user) {
                navigate('/auth/signin');
                return;
              }
              navigate('/chat-list');
            }}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-xs">Chats</span>
          </button>

          <button
            onClick={() =>
              navigate(`/user-profile/${'me'}`)}
            // onClick={() => navigate('user-profile', { selectedUserId: 'me' })}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600"
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
