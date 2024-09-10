import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WalletModalProvider>
      <App />
    </WalletModalProvider>
  </React.StrictMode>
);

reportWebVitals();