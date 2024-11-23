const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request Body:', req.body); 
  next();
});

const complexityData = {
  'Binary Search': { time: 'O(log n)', space: 'O(1)' },
  'Merge Sort': { time: 'O(n log n)', space: 'O(n)' },
  'Quick Sort': { time: 'O(n^2)', space: 'O(log n)' },
};

function detectLanguage(code) {
  if (code.includes('<iostream>') || code.includes('int main()')) return 'C++';
  if (code.includes('public static void main')) return 'Java';
  if (code.includes('def ') || code.includes('import ')) return 'Python';
  if (code.includes('def ') || code.includes('puts')) return 'Ruby';
  if (code.includes('document.getElementById') || code.includes('function')) return 'JavaScript';
  if (code.includes('<stdio.h>') || code.includes('int main()')) return 'C';
  return null;
}

function detectAlgorithm(code) {
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

  return 'Unknown Algorithm';
}

app.post('/analyze', (req, res) => {
  console.log('POST /analyze called');
  const { code } = req.body;

  if (!code) {
    console.error('Error: Code is required for analysis.');
    return res.status(400).json({ error: 'Code is required for analysis.' });
  }

  const language = detectLanguage(code);
  if (!language) {
    console.error('Error: Unsupported or invalid code.');
    return res.status(400).json({ error: 'Unsupported or invalid code.' });
  }

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

  res.json({
    algorithm: algorithm !== 'Unknown Algorithm' ? algorithm : null,
    language,
    timeComplexity: time,
    spaceComplexity: space,
    note: languageNotes[language] || 'No specific notes available for this language.',
  });
});

app.use((err, req, res, next) => {
  console.error('Unexpected Error:', err.message);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

const PORT = 5004; 
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
