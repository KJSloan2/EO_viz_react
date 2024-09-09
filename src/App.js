import './App.css';
import React, { PureComponent } from 'react';
import { useState, useEffect } from 'react';
import { PieChart, Pie, Sector, Cell, BarChart, Bar, Rectangle, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Function to load and parse CSV data
function loadCSV(filePath, setData) {
  fetch(filePath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      const parsedData = parseCSV(data);
      setData(parsedData);
    })
    .catch(error => console.error('Error loading CSV:', error));
}

function parseCSV(csvData) {
  const lines = csvData.trim().split('\n');
  const dataStore = [];
  const headers = lines[0].split(',');

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const obj = {};
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index].trim();
    });
    dataStore.push(obj);
  }
  return dataStore;
}

// Function to get min and max values of a specific column
function getMinMax(data, key) {
  const values = data.map(item => parseFloat(item[key])).filter(value => !isNaN(value));
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

export function ChartA() {
  const [data, setData] = useState([]); // Data from tile_summaries.csv
  const [filteredData, setFilteredData] = useState([]);
  const [minMax, setMinMax] = useState({ min: 50, max: 120 });
  const [selectedTile, setSelectedTile] = useState(null); // To store tileId
  const [jsonFile, setJsonFile] = useState(null); // To store selected JSON file

  // Load CSV on component mount
  useEffect(() => {
    loadCSV('../data/tile_summaries.csv', (parsedData) => {
      setData(parsedData);
      if (selectedTile) {
        const filtered = parsedData.filter(item => item.tile === selectedTile);
        setFilteredData(filtered);

        // Get min and max values for the "mean_lstf" column
        const { min, max } = getMinMax(filtered, 'lstf_freq');
        setMinMax({ min, max });
      }
    });
  }, [selectedTile]);

  // Event listener for the JSON selector
  useEffect(() => {
    const jsonSelector = document.getElementById('json-selector');
    const handleJsonChange = (event) => {
      const selectedFile = event.target.value;
      setJsonFile(selectedFile); // Set the selected JSON file

      // Extract the tileId from the filename (assuming format like "year_tileId.json")
      const split_yearTile = selectedFile.split('_');
      const tileId = split_yearTile[1].replace('.json', ''); // Extract tileId from filename

      // Update selectedTile to filter the CSV
      setSelectedTile(tileId);
    };

    // Add event listener
    jsonSelector.addEventListener('change', handleJsonChange);

    // Cleanup event listener on component unmount
    return () => {
      jsonSelector.removeEventListener('change', handleJsonChange);
    };
  }, []);

  return (
    <>
      {/* Render the chart */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="lstf_range" />
          <YAxis
            domain={[minMax.min, minMax.max]} // Use min and max for scaling
          />
          <Tooltip />
          <Bar dataKey="lstf_freq" fill="#ff3333" activeBar={<Rectangle fill="#ff0000" stroke="8884d8" />} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}

export function ChartB() {
  const [data, setData] = useState([]); // Data from tile_summaries.csv
  const [filteredData, setFilteredData] = useState([]);
  const [minMax, setMinMax] = useState({ min: 50, max: 120 });
  const [selectedTile, setSelectedTile] = useState(null); // To store tileId
  const [jsonFile, setJsonFile] = useState(null); // To store selected JSON file

  // Load CSV on component mount
  useEffect(() => {
    loadCSV('../data/tile_summaries.csv', (parsedData) => {
      setData(parsedData);
      if (selectedTile) {
        const filtered = parsedData.filter(item => item.tile === selectedTile);
        setFilteredData(filtered);

        // Get min and max values for the "mean_lstf" column
        const { min, max } = getMinMax(filtered, 'mean_lstf');
        setMinMax({ min, max });
      }
    });
  }, [selectedTile]);

  // Event listener for the JSON selector
  useEffect(() => {
    const jsonSelector = document.getElementById('json-selector');
    const handleJsonChange = (event) => {
      const selectedFile = event.target.value;
      setJsonFile(selectedFile); // Set the selected JSON file

      // Extract the tileId from the filename (assuming format like "year_tileId.json")
      const split_yearTile = selectedFile.split('_');
      const tileId = split_yearTile[1].replace('.json', ''); // Extract tileId from filename

      // Update selectedTile to filter the CSV
      setSelectedTile(tileId);
    };

    // Add event listener
    jsonSelector.addEventListener('change', handleJsonChange);

    // Cleanup event listener on component unmount
    return () => {
      jsonSelector.removeEventListener('change', handleJsonChange);
    };
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Define a placeholder for the onMouseEnter event
  const handlePieEnter = () => {
    // Implement this if necessary for hover effects
  };

  return (
    <>
      {/* Render the chart */}
      <PieChart width={800} height={400} onMouseEnter={handlePieEnter}>
        <Pie
          data={filteredData.length ? filteredData : data} // Use filteredData if available
          cx={120}
          cy={200}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="lstf_range"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Pie
          data={filteredData.length ? filteredData : data} // Use filteredData if available
          cx={100}
          cy={100}
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="lstf_freq"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </>
  );
}

export function ChartC() {
  const [data, setData] = useState([]); // Data from tile_summaries.csv
  const [filteredData, setFilteredData] = useState([]);
  const [minMax, setMinMax] = useState({ min: 50, max: 120 });
  const [selectedTile, setSelectedTile] = useState(null); // To store tileId
  const [jsonFile, setJsonFile] = useState(null); // To store selected JSON file

  // Load CSV on component mount
  useEffect(() => {
    loadCSV('../data/tile_summaries.csv', (parsedData) => {
      setData(parsedData);
      if (selectedTile) {
        const filtered = parsedData.filter(item => item.tile === selectedTile);
        setFilteredData(filtered);

        // Get min and max values for the "mean_lstf" column
        const { min, max } = getMinMax(filtered, 'ndvi_freq');
        setMinMax({ min, max });
      }
    });
  }, [selectedTile]);

  // Event listener for the JSON selector
  useEffect(() => {
    const jsonSelector = document.getElementById('json-selector');
    const handleJsonChange = (event) => {
      const selectedFile = event.target.value;
      setJsonFile(selectedFile); // Set the selected JSON file

      // Extract the tileId from the filename (assuming format like "year_tileId.json")
      const split_yearTile = selectedFile.split('_');
      const tileId = split_yearTile[1].replace('.json', ''); // Extract tileId from filename

      // Update selectedTile to filter the CSV
      setSelectedTile(tileId);
    };

    // Add event listener
    jsonSelector.addEventListener('change', handleJsonChange);

    // Cleanup event listener on component unmount
    return () => {
      jsonSelector.removeEventListener('change', handleJsonChange);
    };
  }, []);

  return (
    <>
      {/* Render the chart */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ndvi_range" />
          <YAxis
            domain={[minMax.min, minMax.max]} // Use min and max for scaling
          />
          <Tooltip />
          <Bar dataKey="ndvi_freq" fill="#33cc66" activeBar={<Rectangle fill="white" stroke="8884d8" />} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}