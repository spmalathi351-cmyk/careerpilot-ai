import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent unhandled WebSocket/HMR rejection popups in preview iframe
window.addEventListener('unhandledrejection', (event) => {
  const reasonStr = String(event?.reason?.message || event?.reason || '');
  if (
    reasonStr.includes('WebSocket') ||
    reasonStr.includes('vite') ||
    reasonStr.includes('closed without opened')
  ) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(<App />);
