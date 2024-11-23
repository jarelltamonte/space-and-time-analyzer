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
  next();
});

// Complexity data for common algorithms
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
  if (code.includes('document.getElementById') || code.includes('function')) return 'JavaScript';
  if (code.includes('<stdio.h>') || code.includes('int main()')) return 'C';
  return null;
}

// Refined function to infer the algorithm
function detectAlgorithm(code) {
  // Binary Search: Detect specific logic (mid, low, high, and a search loop)
  if (
    code.includes('binarySearch') || 
    (
      code.includes('low') && 
      code.includes('high') && 
      code.includes('mid') &&
      (code.includes('while') || code.includes('if (low <= high)'))
    )
  ) {
    return 'Binary Search';
  }

  // Quick Sort: Detect partitioning and recursive structure
  if (
    code.includes('quickSort') ||
    (
      code.includes('pivot') && 
      code.includes('partition') &&
      (code.includes('quickSort(') || code.includes('return quickSort'))
    )
  ) {
    return 'Quick Sort';
  }

  // Merge Sort: Detect divide and conquer logic with merging
  if (
    code.includes('merge') || 
    (
      code.includes('sort') && 
      code.includes('mid') &&
      code.includes('merge(')
    )
  ) {
    return 'Merge Sort';
  }

  // If no algorithm matches, return unknown
  return 'Unknown Algorithm';
}

// Route: Analyze complexity
app.post('/analyze', (req, res) => {
  console.log('POST /analyze called');
  const { code } = req.body;

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

  // Detect algorithm
  const algorithm = detectAlgorithm(code);
  const { time, space } = complexityData[algorithm] || { time: 'Unknown', space: 'Unknown' };

  const languageNotes = {
    'C++': 'C++ is optimized with STL for common algorithms.',
    Java: 'Java provides efficient libraries like Collections Framework.',
    Python: 'Python relies on Timsort for sorting and has high-level simplicity.',
    Ruby: 'Ruby’s sort methods are based on Quicksort.',
    JavaScript: 'JavaScript is optimized for web performance.',
    C: 'C is a low-level language allowing fine-grained control.',
  };

  // Send response
  res.json({
    algorithm: algorithm !== 'Unknown Algorithm' ? algorithm : null,
    language,
    timeComplexity: time,
    spaceComplexity: space,
    note: languageNotes[language] || 'No specific notes available for this language.',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unexpected Error:', err.message);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

// Start server
const PORT = 5004; // Use an alternate port
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
