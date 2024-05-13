import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PrivyProvider } from '@privy-io/react-auth';
const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <PrivyProvider
      appId="clvprv1ln08w59wrsut9ko32l"
      config={{
        // Display email and wallet as login methods
        loginMethods: ['email'],
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',

        },
        // Create embedded wallets for users who don't have a wallet

      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>,
);