import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import Main from "./Main";
import AppRoutes from './routes';
import "./styles/global.css";

const rootElement = document.getElementById('collaboo');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <BrowserRouter>
        <Main>
          <AppRoutes />
        </Main>
      </BrowserRouter>
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}