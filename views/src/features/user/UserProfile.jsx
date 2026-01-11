// import { Screen } from '../App';
import { ArrowLeft, MapPin, Calendar, Star, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatMonthYear, timeAgo } from '../util/date';
import { useSelector } from 'react-redux';

export const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const isOwnProfile = userId === 'me';

  const [userProfile, setUserProfile] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [error, setError] = useState(null);

  const { isAuthenticated, initialized } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userId) return;
    if (!initialized) return;
    if (userId === 'me' && !isAuthenticated) return;

    const fetchUserProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/auth/user/${userId}`,
          {
            credentials: 'include',
          }
        );

        if (res.status === 401) {
          // User not authenticated, redirect to login
          navigate('/auth/signin');
          return;
        }

        if (!res.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await res.json();

        if (data.success) {
          setUserProfile(data.data);
        } else {
          setError('Failed to load user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user profile');
      }
    };

    const getUserListings = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/listings/user/${userId}`,
          { credentials: 'include' }
        );

        if (res.status === 401) {
          // User not authenticated, redirect to login
          navigate('/auth/signin');
          return;
        }

        if (!res.ok) {
          throw new Error('Failed to fetch user listings');
        }

        const data = await res.json();

        if (data.success) {
          setUserListings(data.data);
        } else {
          setError('Failed to load user listings');
        }
      } catch (error) {
        console.error('Error fetching user listings:', error);
        setError('Failed to load user listings');
      }
    };

    const getUserReviews = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/reviews/user/${userId}`,
          { credentials: 'include' }
        );

        if (res.status === 401) {
          // User not authenticated, redirect to login
          navigate('/auth/signin');
          return;
        }

        if (!res.ok) {
          throw new Error('Failed to fetch user reviews');
        }

        const data = await res.json();

        if (data.success) {
          setUserReviews(data.data);
        } else {
          setError('Failed to load user reviews');
        }
      } catch (error) {
        console.error('Error fetching user reviews:', error);
        setError('Failed to load user reviews');
      }
    };

    fetchUserProfile();
    getUserListings();
    getUserReviews();
  }, [userId, navigate, initialized, isAuthenticated]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/home/feed')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-center text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home/feed')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2>Profile</h2>
          </div>
          {isOwnProfile && (
            <button
              onClick={() => navigate('settings')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl">
              {userProfile?.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div className="flex-1">
              <h1 className="mb-2">{userProfile ? userProfile.name : ''}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{userProfile?.neighborhood}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Joined {formatMonthYear(userProfile?.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <div className="text-2xl">{userProfile?.rating ?? 0}</div>
              </div>
              <div className="text-sm text-gray-600">
                Rating ({userProfile?.total_ratings ?? 0})
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🤝</div>
              <div className="text-2xl">
                {userProfile?.completed_trades ?? 0}
              </div>
              <div className="text-sm text-gray-600">Trades</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">📝</div>
              <div className="text-2xl">
                {
                  userListings.filter((listing) => listing.status === 'active')
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
          </div>
        </div>

        {/* My Listings */}
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <h3 className="mb-4">{isOwnProfile ? 'My Listings' : 'Listings'}</h3>
          <div className="space-y-3">
            {userListings.map((listing) => (
              <div
                key={listing.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      listing.type === 'offer'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {listing.type === 'offer' ? 'Offering' : 'Looking for'}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      listing.status === 'active'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {listing.status}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                    {listing.category}
                  </span>
                </div>
                <div className="mb-2">{listing.title}</div>
                <div className="text-sm text-gray-600">
                  {listing.responses_count ?? 0} responses
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white px-6 py-6">
          <h3 className="mb-4">Reviews</h3>
          <div className="space-y-4">
            {userReviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-200 pb-4 last:border-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div>{review.reviewer_name}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-1">{review.content}</p>
                <div className="text-sm text-gray-500">
                  {timeAgo(review.created_at)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
