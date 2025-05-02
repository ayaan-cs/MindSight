import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './MindSight.css';

const MindSight = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('realtime');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [brainData, setBrainData] = useState([]);
    const [insights, setInsights] = useState([]);
    const [selectedPattern, setSelectedPattern] = useState(null);
    const [isSimulating, setIsSimulating] = useState(false);

    // Sample brain wave patterns
    const samplePatterns = [
        { id: 1, name: 'Alpha Waves', description: 'Relaxed, calm mental state', color: '#4CAF50' },
        { id: 2, name: 'Beta Waves', description: 'Alert, actively thinking', color: '#2196F3' },
        { id: 3, name: 'Theta Waves', description: 'Deep meditation, sleep', color: '#9C27B0' },
        { id: 4, name: 'Delta Waves', description: 'Deep sleep, regeneration', color: '#F44336' },
        { id: 5, name: 'Gamma Waves', description: 'High cognitive processing', color: '#FF9800' }
    ];

    // Generate synthetic brain wave data for demo purposes
    useEffect(() => {
        generateSyntheticData();
    }, []);

    const generateSyntheticData = () => {
        const newData = [];
        for (let i = 0; i < 100; i++) {
            const timePoint = {
                time: i,
                alpha: Math.sin(i * 0.1) * 10 + 20 + Math.random() * 5,
                beta: Math.sin(i * 0.05 + 1) * 15 + 30 + Math.random() * 7,
                theta: Math.sin(i * 0.07 + 2) * 8 + 15 + Math.random() * 4,
                delta: Math.sin(i * 0.03 + 3) * 12 + 25 + Math.random() * 6,
                gamma: Math.sin(i * 0.15 + 4) * 5 + 10 + Math.random() * 3
            };
            newData.push(timePoint);
        }
        setBrainData(newData);
    };

    // Simulate real-time data updates
    useEffect(() => {
        let interval;

        if (isSimulating) {
            interval = setInterval(() => {
                setBrainData(prevData => {
                    const newData = [...prevData.slice(1)];
                    const lastTime = newData[newData.length - 1].time + 1;

                    newData.push({
                        time: lastTime,
                        alpha: Math.sin(lastTime * 0.1) * 10 + 20 + Math.random() * 5,
                        beta: Math.sin(lastTime * 0.05 + 1) * 15 + 30 + Math.random() * 7,
                        theta: Math.sin(lastTime * 0.07 + 2) * 8 + 15 + Math.random() * 4,
                        delta: Math.sin(lastTime * 0.03 + 3) * 12 + 25 + Math.random() * 6,
                        gamma: Math.sin(lastTime * 0.15 + 4) * 5 + 10 + Math.random() * 3
                    });

                    return newData;
                });
            }, 100);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isSimulating]);

    // Simulate analyzing brain data with DeepSeek-R1
    const analyzeData = () => {
        setIsAnalyzing(true);
        setIsLoading(true);

        // Simulate API call to Hugging Face with DeepSeek-R1 model
        setTimeout(() => {
            const sampleInsights = [
                {
                    pattern: 'Alpha-Beta Correlation',
                    significance: 'High alpha waves combined with moderate beta activity suggest a relaxed but alert mental state',
                    confidence: 87,
                    timeRanges: [{ start: 15, end: 35 }]
                },
                {
                    pattern: 'Theta Spike',
                    significance: 'Brief spike in theta waves may indicate momentary deep focus or creative insight',
                    confidence: 72,
                    timeRanges: [{ start: 42, end: 48 }]
                },
                {
                    pattern: 'Gamma Burst',
                    significance: 'Short gamma bursts correspond to complex information processing',
                    confidence: 91,
                    timeRanges: [{ start: 60, end: 75 }]
                }
            ];

            setInsights(sampleInsights);
            setIsLoading(false);
            setIsAnalyzing(false);
        }, 2000);
    };

    // Toggle simulation of live data
    const toggleSimulation = () => {
        setIsSimulating(!isSimulating);
    };

    return (
        <div className="mindsight">
            {/* Header */}
            <div className="mindsight-header">
                <div className="header-left">
                    <div className="icon-container">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="brain-icon">
                            <path d="M9.5 2a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5Z"></path>
                            <path d="M14.5 2a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5Z"></path>
                            <path d="M3 7v9a6 6 0 0 0 6 6h6a6 6 0 0 0 6-6V7"></path>
                            <path d="M5 7V6a2 2 0 0 1 2-2"></path>
                            <path d="M9 10v4"></path>
                            <path d="m9 14 3 3"></path>
                            <path d="M9 14h4"></path>
                            <path d="M19 7V6a2 2 0 0 0-2-2"></path>
                        </svg>
                    </div>
                    <div>
                        <h2>MindSight</h2>
                        <p>AI-Powered Brain Activity Visualization</p>
                    </div>
                </div>

                <div className="header-controls">
                    <button
                        onClick={toggleSimulation}
                        className={`control-button ${isSimulating ? 'active' : ''}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                            {isSimulating ? (
                                <> {/* Pause icon */}
                                    <rect x="6" y="4" width="4" height="16"></rect>
                                    <rect x="14" y="4" width="4" height="16"></rect>
                                </>
                            ) : (
                                <> {/* Play icon */}
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </>
                            )}
                        </svg>
                        {isSimulating ? 'Pause' : 'Simulate'}
                    </button>

                    <button
                        onClick={analyzeData}
                        disabled={isAnalyzing}
                        className={`control-button analyze-button ${isAnalyzing ? 'disabled' : ''}`}
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="spinner"></div>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                                </svg>
                                Analyze
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="mindsight-tabs">
                <div className="tab-list">
                    {[
                        { id: 'realtime', label: 'Real-Time Display' },
                        { id: 'insights', label: 'AI Insights' },
                        { id: 'patterns', label: 'Wave Patterns' },
                        { id: 'export', label: 'Export Data' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="mindsight-content">
                {/* Real-time Display Tab */}
                {activeTab === 'realtime' && (
                    <div className="tab-content">
                        <div className="section-header">
                            <h3>Brain Wave Activity</h3>
                            <p className="section-description">
                                Real-time visualization of brain electrical activity across different frequency bands.
                            </p>
                        </div>

                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={brainData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="time" stroke="#666" />
                                    <YAxis stroke="#666" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.375rem' }}
                                        labelStyle={{ color: '#e5e7eb' }}
                                        itemStyle={{ color: '#e5e7eb' }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="alpha" stroke="#4CAF50" dot={false} strokeWidth={2} name="Alpha" />
                                    <Line type="monotone" dataKey="beta" stroke="#2196F3" dot={false} strokeWidth={2} name="Beta" />
                                    <Line type="monotone" dataKey="theta" stroke="#9C27B0" dot={false} strokeWidth={2} name="Theta" />
                                    <Line type="monotone" dataKey="delta" stroke="#F44336" dot={false} strokeWidth={2} name="Delta" />
                                    <Line type="monotone" dataKey="gamma" stroke="#FF9800" dot={false} strokeWidth={2} name="Gamma" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="wave-legend">
                            {samplePatterns.map(pattern => (
                                <div key={pattern.id} className="wave-type">
                                    <div className="color-indicator" style={{ backgroundColor: pattern.color }}></div>
                                    <div className="wave-name">{pattern.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* AI Insights Tab */}
                {activeTab === 'insights' && (
                    <div className="tab-content">
                        <div className="section-header">
                            <h3>DeepSeek-R1 Analysis</h3>
                            <p className="section-description">
                                Patterns and insights detected by the DeepSeek-R1 model in your brain activity data.
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p>Processing with DeepSeek-R1...</p>
                            </div>
                        ) : insights.length > 0 ? (
                            <div className="insights-list">
                                {insights.map((insight, index) => (
                                    <div key={index} className="insight-card">
                                        <div className="insight-header">
                                            <h4>{insight.pattern}</h4>
                                            <div className="confidence-badge">
                                                {insight.confidence}% confidence
                                            </div>
                                        </div>
                                        <p className="insight-description">{insight.significance}</p>
                                        <div className="time-range">
                                            Time range: {insight.timeRanges.map(range => `${range.start}s-${range.end}s`).join(', ')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-data-container">
                                <div className="no-data-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    </svg>
                                </div>
                                <p className="no-data-message">No analysis results available</p>
                                <p className="no-data-hint">
                                    Click the "Analyze" button in the header to process the current brain wave data with DeepSeek-R1.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Wave Patterns Tab */}
                {activeTab === 'patterns' && (
                    <div className="tab-content">
                        <div className="section-header">
                            <h3>Brain Wave Patterns</h3>
                            <p className="section-description">
                                Reference information about different brain wave states and their significance.
                            </p>
                        </div>

                        <div className="patterns-grid">
                            {samplePatterns.map(pattern => (
                                <div
                                    key={pattern.id}
                                    className={`pattern-card ${selectedPattern === pattern.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedPattern(selectedPattern === pattern.id ? null : pattern.id)}
                                >
                                    <div className="pattern-header">
                                        <div className="pattern-color" style={{ backgroundColor: pattern.color }}></div>
                                        <h4>{pattern.name}</h4>
                                    </div>
                                    <p className="pattern-description">{pattern.description}</p>

                                    {selectedPattern === pattern.id && (
                                        <div className="pattern-details">
                                            <p>Frequency: {pattern.id === 1 ? '8-13 Hz' :
                                                pattern.id === 2 ? '13-30 Hz' :
                                                    pattern.id === 3 ? '4-8 Hz' :
                                                        pattern.id === 4 ? '0.5-4 Hz' :
                                                            '30-100 Hz'}
                                            </p>
                                            <p>
                                                {pattern.id === 1 ? 'Common during wakeful relaxation, especially with closed eyes. Associated with meditation and creative states.' :
                                                    pattern.id === 2 ? 'Dominant rhythm in normal, alert consciousness. Indicates active thinking, focus, and problem solving.' :
                                                        pattern.id === 3 ? 'Occurs during sleep, deep meditation, and creative states. Associated with memory consolidation and learning.' :
                                                            pattern.id === 4 ? 'Slowest brain waves, most common during deep, dreamless sleep. Essential for healing and regeneration.' :
                                                                'Fastest brain waves, associated with simultaneous processing of information from different brain areas.'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Export Data Tab */}
                {activeTab === 'export' && (
                    <div className="tab-content">
                        <div className="section-header">
                            <h3>Export Options</h3>
                            <p className="section-description">
                                Download your brain activity data and analysis results in various formats.
                            </p>
                        </div>

                        <div className="export-options">
                            <div className="export-card">
                                <div className="export-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                </div>
                                <div className="export-content">
                                    <h4>Raw Data</h4>
                                    <p>
                                        Export the raw brain wave measurements for further analysis in external tools.
                                    </p>
                                    <div className="export-buttons">
                                        <button className="export-button">CSV</button>
                                        <button className="export-button">JSON</button>
                                    </div>
                                </div>
                            </div>

                            <div className="export-card">
                                <div className="export-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                    </svg>
                                </div>
                                <div className="export-content">
                                    <h4>Analysis Report</h4>
                                    <p>
                                        Download a comprehensive report of the DeepSeek-R1 analysis results.
                                    </p>
                                    <div className="export-buttons">
                                        <button className={`export-button ${insights.length > 0 ? 'active' : 'disabled'}`} disabled={insights.length === 0}>
                                            PDF Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mindsight-footer">
                <div className="footer-info">
                    <p>Powered by DeepSeek-R1 on Hugging Face</p>
                    <p>Data refresh rate: 250 Hz</p>
                </div>
            </div>
        </div>
    );
};

export default MindSight;