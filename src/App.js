import React, { useState } from 'react';
import './App.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');
  const [complexityData, setComplexityData] = useState(null);

  const analyzeComplexity = async () => {
    try {
      const response = await fetch('http://localhost:5004/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setResult(data);

      if (data.algorithm) {
        setComplexityData({
          labels: ['Time Complexity', 'Space Complexity'],
          datasets: [
            {
              label: data.algorithm,
              data: [
                parseComplexity(data.timeComplexity),
                parseComplexity(data.spaceComplexity),
              ],
              backgroundColor: ['#6e8897', '#9fb1bd'],
            },
          ],
        });
      }
    } catch (error) {
      setResult({ error: 'Failed to connect to the server. Please check the backend.' });
    }
  };

  const parseComplexity = (complexity) => {
    const scale = {
      'O(1)': 1,
      'O(log n)': 2,
      'O(n)': 3,
      'O(n log n)': 4,
      'O(n^2)': 5,
    };
    return scale[complexity] || 0;
  };

  return (
    <div className="outer-con">
      <p className="title">Time and Space Complexity Analyzer</p>
      <p className='name'>By Jarell Tamonte</p>
      <textarea
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows="10"
        cols="50"
        className="text-area"
      ></textarea>
      <button onClick={analyzeComplexity} className="analyze-btn">Analyze</button>

      {result && (
        <div className="result-area">
          <p className="results">Results</p>
          {result.error ? (
            <p style={{ color: 'red' }}>{result.error}</p>
          ) : (
            <>
              <p><strong>Detected Language:</strong> {result.language}</p>
              <p><strong>Time Complexity:</strong> {result.timeComplexity}</p>
              <p><strong>Space Complexity:</strong> {result.spaceComplexity}</p>
              <p><strong>Detected Algorithm:</strong> {result.algorithm}</p>
              <p><strong>Note:</strong> {result.note}</p>
            </>
          )}
        </div>
      )}

      {complexityData && (
        <div className="chart-container">
          <p className="performance-title">Complexity Visualizer</p>
          <Bar
            data={complexityData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: {
                    generateLabels: (chart) => {
                      const labels = ChartJS.defaults.plugins.legend.labels.generateLabels(chart);
                      return labels.map(label => ({
                        ...label,
                        fillStyle: 'transparent',
                        strokeStyle: 'transparent',
                      }));
                    },
                  },
                },
              },
              scales: {
                y: { 
                  title: { display: true, text: 'Performance Scale' },
                  ticks: {
                    callback: function (value) {
                      const reverseScale = {
                        1: 'O(1)',
                        2: 'O(log n)',
                        3: 'O(n)',
                        4: 'O(n log n)',
                        5: 'O(n^2)',
                      };
                      return reverseScale[value] || value;
                    },
                    stepSize: 1,
                  },
                  beginAtZero: true,
                  max: 5, 
                },
              },
            }}
          />
          <p className="comment">The <strong>smaller</strong> the scale value, the <strong>faster</strong> the performance!</p>
          <p className="comment">Note: The scale value defaults to 0 if the complexity is unidentified.</p>
        </div>
      )}
    </div>
  );
};

export default App;
