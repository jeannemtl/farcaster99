import React, { useEffect, useState } from "react";

function River() {
    const [apiKey, setApiKey] = useState(null);

    const generateApiKey = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/createApiKey", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chainId: 5101, // Change to the appropriate chain ID
                }),
            });
            const data = await response.json();
            console.log("Server response:", data); // Log the server response
            const apiKey = data.apiKey; // Extract the API key from the response
            console.log("API Key generated:", apiKey); // Log the generated API key
            setApiKey(apiKey); // Update the API key state

        } catch (error) {
            console.error("Error generating API key:", error); // Log any errors that occur
            alert("Error generating API key! Check the console for details.");
        }
    };

    useEffect(() => {
        generateApiKey();
    }, []); // Empty dependency array ensures the effect runs only once


    const viewWalletAddress = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/getWallets", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            console.log("Wallet addresses:", data.data.walletAddresses);
            // Update state or perform other actions with wallet addresses
        } catch (error) {
            console.error("Error fetching wallet addresses:", error);
        }
    };

    const sendTransaction = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/sendTransactions", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            console.log("Transaction data:", data);
            // Process the transaction data as needed
        } catch (error) {
            console.error("Error sending transaction:", error);
        }
    };

    return (
        <div>
            <button onClick={generateApiKey}>Generate API Key</button>
            <button onClick={viewWalletAddress}>View Wallet Address</button>
            <button onClick={sendTransaction}>Send Transaction</button>
            <div id="dynamicContent"></div>
        </div>
    );
}

export default River;
