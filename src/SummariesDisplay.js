import React from 'react';
import PropTypes from 'prop-types';
import './SummariesDisplay.css'; // Import CSS file for styles

function SummariesDisplay({ summaries, onMintButtonClick }) {
    const handleMintButtonClick = (index) => {
        // Call the parent component function to handle mint button click
        onMintButtonClick(index);
    };

    // Filter out summaries where minted is true
    const mintedSummaries = summaries.filter(summary => summary.minted === true);

    return (
        <div>
            <ul className="summary-list">
                {mintedSummaries.map((summary, index) => (
                    <li key={index} className="">
                        {/* Apply CSS class for font-medium to the summary content */}
                        <div className="font-medium tracking-tight text-primary-foreground text-base">
                            {summary.url}: {/* Add colon after the URL */}
                        </div>

                        <div className="font-medium tracking-tight text-primary-foreground text-base">
                            {summary.summary.split(' ').slice(0, 30).join(' ')}
                        </div>

                        <div className="font-medium tracking-tight text-primary-foreground text-base leading-[14px]">Date: {new Date(summary.date_added).toLocaleString()}</div>
                        <button
                            // Pass the index to the handleMintButtonClick function
                            className="mint-button" // Apply CSS class for styling
                        >
                            Minted
                        </button>
                    </li>
                ))}

            </ul>
        </div>
    );
}

SummariesDisplay.propTypes = {
    summaries: PropTypes.array.isRequired,
    onMintButtonClick: PropTypes.func.isRequired, // Define prop type for mint button click handler
};

export default SummariesDisplay;
