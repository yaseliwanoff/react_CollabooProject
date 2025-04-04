import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import BuyLoadingCIS from '@/pages/BuyLoadingCIS';
import BuyLoadingWord from '@/pages/BuyLoadingWord';
import Profile from '@/pages/Profile';
import HelpTicket from '@/pages/HelpTicket';
import HelpTicketCreate from '@/pages/HelpTicketCreate';
import Help from '@/pages/Help';
import Partners from '@/pages/Partners';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path='/buy-loading-cis' element={<BuyLoadingCIS />} />
      <Route path='/buy-loading-word' element={<BuyLoadingWord />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/help" element={<Help />} />
      <Route path="/help-ticket/:ticketId" element={<HelpTicket />} />
      <Route path="/help-ticket-create" element={<HelpTicketCreate />} />
      <Route path="/partners" element={<Partners />} />
    </Routes>
  );
};

export default AppRoutes;