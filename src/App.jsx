import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import MindSight from './components/MindSight';
import ResearchPlatform from './components/ResearchPlatform';
import About from './components/About';

function AppContent() {
    const [platformMode, setPlatformMode] = useState('original');
    const location = useLocation();

    const handleModeSwitch = (mode) => {
        setPlatformMode(mode);
    };

    const isAboutPage = location.pathname === '/about';

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="header-content">
                    <div className="header-main">
                        <h1>MindSight</h1>
                        <p>Research-Grade EEG Analysis Platform</p>
                        <p className="subtitle">Authentic medical data meets advanced AI for neuroscience education and research</p>
                    </div>

                    {/* Navigation */}
                    <nav className="app-navigation">
                        <Link
                            to="/"
                            className={`nav-link ${!isAboutPage ? 'active' : ''}`}
                        >
                            🧠 Platform
                        </Link>
                        <Link
                            to="/about"
                            className={`nav-link ${isAboutPage ? 'active' : ''}`}
                        >
                            📚 About
                        </Link>
                    </nav>

                    {/* Platform Mode Selector - Only show on main platform page */}
                    {!isAboutPage && (
                        <div className="platform-selector">
                            <div className="mode-tabs">
                                <button
                                    className={`mode-tab ${platformMode === 'original' ? 'active' : ''}`}
                                    onClick={() => handleModeSwitch('original')}
                                >
                                    <div className="mode-icon">🎓</div>
                                    <div className="mode-info">
                                        <h3>Original Platform</h3>
                                        <p>Educational EEG visualization</p>
                                    </div>
                                </button>

                                <button
                                    className={`mode-tab ${platformMode === 'research' ? 'active' : ''}`}
                                    onClick={() => handleModeSwitch('research')}
                                >
                                    <div className="mode-icon">🔬</div>
                                    <div className="mode-info">
                                        <h3>Research Platform</h3>
                                        <p>PhysioNet data & advanced analysis</p>
                                    </div>
                                </button>
                            </div>

                            <div className="mode-description">
                                {platformMode === 'original' ? (
                                    <div className="mode-desc">
                                        <h4>✨ Original MindSight Experience</h4>
                                        <p>Your complete original platform with synthetic data generation, real-time visualization, and DeepSeek-R1 AI analysis.</p>
                                        <ul>
                                            <li>🧠 Synthetic brain wave generation</li>
                                            <li>📊 Real-time EEG visualization</li>
                                            <li>🤖 DeepSeek-R1 AI insights</li>
                                            <li>📈 Educational demonstrations</li>
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="mode-desc">
                                        <h4>🔬 Advanced Research Platform</h4>
                                        <p>Research-grade analysis with authentic PhysioNet datasets, advanced signal processing, and clinical reporting.</p>
                                        <ul>
                                            <li>🏥 PhysioNet medical database integration</li>
                                            <li>📊 FFT spectral analysis & band powers</li>
                                            <li>🤖 Medical-grade AI assessment</li>
                                            <li>📄 Professional PDF reports</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <main className="app-content">
                <Routes>
                    <Route path="/" element={
                        <>
                            {/* Render the appropriate platform based on mode */}
                            {platformMode === 'original' ? (
                                <MindSight />
                            ) : (
                                <ResearchPlatform />
                            )}
                        </>
                    } />
                    <Route path="/about" element={<About />} />
                </Routes>
            </main>

            <footer className="app-footer">
                <div className="footer-content">
                    <div className="footer-main">
                        <p><strong>MindSight - Advanced Neuroscience Platform</strong></p>
                        <p><em>Powered by Enhanced DeepSeek-R1 AI with Medical Intelligence</em></p>
                    </div>
                    <div className="footer-details">
                        {!isAboutPage && (
                            <p><strong>Current Mode:</strong> {platformMode === 'original' ? 'Original Educational Platform' : 'Research-Grade Analysis Platform'}</p>
                        )}
                        <p><strong>Data Sources:</strong> PhysioNet Medical Database • OpenNeuro Research Archive • Kaggle Scientific Datasets</p>
                        <p><strong>Technology:</strong> React • EEG Processing • DeepSeek-R1 AI Analysis • Research-Grade Visualization</p>
                        <p><strong>Built for:</strong> Medical Education • Neuroscience Research • Clinical Training • BCI Development</p>
                    </div>
                    <div className="footer-attribution">
                        <p>Created by Ayaan A. Syed | <a href="https://github.com/ayaan-cis" target="_blank" rel="noopener noreferrer">GitHub</a> | <a href="http://www.linkedin.com/in/ayaan-syed" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
                        <p><em>Developed with authentic research data and medical-grade AI analysis for educational and research purposes.</em></p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                .header-main {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .app-navigation {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .nav-link {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    padding: 0.75rem 1.5rem;
                    color: #e0e7ff;
                    text-decoration: none;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .nav-link:hover {
                    background: rgba(255, 255, 255, 0.15);
                    border-color: rgba(99, 102, 241, 0.5);
                    transform: translateY(-2px);
                    color: #f8fafc;
                }

                .nav-link.active {
                    background: rgba(99, 102, 241, 0.3);
                    border-color: #6366f1;
                    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
                    color: #f8fafc;
                }

                .platform-selector {
                    margin-top: 2rem;
                    max-width: 800px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .mode-tabs {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .mode-tab {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    text-align: left;
                    color: #e0e7ff;
                }

                .mode-tab:hover {
                    background: rgba(255, 255, 255, 0.15);
                    border-color: rgba(99, 102, 241, 0.5);
                    transform: translateY(-2px);
                }

                .mode-tab.active {
                    background: rgba(99, 102, 241, 0.3);
                    border-color: #6366f1;
                    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
                }

                .mode-icon {
                    font-size: 2rem;
                    min-width: 3rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .mode-info h3 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.2rem;
                    color: #f8fafc;
                }

                .mode-info p {
                    margin: 0;
                    font-size: 0.9rem;
                    opacity: 0.8;
                }

                .mode-description {
                    background: rgba(15, 23, 42, 0.8);
                    border: 1px solid rgba(99, 102, 241, 0.3);
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                }

                .mode-desc h4 {
                    color: #6366f1;
                    margin: 0 0 1rem 0;
                    font-size: 1.2rem;
                }

                .mode-desc p {
                    color: #c4b5fd;
                    margin: 0 0 1rem 0;
                    line-height: 1.6;
                }

                .mode-desc ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 0.5rem;
                }

                .mode-desc li {
                    color: #a5b4fc;
                    font-size: 0.9rem;
                    padding: 0.25rem 0;
                }

                @media (max-width: 768px) {
                    .app-navigation {
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .mode-tabs {
                        grid-template-columns: 1fr;
                    }
                    
                    .mode-tab {
                        flex-direction: column;
                        text-align: center;
                    }
                    
                    .mode-desc ul {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;