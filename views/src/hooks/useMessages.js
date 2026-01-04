import { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '/src/features/util/socket.js';

const API_BASE_URL = 'http://localhost:3000/api';

export const useMessages = (chatId, authUserId) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!chatId || !authUserId) return;

    // Fetch messages
    axios
      .get(`${API_BASE_URL}/conversations/${chatId}/messages`, {
        withCredentials: true,
        timeout: 5000,
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

    // Socket setup
    if (!socket.connected) {
      socket.connect();
    }

    const handleNewMessage = (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    };

    socket.off('new_message');
    socket.on('new_message', handleNewMessage);

    // Join room
    socket.emit('join-conversation', chatId, (joined) => {
      if (!joined) console.error('Failed to join room');
    });

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [chatId, authUserId]);

  const sendMessage = async (content) => {
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const tempMessage = {
      id: tempId,
      content,
      sender_id: authUserId,
      created_at: new Date().toISOString(),
      optimistic: true,
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/conversations/messages`,
        { conversationId: chatId, content },
        { withCredentials: true, timeout: 5000 }
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

  return { messages, sendMessage };
};