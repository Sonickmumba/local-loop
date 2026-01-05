import React, { useEffect, useRef } from 'react';

export const MessageList = ({ messages, authUserId }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  return (
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
  );
};