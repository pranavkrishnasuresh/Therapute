import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import './Analysis.css'; // Import your CSS file for analysis styling
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis } from 'victory';
import ExerciseList from '../Components/ExerciseList';

function Analysis() {


  return (
    <div className="analysis-container">
      <Navbar />
      <ExerciseList />
    </div>
  );
}

export default Analysis;
