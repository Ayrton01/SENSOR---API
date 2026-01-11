import React from 'react';
import ReactDOM from 'react-dom/client';
import './dashboard.css';
import Dashboard from './dashboard';
import reportWebVitals from './reportWebVitals';

// 1. Importe o AuthProvider da pasta que você criou
import { AuthProvider } from './token/AuthContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. Envolva o Dashboard com o Provedor de Autenticação */}
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();