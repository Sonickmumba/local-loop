import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const useConversation = (chatId) => {
  const [conversation, setConversation] = useState(null);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chatId) return;

    axios
      .get(`${API_BASE_URL}/conversations/${chatId}`, {
        withCredentials: true,
        timeout: 5000,
      })
      .then((res) => {
        if (res.data.success) {
          setConversation(res.data.data);
          setContact(res.data.data.partner);
        } else {
          setError('Failed to load conversation');
        }
      })
      .catch((err) => {
        console.error('Failed to fetch conversation details', err);
        setError('Failed to load conversation');
      })
      .finally(() => setLoading(false));
  }, [chatId]);

  return { conversation, contact, loading, error };
};