import React, { useState } from 'react';
import './App.css'

const App = () => {
  const [algorithm, setAlgorithm] = useState('');
  const [code, setCode] = useState(''); 
  const [result, setResult] = useState('');

  const analyzeComplexity = async () => {
    try {
      const response = await fetch('http://localhost:5001/analyze', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm, code }), 
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to connect to the server. Please check the backend.' });
    }
  };

  return (
    <div className="outer-con">
      <p className="title">Time and Space Complexity Analyzer</p>
      <p className='name'>By Jarell Tamonte</p>
      <select onChange={(e) => setAlgorithm(e.target.value)} className='select-menu'>
        <option value="">Select Algorithm</option>
        <option value="Binary Search">Binary Search</option>
        <option value="Merge Sort">Merge Sort</option>
        <option value="Quick Sort">Quick Sort</option>
      </select>
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
        <div className='result-area'>
          <h2>Results:</h2>
          {result.error ? (
            <p style={{ color: 'red' }}>{result.error}</p>
          ) : (
            <>
              <p><strong>Detected Language:</strong> {result.language}</p>
              <p><strong>Time Complexity:</strong> {result.timeComplexity}</p>
              <p><strong>Space Complexity:</strong> {result.spaceComplexity}</p>
              <p><strong>Note:</strong> {result.note}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
