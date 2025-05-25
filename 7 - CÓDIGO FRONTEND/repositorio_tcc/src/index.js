import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

//Endereço do servidor a ser utilizado nas requisições HTTP
window.server = process.env.REACT_APP_URL_API

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);