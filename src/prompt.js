import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import SummariesDisplay from './SummariesDisplay'; // Import the SummariesDisplay component
import './prompt.css';
import LoginButton from './LoginButton';

export default function Prompt({ email }) {
    const [isLoading, setIsLoading] = useState(false);
    const [inputPrompt, setInputPrompt] = useState("");
    const [message, setMessage] = useState(""); // State for feedback to the user
    const [responses, setResponses] = useState([]); // State to store responses
    const [summaries, setSummaries] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0); // State for refreshing the SummariesDisplay component
    const [filteredSummaries, setFilteredSummaries] = useState([]); // State for filtered summaries


    // Load stored summaries from local storage on component mount
    // useEffect(() => {
    //    const storedSummaries = localStorage.getItem('summaries');
    //    if (storedSummaries) {
    //        setResponses(JSON.parse(storedSummaries));
    //    }
    // }, []);


    useEffect(() => {
        fetchFilteredSummaries();
    }, []); // Empty dependency array ensures the effect runs only once on component mount

    // Save summaries to local storage whenever the 'responses' state changes
    useEffect(() => {
        localStorage.setItem('summaries', JSON.stringify(responses));
    }, [responses]);

    async function fetchFilteredSummaries() {
        try {
            const response = await fetch("https://framereactnext-pi.vercel.app/api/getpet");
            if (response.ok) {
                const data = await response.json();
                const filteredSummaries = data.summaries.filter(summary => !summary.minted);
                setFilteredSummaries(filteredSummaries); // Update filteredSummaries state with fetched data
                return filteredSummaries; // Return the updated filteredSummaries here
            } else {
                console.error("Failed to fetch filtered summaries from database");
            }
        } catch (error) {
            console.error("Error fetching filtered summaries:", error);
        }
    }


    async function fetchSummaries() {
        setIsLoading(true);
        try {
            const response = await fetch("https://framereactnext-pi.vercel.app/api/getpet");
            if (response.ok) {
                const data = await response.json();
                console.log("Received data:", data);
                setSummaries(data.summaries);
                console.log("SUMMARIES", data.summaries);
                return data.summaries; // Return the updated summaries here
            } else {
                setMessage("Failed to fetch summaries");
            }
        } catch (error) {
            console.error("Error fetching summaries:", error);
            setMessage("Failed to fetch summaries due to a network error.");
        } finally {
            setIsLoading(false);
        }
    }

    // Fetch last 5 summaries from the backend API
    useEffect(() => {


        fetchSummaries();
    }, [refreshKey]);


    const handleMint = async (id) => {
        setIsLoading(true);
        console.log("Handlemint", id)
        try {
            const databaseEndpoint = "https://framereactnext-pi.vercel.app/api/mintpet";
            const databaseResponse = await fetch(databaseEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }), // Pass the ID along with the summary
            });

            if (databaseResponse.ok) {
                setMessage("Summary successfully minted");

                // Update minted status in responses state
                const updatedResponses = responses.map(item =>
                    item.id === id ? { ...item, minted: true } : item
                );
                setResponses(updatedResponses);

                // Fetch filtered summaries again after minting
                await fetchFilteredSummaries();

                // Increment refreshKey to force re-render of SummariesDisplay component
                setRefreshKey(prevKey => prevKey + 1);
            } else {
                setMessage("Failed to mint summary");
            }
        } catch (error) {
            console.error("Error minting summary:", error);
            setMessage("Failed to mint summary due to a network error.");
        } finally {
            setIsLoading(false);
        }
    };

    async function storeInDatabase(response, url) {
        const databaseEndpoint = "https://framereactnext-pi.vercel.app/api/addpet";
        const databaseResponse = await fetch(databaseEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ summary: response, url: url }),
        });

        if (!databaseResponse.ok) {
            setMessage("Failed to save summary to the database");
        } else {
            const data = await response.json();
            setMessage(`Error: ${data.message || "Failed to send prompt"}`);
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        const endpoint = "https://floating-lowlands-74434-476271de7154.herokuapp.com/summary";
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url: inputPrompt }),
            });

            if (response.ok) {
                const responseData = await response.json();
                // Store the entire response object including ID and summary
                const newResponse = { id: responseData.id, summary: responseData.summary, minted: false, url: responseData.url };
                setResponses([newResponse, ...responses]);
                setInputPrompt("");
                setIsLoading(false);

                // Send the summary to your database endpoint
                await storeInDatabase(responseData.summary, responseData.url)
            }
        } catch (error) {
            console.error("Error sending data:", error);
            setMessage("Failed to send prompt due to a network error.");
        }
    };

    return (

        <div className="prompt-container">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ width: "100%", marginTop: "20px" }}>

                    {/* Display last 5 summaries */}
                    <div className="z-10 w-full max-w-xl px-5 xl:px-0">
                        <h1
                            className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
                            style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
                        >
                            ORCHID
                        </h1>
                        <h5 className="mb-4 text-center text-black">
                            {" "}
                            {/* Add a margin bottom for spacing */}
                            Mint your summary
                        </h5>
                        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", maxWidth: "100%" }}>
                            <textarea
                                value={inputPrompt}
                                onChange={(e) => setInputPrompt(e.target.value)}
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
                            <button
                                onClick={handleSubmit}
                                className="group flex max-w-fit items-center justify-center rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
                                style={{ alignSelf: "flex-start" }} // Align the button to the start of the flex container
                            >
                                {isLoading ? (
                                    // Spinner loader here
                                    <span className="spinner"></span>
                                ) : (
                                    <span>Submit</span>
                                )}
                            </button>
                        </div>

                        {/* Display unminted and minted summaries */}
                        {responses.map((response, index) => (
                            // Check if the response is not minted
                            !response.minted && (
                                <div
                                    key={index}
                                    className="response-container"
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        marginBottom: "20px",
                                    }}
                                >
                                    <div
                                        style={{
                                            border: "1px solid #ccc",
                                            borderRadius: "15px",
                                            padding: "15px",
                                        }}
                                    >
                                        <div className="font-medium tracking-tight text-primary-foreground text-base leading-[14px]">
                                            {response.summary}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleMint(response.id)}
                                        style={{
                                            padding: "10px 20px",
                                            backgroundColor: "#007bff",
                                            color: "#fff",
                                            borderRadius: "8px",
                                            border: "none",
                                            cursor: "pointer",
                                            marginTop: "10px" // Adjust as needed for spacing between response and mint button
                                        }}
                                    >
                                        Mint
                                    </button>
                                </div>
                            )
                        ))}
                        {/* Check if there are no unminted summaries */}
                        {filteredSummaries.length === 0 && (
                            <div className="font-medium tracking-tight text-primary-foreground text-base leading-[14px]">
                                All summaries have been minted
                            </div>
                        )}

                        {/* Display filtered summaries */}
                        {filteredSummaries.map((response, index) => (
                            <div
                                key={index}
                                className="response-container"
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    marginBottom: "20px",
                                }}
                            >
                                <div
                                    style={{
                                        border: "1px solid #ccc",
                                        borderRadius: "15px",
                                        padding: "15px",
                                    }}
                                >
                                    <div className="font-medium tracking-tight text-primary-foreground text-base leading-[14px]">
                                        {response.summary}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleMint(response.id)}
                                    style={{

                                        padding: "10px 20px",
                                        backgroundColor: "#007bff",
                                        color: "#fff",
                                        borderRadius: "8px",
                                        border: "none",
                                        cursor: "pointer",
                                        marginTop: "10px" // Adjust as needed for spacing between response and mint button
                                    }}
                                >
                                    Mint
                                </button>
                            </div>
                        ))}

                        {/* Display last 5 summaries */}
                        <div className="font-medium response-container">
                            <SummariesDisplay summaries={summaries} onMintButtonClick={handleMint} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Prompt.propTypes = {
    onResponseMessage: PropTypes.func.isRequired,
};
