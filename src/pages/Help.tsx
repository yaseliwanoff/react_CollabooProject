import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Chat from "@/assets/images/svg/Chat.svg";
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useSupport } from '@/hooks/useSupport';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

const Help: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Tickets');
  const [hoveredTicketId, setHoveredTicketId] = useState<string | null>(null);
  const { tickets, loading, error, fetchTickets } = useSupport();
  const { token } = useAuth();

  const handleProfileClick = () => {
    setActiveTab('Tickets');
  };

  useEffect(() => {
    if (token) {
      fetchTickets();
    }
  }, [token, fetchTickets]);

  if (loading && !tickets.length) {
    return <div className="container pt-[55px]">Loading tickets...</div>;
  }

  if (error) {
    return <div className="container pt-[55px] text-red-500">Error: {error}</div>;
  }

  return (
    <section className="container font-[Inter] font-normal text-[#18181B]">
      <div className="container pt-[55px]">
        <div className="w-full md:flex items-center pt-10 mb-8 justify-between">
          <h1 className="font-semibold text-[30px]">Helpdesk</h1>
          <div className='hidden lg:flex'>
            <Link to={"/help-ticket-create"}>
              <Button variant={"default"} className="ml-auto">
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
              <button className="button-sidebar" onClick={handleProfileClick}>
                Tickets
              </button>
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
          <div className='flex lg:hidden mb-5'>
            <Link to={"/help-ticket-create"} className="w-full">
              <Button variant={"full_dark"} className="w-full">
                <span>
                  <img src={Chat} alt="icon" />
                </span>
                <span>Submit new ticket</span>
              </Button>
            </Link>
          </div>
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
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>
                            <Link to={`/help-ticket/${ticket.id}`} className="hover:underline">
                              {ticket.title}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}
                          </TableCell>
                          <TableCell className="text-right" onMouseEnter={() => setHoveredTicketId(ticket.id)} onMouseLeave={() => setHoveredTicketId(null)}>
                            {ticket.status === "open" && (
                              <span className="flex items-center justify-end">
                                {hoveredTicketId === ticket.id ? (
                                  <Link to={`/help-ticket/${ticket.id}`} className="underline">
                                    Open ticket
                                  </Link>
                                ) : (
                                  <>
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                    Open
                                  </>
                                )}
                              </span>
                            )}
                            {ticket.status === "closed" && (
                              <span className="flex items-center justify-end">
                                {hoveredTicketId === ticket.id ? (
                                  <Link to={`/help-ticket/${ticket.id}`} className="underline">
                                    View ticket
                                  </Link>
                                ) : (
                                  <>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-1"></span>
                                    Closed
                                  </>
                                )}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="md:hidden">
                  {tickets.map((ticket) => (
                    <Link to={`/help-ticket/${ticket.id}`} key={ticket.id}>
                      <div className="border p-4 mb-4 rounded-lg cursor-pointer">
                        <div className='flex flex-col'>
                          <span className='opacity-70 text-[14px]'>{ticket.id}</span>
                          <span className='font-semibold text-[18px]'>{ticket.title}</span>
                        </div>
                        <p className='opacity-70 text-[14px]'>
                          Updated: {formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}
                        </p>
                        <p className="text-right">
                          {ticket.status === "open" ? (
                            <span className="text-green-500">Open</span>
                          ) : (
                            <span className="text-gray-500">Closed</span>
                          )}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {tickets.length > 0 && (
                  <div className='flex md:float-right mt-6'>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationLink href="#" isActive>2</PaginationLink>
                        <PaginationItem>
                          <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext href="#" />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Help;
