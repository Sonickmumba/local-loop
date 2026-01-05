import React, { useState } from 'react';
import { Send } from 'lucide-react';

export const MessageInput = ({ onSend, disabled = false }) => {
  const [messageText, setMessageText] = useState('');

  const handleSend = () => {
    if (messageText.trim()) {
      onSend(messageText.trim());
      setMessageText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={disabled}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !messageText.trim()}
          className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};