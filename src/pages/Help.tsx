import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Chat from "@/assets/images/svg/Chat.svg";
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const tickets = [
  {
    id: "hd-001",
    question: "Card payment link",
    updated: "12 hours",
    status: "New",
  },
  {
    id: "hd-002",
    question: "Login Issues: Unable to Access My Account",
    updated: "19 hours",
    status: "",
  },
  {
    id: "hd-003",
    question: "Payment Failed: Transaction Declined",
    updated: "23 hours",
    status: "",
  },
  {
    id: "hd-004",
    question: "App Crashing on Startup: Urgent Fix Needed",
    updated: "1 day",
    status: "",
  },
  {
    id: "hd-005",
    question: "Forgot Password: Can't Reset My Credentials",
    updated: "311 days",
    status: "",
  },
  {
    id: "hd-006",
    question: "Security Concern: Suspicious Activity on My Account and I don’t know what to do!",
    updated: "312 days",
    status: "",
  },
  {
    id: "hd-007",
    question: "Profile Update Problem: Changes Not Saving",
    updated: "456 days",
    status: "",
  },
]

const Help: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Tickets');
  const [hoveredTicketId, setHoveredTicketId] = useState<string | null>(null);

  const handleProfileClick = () => {
    setActiveTab('Tickets');
  };

  return (
    <section className="container font-[Inter] font-normal text-[#18181B]">
      <div className="container pt-[55px]">
        <div className="w-full flex items-center pt-10 mb-8 justify-between">
          <h1 className="font-semibold text-[30px]">Helpdesk</h1>
          <div>
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
        <div className="flex h-screen text-[Inter]">
          <aside className="w-1/5 flex flex-col text-[14px]">
            <button 
              className="button-sidebar" 
              onClick={handleProfileClick}
            >
              Tickets
            </button>
          </aside>
          <div className="w-4/5">
            {activeTab === 'Tickets' && (
              <>
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
                        <TableCell>{ticket.question}</TableCell>
                        <TableCell>{ticket.updated}</TableCell>
                        <TableCell 
                          className="text-right"
                          onMouseEnter={() => setHoveredTicketId(ticket.id)}
                          onMouseLeave={() => setHoveredTicketId(null)}
                        >
                          {ticket.status === "New" && (
                            <span className="flex items-center">
                              {hoveredTicketId === ticket.id ? (
                                <>
                                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
                                  <Link to="/some-other-page" className="underline">
                                    Got answer (Open)
                                  </Link>
                                </>
                              ) : (
                                <>
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                  {ticket.status}
                                </>
                              )}
                            </span>
                          )}
                          {ticket.status === "" && (
                            <span className="flex items-center">
                              {hoveredTicketId === ticket.id ? (
                                <>
                                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
                                  <Link to="/help-ticket" className="underline">
                                    Got answer (Open)
                                  </Link>
                                </>
                              ) : (
                                <span></span>
                              )}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className='flex float-right mt-6'>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>
                          2
                        </PaginationLink>
                      </PaginationItem>
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
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Help;
