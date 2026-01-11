import { useState } from 'react';
// import { Screen } from '../App';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, MessageSquare } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api';

export function TradeNegotiationScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const { listingId, ownerId, listingTitle, ownerName } = location.state || {};

  const [formData, setFormData] = useState({
    tradeDate: '',
    tradeTime: '',
    location: '',
    notes: '',
    requesterOffer: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/trades`, {
        method: 'POST',
        credentials: 'include', // REQUIRED for cookie auth
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId,
          ownerId,
          requesterOffer: formData.requesterOffer,
          tradeDate: formData.tradeDate,
          tradeTime: formData.tradeTime,
          location: formData.location,
          notes: formData.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error('You already proposed a trade for this listing');
        }
        throw new Error(data.message);
      }

      navigate('/trade-management', {
        state: { selectedTradeId: data.trade.id },
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (!listingId || !ownerId) {
    return <div className="p-4 text-red-600">Invalid trade context</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2>Propose a Trade</h2>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Trade Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="text-sm text-gray-600 mb-3">You're trading with</div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white">
              SM
            </div>
            <div>
              <div className="mb-1">{ownerName}</div>
              <div className="text-sm text-gray-600">⭐ 4.8 rating</div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎸</span>
              <div>{listingTitle}</div>
            </div>
            <div className="text-sm text-gray-600">What they're offering</div>
          </div>
        </div>

        {/* Trade Details Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="mb-4">Trade Details</h3>

            {/* Date */}
            <div className="mb-4">
              <label htmlFor="date" className="block mb-2 text-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Preferred Date</span>
                </div>
              </label>
              <input
                type="date"
                id="date"
                value={formData.tradeDate}
                onChange={(e) =>
                  setFormData({ ...formData, tradeDate: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Time */}
            <div className="mb-4">
              <label htmlFor="time" className="block mb-2 text-gray-700">
                Preferred Time
              </label>
              <input
                type="time"
                id="time"
                value={formData.tradeTime}
                onChange={(e) =>
                  setFormData({ ...formData, tradeTime: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Location */}
            <div className="mb-4">
              <label htmlFor="location" className="block mb-2 text-gray-700">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Meeting Location</span>
                </div>
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g., Central Park Cafe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block mb-2 text-gray-700">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Additional Notes</span>
                </div>
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any additional details or questions..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* What You're Offering */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="mb-3">What are you offering in exchange?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Let them know what skills, goods, or services you can provide
            </p>
            <textarea
              value={formData.requesterOffer}
              onChange={(e) =>
                setFormData({ ...formData, requesterOffer: e.target.value })
              }
              placeholder="e.g., I can help with web design, or I have fresh vegetables from my garden..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-full hover:bg-blue-700 transition-colors"
          >
            Send Proposal
          </button>
        </form>
      </div>
    </div>
  );
}
