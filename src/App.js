import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { isJSON } from 'json-validator';
import './App.css';

const API_URL = 'https://bajaj-backend-new.vercel.app/api/bfhl';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest lowercase alphabet' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    if (!isJSON(input)) {
      setError('Invalid JSON input');
      return;
    }

    try {
      const parsedInput = JSON.parse(input);
      const res = await axios.post(API_URL, parsedInput);
      setResponse(res.data);
    } catch (err) {
      setError('Error processing request');
    }
  };

  const renderResponse = () => {
    if (!response) return null;

    const filteredResponse = {};
    selectedOptions.forEach(option => {
      if (response[option.value]) {
        filteredResponse[option.value] = response[option.value];
      }
    });

    return (
      <div className="response">
        <h3>Response:</h3>
        <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Flask API Frontend</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Enter JSON input (e.g., {"data": ["A","C","z"]})'
        />
        <button type="submit">Submit</button>
      </form>
      {error && <div className="error">{error}</div>}
      {response && (
        <div className="filter">
          <h3>Filter Response:</h3>
          <Select
            isMulti
            options={options}
            value={selectedOptions}
            onChange={setSelectedOptions}
          />
        </div>
      )}
      {renderResponse()}
    </div>
  );
}

export default App;