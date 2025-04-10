import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Chat from "@/assets/images/svg/Chat.svg";
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Ticket {
  id: string;
  title: string;
  header_message: string;
  updated: string;
  status: string;
}

const Help: React.FC = () => {
  const { getUserToken, token, error: authError } = useAuth();
  const [activeTab, setActiveTab] = useState('Tickets');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if (!token) {
          console.error('No token found');
          setError('User is not authenticated');
          return;
        }

        const apiUrl = "http://217.114.14.99:8080/api-support/api/v1/ticket/paginated?limit=10&offset=0";
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTickets(data);
        } else {
          throw new Error(`Failed to load tickets. Status: ${response.status}`);
        }
      } catch (err) {
        setError(`Error`);
        console.error('Error occurred:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [token]);

  useEffect(() => {
    if (authError) {
      setError(`Authentication error: ${authError}`);
    }
  }, [authError]);

  const handleProfileClick = () => {
    setActiveTab('Tickets');
  };

  const handleMouseEnter = (ticketId: string) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, status: 'open' }
          : ticket
      )
    );
  };

  const handleMouseLeave = (ticketId: string) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, status: 'pending' }
          : ticket
      )
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className="container font-[Inter] font-normal text-[#18181B]">
      <div className="container pt-[55px]">
        <div className="w-full md:flex items-center pt-10 mb-8 justify-between">
          <h1 className="font-semibold text-[30px]">Helpdesk</h1>
          <div className="hidden lg:flex">
            <Link to={"/help-ticket-create"}>
              <Button variant={"default"} className="ml-auto">
                <span><img src={Chat} alt="icon" /></span>
                <span>Submit new ticket</span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="lg:flex h-screen text-[Inter]">
          <aside className="w-1/5 hidden lg:flex flex-col text-[14px]">
            <Link to={"/help"}>
              <button className="button-sidebar" onClick={handleProfileClick}>Tickets</button>
            </Link>
          </aside>
          <aside className="flex lg:hidden">
            <Tabs defaultValue="all" className="w-full mb-3" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-1">
                <Link to={"/help"}>
                  <TabsTrigger className='w-full' value="all" onClick={handleProfileClick}>Tickets</TabsTrigger>
                </Link>
              </TabsList>
            </Tabs>
          </aside>
          <div className="md:w-4/5">
            {activeTab === 'Tickets' && (
              <>
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">#</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets.map((ticket) => (
                        <TableRow
                          key={ticket.id}
                          onMouseEnter={() => handleMouseEnter(ticket.id)}
                          onMouseLeave={() => handleMouseLeave(ticket.id)}
                        >
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>{ticket.title}</TableCell>
                          <TableCell>{ticket.updated}</TableCell>
                          <TableCell className="text-right">
                            {ticket.status === 'open' ? (
                              <Link to={`/help-ticket/${ticket.id}`} className="text-blue-500">
                                {ticket.status}
                              </Link>
                            ) : (
                              <span>{ticket.status}</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="md:hidden">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="border p-4 mb-4 rounded-lg cursor-pointer"
                      onMouseEnter={() => handleMouseEnter(ticket.id)}
                      onMouseLeave={() => handleMouseLeave(ticket.id)}
                    >
                      <div className="flex flex-col">
                        <span className="opacity-70 text-[14px]">{ticket.id}</span>
                        <span className="font-semibold text-[18px]">{ticket.title}</span>
                      </div>
                      <p className="opacity-70 text-[14px]">Updated: {ticket.updated}</p>
                      <p className="text-right">
                        {ticket.status === 'open' ? (
                          <Link to={`/help-ticket/${ticket.id}`} className="text-blue-500">
                            {ticket.status}
                          </Link>
                        ) : (
                          <span>{ticket.status}</span>
                        )}
                      </p>
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

export default Help;
