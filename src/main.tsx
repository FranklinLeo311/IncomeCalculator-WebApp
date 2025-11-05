import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './shared/contexts/TheameContext';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <StrictMode>
     <ThemeProvider>
        <App />
     </ThemeProvider>
  </StrictMode>
  
  </BrowserRouter>
)
