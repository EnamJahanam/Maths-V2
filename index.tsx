/**
 * @fileoverview This is the entry point of the React application.
 * It uses the React 18 createRoot API to render the main App component
 * into the 'root' div in the index.html file.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Find the root DOM element where the React app will be mounted.
const rootElement = document.getElementById('root');
if (!rootElement) {
  // If the root element is not found, throw an error to halt execution,
  // as the application cannot be rendered.
  throw new Error("Could not find root element to mount to");
}

// Create a new root renderer for the application.
const root = ReactDOM.createRoot(rootElement);

// Render the main App component within React's StrictMode.
// StrictMode helps identify potential problems in an application by activating
// additional checks and warnings for its descendants.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);