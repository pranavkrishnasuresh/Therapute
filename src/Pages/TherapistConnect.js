import React from 'react';
import './TherapistConnect.css'; // Assuming you have a styles.css for styling
import Navbar from '../Components/Navbar';
// Example data for demonstration
const patientData = {
  therapist: {
    name: 'Dr. Emily Smith',
    specialization: 'Physical Therapist',
  },
  exercises: [
    {
      id: 1,
      name: 'Push-ups',
      dueDate: '2024-03-15',
    },
    {
      id: 2,
      name: 'Squats',
      dueDate: '2024-03-20',
    },
    // Add more exercises as needed
  ],
};

const TherapistConnect = () => {
  const { therapist, exercises } = patientData;

  return (
    <div className="dashboard-container">
      <Navbar/>
      <div className="therapist-info">
        <h1>Your Current Therapist</h1>
        <div className="therapist-details">
          <h2>{therapist.name}</h2>
          <p>{therapist.specialization}</p>
        </div>
      </div>
      <div className="exercises-list">
        <h1>Your Assigned Exercises</h1>
        <ul>
          {exercises.map((exercise) => (
            <li key={exercise.id}>
              <div className="exercise-name">{exercise.name}</div>
              <div className="due-date">Due Date: {exercise.dueDate}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TherapistConnect;
