import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChartA, ChartB, ChartC } from './App'; // Import components

/*const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
root.render(<App />);*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Create React roots for each div
const chartARoot = ReactDOM.createRoot(document.getElementById('chartA'));
const chartBRoot = ReactDOM.createRoot(document.getElementById('chartB'));
const chartCRoot = ReactDOM.createRoot(document.getElementById('chartC'));
const leftTopRoot = ReactDOM.createRoot(document.getElementById('deck-container-lstf'));
const leftBottomRoot = ReactDOM.createRoot(document.getElementById('deck-container-ndvi'));

// Render components to their respective divs
chartARoot.render(<ChartA />);
chartBRoot.render(<ChartB />);
chartCRoot.render(<ChartC />);
leftTopRoot.render(<div></div>); // Replace with actual component if needed
leftBottomRoot.render(<div></div>);