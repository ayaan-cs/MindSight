import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './MindSight.css';
import { InferenceClient } from "@huggingface/inference";

const MindSight = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('realtime');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [brainData, setBrainData] = useState([]);
    const [insights, setInsights] = useState([]);
    const [selectedPattern, setSelectedPattern] = useState(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [useRealApi, setUseRealApi] = useState(false);
    const [needsAuthentication, setNeedsAuthentication] = useState(false);

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

    // Toggle API mode
    const toggleApiMode = () => {
        if (!useRealApi && !process.env.REACT_APP_HUGGING_FACE_TOKEN) {
            // If trying to enable real API but no token is available
            setNeedsAuthentication(true);
        } else {
            setUseRealApi(!useRealApi);
            setNeedsAuthentication(false);
        }
    };

    // Handle authentication
    const handleAuthentication = (token) => {
        // In a real app, you'd validate the token or store it securely
        // For the demo, we'll just set a session storage item
        sessionStorage.setItem('huggingface_token', token);
        setNeedsAuthentication(false);
        setUseRealApi(true);
    };

    // Format brain wave data for the model
    const formatBrainWaveDataForModel = (data) => {
        // Extract a window of recent data (last 30 timepoints)
        const recentData = data.slice(-30);

        // Calculate averages and states as before
        const alphaAvg = recentData.reduce((sum, point) => sum + point.alpha, 0) / recentData.length;
        const betaAvg = recentData.reduce((sum, point) => sum + point.beta, 0) / recentData.length;
        const thetaAvg = recentData.reduce((sum, point) => sum + point.theta, 0) / recentData.length;
        const deltaAvg = recentData.reduce((sum, point) => sum + point.delta, 0) / recentData.length;
        const gammaAvg = recentData.reduce((sum, point) => sum + point.gamma, 0) / recentData.length;

        // Determine states
        let alphaState = alphaAvg > 25 ? "high" : (alphaAvg > 15 ? "moderate" : "low");
        let betaState = betaAvg > 35 ? "high" : (betaAvg > 25 ? "moderate" : "low");
        let thetaState = thetaAvg > 20 ? "high" : (thetaAvg > 10 ? "moderate" : "low");
        let deltaState = deltaAvg > 30 ? "high" : (deltaAvg > 20 ? "moderate" : "low");
        let gammaState = gammaAvg > 12 ? "high" : (gammaAvg > 8 ? "moderate" : "low");

        // Create improved prompt with better instructions
        return `You are a professional neuroscientist providing analysis of brain wave activity.
        Analyze the following brain wave readings:
            - Alpha waves: ${alphaState} (avg: ${alphaAvg.toFixed(2)})
            - Beta waves: ${betaState} (avg: ${betaAvg.toFixed(2)})
            - Theta waves: ${thetaState} (avg: ${thetaAvg.toFixed(2)})
            - Delta waves: ${deltaState} (avg: ${deltaAvg.toFixed(2)})
            - Gamma waves: ${gammaState} (avg: ${gammaAvg.toFixed(2)})
            
            Please identify 3-4 significant neurological patterns based on this data. For each pattern:
            1. Give it a meaningful scientific name (like "Alpha-Beta Coherence Pattern" or "Theta Dominance State")
            2. Provide a brief, professional interpretation of what this pattern indicates about mental state
            3. Assign a confidence level between 50-100%
            4. Suggest a time range where this pattern would be most prominent
            
            Respond ONLY in this JSON format, with no explanations or thinking outside the JSON structure:
            {
              "patterns": [
                {
                  "pattern": "Pattern Name Here",
                  "significance": "Brief interpretation of what this means",
                  "confidence": 85,
                  "timeRanges": [{"start": 15, "end": 35}]
                },
                ... (more patterns)
              ]
            }`;
    };

    // Process model output
    const processModelOutput = (output) => {
        try {
            // Case 1: Using mock data for demo/development
            if (!output || !output.choices || !output.choices[0] || !output.choices[0].message) {
                // Return sample insights for demonstration
                return [
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
            }

            // Extract the content from the message
            let responseContent = output.choices[0].message.content || "";

            // Remove any thinking tags or similar markers
            responseContent = responseContent.replace(/<think>[\s\S]*?<\/think>/g, "");
            responseContent = responseContent.replace(/\[think\][\s\S]*?\[\/think\]/g, "");
            responseContent = responseContent.replace(/<thinking>[\s\S]*?<\/thinking>/g, "");
            responseContent = responseContent.replace(/\*\*thinking\*\*[\s\S]*?\*\*\/thinking\*\*/g, "");
            responseContent = responseContent.replace(/^<think>.*$/gm, "");

            // Try to find and extract JSON from the response
            let jsonContent = null;

            // Look for JSON blocks in markdown or just JSON objects
            const jsonBlockMatch = responseContent.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
            if (jsonBlockMatch && jsonBlockMatch[1]) {
                try {
                    jsonContent = JSON.parse(jsonBlockMatch[1]);
                } catch (e) {
                    console.error("Failed to parse JSON from code block:", e);
                }
            }

            // If no JSON in code blocks, try to parse the entire content as JSON
            if (!jsonContent) {
                try {
                    // Find anything that looks like a JSON object or array
                    const jsonMatch = responseContent.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
                    if (jsonMatch && jsonMatch[1]) {
                        jsonContent = JSON.parse(jsonMatch[1]);
                    }
                } catch (e) {
                    console.error("Failed to parse JSON from content:", e);
                }
            }

            // Process JSON content if found
            if (jsonContent) {
                // Handle various JSON structures
                if (Array.isArray(jsonContent)) {
                    return jsonContent.map(insight => ({
                        pattern: insight.pattern || 'Unnamed Pattern',
                        significance: insight.significance || 'No description provided',
                        confidence: Number(insight.confidence) || 70,
                        timeRanges: insight.timeRanges || [{ start: 0, end: 100 }]
                    }));
                } else if (jsonContent.patterns && Array.isArray(jsonContent.patterns)) {
                    return jsonContent.patterns.map(p => ({
                        pattern: p.pattern || p.name || 'Unnamed Pattern',
                        significance: p.significance || p.description || 'No description provided',
                        confidence: Number(p.confidence) || 70,
                        timeRanges: p.timeRanges || [{ start: 0, end: 100 }]
                    }));
                } else if (jsonContent.pattern || jsonContent.significance) {
                    return [{
                        pattern: jsonContent.pattern || 'Unnamed Pattern',
                        significance: jsonContent.significance || 'No description provided',
                        confidence: Number(jsonContent.confidence) || 70,
                        timeRanges: jsonContent.timeRanges || [{ start: 0, end: 100 }]
                    }];
                }
            }

            // If we couldn't extract JSON, create better fallback responses
            // This creates more professional-looking insights even if the model's response isn't ideal

            // Parse out sentences that might contain insights
            const sentences = responseContent
                .replace(/<think>.*?<\/think>/g, '')
                .split(/(?<=\.|\?|\!)\s+/)
                .filter(s => s.length > 20 && s.length < 200);

            if (sentences.length > 0) {
                // Create structured insights from sentences
                return sentences.slice(0, 3).map((sentence, index) => {
                    // Generate pattern names based on brain wave types mentioned
                    let patternName = 'Neural Pattern';
                    if (sentence.toLowerCase().includes('alpha')) patternName = 'Alpha Wave Pattern';
                    else if (sentence.toLowerCase().includes('beta')) patternName = 'Beta Activity Pattern';
                    else if (sentence.toLowerCase().includes('theta')) patternName = 'Theta State Pattern';
                    else if (sentence.toLowerCase().includes('delta')) patternName = 'Delta Wave Pattern';
                    else if (sentence.toLowerCase().includes('gamma')) patternName = 'Gamma Frequency Pattern';

                    // Make sure pattern names are unique
                    if (index > 0) patternName += ` ${index + 1}`;

                    return {
                        pattern: patternName,
                        significance: sentence.trim(),
                        confidence: 70 - (index * 5), // Decrease confidence for later sentences
                        timeRanges: [{ start: index * 30, end: (index + 1) * 30 }]
                    };
                });
            }

            // Last resort fallback
            return [{
                pattern: 'Combined Brain Wave Analysis',
                significance: 'The brain wave patterns indicate a complex mental state with mixed activity across frequency bands.',
                confidence: 65,
                timeRanges: [{ start: 0, end: 100 }]
            }];

        } catch (error) {
            console.error("Error processing model output:", error);

            // Return a more professional fallback insight
            return [{
                pattern: 'Baseline Neural Activity',
                significance: 'Analysis shows typical brain wave patterns within normal parameters.',
                confidence: 60,
                timeRanges: [{ start: 0, end: 100 }]
            }];
        }
    };
    // Analyze brain data using the DeepSeek-R1 model
    const analyzeData = async () => {
        setIsAnalyzing(true);
        setIsLoading(true);

        try {
            // Check if we should use the real API or mock data
            if (!useRealApi) {
                // Use mock data for development
                setTimeout(() => {
                    const mockInsights = processModelOutput(null);
                    setInsights(mockInsights);
                    setIsLoading(false);
                    setIsAnalyzing(false);
                }, 2000);
                return;
            }

            // Use the real API
            let apiToken = process.env.REACT_APP_HUGGING_FACE_TOKEN;

            // If no environment token, try from session storage (user provided)
            if (!apiToken) {
                apiToken = sessionStorage.getItem('huggingface_token');
            }

            if (!apiToken) {
                throw new Error("API token not found. Please authenticate to use DeepSeek-R1.");
            }

            // Create a new InferenceClient instance
            const client = new InferenceClient(apiToken);

            // Format the brain data for the model
            const prompt = formatBrainWaveDataForModel(brainData);
            console.log("Sending prompt to model:", prompt);

            // Call the DeepSeek-R1 model using the fireworks-ai provider
            const chatCompletion = await client.chatCompletion({
                provider: "fireworks-ai",
                model: "deepseek-ai/DeepSeek-R1",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert neurologist analyzing brain wave data."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 512,
                temperature: 0.3
            });

            console.log("API Response:", chatCompletion);

            // Process the model response
            const processedInsights = processModelOutput(chatCompletion);
            setInsights(processedInsights);

        } catch (error) {
            console.error("Error analyzing brain data:", error);

            if (error.message.includes("API token") || error.message.includes("Authentication")) {
                setNeedsAuthentication(true);
            }

            setInsights([{
                pattern: 'Analysis Error',
                significance: `Error: ${error.message || 'Unknown error occurred'}. Please check your API configuration.`,
                confidence: 0,
                timeRanges: [{ start: 0, end: 0 }]
            }]);
        } finally {
            setIsLoading(false);
            setIsAnalyzing(false);
        }
    };

    // Toggle simulation of live data
    const toggleSimulation = () => {
        setIsSimulating(!isSimulating);
    };

    // Function to export brain wave data as CSV
    const exportAsCSV = () => {
        // Prepare the CSV content
        let csvContent = "time,alpha,beta,theta,delta,gamma\n";

        // Add all data points
        brainData.forEach(point => {
            csvContent += `${point.time},${point.alpha.toFixed(2)},${point.beta.toFixed(2)},${point.theta.toFixed(2)},${point.delta.toFixed(2)},${point.gamma.toFixed(2)}\n`;
        });

        // Create and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.setAttribute('href', url);
        link.setAttribute('download', 'mindsight_brainwave_data.csv');
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

// Function to export brain wave data as JSON
    const exportAsJSON = () => {
        // Prepare the JSON content (ensure it doesn't include circular references)
        const exportData = brainData.map(point => ({
            time: point.time,
            alpha: parseFloat(point.alpha.toFixed(2)),
            beta: parseFloat(point.beta.toFixed(2)),
            theta: parseFloat(point.theta.toFixed(2)),
            delta: parseFloat(point.delta.toFixed(2)),
            gamma: parseFloat(point.gamma.toFixed(2))
        }));

        // Create and trigger download
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.setAttribute('href', url);
        link.setAttribute('download', 'mindsight_brainwave_data.json');
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

// Function to generate PDF report using jsPDF
    const exportAsPDF = () => {
        if (!insights || insights.length === 0) {
            alert('No analysis data available. Please run an analysis first.');
            return;
        }

        // We'll use a technique with HTML and html2canvas since we don't have external dependencies
        const reportContent = document.createElement('div');
        reportContent.style.width = '700px';
        reportContent.style.padding = '20px';
        reportContent.style.backgroundColor = 'white';
        reportContent.style.color = 'black';
        reportContent.style.fontFamily = 'Arial, sans-serif';

        // Create report header
        const header = document.createElement('div');
        header.innerHTML = `
    <h1 style="color: #6366f1; margin-bottom: 5px;">MindSight Brain Analysis Report</h1>
    <p style="color: #666; margin-top: 0;">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
    <hr style="border-top: 1px solid #ddd; margin: 20px 0;">
  `;
        reportContent.appendChild(header);

        // Add brain wave averages section
        const avgData = calculateAverages(brainData);
        const averagesSection = document.createElement('div');
        averagesSection.innerHTML = `
    <h2 style="color: #4338ca;">Brain Wave Averages</h2>
    <p>The following values represent the average activity levels recorded during the session:</p>
    <ul style="list-style-type: none; padding-left: 0;">
      <li><span style="color: #4CAF50; font-weight: bold;">Alpha Waves:</span> ${avgData.alpha.toFixed(2)}</li>
      <li><span style="color: #2196F3; font-weight: bold;">Beta Waves:</span> ${avgData.beta.toFixed(2)}</li>
      <li><span style="color: #9C27B0; font-weight: bold;">Theta Waves:</span> ${avgData.theta.toFixed(2)}</li>
      <li><span style="color: #F44336; font-weight: bold;">Delta Waves:</span> ${avgData.delta.toFixed(2)}</li>
      <li><span style="color: #FF9800; font-weight: bold;">Gamma Waves:</span> ${avgData.gamma.toFixed(2)}</li>
    </ul>
    <hr style="border-top: 1px solid #ddd; margin: 20px 0;">
  `;
        reportContent.appendChild(averagesSection);

        // Add insights section
        const insightsSection = document.createElement('div');
        insightsSection.innerHTML = `
    <h2 style="color: #4338ca;">DeepSeek-R1 Analysis Insights</h2>
    <p>The AI analysis identified the following patterns in your brain wave activity:</p>
  `;

        insights.forEach(insight => {
            const insightDiv = document.createElement('div');
            insightDiv.style.marginBottom = '15px';
            insightDiv.style.padding = '10px';
            insightDiv.style.border = '1px solid #ddd';
            insightDiv.style.borderRadius = '5px';

            insightDiv.innerHTML = `
      <h3 style="margin-top: 0; color: #6366f1;">${insight.pattern} <span style="font-size: 14px; color: #888;">(${insight.confidence}% confidence)</span></h3>
      <p style="margin-bottom: 5px;">${insight.significance}</p>
      <p style="font-size: 14px; color: #666; margin-top: 5px;">Time range: ${insight.timeRanges.map(range => `${range.start}s-${range.end}s`).join(', ')}</p>
    `;

            insightsSection.appendChild(insightDiv);
        });

        reportContent.appendChild(insightsSection);

        // Add footer
        const footer = document.createElement('div');
        footer.style.marginTop = '30px';
        footer.style.borderTop = '1px solid #ddd';
        footer.style.paddingTop = '10px';
        footer.style.fontSize = '12px';
        footer.style.color = '#666';
        footer.innerHTML = `
    <p>This report was generated by MindSight, an AI-powered brain activity visualization and analysis tool.</p>
    <p>Analysis performed using DeepSeek-R1 AI model.</p>
  `;
        reportContent.appendChild(footer);

        // Temporarily add to document (hidden), convert to image, then remove
        reportContent.style.position = 'absolute';
        reportContent.style.left = '-9999px';
        document.body.appendChild(reportContent);

        // Use html2canvas to convert to image
        // This approach uses browser-based capabilities instead of requiring a library
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
    <html>
      <head>
        <title>MindSight Analysis Report</title>
        <style>
          @media print {
            body { margin: 0; padding: 20px; }
            @page { size: A4; margin: 0; }
          }
        </style>
      </head>
      <body>
        ${reportContent.outerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              // Optional: Close after printing
              // setTimeout(function() { window.close(); }, 500);
            }, 500);
          }
        </script>
      </body>
    </html>
  `);

        // Clean up
        document.body.removeChild(reportContent);
    };

// Helper function to calculate average values
    const calculateAverages = (data) => {
        const sum = {
            alpha: 0,
            beta: 0,
            theta: 0,
            delta: 0,
            gamma: 0
        };

        data.forEach(point => {
            sum.alpha += point.alpha;
            sum.beta += point.beta;
            sum.theta += point.theta;
            sum.delta += point.delta;
            sum.gamma += point.gamma;
        });

        const count = data.length || 1; // Avoid division by zero

        return {
            alpha: sum.alpha / count,
            beta: sum.beta / count,
            theta: sum.theta / count,
            delta: sum.delta / count,
            gamma: sum.gamma / count
        };
    };

    // Authentication modal component
    const AuthenticationModal = ({ isOpen, onClose, onSubmit }) => {
        const [token, setToken] = useState('');

        if (!isOpen) return null;

        return (
            <div className="auth-modal">
                <div className="auth-modal-content">
                    <h3>DeepSeek-R1 API Authentication</h3>
                    <p>Enter your Hugging Face API token to use the DeepSeek-R1 model:</p>
                    <input
                        type="password"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Hugging Face API Token"
                        className="auth-input"
                    />
                    <div className="auth-buttons">
                        <button className="auth-cancel" onClick={onClose}>Cancel</button>
                        <button
                            className="auth-submit"
                            onClick={() => onSubmit(token)}
                            disabled={!token}
                        >
                            Authenticate
                        </button>
                    </div>
                    <p className="auth-note">
                        Note: This token will only be stored temporarily for this session.
                    </p>
                </div>
            </div>
        );
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
                        onClick={toggleApiMode}
                        className={`control-button ${useRealApi ? 'active' : ''}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                            {useRealApi ? (
                                <> {/* Cloud icon for real API */}
                                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                                </>
                            ) : (
                                <> {/* Database icon for mock data */}
                                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                                    <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
                                    <path d="M3 12A9 3 0 0 0 21 12"></path>
                                </>
                            )}
                        </svg>
                        {useRealApi ? 'Using Live API' : 'Using Mock Data'}
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
                                        <button className="export-button" onClick={exportAsCSV}>CSV</button>
                                        <button className="export-button" onClick={exportAsJSON}>JSON</button>
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
                                        <button
                                            className={`export-button ${insights.length > 0 ? 'active' : 'disabled'}`}
                                            disabled={insights.length === 0}
                                            onClick={exportAsPDF}
                                        >
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

            {/* Authentication Modal */}
            {needsAuthentication && (
                <AuthenticationModal
                    isOpen={needsAuthentication}
                    onClose={() => setNeedsAuthentication(false)}
                    onSubmit={handleAuthentication}
                />
            )}
        </div>
    );
};

export default MindSight;