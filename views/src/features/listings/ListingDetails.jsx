// import { Screen } from '../App';
import { ArrowLeft, MapPin, Clock, MessageSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// interface ListingDetailsScreenProps {
//   navigate: (screen: Screen, state?: any) => void;
//   listingId?: string;
// }

export const ListingDetailsScreen = ({ listingId }) => {
    const navigate = useNavigate();
  // Mock listing data
  const listing = {
    id: listingId || '1',
    type: 'offer',
    category: 'Skills',
    title: 'Free guitar lessons for beginners',
    description: 'I\'ve been playing guitar for over 10 years and would love to help beginners get started on their musical journey. I can teach basic chords, strumming patterns, and simple songs. Available on weekends, happy to meet at a local coffee shop or park.',
    author: 'Sarah Martinez',
    authorId: 'user1',
    neighborhood: 'Downtown',
    distance: '0.5 mi',
    timeAgo: '2 hours ago',
    responses: 5
  };

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
            <span className={`px-3 py-1 rounded-full text-sm ${
              listing.type === 'offer'
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-100 text-orange-700'
            }`}>
              {listing.type === 'offer' ? '🤝 Offering' : '🙋 Looking for'}
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
              {listing.category}
            </span>
          </div>

          <h1 className="mb-4">{listing.title}</h1>

          <p className="text-gray-700 mb-6 leading-relaxed">{listing.description}</p>

          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{listing.neighborhood} • {listing.distance} away</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>Posted {listing.timeAgo}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MessageSquare className="w-5 h-5" />
              <span>{listing.responses} people responded</span>
            </div>
          </div>
        </div>

        {/* Author Info */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="mb-3 text-gray-600">Posted by</div>
          <button
            onClick={() => navigate('user-profile', { selectedUserId: listing.authorId })}
            className="flex items-center gap-3 w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white">
              {listing.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 text-left">
              <div className="mb-1">{listing.author}</div>
              <div className="text-sm text-gray-600">⭐ 4.8 • 23 trades completed</div>
            </div>
            <User className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Related Listings */}
        <div className="p-6">
          <h3 className="mb-4">Similar Listings</h3>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                    Skills
                  </span>
                </div>
                <div className="mb-2">Piano lessons for kids</div>
                <div className="text-sm text-gray-600">West End • 1.5 mi</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('chat-conversation', { selectedChatId: listing.id })}
            className="w-full bg-blue-600 text-white py-4 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
