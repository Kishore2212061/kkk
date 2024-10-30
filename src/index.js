import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import App from './App'; // Import your main App component

// Get the root element from the HTML where the React app should mount
const container = document.getElementById('root');

// Create the root using createRoot instead of ReactDOM.render
const root = createRoot(container);

// Render the App component to the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
