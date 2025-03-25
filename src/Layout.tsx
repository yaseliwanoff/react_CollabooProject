import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { TokenProvider } from '@/contexts/TokenContext';

import Main from "./Main";
import AppRoutes from './routes';
import "./styles/global.css";

const rootElement = document.getElementById('collaboo');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <TokenProvider>
        <BrowserRouter>
          <Main>
            <AppRoutes />
          </Main>
        </BrowserRouter>
      </TokenProvider>
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}