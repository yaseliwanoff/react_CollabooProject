import React, { useState, useEffect, useRef } from 'react';
import { apiRoutes, socketRoutes } from "@/config/apiConfig";
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Chat from "@/assets/images/svg/Chat.svg";
import { Textarea } from "@/components/ui/textarea";
import { Link } from 'react-router-dom';
import { useAuth } from "@/hooks/useAuth";

// WebSocket URL с измененным форматом для безопасности
const SOCKET_URL = socketRoutes.ticketWS;

const HelpTicket: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Tickets');
  const { ticketId } = useParams<{ ticketId: string }>();
  const { token, isAuthReady, error: authError } = useAuth();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const socketRef = useRef<WebSocket | null>(null);

  // Функция для форматирования времени
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Загрузка сообщений из localStorage при инициализации компонента
  useEffect(() => {
    const savedMessages = localStorage.getItem(`ticket_${ticketId}_messages`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

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

    // Инициализация WebSocket с новым URL форматом
    socketRef.current = new WebSocket(`${SOCKET_URL}${ticketId}`);

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
      // Отправляем токен для аутентификации после подключения
      if (socketRef.current && token) {
        socketRef.current.send(JSON.stringify({ action: 'authenticate', token: token }));
      }
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message data:', data); // Логируем данные, полученные через WebSocket

      if (data.ticketId === ticketId) {
        // Если сообщение от этого тикета, обновляем состояние
        setMessages((prevMessages) => {
          const updatedMessages = [
            ...prevMessages,
            {
              username: data.message.username,
              content: data.message.content,
              senderType: data.message.senderType, // Сохраняем тип отправителя (user/admin)
              timestamp: new Date() // Добавляем время отправки
            }
          ];
          console.log('Updated messages:', updatedMessages); // Логируем обновленные сообщения
          localStorage.setItem(`ticket_${ticketId}_messages`, JSON.stringify(updatedMessages)); // Сохраняем в localStorage
          return updatedMessages;
        });
      }
    };

    socketRef.current.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      if (socketRef.current) {
        // Закрываем WebSocket только при выходе из тикета
        socketRef.current.close();
      }
    };
  }, [ticketId, token, isAuthReady]);

  // Функция для отправки сообщений через WebSocket
  const sendMessage = async () => {
    if (!messageInput.trim()) return;

    const messageData = {
      event: "message/create",
      body: {
        ticketId: ticketId,
        content: messageInput
      }
    };

    // Здесь мы добавляем сообщение сразу в messages, чтобы оно отображалось на клиенте до того как придет ответ от сервера
    setMessages((prevMessages) => {
      const updatedMessages = [
        ...prevMessages,
        {
          username: 'You',
          content: messageInput,
          senderType: 'user',
          timestamp: new Date() // Добавляем время отправки
        }
      ];
      localStorage.setItem(`ticket_${ticketId}_messages`, JSON.stringify(updatedMessages)); // Сохраняем в localStorage
      return updatedMessages;
    });

    console.log('Sending message:', messageData); // Логируем данные сообщения перед отправкой

    // Отправка сообщения через WebSocket
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify(messageData));
      setMessageInput(''); // Очистка поля ввода после отправки
    } else {
      setError('WebSocket connection is not established.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || authError) {
    return <div>{error || authError}</div>;
  }

  return (
    <section className="bg-[#FBFBFB] text-[#1B1B1B]">
      <div className="container pt-[55px]">
        <div className="w-full flex items-center pt-10 mb-8 justify-between">
          <h1 className="font-semibold text-[30px]">Helpdesk</h1>
          <div className="hidden lg:flex">
            <Link to="/help-ticket-create">
              <Button variant="default" className="ml-auto">
                <span>
                  <img src={Chat} alt="icon" />
                </span>
                <span>Submit new ticket</span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="lg:flex h-screen text-[Inter]">
          <aside className="w-1/5 hidden lg:flex flex-col text-[14px]">
            <Link to={"/help"}>
              <button
                className="button-sidebar"
                onClick={() => setActiveTab('Tickets')}
              >
                Tickets
              </button>
            </Link>
          </aside>
          <div className="lg:w-4/5">
            {ticket && (
              <>
                <h2 className="text-[20px] font-semibold mt-4">{ticket.title}</h2>
                <div className="mt-6">
                  <h5 className="font-medium text-[14px] mb-2">Message</h5>
                  <Textarea
                    style={{
                      resize: "none",
                      height: "115px",
                    }}
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
                      className={`py-4 border-b border-[#E5E7EB] ${msg.senderType === 'admin' ? 'bg-[#F3F4F6]' : ''}`} // Если админ, добавляем другой фон
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-semibold text-[14px] ${msg.senderType === 'admin' ? 'text-blue-500' : ''}`}>
                          {msg.username || 'Unknown'}
                        </span>
                        <span className="text-[#71717A] text-[14px] pl-6">{formatTime(new Date(msg.timestamp))}</span>
                      </div>
                      <div className="mt-1">
                        <p>{msg.content}</p> {/* Отображаем контент сообщения */}
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
