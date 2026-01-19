// import { Screen } from '../App';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, MessageSquare, User } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

export const ListingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { listingId } = useParams();

  const user = useSelector((state) => state.auth.user);
  const listingsFromStore = useSelector((s) => s.homeFeed.listings);
  const listingFromRedux = listingsFromStore.find(
    (l) => String(l.id) === listingId
  );

  const [listing, setListing] = useState(
    location.state?.listing || listingFromRedux || null
  );
  const [error, setError] = useState(null);

  const isSelfListing = user?.id === listing?.user_id;
  const isDisabled = !user || isSelfListing;

  const [similarListings, setSimilarListings] = useState([]);

  useEffect(() => {
    if (!listing) {
      fetchListing();
    }
    fetchSimilarListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  const handleSendMessage = async () => {
    if (isDisabled) return;

    if (!user) {
      navigate('/auth/signin');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/conversations',
        {
          listingId: listing.id, // <-- listing ID
          participantId: listing.user_id, // <-- listing owner ID
        },
        { withCredentials: true }
      );
      // Optional: Add slight delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 300));
      navigate(`/chat-conversation?chatId=${response.data.data.id}`);
    } catch (error) {
      console.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to create conversation'
      );
    }
  };
  
  async function fetchListing() {
    try {
      const response = await fetch(
        `http://localhost:3000/api/listings/${listingId}`,
        { credentials: 'include' }
      );

      if (response.status === 401) {
        // User not authenticated, redirect will be handled by RequireAuth
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch listing');
      }

      const result = await response.json();
      setListing(result.data);
    } catch {
      setError('Failed to load listing');
    }
  }

  const fetchSimilarListings = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/listings/${listingId}/similar`,
        { credentials: 'include' }
      );

      if (res.status === 401) {
        // User not authenticated, redirect will be handled by RequireAuth
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch similar listings');
      }

      const data = await res.json();

      if (data.success) {
        setSimilarListings(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching similar listings:', error);
    }
  };

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

  if (!listing) {
    return <div>Loading...</div>;
  }

  console.log(listing)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/home/feed')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2>Listing Details</h2>
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        {/* Listing Content */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                listing.type === 'offer'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700'
              }`}
            >
              {listing.type === 'offer' ? '🤝 Offering' : '🙋 Looking for'}
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
              {listing.category}
            </span>
          </div>

          <h1 className="mb-4">{listing.title}</h1>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {listing.description}
          </p>

          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>
                {listing.neighborhood} • {listing.distance} km away
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>Posted {listing.timeAgo}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MessageSquare className="w-5 h-5" />
              <span>{listing.responses_count} people responded</span>
            </div>
          </div>
        </div>

        {/* Author Info */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="mb-3 text-gray-600">Posted by</div>
          <button
            onClick={() => navigate(`/user-profile/${listing.user_id}`)}
            className="flex items-center gap-3 w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white">
              {listing.author_name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div className="flex-1 text-left">
              <div className="mb-1">{listing.author_name}</div>
              <div className="text-sm text-gray-600">
                ⭐ {listing.author_rating} • {listing.completed_trades} trades
                completed
              </div>
            </div>
            <User className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Related Listings */}
        <div className="p-6">
          <h3 className="mb-4">Similar Listings</h3>
          {similarListings.length === 0 ? (
            <p className="text-sm text-gray-500">No similar listings found.</p>
          ) : (
            <div className="space-y-3">
              {similarListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                  onClick={() => navigate(`/listing-details/${listing.id}`)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                      {listing.category}
                    </span>
                  </div>
                  <div className="mb-2">{listing.title}</div>
                  <div className="text-sm text-gray-600">
                    {listing?.neighborhood}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            disabled={isDisabled}
            onClick={handleSendMessage}
            className={`
        w-full py-4 rounded-full transition-colors flex items-center justify-center gap-2
        ${
          isDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
        }
      `}
          >
            <MessageSquare className="w-5 h-5" />
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};
