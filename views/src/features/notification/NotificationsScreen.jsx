// import { Screen } from '../App';
import { ArrowLeft, MessageSquare, UserPlus, Star, Package } from 'lucide-react';

// interface NotificationsScreenProps {
//   navigate: (screen: Screen, state?: any) => void;
// }

// interface Notification {
//   id: string;
//   type: 'message' | 'trade' | 'review' | 'listing';
//   title: string;
//   description: string;
//   time: string;
//   read: boolean;
// }

const mockNotifications = [
  {
    id: '1',
    type: 'message',
    title: 'New message from Sarah Martinez',
    description: 'Sure! I can start this weekend if that works for you',
    time: '5 minutes ago',
    read: false
  },
  {
    id: '2',
    type: 'trade',
    title: 'Trade proposal received',
    description: 'Mike Roberts wants to trade moving help for pizza',
    time: '2 hours ago',
    read: false
  },
  {
    id: '3',
    type: 'review',
    title: 'New review received',
    description: 'Lisa Kim left you a 5-star review',
    time: '1 day ago',
    read: true
  },
  {
    id: '4',
    type: 'listing',
    title: 'New listing in your area',
    description: 'Someone is offering free yoga classes nearby',
    time: '2 days ago',
    read: true
  }
];

export const NotificationsScreen = ({ navigate }) => {
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
          <h2>Notifications</h2>
        </div>
      </header>

      {/* Notifications List */}
      <div className="divide-y divide-gray-200">
        {mockNotifications.map((notification) => (
          <button
            key={notification.id}
            onClick={() => {
              if (notification.type === 'message') {
                // navigate('/chat-conversation', { selectedChatId: '1' });
                navigate(`/chat-conversation?chatId=${notification.conversationId}`);
              } else if (notification.type === 'trade') {
                navigate('trade-management', { selectedTradeId: '1' }); // need to be implemented
              }
            }}
            className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors ${
              !notification.read ? 'bg-blue-50' : 'bg-white'
            }`}
          >
            <div className="flex gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                notification.type === 'message' ? 'bg-blue-100' :
                notification.type === 'trade' ? 'bg-green-100' :
                notification.type === 'review' ? 'bg-yellow-100' :
                'bg-purple-100'
              }`}>
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="mb-1">{notification.title}</div>
                <p className="text-sm text-gray-600 mb-1">{notification.description}</p>
                <div className="text-xs text-gray-500">{notification.time}</div>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
