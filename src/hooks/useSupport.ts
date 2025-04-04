import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface Ticket {
  id: string;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  text: string;
  created_at: string;
  is_admin: boolean;
}

export function useSupport() {
  const { token, getUserToken } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Подключение к WebSocket
  const connectWebSocket = useCallback(async () => {
    try {
      const currentToken = token || (await getUserToken());
      if (!currentToken) {
        throw new Error('Authentication required');
      }

      const wsUrl = `ws://217.114.14.99:8080/api-support/api/v1/ws/?token=${currentToken}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.ticket_id) {
          // Обновляем сообщения для конкретного тикета
          setMessages(prev => ({
            ...prev,
            [data.ticket_id]: [...(prev[data.ticket_id] || []), data]
          }));
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
      };

      setSocket(ws);
      return ws;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'WebSocket connection failed');
      return null;
    }
  }, [token, getUserToken]);

  // Загрузка тикетов
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const currentToken = token || (await getUserToken());
      if (!currentToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch('http://217.114.14.99:8080/api-support/api/v1/ticket/', {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, [token, getUserToken]);

  // Загрузка сообщений для тикета
  const fetchMessages = useCallback(async (ticketId: string) => {
    try {
      setLoading(true);
      const currentToken = token || (await getUserToken());
      if (!currentToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`http://217.114.14.99:8080/api-support/api/v1/message/by-ticket?ticket_id=${ticketId}`, {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(prev => ({
        ...prev,
        [ticketId]: data
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [token, getUserToken]);

  // Создание нового тикета
  const createTicket = useCallback(async (title: string, message: string) => {
    try {
      setLoading(true);
      const currentToken = token || (await getUserToken());
      if (!currentToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch('http://217.114.14.99:8080/api-support/api/v1/ticket/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({ title, message })
      });

      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      const data = await response.json();
      setTickets(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, getUserToken]);

  // Отправка сообщения
  const sendMessage = useCallback(async (ticketId: string, text: string) => {
    try {
      const currentToken = token || (await getUserToken());
      if (!currentToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`http://217.114.14.99:8080/api-support/api/v1/message/?ticket_id=${ticketId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    }
  }, [token, getUserToken]);

  useEffect(() => {
    let ws: WebSocket | null = null;
    
    const init = async () => {
      if (token) {
        ws = await connectWebSocket();
        await fetchTickets();
      }
    };

    init();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [token, connectWebSocket, fetchTickets]);

  return {
    socket,
    tickets,
    messages,
    loading,
    error,
    fetchTickets,
    fetchMessages,
    createTicket,
    sendMessage
  };
}
