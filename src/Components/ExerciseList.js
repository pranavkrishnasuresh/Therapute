import React, { useState } from 'react';
import './ExerciseList.css'; // Import your CSS file for styling
import Chatbot from './Chatbot';


const ExerciseList = () => {
  const [exercises, setExercises] = useState(generateDummyExercises());
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [chatbotTitle, setChatbotTitle] = useState("");

  // Function to generate dummy exercises
  function generateDummyExercises() {
    const dummyExercises = [];
    for (let i = 1; i <= 20; i++) {
      dummyExercises.push({ id: i, name: `Exercise ${i}` });
    }
    return dummyExercises;
  }

  // Function to handle click on exercise
  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    setChatbotTitle(exercise.name);
  };

  // Function to handle closing the chatbot
  const handleCloseChatbot = () => {
    setSelectedExercise(null);
    setChatbotTitle("");
  };



  return (
    <div className="exercise-list-container">
      <h2>Physical Therapy Exercises</h2>
      {/* Analytics Section */}
      <div className="analytics-box">
        <h3>Analytics</h3>
        {/* Add analytics components here */}
      </div>

      {/* Exercise Sections */}
      <div className="exercise-sections">
        {/* Pending Conversations Section */}
        <div className="pending-conversations-box">
          <h3>Pending Conversations</h3>
          <div className="pending-conversations">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="exercise-item">
                <div className="exercise-info">
                  <h4>{exercise.name}</h4>
                  <button onClick={() => handleExerciseClick(exercise)}>Start Conversation</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chatbot Section */}
        {selectedExercise && (
          <div className="chatbot-box">
            <div className="chatbot-title">
              <h3>{chatbotTitle}</h3>
            </div>
            <Chatbot/>
            <button className="closeModalButton" onClick={handleCloseChatbot}>Close</button>

          </div>
        )}

        {/* Past Conversations Section */}

      </div>
    </div>
  );
};

export default ExerciseList;


