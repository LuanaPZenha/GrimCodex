import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { loadAppConfig } from './services/config';
import { configureApi } from './services/api';
import './index.css';

function renderApp() {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

loadAppConfig()
  .then((cfg) => {
    if (cfg.apiUrl) {
      configureApi(cfg.apiUrl);
    }
    renderApp();
  })
  .catch(() => {
    renderApp();
  });
