import {
  ArrowLeft,
  MessageSquare,
  UserPlus,
  Star,
  Package,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
} from './notificationsSlice';


export const NotificationsScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notifications, status, error } = useSelector(
    (state) => state.notifications
  );

  const getIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'trade':
        return <Package className="w-5 h-5 text-green-600" />;
      case 'review':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'listing':
        return <UserPlus className="w-5 h-5 text-purple-600" />;
      default:
        return null;
    }
  };

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);
  const handleNotificationClick = async (notification) => {
    // Mark as read if not already read
    if (!notification.is_read) {
      dispatch(markAsRead(notification.id));
    }

    // Navigate based on notification type
    if (notification.type === 'message' && notification.reference_id) {
      navigate(`/chat-conversation?chatId=${notification.reference_id}`);
    } else if (notification.type === 'trade' && notification.reference_id) {
      // navigate('/trade-management', { selectedTradeId: notification.reference_id });
      // For now, just navigate to home
      navigate('/home/feed');
    } else if (notification.type === 'listing' && notification.reference_id) {
      navigate(`/listing-details/${notification.reference_id}`);
    } else {
      // Default navigation
      navigate('/home/feed');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-center text-gray-500">Loading notifications...</p>
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
            <h2>Notifications</h2>
          </div>
          {notifications.some((n) => !n.is_read) && (
            <button
              onClick={() => dispatch(markAllAsRead())}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Mark all read
            </button>
          )}
        </div>
      </header>

      {/* Notifications List */}
      <div className="divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-4">🔔</div>
            <p>No notifications yet</p>
            <p className="text-sm">
              You'll see updates about messages, trades, and reviews here
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors ${
                !notification.is_read ? 'bg-blue-50' : 'bg-white'
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notification.type === 'message'
                      ? 'bg-blue-100'
                      : notification.type === 'trade'
                      ? 'bg-green-100'
                      : notification.type === 'review'
                      ? 'bg-yellow-100'
                      : 'bg-purple-100'
                  }`}
                >
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-1">{notification.title}</div>
                  {notification.description && (
                    <p className="text-sm text-gray-600 mb-1">
                      {notification.description}
                    </p>
                  )}
                  <div className="text-xs text-gray-500">
                    {notification.timeAgo}
                  </div>
                </div>
                {!notification.is_read && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
