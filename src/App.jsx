import React from 'react';
import './App.css';
import MindSight from './components/MindSight';

function App() {
    return (
        <div className="app-container">
            <header className="app-header">
                <div className="header-content">
                    <h1>MindSight</h1>
                    <p>Research-Grade EEG Analysis Platform</p>
                    <p className="subtitle">Authentic medical data meets advanced AI for neuroscience education and research</p>
                </div>
            </header>

            <main className="app-content">
                <MindSight />

                <section className="about-section">
                    <h2>About This Project</h2>
                    <p>
                        <strong>MindSight</strong> is a neuroscience platform that combines authentic research-grade EEG data
                        with advanced AI analysis to provide medical-quality insights for education and research.
                    </p>

                    <div className="research-highlight">
                        <h3>🔬 Research-Grade Platform</h3>
                        <p>
                            Process authentic EEG datasets from PhysioNet, OpenNeuro, and Kaggle research databases
                            with medical AI intelligence for real neuroscience applications.
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-item">
                            <h4>🧠 Authentic Medical Data Integration</h4>
                            <ul>
                                <li>PhysioNet Medical Database</li>
                                <li>OpenNeuro Research Archive</li>
                                <li>Kaggle Scientific Datasets</li>
                            </ul>
                            <p>Real EEG datasets from motor imagery, sleep studies, mental state classification, and emotion recognition research.</p>
                        </div>

                        <div className="feature-item">
                            <h4>🤖 Advanced AI Medical Intelligence</h4>
                            <ul>
                                <li>Enhanced DeepSeek-R1 with specialized neuroscience knowledge</li>
                                <li>Scenario-specific analysis with medical terminology</li>
                                <li>Clinical significance assessment with therapeutic context</li>
                                <li>Pattern detection for ERD, sleep stages, ADHD markers</li>
                            </ul>
                        </div>

                        <div className="feature-item">
                            <h4>📊 Professional Research Features</h4>
                            <ul>
                                <li>Medical-grade confidence scoring and normal range comparisons</li>
                                <li>Comprehensive clinical reports with research context</li>
                                <li>Data export capabilities for external analysis tools</li>
                                <li>Educational content for medical students and professionals</li>
                            </ul>
                        </div>
                    </div>

                    <div className="applications-section">
                        <h3>🎓 Applications & Use Cases</h3>
                        <div className="applications-grid">
                            <div className="app-item">
                                <strong>🏥 Medical Education</strong>
                                <p>Neuroscience course integration with authentic research data and medical student training with real clinical patterns.</p>
                            </div>
                            <div className="app-item">
                                <strong>🔬 Research & Development</strong>
                                <p>EEG analysis method validation, brain-computer interface development, and neurofeedback therapy research.</p>
                            </div>
                            <div className="app-item">
                                <strong>👨‍⚕️ Clinical Training</strong>
                                <p>Sleep disorder diagnosis, motor rehabilitation assessment, and attention deficit evaluation.</p>
                            </div>
                            <div className="app-item">
                                <strong>🧪 Algorithm Testing</strong>
                                <p>Synthetic data provides foundation for hardware integration and method validation before live EEG implementation.</p>
                            </div>
                        </div>
                    </div>

                    <div className="data-sources-section">
                        <h3>🔮 Data Sources & Future Integration</h3>

                        <div className="data-highlight">
                            <h4>📊 Current: Research Data Platform</h4>
                            <p>
                                <strong>Authentic Medical Data:</strong> MindSight processes real EEG recordings from major medical institutions,
                                university research labs, and peer-reviewed scientific studies.
                            </p>
                        </div>

                        <div className="synthetic-explanation">
                            <h4>🎓 Educational Foundation</h4>
                            <p>
                                <strong>Synthetic Educational Data:</strong> For demonstration and learning purposes, MindSight generates
                                realistic brain wave patterns based on established medical literature. This synthetic data serves as the foundation for:
                            </p>
                            <ul>
                                <li>🎓 Educational demonstrations before implementing real hardware</li>
                                <li>🧪 Algorithm testing and validation</li>
                                <li>🎨 User interface development and training</li>
                                <li>🔌 Future integration with live EEG acquisition systems</li>
                            </ul>
                        </div>

                        <div className="roadmap">
                            <h4>🚀 Development Roadmap</h4>
                            <div className="roadmap-grid">
                                <div className="phase">
                                    <strong>Phase 1: Current ✅</strong>
                                    <p>Research data platform with authentic medical database integration and advanced AI analysis</p>
                                </div>
                                <div className="phase">
                                    <strong>Phase 2: Hardware 🔄</strong>
                                    <p>Real-time EEG connectivity (OpenBCI, Muse, NeuroSky) with direct brain signal acquisition</p>
                                </div>
                                <div className="phase">
                                    <strong>Phase 3: Clinical 🔮</strong>
                                    <p>Medical device integration, therapeutic neurofeedback, and professional diagnostic support</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tech-stack">
                        <h3>🛠️ Enhanced Technology Stack</h3>
                        <div className="tech-grid">
                            <div className="tech-category">
                                <h4>🎨 Frontend Framework</h4>
                                <ul>
                                    <li><span className="tech-label">React 18:</span> Modern component-based architecture</li>
                                    <li><span className="tech-label">Recharts:</span> Professional data visualization library</li>
                                    <li><span className="tech-label">CSS3:</span> Medical-grade user interface design</li>
                                </ul>
                            </div>

                            <div className="tech-category">
                                <h4>🤖 AI & Machine Learning</h4>
                                <ul>
                                    <li><span className="tech-label">DeepSeek-R1:</span> Enhanced with medical intelligence via Hugging Face</li>
                                    <li><span className="tech-label">Pattern Recognition:</span> Advanced statistical analysis for EEG patterns</li>
                                    <li><span className="tech-label">Medical Knowledge:</span> Specialized neuroscience prompt engineering</li>
                                </ul>
                            </div>

                            <div className="tech-category">
                                <h4>📊 Data Processing & Integration</h4>
                                <ul>
                                    <li><span className="tech-label">Multi-format Parser:</span> PhysioNet EDF, CSV, research formats</li>
                                    <li><span className="tech-label">Real-time Processing:</span> Advanced statistics and frequency analysis</li>
                                    <li><span className="tech-label">Data Validation:</span> Research-grade quality assessment</li>
                                </ul>
                            </div>

                            <div className="tech-category">
                                <h4>🗃️ Research Database Integration</h4>
                                <ul>
                                    <li><span className="tech-label">PhysioNet API:</span> Direct medical research database access</li>
                                    <li><span className="tech-label">OpenNeuro:</span> Neuroscience research data compatibility</li>
                                    <li><span className="tech-label">Kaggle Datasets:</span> Scientific EEG study data processing</li>
                                </ul>
                            </div>

                            <div className="tech-category">
                                <h4>📄 Export & Analysis Tools</h4>
                                <ul>
                                    <li><span className="tech-label">PDF Reports:</span> Clinical-grade analysis documentation</li>
                                    <li><span className="tech-label">Data Export:</span> CSV/JSON formats for external tools</li>
                                    <li><span className="tech-label">Citations:</span> Proper research attribution and references</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="app-footer">
                <div className="footer-content">
                    <div className="footer-main">
                        <p><strong>MindSight - Advanced Neuroscience Platform</strong></p>
                        <p><em>Powered by Enhanced DeepSeek-R1 AI with Medical Intelligence</em></p>
                    </div>
                    <div className="footer-details">
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
        </div>
    );
}

export default App;