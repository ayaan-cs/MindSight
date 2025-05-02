import React, { useState } from 'react';
import './App.css';
import MindSight from './components/MindSight';

function App() {
  return (
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <h1>MindSight</h1>
            <p>AI-Powered Brain Activity Visualization and Analysis</p>
          </div>
        </header>

        <main className="app-content">
          <MindSight />

          <section className="about-section">
            <h2>About This Project</h2>
            <p>
              MindSight is an AI-powered tool for visualizing and analyzing brain wave activity
              using advanced machine learning. Built with React and integrating with Hugging Face's
              DeepSeek-R1 model, it demonstrates the potential of AI in neuroscience applications.
            </p>
            <p>
              This demo uses synthetic data to showcase the visualization and analysis capabilities.
              In a real implementation, it could process EEG data from brain-computer interfaces or
              medical devices.
            </p>

            <div className="tech-stack">
              <h3>Technology Stack</h3>
              <ul>
                <li><span className="tech-label">Frontend:</span> React, Recharts</li>
                <li><span className="tech-label">AI Model:</span> DeepSeek-R1 on Hugging Face</li>
                <li><span className="tech-label">Data Processing:</span> JavaScript with synthetic generation</li>
              </ul>
            </div>
          </section>
        </main>

        <footer className="app-footer">
          <p>Created by Ayaan A. Syed | <a href="https://github.com/ayaan-cis" target="_blank" rel="noopener noreferrer">GitHub</a> | <a href="http://www.linkedin.com/in/ayaan-syed" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
        </footer>
      </div>
  );
}

export default App;