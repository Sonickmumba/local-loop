import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MoreVertical } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from 'axios';

const SOCKET_SERVER_URL = 'http://localhost:3000';
const API_BASE_URL = 'http://localhost:3000/api';

export function ChatConversation() {
  const navigate = useNavigate();
  const authUserId = useSelector((state) => state.auth.user?.id);
  const location = useLocation();
  
  const { chatId } = location.state || {};
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [contact, setContact] = useState(null);
  const [conversation, setConversation] = useState(null);

  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  

  // Scroll chat to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
  console.log('Chat ID:', chatId);

  if (!chatId) return;

  // Fetch conversation details (partner + listing)
axios
  .get(`${API_BASE_URL}/conversations/${chatId}`, {
    withCredentials: true,
  })
  .then((res) => {
    if (res.data.success) {
      setConversation(res.data.data);
    }
  })
  .catch((err) =>
    console.error('Failed to fetch conversation details', err)
  );






  axios
    .get(`${API_BASE_URL}/conversations/${chatId}`, {
      withCredentials: true,
    })
    .then(res => {
      console.log('Conversation API response:', res.data);
      setContact(res.data.data);
    })
    .catch(err => {
      console.error(
        'Failed to load conversation header:',
        err.response?.data || err.message
      );
    });
}, [chatId]);


  // Fetch previous messages + setup socket
  useEffect(() => {
    if (!chatId || !authUserId) return;

    // Fetch messages
    axios
      .get(`${API_BASE_URL}/conversations/${chatId}/messages`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          const uniqueMessages = res.data.data.filter(
            (v, i, a) => a.findIndex((x) => x.id === v.id) === i
          );
          setMessages(uniqueMessages);
        }
      })
      .catch((err) => console.error('Failed to fetch messages', err));

    // Connect to socket
    socketRef.current = io(SOCKET_SERVER_URL, {
      withCredentials: true,
    });

    socketRef.current.emit('join-conversation', chatId);

    // Listen for new messages
    socketRef.current.on('new-message', (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [chatId, authUserId]);

  // Send message
  const handleSend = async () => {
    if (!messageText.trim()) return;

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const tempMessage = {
      id: tempId,
      content: messageText,
      sender_id: authUserId,
      created_at: new Date().toISOString(),
      optimistic: true,
    };

    // Show immediately
    setMessages((prev) => [...prev, tempMessage]);
    setMessageText('');

    try {
      const res = await axios.post(
        `${API_BASE_URL}/conversations/messages`,
        { conversationId: chatId, content: tempMessage.content },
        { withCredentials: true }
      );

      if (res.data.success && res.data.data) {
        const confirmedMessage = res.data.data;

        setMessages((prev) =>
          prev
            .map((m) => (m.id === tempId ? confirmedMessage : m))
            .filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i)
        );
      }
    } catch (err) {
      console.error('Failed to send message', err);
    }
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
  console.log(contact);

  if (!conversation) {
  return (
    <div className="flex items-center justify-center min-h-screen text-gray-500">
      Loading conversation…
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            {contact && (
              <>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white">
                  {conversation?.partner?.name
  ?.split(' ')
  .map((n) => n[0])
  .join('') || '?'}

                </div>

                <div>
                  <div>{conversation?.partner?.name || 'Loading…'}</div>
                  <div className="text-sm text-gray-600">
                    Re: {conversation?.listing?.title || ''}
                  </div>
                </div>
              </>
            )}

            {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white">
              {contact.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div>{contact.name}</div>
              <div className="text-sm text-gray-600">Re: {contact.listing}</div>
            </div> */}
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => {
          const isMe = message.sender_id === authUserId;
          return (
            <div
              key={message.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  isMe
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <p>{message.content}</p>
                <div
                  className={`text-xs mt-1 ${
                    isMe ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Trade Action */}
      <div className="bg-blue-50 border-t border-blue-200 px-4 py-3">
        <button
          onClick={() => navigate('trade-negotiation')}
          className="w-full bg-white border border-blue-300 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors"
        >
          🤝 Propose a Trade
        </button>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
