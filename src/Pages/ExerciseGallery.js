import React, { useState } from 'react';
import './ExerciseGallery.css'; // Import CSS file for styling
import Navbar from '../Components/Navbar';
const FlipCard = ({ frontImage, frontText, backImage, backDescription }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (


    <div className='flip-card-container'>
        <Navbar />
 <div className={`flip-card ${isFlipped ? 'flipped' : ''}`} onClick={handleClick}>
        <div className="flip-card-inner">
        <div className="flip-card-front">
          <img src={frontImage} alt="Front" />
          <p>{frontText}</p>
        </div>
        <div className="flip-card-back">
          <img src={backImage} alt="Back" />
          <p>{backDescription}</p>
        </div>
      </div>
    </div>
    </div>
       
    
  );
};

const ExerciseGallery = () => {
  return (
    <div className="page-of-cards">
      <div className="cards-container">
        <FlipCard
          frontImage="front-image-1.jpg"
          frontText="Front Text 1"
          backImage="back-image-1.jpg"
          backDescription="Back Description 1"
        />
        <FlipCard
          frontImage="front-image-2.jpg"
          frontText="Front Text 2"
          backImage="back-image-2.jpg"
          backDescription="Back Description 2"
        />
        {/* Add more FlipCard components as needed */}
      </div>
    </div>
  );
};

export default ExerciseGallery;
