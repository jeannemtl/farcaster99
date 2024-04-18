import React, { useState } from 'react';
import Prompt from './prompt';
import River from './river';
import './App.css';
import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { SignInButton } from '@farcaster/auth-kit';
import { useProfile } from '@farcaster/auth-kit';

function App() {
  const config = {
    rpcUrl: 'https://mainnet.optimism.io',
    domain: 'prompterminal.com',
    siweUri: 'https://prompterminal.com/',
  };

  // State variable for authentication status
  const [apiKey, setApiKey] = useState(null);

  // Function to handle successful authentication and set the API key
  const handleApiKeyGenerated = (apiKey) => {
    setApiKey(apiKey);
  };

  return (
    <AuthKitProvider config={config}>
      <div className="container">
        <div className="content">
          <a
            href="https://t.me/hotmomabaebot"
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            Add on TG
          </a>
          <h1 className="title">ORCHID</h1>
          <h5 className="subtitle">ORCHID decides which model works best for you</h5>
          <p className='signup'>
            <SignInButton
              onSuccess={({ fid, username }) => {
                console.log(`Hello, ${username}! Your fid is ${fid}.`);
                // Update authentication status when fid and username are obtained
                setApiKey(true);
              }}
            />
          </p>
          {/* Render River component only if user is authenticated */}
          {apiKey ? (
            <p className="p">Authenticated, rendering <River onApiKeyGenerated={handleApiKeyGenerated} /></p>
          ) : (
            <p className="p">Not Authenticated</p>
          )}
          {apiKey && <p className="p"><Prompt apiKey={apiKey} /></p>}
        </div>
      </div>
    </AuthKitProvider>
  );
}

export default App;
