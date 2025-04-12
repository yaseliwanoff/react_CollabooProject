import React, { useState, useEffect, useRef } from 'react';
import { apiRoutes, socketRoutes } from "@/config/apiConfig";
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Chat from "@/assets/images/svg/Chat.svg";
import { Textarea } from "@/components/ui/textarea";
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

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

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

    socketRef.current = new WebSocket(`${SOCKET_URL}${ticketId}`);

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
      if (socketRef.current && token) {
        socketRef.current.send(JSON.stringify({ action: 'authenticate', token: token }));
      }
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message data:', data);

      if (data.ticketId === ticketId) {
        setMessages((prevMessages) => {
          const updatedMessages = [
            ...prevMessages,
            {
              username: data.message.username,
              content: data.message.content,
              senderType: data.message.senderType,
              timestamp: new Date()
            }
          ];
          localStorage.setItem(`ticket_${ticketId}_messages`, JSON.stringify(updatedMessages));
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
        socketRef.current.close();
      }
    };
  }, [ticketId, token, isAuthReady]);

  const sendMessage = async () => {
    if (!messageInput.trim()) return;

    const messageData = {
      event: "message/create",
      body: {
        ticketId: ticketId,
        content: messageInput
      }
    };

    setMessages((prevMessages) => {
      const updatedMessages = [
        ...prevMessages,
        {
          username: 'You',
          content: messageInput,
          senderType: 'user',
          timestamp: new Date()
        }
      ];
      localStorage.setItem(`ticket_${ticketId}_messages`, JSON.stringify(updatedMessages));
      return updatedMessages;
    });

    if (socketRef.current) {
      socketRef.current.send(JSON.stringify(messageData));
      setMessageInput('');
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
          <aside className="w-1/5 hidden lg:flex flex-col text-[14px] space-y-2 pr-4 border-r border-[#E5E7EB]">
            <button
              className={`button-sidebar ${activeTab === 'Tickets' ? 'font-bold' : ''}`}
              onClick={() => setActiveTab('Tickets')}
            >
              Tickets
            </button>
            <button
              className={`button-sidebar ${activeTab === 'Settings' ? 'font-bold' : ''}`}
              onClick={() => setActiveTab('Settings')}
            >
              Settings
            </button>
            <button
              className={`button-sidebar ${activeTab === 'FAQ' ? 'font-bold' : ''}`}
              onClick={() => setActiveTab('FAQ')}
            >
              FAQ
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
                          {msg.username || 'Unknown'}
                        </span>
                        <span className="text-[#71717A] text-[14px] pl-6">{formatTime(new Date(msg.timestamp))}</span>
                      </div>
                      <div className="mt-1">
                        <p>{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'Settings' && (
              <div className="mt-6 text-[16px]">
                <h2 className="text-[20px] font-semibold mb-4">Settings</h2>
                <p>Here you can configure notification preferences, account settings, etc.</p>
              </div>
            )}

            {activeTab === 'FAQ' && (
              <div className="mt-6 text-[16px]">
                <h2 className="text-[20px] font-semibold mb-4">Frequently Asked Questions</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>How to create a new ticket?</li>
                  <li>How to contact support?</li>
                  <li>How to close a ticket?</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpTicket;
