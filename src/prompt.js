import React, { useState } from "react";

import "./prompt.css";
import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { SignInButton } from '@farcaster/auth-kit';

export default function Prompt({ apiKey }) {
    const [isLoading, setIsLoading] = useState(false);
    const [inputPrompt, setInputPrompt] = useState("");
    const [message, setMessage] = useState(""); // State for feedback to the user
    const [responseMessage, setResponseMessage] = useState(""); // State to store the response message

    const handleSubmit = async () => {
        setIsLoading(true);
        const endpoint = "https://frame.syndicate.io/api/v2/sendTransaction"; // Transaction endpoint

        try {
            // Extract the URL from the input field
            const url = inputPrompt.trim();
            console.log("URL:", url);

            // Construct the body of the request
            const requestBody = {
                frameTrustedData: "0a49080d1085940118f6b...", // Replace with your trusted data
                contractAddress: "0x18F...", // Replace with your contract address
                functionSignature: "mint(address to, uint256 amount)",
                args: { to: url, amount: 1 }, // Use the URL as the 'to' address
                shouldLike: false,
                shouldRecast: false,
                shouldFollow: false
            };

            console.log("Request Body:", requestBody);

            // Send a POST request to the transaction endpoint
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}` // Use the API key passed as prop
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            console.log("Response Data:", data);

            if (response.ok) {
                setMessage("Transaction sent successfully!"); // Set success message
                setInputPrompt(""); // Clear the input field
                setResponseMessage(data.response); // Set response message
            } else {
                setMessage(`Error: ${data.message || "Failed to send transaction"}`); // Set error message from server response or a default message
            }
        } catch (error) {
            console.error("Error sending transaction:", error);
            setMessage("Failed to send transaction due to a network error."); // Set a generic error message
        }

        setIsLoading(false);
    };


    // ...

    return (
        <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
            <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="What links would you like me to summarize?"
                rows={4} // initial number of rows
                style={{
                    width: "100%",
                    borderRadius: "15px",
                    padding: "15px 10px",
                    border: "1px solid #ccc",
                    marginBottom: "10px",
                    resize: "vertical", // allows users to resize the textarea vertically
                }}
            ></textarea>
            {isLoading ? (
                // Spinner loader here
                <span className="spinner"></span>
            ) : (
                <button
                    onClick={handleSubmit}
                    className="submit-button group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
                >
                    Submit
                </button>
            )}

            {message && (
                <p
                    style={{
                        backgroundColor: "#f2f2f2",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        textAlign: "center",
                        marginTop: "10px",
                        borderTop: "2px solid #ccc", // This adds a line above the message
                    }}
                >
                    {message}
                </p>
            )}
            {responseMessage && (
                <textarea
                    value={responseMessage}
                    readOnly
                    rows={10} // initial number of rows
                    style={{
                        width: "100%",
                        borderRadius: "15px",
                        padding: "15px 10px",
                        border: "1px solid #ccc",
                        marginTop: "10px",
                        resize: "vertical", // allows users to resize the textarea vertically
                    }}
                ></textarea>
            )}
        </div>
    );
}