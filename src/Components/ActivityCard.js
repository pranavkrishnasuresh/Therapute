import React from 'react';
import "./ActivityCard.css";

export default function ActivityCard(props) {
    const handleClick = async () => {
        try {
            // Make POST request to your API
            const response = await fetch('http://localhost:3001/set_mode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', // Set content type to form data
                },
                body: new URLSearchParams({ exercise: props.name }), // Convert data to URLSearchParams
            });
            
            // Check if the request was successful
            if (response.status == 200) {
                // If successful, navigate to the desired link
                window.location.href = 'http://localhost:3001/video_feed';
            } else {
                // Handle errors if necessary
                console.error('Error:', response.statusText);
            }
        } catch (error) {

            // Handle errors if necessary
            console.error('Error:', error);
        }
    }
    
    return (
        <div className="activity-card-individual" onClick={handleClick}>
            <h2 className="activity-text">{props.showName}</h2>
            <img className="activity-img" src={props.imgSrc} alt={props.name} />
        </div>
    );
}
