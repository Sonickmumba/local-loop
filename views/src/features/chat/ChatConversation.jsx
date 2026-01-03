import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useConversation } from '../../hooks/useConversation';
import { useMessages } from '../../hooks/useMessages';
import { ChatHeader } from '../../components/ChatHeader';
import { MessageList } from '../../components/MessageList';
import { MessageInput } from '../../components/MessageInput';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

const SOCKET_SERVER_URL = 'http://localhost:3000';
const API_BASE_URL = 'http://localhost:3000/api';

export function ChatConversation() {
  const navigate = useNavigate();
  const { userId: authUserId } = useAuth();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const chatId = searchParams.get('chatId');

  const { conversation, contact, loading: conversationLoading, error: conversationError } = useConversation(chatId);
  const { messages, sendMessage } = useMessages(chatId, authUserId);

  const handleSend = (content) => {
    sendMessage(content);
  };

  if (!chatId) {
    return (
      <div className="p-4 text-red-600">No chat selected. Please go back.</div>
    );
  }

  if (!authUserId) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading chat…
      </div>
    );
  }

  if (conversationLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
        <span className="ml-2">Loading conversation…</span>
      </div>
    );
  }

  if (conversationError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ErrorMessage message={conversationError} />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        No conversation found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ChatHeader onBack={() => navigate(-1)} contact={contact} conversation={conversation} />

      <MessageList messages={messages} authUserId={authUserId} />

      {/* Trade Action */}
      <div className="bg-blue-50 border-t border-blue-200 px-4 py-3">
        <button
          onClick={() => navigate('trade-negotiation')}
          className="w-full bg-white border border-blue-300 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors"
        >
          🤝 Propose a Trade
        </button>
      </div>

      <MessageInput onSend={handleSend} />
    </div>
  );
}
