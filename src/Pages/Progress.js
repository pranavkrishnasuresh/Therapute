import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Progress.css';

const Progress = () => {
  const navigation = useNavigate();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const animationDuration = 5000; // 5 seconds in milliseconds
    const interval = 50; // Update width every 50 milliseconds
    const widthIncrement = 100 / (animationDuration / interval);

    const timer = setInterval(() => {
      setWidth((prevWidth) => {
        const newWidth = prevWidth + widthIncrement;
        if (newWidth >= 100) {
          clearInterval(timer);
          navigation('/Result');
        }
        return newWidth;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [navigation]);

  return (
    <div className="loading-container">
      <div className="loading-text">Analyzing exercise data...</div>
      <div className="loading-bar-container">
        <div className="loading-bar" style={{ width: `${width}%` }}></div>
      </div>
    </div>
  );
};

export default Progress;
