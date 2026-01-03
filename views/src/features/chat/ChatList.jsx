// import { Screen } from '../App';
import { ArrowLeft, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api';

export const ChatList = () => {
    const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/conversations`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          setConversations(res.data.data);
        }
      })
      .catch((err) => console.error('Failed to fetch conversations', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading messages…
      </div>
    );
  }

  console.log(conversations[0]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/home/feed')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2>Messages</h2>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </header>

      {/* Chat List */}
      <div className="divide-y divide-gray-200">
        {conversations.map((chat) => (
          <button
            key={chat.id}
            onClick={() =>
              navigate(`/chat-conversation?chatId=${chat.id}`)
            }
            className="w-full bg-white hover:bg-gray-50 transition-colors px-4 py-4 flex items-start gap-3"
          >
            {/* Avatar */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
              {chat.partner_name
                ?.split(' ')
                .map((n) => n[0])
                .join('')}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <div>{chat.partner_name}</div>
                <span className="text-xs text-gray-500">{chat.timeAgo}</span>
              </div>

              <div className="text-sm text-gray-600 mb-1 truncate">
                {chat.last_message || 'No messages yet'}
              </div>

              <div className="text-xs text-gray-500">
                Re: {chat.listing_title}
              </div>
            </div>

            {/* Unread badge */}
            {Number(chat.unread_count) > 0 && (
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                {chat.unread_count}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
