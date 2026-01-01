import { useState } from 'react';
// import { Screen } from '../App';
import { ArrowLeft, Send, MoreVertical } from 'lucide-react';

export function ChatConversation({ navigate, chatId }) {
  const [messageText, setMessageText] = useState('');
  console.log('ChatConversationScreen chatId:', chatId);
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'them',
      text: 'Hi! I saw your listing about guitar lessons. Are you still offering them?',
      time: '10:30 AM'
    },
    {
      id: '2',
      sender: 'me',
      text: 'Yes! I\'d be happy to help you get started. Do you have any experience?',
      time: '10:32 AM'
    },
    {
      id: '3',
      sender: 'them',
      text: 'I\'m a complete beginner. Never played before.',
      time: '10:35 AM'
    },
    {
      id: '4',
      sender: 'me',
      text: 'Perfect! That\'s exactly what I love to teach. When would you like to start?',
      time: '10:37 AM'
    },
    {
      id: '5',
      sender: 'them',
      text: 'Sure! I can start this weekend if that works for you',
      time: '10:40 AM'
    }
  ]);

  const handleSend = () => {
    if (!messageText.trim()) return;

    const newMessage= {
      id: Date.now().toString(),
      sender: 'me',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const contact = {
    name: 'Sarah Martinez',
    listing: 'Guitar lessons'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('chat-list')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white">
              {contact.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div>{contact.name}</div>
              <div className="text-sm text-gray-600">Re: {contact.listing}</div>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                message.sender === 'me'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <p>{message.text}</p>
              <div className={`text-xs mt-1 ${
                message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.time}
              </div>
            </div>
          </div>
        ))}
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
