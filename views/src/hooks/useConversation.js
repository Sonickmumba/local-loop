import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api';

export const useConversation = (chatId) => {
  const navigate = useNavigate();
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
        if (err.response?.status === 401) {
          navigate('/auth/signin');
          return;
        }
        setError('Failed to load conversation');
      })
      .finally(() => setLoading(false));
  }, [chatId, navigate]);

  return { conversation, contact, loading, error };
};
