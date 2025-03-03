import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from "@/components/Header";

interface MainProps {
  children: ReactNode;
}

const Main: React.FC<MainProps> = ({ children }) => {
  const location = useLocation();

  // Определение, на каких маршрутах не должен отоброжаться Header
  const showHeader = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <main>
      {showHeader && <Header />}
      {children}
    </main>
  );
}

export default Main;