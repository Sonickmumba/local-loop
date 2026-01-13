import { useState } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const ReviewRating = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { tradeId, revieweeId, partnerName, listingTitle } =
    location.state || {};

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [tag, setTag] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          tradeId,
          revieweeId,
          rating,
          content: review,
          tag,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }
      alert('Thank you for your review!');

      navigate('/home/feed');
    } catch (err) {
      alert(err.message);
    }
  };

  if (!tradeId || !revieweeId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Invalid review request
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/trade-management')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2>Leave a Review</h2>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Partner Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
              {partnerName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div className="mb-2">{partnerName}</div>
            <div className="text-sm text-gray-600">Re: {listingTitle}</div>
          </div>

          {/* Rating */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-center mb-6">How was your experience?</h3>
            <div className="flex justify-center gap-3 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      (hoveredRating || rating) >= star
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <div className="text-center text-lg mb-4">
                {rating === 5 && '🌟 Amazing!'}
                {rating === 4 && '😊 Great!'}
                {rating === 3 && '🙂 Good'}
                {rating === 2 && '😐 Okay'}
                {rating === 1 && '😕 Not great'}
              </div>
            )}
          </div>

          {/* Review Text */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="mb-4">Share your experience</h3>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell others about your experience..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              Your review helps build a trusted community
            </p>
          </div>

          {/* Quick Tags */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="mb-4">Add tags (optional)</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'Reliable',
                'Friendly',
                'Professional',
                'On time',
                'Great communication',
                'Helpful',
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTag(tag)}
                  className="px-4 py-2 bg-gray-100 hover:bg-blue-100 hover:text-blue-600 rounded-full text-sm transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={rating === 0 || review.trim() === ''}
            className={`w-full py-4 rounded-full transition-colors ${
              rating > 0 && review.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};
