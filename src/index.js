import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Foglio di stile globale
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // Import per PWA

// Monta l'app React sul DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ✅ Registra il service worker per abilitare funzionalità PWA (installazione, offline, ecc.)
serviceWorkerRegistration.register();

// 📊 (Opzionale) Performance logging — puoi rimuoverlo se non ti serve
reportWebVitals();
