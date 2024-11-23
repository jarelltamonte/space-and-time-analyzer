const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Log every request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request Body:', req.body); // Log request body
  next(); // Pass to the next middleware/route handler
});

// Complexity data for each algorithm
const complexityData = {
  'Binary Search': { time: 'O(log n)', space: 'O(1)' },
  'Merge Sort': { time: 'O(n log n)', space: 'O(n)' },
  'Quick Sort': { time: 'O(n^2)', space: 'O(log n)' },
};

// Function to detect programming language
function detectLanguage(code) {
  if (code.includes('<iostream>') || code.includes('int main()')) return 'C++';
  if (code.includes('public static void main')) return 'Java';
  if (code.includes('def ') || code.includes('import ')) return 'Python';
  if (code.includes('def ') || code.includes('puts')) return 'Ruby';
  if (code.includes('document.getElementById') || code.includes('int main()')) return 'JavaScript';
  if (code.includes('<stdio.h>') || code.includes('int main()')) return 'C';
  return null;
}

// Route: Analyze complexity
app.post('/analyze', (req, res) => {
  console.log('POST /analyze called'); // Log when this route is hit
  const { algorithm, code } = req.body;

  // Validate algorithm
  if (!algorithm || !complexityData[algorithm]) {
    console.error('Error: Invalid or unsupported algorithm selected.');
    return res.status(400).json({ error: 'Invalid or unsupported algorithm selected.' });
  }

  // Validate code
  if (!code) {
    console.error('Error: Code is required for analysis.');
    return res.status(400).json({ error: 'Code is required for analysis.' });
  }

  // Detect language
  const language = detectLanguage(code);
  if (!language) {
    console.error('Error: Unsupported or invalid code.');
    return res.status(400).json({ error: 'Unsupported or invalid code.' });
  }

  // Fetch complexity data
  const { time, space } = complexityData[algorithm];

  const languageNotes = {
    'C++': 'C++ is optimized with STL for common algorithms.',
    Java: 'Java provides efficient libraries like Collections Framework.',
    Python: 'Python relies on Timsort for sorting and has high-level simplicity.',
    Ruby: 'Ruby’s sort methods are based on Quicksort.',
    JavaScript: 'JavaScript optimized for web performance',
    C: 'C is not optimized'
  };
  

  // Send response
  res.json({
    algorithm,
    language,
    timeComplexity: time,
    spaceComplexity: space,
    note: languageNotes[language],
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unexpected Error:', err.message);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

// Start server
const PORT = 5001; // Use an alternate port
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
