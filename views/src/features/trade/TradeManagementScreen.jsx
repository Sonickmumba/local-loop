import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatTradeDate } from '../util/date';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';


export const TradeManagementScreen = () => {
  const currentUserId = useSelector((state) => state.auth.user.id);

  const location = useLocation();
  const navigate = useNavigate();
  const tradeDataId = location.state?.selectedTradeId;
  const [trade, setTrade] = useState(null);

  const [isUpdating, setIsUpdating] = useState(false);

  const handleAccept = async () => {
    if (isRequester) return;

    const toastId = toast.loading('Accepting trade...');

    try {
      const res = await fetch(
        `http://localhost:3000/api/trades/${trade.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ status: 'accepted' }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to accept trade');
      }

      // update UI immediately
      setTrade(data.data);
      toast.success('Trade accepted!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error(err.message, { id: toastId });
    }
  };

  const handleComplete = async () => {

    const toastId = toast.loading('Completing trade...');

    try {
      const res = await fetch(
        `http://localhost:3000/api/trades/${trade.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ status: 'completed' }),
        }
      );

      const data = await res.json();
      toast.success('Trade marked as completed!', { id: toastId });

      if (!res.ok) {
        throw new Error(data.message || 'Failed to complete trade');
      }
      
      setTrade(data.data);
      
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  const handleDecline = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to decline this proposal?'
    );

    if (!confirmed) return;

    const toastId = toast.loading('Declining trade...');

    try {
      setIsUpdating(true);

      const res = await fetch(
        `http://localhost:3000/api/trades/${trade.id}/status`,
        {
          method: 'PATCH',
          headers: { 'content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: 'cancelled' }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to decline trade');
      }

      setTrade(data.data);
      toast.success('Trade declined', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (!tradeDataId) return;

    const fetchTradeDetails = async () => {
      const res = await fetch(
        `http://localhost:3000/api/trades/${tradeDataId}`,
        {
          credentials: 'include',
        }
      );
      const data = await res.json();
      setTrade(data.trade);
    };
    fetchTradeDetails();
  }, [tradeDataId]);

  if (!trade) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading trade details...</div>
      </div>
    );
  }

  const isRequester = trade.requester_id === currentUserId;

  const revieweeId = isRequester ? trade.owner_id : trade.requester_id;

  const partnerName = isRequester ? trade.owner_name : trade.requester_name;
  const partnerRating = isRequester
    ? trade.owner_rating
    : trade.requester_rating;
    
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
          <h2>Trade Details</h2>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Status Banner */}
        <div
          className={`rounded-xl border-2 p-4 mb-6 ${
            trade.status === 'pending'
              ? 'bg-yellow-50 border-yellow-300'
              : trade.status === 'accepted'
              ? 'bg-blue-50 border-blue-300'
              : trade.status === 'completed'
              ? 'bg-green-50 border-green-300'
              : 'bg-red-50 border-red-300'
          }`}
        >
          <div className="flex items-center gap-3">
            {trade.status === 'pending' && (
              <Clock className="w-6 h-6 text-yellow-600" />
            )}
            {trade.status === 'accepted' && (
              <CheckCircle className="w-6 h-6 text-blue-600" />
            )}
            {trade.status === 'completed' && (
              <CheckCircle className="w-6 h-6 text-green-600" />
            )}
            {trade.status === 'cancelled' && (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
            <div>
              <div className="mb-1">
                {trade.status === 'pending' && 'Waiting for response'}
                {trade.status === 'accepted' && 'Trade confirmed!'}
                {trade.status === 'completed' && 'Trade completed'}
                {trade.status === 'cancelled' && 'Trade cancelled'}
              </div>
              <p className="text-sm opacity-80">
                {trade.status === 'pending' &&
                  'Your trade proposal has been sent'}
                {trade.status === 'accepted' &&
                  'Both parties have agreed to the trade'}
                {trade.status === 'completed' &&
                  'Hope it went well! Leave a review'}
                {trade.status === 'cancelled' &&
                  'This trade has been cancelled'}
              </p>
            </div>
          </div>
        </div>

        {/* Partner Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="text-sm text-gray-600 mb-3">Trading with</div>
          <button
            onClick={() => {
              const partnerId = isRequester
                ? trade.owner_id
                : trade.requester_id;
              navigate(`/user-profile/${partnerId}`)
            }}
            className="flex items-center gap-3 w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white">
              {partnerName
                ?.split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div className="flex-1 text-left">
              <div className="mb-1">{partnerName}</div>
              <div className="text-sm text-gray-600">
                ⭐ {partnerRating} • 23 trades
              </div>
            </div>
          </button>
        </div>

        {/* Trade Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="mb-4">Trade Details</h3>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">
                What you're getting
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
                <span className="text-2xl">🎸</span>
                <div>{trade.listing_title}</div>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">
                What you're offering
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-2">
                <span className="text-2xl">💻</span>
                <div>{trade.requester_offer}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Date</div>
                  <div>{formatTradeDate(trade.trade_date)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Time</div>
                  <div>{trade.trade_time}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Location</div>
                  <div>{trade.location}</div>
                </div>
              </div>

              {trade.notes && (
                <div className="flex items-start gap-3 text-gray-700">
                  <MessageSquare className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <div className="text-sm text-gray-600">Notes</div>
                    <div>{trade.notes}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {trade.status === 'pending' && (
            <>
              <button
                onClick={handleAccept}
                disabled={isRequester}
                className={`w-full py-4 rounded-full transition-colors ${
                  isRequester
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                // className="w-full bg-blue-600 text-white py-4 rounded-full hover:bg-blue-700 transition-colors"
              >
                Accept Trade
              </button>
              <button
                onClick={handleDecline}
                disabled={isUpdating}
                className="w-full bg-white border border-gray-300 text-gray-700 py-4 rounded-full hover:bg-gray-50 transition-colors"
              >
                Decline
              </button>
            </>
          )}

          {trade.status === 'accepted' && (
            <>
              <button
                onClick={handleComplete}
                className="w-full bg-green-600 text-white py-4 rounded-full hover:bg-green-700 transition-colors"
              >
                Mark as Completed
              </button>
              <button
                onClick={() =>
                  navigate(`/chat-conversation?chatId=${trade.id}`)
                }
                className="w-full bg-white border border-blue-600 text-blue-600 py-4 rounded-full hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Send Message
              </button>
            </>
          )}

          {trade.status === 'completed' && (
            <button
              onClick={() => {
                navigate('/review-rating', {
                  state: {
                    tradeId: trade.id,
                    revieweeId,
                    partnerName,
                    listingTitle: trade.listing_title,
                  },
                });
              }}
              className="w-full bg-blue-600 text-white py-4 rounded-full hover:bg-blue-700 transition-colors"
            >
              Leave a Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
