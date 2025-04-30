import React, { useState, useEffect, useRef } from 'react';
import { apiRoutes, socketRoutes } from "@/config/apiConfig";
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Chat from "@/assets/images/svg/Chat.svg";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

const SOCKET_URL = socketRoutes.ticketWS;

const HelpTicket: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Tickets');
  const { ticketId } = useParams<{ ticketId: string }>();
  // const { token, isAuthReady, error: authError, token: userToken } = useAuth();
  const { token, isAuthReady, error: authError} = useAuth();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const socketRef = useRef<WebSocket | null>(null);

  // Хранение имени пользователя (username) для отправки сообщений
  const [username] = useState<string | null>(null);

  const formatTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Функция для загрузки сообщений
  const fetchMessages = async (ticketId: string, token: string) => {
    try {
      const messagesUrl = `https://collaboo.co/api-support/api/v1/message/by-ticket?ticket_id=${ticketId}`;
      console.log(messagesUrl);

      const response = await fetch(messagesUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();

        setMessages(data.map((msg: any) => ({
          username: msg.username || 'User',
          content: msg.content,
          senderType: msg.senderType || 'user',
          timestamp: msg.created_at
        })));
      } else {
        throw new Error(`Failed to fetch messages. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    if (!isAuthReady || !ticketId || !token) return;
  
    const fetchTicket = async () => {
      try {
        const apiUrl = `${apiRoutes.helpTicket}/?ticket_id=${ticketId}`;
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
  
        if (response.ok) {
          const data = await response.json();
          setTicket(data);
  
          // Загружаем сообщения отдельно
          await fetchMessages(ticketId, token);
        } else {
          throw new Error(`Failed to load ticket. Status: ${response.status}`);
        }
      } catch (err) {
        setError('Error loading ticket');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchTicket();
  
    // Устанавливаем WebSocket соединение
    socketRef.current = new WebSocket(`${SOCKET_URL}${ticketId}`);
  
    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
      if (socketRef.current && token) {
        socketRef.current.send(JSON.stringify({ action: 'authenticate', token }));
      }
    };
  
    // Обработчик для WebSocket сообщений
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data?.message && data.ticketId === ticketId) {
        const { username, content, senderType, timestamp } = data.message;
  
        // Добавляем новое сообщение
        setMessages(prev => [
          ...prev,
          {
            username,
            content,
            senderType,
            timestamp: timestamp || new Date()
          }
        ]);
      }
    };
  
    socketRef.current.onerror = (err) => {
      console.error('WebSocket error:', err);
      // Попробуй переподключиться через некоторое время
      setTimeout(() => {
        if (socketRef.current?.readyState !== WebSocket.OPEN) {
          socketRef.current = new WebSocket(`${SOCKET_URL}${ticketId}`);
          console.log("Reconnecting WebSocket...");
        }
      }, 5000); // Пытаемся переподключиться через 5 секунд
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      socketRef.current?.close();
    };
  }, [ticketId, token, isAuthReady]);

  const sendMessage = async () => {
    if (!messageInput.trim()) return;

    // Используем username из useAuth
    const currentUsername = username || 'You';

    const messageData = {
      event: "message/create",
      body: {
        ticketId,
        content: messageInput
      }
    };

    // Добавляем сообщение с username
    setMessages(prevMessages => [
      ...prevMessages,
      {
        username: currentUsername,
        content: messageInput,
        senderType: 'user',
        timestamp: new Date()
      }
    ]);

    // Проверка состояния WebSocket перед отправкой
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(messageData));
      setMessageInput('');
    } else {
      setError('WebSocket connection is not established or is closed.');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error || authError) return <div>{error || authError}</div>;

  return (
    <section className="bg-[#FBFBFB] text-[#1B1B1B]">
      <div className="container pt-[55px]">
        <div className="w-full flex items-center pt-10 mb-8 justify-between">
          <h1 className="font-semibold text-[30px]">Helpdesk</h1>
          <div className="hidden lg:flex">
            <Link to="/help-ticket-create">
              <Button variant="default" className="ml-auto">
                <img src={Chat} alt="icon" />
                <span>Submit new ticket</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:flex h-screen text-[Inter]">
          <aside className="w-1/5 hidden lg:flex flex-col text-[14px] space-y-2 pr-4">
            <button
              className={`button-sidebar ${activeTab === 'Tickets' ? 'font-bold' : ''}`}
              onClick={() => setActiveTab('Tickets')}
            >
              Tickets
            </button>
          </aside>

          <div className="lg:w-4/5 px-4">
            {activeTab === 'Tickets' && ticket && (
              <>
                <h2 className="text-[20px] font-semibold mt-4">{ticket.title}</h2>
                <div className="mt-6">
                  <h5 className="font-medium text-[14px] mb-2">Message</h5>
                  <Textarea
                    style={{ resize: "none", height: "115px" }}
                    placeholder="Enter your text here…"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  <div className="flex justify-end mt-4">
                    <Button variant="default" onClick={sendMessage}>Send</Button>
                  </div>
                </div>
                <div className="mt-6">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`py-4 border-b border-[#E5E7EB] ${msg.senderType === 'admin' ? 'bg-[#F3F4F6]' : ''}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-semibold text-[14px] ${msg.senderType === 'admin' ? 'text-blue-500' : ''}`}>
                          {msg.username || (msg.senderType === 'admin' ? 'Admin' : 'User')}
                        </span>
                        <span className="text-[#71717A] text-[14px] pl-6">{formatTime(msg.timestamp)}</span>
                      </div>
                      <div className="mt-1">
                        <p>{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpTicket;
