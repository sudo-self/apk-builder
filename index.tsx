import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Polyfill process for browser environments to prevent crashes when accessing process.env
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { 
    env: {
      NEXT_PUBLIC_GITHUB_TOKEN: "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"
    } 
  };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);