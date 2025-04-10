import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import Chat from "@/assets/images/svg/Chat.svg";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Textarea } from "@/components/ui/textarea";
import { Link } from 'react-router-dom';
import { useAuth } from "@/hooks/useAuth"; // Импортируем useAuth
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const HelpTicketCreate: React.FC = () => {
  const { getUserToken } = useAuth(); // Получаем функцию для обновления токена
  const [activeTab, setActiveTab] = useState('Tickets');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileClick = () => {
    setActiveTab('Tickets');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Подготовка данных для отправки
    const ticketData = {
      title,
      header_message: message,
    };

    try {
      // Получаем актуальный токен перед отправкой
      const token = await getUserToken();
      if (!token) {
        throw new Error('User is not authenticated');
      }

      const response = await fetch('http://217.114.14.99:8080/api-support/api/v1/ticket/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Используем актуальный токен
        },
        body: JSON.stringify(ticketData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Ticket created successfully:', data);
        // Очистить форму после успешной отправки
        setTitle('');
        setMessage('');
      } else {
        const errorData = await response.json();
        console.error('Error creating ticket:', errorData);
      }
    } catch (error) {
      console.error('Error sending request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container font-[Inter] font-normal text-[#18181B]">
      <div className="container pt-[55px]">
        <div className="w-full flex items-center pt-10 mb-8 justify-between">
          <h1 className="font-semibold text-[30px]">Helpdesk</h1>
          <div className='hidden md:flex'>
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
        <div className="md:flex h-screen text-[Inter]">
          <aside className="w-1/5 hidden md:flex flex-col text-[14px]">
            <Link to={"/help"}>
              <button 
                className="button-sidebar" 
                onClick={handleProfileClick}
              >
                Tickets
              </button>
            </Link>
          </aside>
          <div className='md:flex'>
            <aside className="flex md:hidden">
              <Tabs defaultValue="all" className="w-full mb-6" onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-1">
                        <Link to={"/help"}>
                          <TabsTrigger className='w-full' value="all" onClick={handleProfileClick}>Tickets</TabsTrigger>
                        </Link>
                      </TabsList>
                    </Tabs>
            </aside>
            <div className='flex md:hidden mb-5'>
              <Link to={"/help-ticket-create"} className="w-full">
                <Button variant={"full_dark"} className="w-full">
                  <span>
                    <img src={Chat} alt="icon" />
                  </span>
                  <span>Submit new ticket</span>
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-4/5">
            {activeTab === 'Tickets' && (
              <>
                <div className='py-2'>
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/help">Helpdesk</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/help">Tickets</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>New Ticket</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className='mt-6 flex flex-col gap-3'>
                    <div>
                      <h5 className='font-medium text-[14px] mb-2'>Ticket title</h5>
                      <Input
                        placeholder='Enter ticket title…'
                        className='w-full'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <h5 className='font-medium text-[14px] mb-2'>Message</h5>
                      <Textarea
                        style={{
                          resize: "none",
                          height: "115px",
                        }}
                        placeholder="Enter your text here…"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                    <div className='flex justify-end mt-4'>
                      <Button variant={"default"} type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </Button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HelpTicketCreate;
