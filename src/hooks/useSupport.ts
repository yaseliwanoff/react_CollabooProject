import { useState, useEffect, useCallback, useRef } from 'react';
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
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // WebSocket event handlers
  const setupWebSocket = useCallback((ws: WebSocket) => {
    ws.onopen = () => {
      console.log('WebSocket connected');
      reconnectAttempts.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.ticket_id) {
          setMessages(prev => ({
            ...prev,
            [data.ticket_id]: [...(prev[data.ticket_id] || []), {
              id: data.id,
              text: data.content || data.text,
              created_at: data.created_at,
              is_admin: data.is_admin || false
            }]
          }));
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket connection error');
    };

    ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        reconnectAttempts.current += 1;
        setTimeout(() => {
          console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})`);
          connectWebSocket();
        }, delay);
      }
    };
  }, []);

  // Connect to WebSocket
  const connectWebSocket = useCallback(async () => {
    try {
      const currentToken = token || (await getUserToken());
      if (!currentToken) {
        throw new Error('Authentication required');
      }

      // Close existing connection if any
      if (socketRef.current) {
        socketRef.current.close();
      }
      // http://217.114.14.99:8003/api-support/api/v1/ws/ticket/1
      const wsUrl = `http://217.114.14.99:8003/api-support/api/v1/ws/ticket/?token=${currentToken}`;
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;
      setSocket(ws);

      setupWebSocket(ws);
      return ws;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'WebSocket connection failed');
      return null;
    }
  }, [token, getUserToken, setupWebSocket]);

  // Fetch tickets
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

  // Fetch messages for a ticket
  const fetchMessages = useCallback(async (ticketId: string) => {
    try {
      setLoading(true);
      const currentToken = token || (await getUserToken());
      if (!currentToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `http://217.114.14.99:8080/api-support/api/v1/message/by-ticket?ticket_id=${ticketId}`,
        {
          headers: {
            'Authorization': `Bearer ${currentToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(prev => ({
        ...prev,
        [ticketId]: data.map((msg: any) => ({
          id: msg.id,
          text: msg.content,
          created_at: msg.created_at,
          is_admin: msg.is_admin || false
        }))
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [token, getUserToken]);

  // Create new ticket
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

  // Send message
  const sendMessage = useCallback(async (ticketId: string, text: string) => {
    try {
      const currentToken = token || (await getUserToken());
      if (!currentToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `http://217.114.14.99:8080/api-support/api/v1/message/?ticket_id=${ticketId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`
          },
          body: JSON.stringify({ text })
        }
      );

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
    if (token) {
      connectWebSocket();
      fetchTickets();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
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
