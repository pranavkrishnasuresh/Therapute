import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Upload.css';
import big from "../images/Hi.png"

const Upload = () => {
    const navigate = useNavigate();

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        // Check if the uploaded file is an MOV file
        if (file.name.toLowerCase().endsWith('.mov')) {
            // Navigate to a new page if the file is an MOV file
            navigate("/progress");
        } else {
            // Process the uploaded file as needed
            console.log('Uploaded file is not an MOV:', file);
        }
    };

    return (
        <div className="query-page">
            <div className="content">
                <h1 className="title">Upload Your Exercise</h1>
                <img className="logoQuery" src={big} alt="Patient data" />
                <div className="buttons">
                    <label className="file-upload">
                        <input type="file" accept=".mov" className="file-input" onChange={handleFileUpload} />
                        Upload MOV
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Upload;
