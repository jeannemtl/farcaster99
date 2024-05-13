import React, { useState, useEffect } from 'react';
import Prompt from './prompt';
import River from './river';
import './App.css';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { useLogin, usePrivy } from '@privy-io/react-auth';

function App() {
  const config = {
    rpcUrl: 'https://mainnet.optimism.io',
    domain: 'prompterminal.com',
    siweUri: 'https://prompterminal.com/',
  };
  // State variables for API key, frame initialization, and trusted data
  const [apiKey, setApiKey] = useState(null);
  const [frameInitialized, setFrameInitialized] = useState(false);
  const [trustedData, setTrustedData] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [email, setEmail] = useState('');

  const { authenticated } = usePrivy();
  const { login } = useLogin({
    onComplete: (user, isNewUser, wasAlreadyAuthenticated) => {
      console.log(user.id); // Access user ID here
      console.log(user);
      console.log(isNewUser);
      console.log(wasAlreadyAuthenticated);
      // Any logic you'd like to execute if the user is/becomes authenticated while this
      // component is mounted
    },
    onError: (error) => {
      console.log(error);
      // Any logic you'd like to execute after a user exits the login flow or there is an error
    },
  });

  useEffect(() => {
    // Fetch the user's email after authentication
    if (authenticated) {
      const userEmail = 'shih.jeanne@gmail.com'; // Replace with the actual email from the user object
      setEmail(userEmail);
    }
  }, [authenticated]);



  const handleResponseMessage = (message) => {
    setResponseMessage(message);
  };

  const generateInitialFrame = async () => {
    try {
      // Replace "URL_TO_CREATE_FRAME_ENDPOINT" with your actual endpoint URL
      const response = await fetch("URL_TO_CREATE_FRAME_ENDPOINT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          frame: "vNext",
          "frame:image": "http://localhost:3000/image.png",
          "frame:button:1": "Green",
          "frame:button:2": "Purple",
          "frame:button:3": "Red",
          "frame:button:4": "Blue"
        })
      });

      if (response.ok) {
        console.log("Initial frame created successfully!");
        const trustedData = await response.json();
        setTrustedData(trustedData);
        setFrameInitialized(true);
      } else {
        console.error("Failed to create initial frame");
      }
    } catch (error) {
      console.error("Error creating initial frame:", error);
    }
  };

  // Function to handle successful authentication

  const handleApiKeyGenerated = (apiKey) => {
    setApiKey(apiKey);
  };


  return (
    <div className="container">
      <div className="content">

        <LoginButton />
        <LogoutButton />
        {/* Conditionally render the Prompt component */}
        {authenticated && (
          <React.Fragment>
            {/*<River onApiKeyGenerated={handleApiKeyGenerated} /> */}
            <Prompt apiKey={apiKey} email={email} onResponseMessage={handleResponseMessage} />
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default App;
