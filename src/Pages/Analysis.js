import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import './Analysis.css'; // Import your CSS file for analysis styling
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis } from 'victory';
import ExerciseList from '../Components/ExerciseList';

function Analysis() {
  const [exerciseHistoryData, setExerciseHistoryData] = useState([]);
  const [errorRateData, setErrorRateData] = useState([]);
  const [improvementData, setImprovementData] = useState([]);

  useEffect(() => {
    // Fetch data from API and update state
    // Example: fetchExerciseHistory().then(data => setExerciseHistoryData(data));
    // Replace fetchExerciseHistory() with actual API call

    // Mock data for exercise history
    const mockExerciseHistoryData = [
      { date: new Date('2023-01-01'), performance: 10 },
      { date: new Date('2023-01-02'), performance: 15 },
      { date: new Date('2023-01-03'), performance: 12 },
      // Add more data points as needed
    ];
    setExerciseHistoryData(mockExerciseHistoryData);

    // Mock data for error rate
    const mockErrorRateData = [
      { date: new Date('2023-01-01'), errorCount: 2 },
      { date: new Date('2023-01-02'), errorCount: 1 },
      { date: new Date('2023-01-03'), errorCount: 3 },
      // Add more data points as needed
    ];
    setErrorRateData(mockErrorRateData);

    // Mock data for improvement trend
    const mockImprovementData = [
      { date: new Date('2023-01-01'), improvementPercentage: 20 },
      { date: new Date('2023-01-02'), improvementPercentage: 30 },
      { date: new Date('2023-01-03'), improvementPercentage: 25 },
      // Add more data points as needed
    ];
    setImprovementData(mockImprovementData);
  }, []);

  return (
    <div className="analysis-container">
      <Navbar />
      <div className="analysis-content">
        <h1>Analytics</h1>
        {/* Exercise History Over Time */}
        <div className="chart-container">
          <h3>Exercise History Over Time</h3>
          <VictoryChart theme={VictoryTheme.material}>
            <VictoryLine data={exerciseHistoryData} x="date" y="performance" />
            <VictoryAxis tickFormat={(date) => new Date(date).toLocaleDateString()} />
            <VictoryAxis dependentAxis />
          </VictoryChart>
        </div>

        {/* Error Rate Over Time */}
        <div className="chart-container">
          <h3>Error Rate Over Time</h3>
          <VictoryChart theme={VictoryTheme.material}>
            <VictoryLine data={errorRateData} x="date" y="errorCount" />
            <VictoryAxis tickFormat={(date) => new Date(date).toLocaleDateString()} />
            <VictoryAxis dependentAxis />
          </VictoryChart>
        </div>

        {/* Improvement Trend */}
        <div className="chart-container">
          <h3>Improvement Trend</h3>
          <VictoryChart theme={VictoryTheme.material}>
            <VictoryLine data={improvementData} x="date" y="improvementPercentage" />
            <VictoryAxis tickFormat={(date) => new Date(date).toLocaleDateString()} />
            <VictoryAxis dependentAxis />
          </VictoryChart>
        </div>
      </div>
      <ExerciseList />
    </div>
  );
}

export default Analysis;
