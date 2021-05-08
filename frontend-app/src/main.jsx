import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const jobId = new URLSearchParams(window.location.search).get('job_id');
const isSender = !jobId;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
