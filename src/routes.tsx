import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import BuyLoadingCIS from '@/pages/BuyLoadingCIS';
import BuyLoadingWord from '@/pages/BuyLoadingWord';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path='/buy-loading-cis' element={<BuyLoadingCIS />} />
      <Route path='/buy-loading-word' element={<BuyLoadingWord />} />
    </Routes>
  );
};

export default AppRoutes;