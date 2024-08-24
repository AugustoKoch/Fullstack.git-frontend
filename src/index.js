import React from 'react';
import { createRoot } from 'react-dom/client'; // Atualizado para importar createRoot
import './index.css';
import App from './App';

// Crie a raiz do React no elemento com id 'root'
const root = createRoot(document.getElementById('root'));

// Renderize o aplicativo usando a nova API
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
