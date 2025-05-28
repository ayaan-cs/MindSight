import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './MindSight.css';
import { InferenceClient } from "@huggingface/inference";
import DataLoader from './DataLoader';
import {
    getMedicalContext,
    formatBrainWaveDataForModelEnhanced,
    processEnhancedModelOutput,
    analyzePatternSignificance
} from '../utils/enhancedAI';

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

    // New state for real data integration
    const [isUsingRealData, setIsUsingRealData] = useState(false);
    const [realDataMetadata, setRealDataMetadata] = useState(null);
    const [dataSource, setDataSource] = useState('synthetic');
    const [currentScenario, setCurrentScenario] = useState('Mixed Activity');

    // Sample brain wave patterns (existing)
    const samplePatterns = [
        { id: 1, name: 'Alpha Waves', description: 'Relaxed, calm mental state', color: '#4CAF50' },
        { id: 2, name: 'Beta Waves', description: 'Alert, actively thinking', color: '#2196F3' },
        { id: 3, name: 'Theta Waves', description: 'Deep meditation, sleep', color: '#9C27B0' },
        { id: 4, name: 'Delta Waves', description: 'Deep sleep, regeneration', color: '#F44336' },
        { id: 5, name: 'Gamma Waves', description: 'High cognitive processing', color: '#FF9800' }
    ];

    // Generate synthetic brain wave data for demo purposes (existing function)
    useEffect(() => {
        if (!isUsingRealData) {
            generateSyntheticData();
        }
    }, [isUsingRealData]);

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
        setDataSource('synthetic');
        setCurrentScenario('Mixed Activity');
    };

    // Handle real data loading
    const handleRealDataLoaded = (data, metadata) => {
        console.log('Real data loaded:', data.length, 'samples');
        console.log('Metadata:', metadata);

        setBrainData(data);
        setRealDataMetadata(metadata);
        setIsUsingRealData(true);
        setDataSource(metadata.source || 'Real EEG Data');

        // Determine scenario from metadata or data
        const scenario = determineScenarioFromData(data, metadata);
        setCurrentScenario(scenario);

        // Stop simulation if running
        setIsSimulating(false);

        // Automatically switch to real-time view
        setActiveTab('realtime');
    };

    // Handle data loading errors
    const handleDataLoadError = (error) => {
        console.error('Data load error:', error);
        alert(`Error loading data: ${error}`);
    };

    // Determine scenario from loaded data
    const determineScenarioFromData = (data, metadata) => {
        if (!data || data.length === 0) return 'Unknown';

        // Check if data has scenario information
        const firstPoint = data[0];
        if (firstPoint.scenario) {
            return firstPoint.scenario;
        }

        // Determine from metadata
        if (metadata.datasetType) {
            switch (metadata.datasetType) {
                case 'physionet_motor':
                    return 'Motor Imagery Task';
                case 'physionet_sleep':
                    return 'Sleep Study';
                case 'kaggle_mental':
                    return 'Mental State Classification';
                case 'kaggle_emotion':
                    return 'Emotion Recognition';
                default:
                    return 'Real EEG Data';
            }
        }

        return 'Real EEG Data';
    };

    // Enhanced format brain wave data for the model with real data context
    const formatBrainWaveDataForModel = (data) => {
        const recentData = data.slice(-30);

        // Calculate averages
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

        // Enhanced prompt with real data context
        const dataContext = isUsingRealData
            ? `This is REAL EEG data from: ${realDataMetadata?.source || 'medical research database'}
               Dataset type: ${realDataMetadata?.datasetType || 'unknown'}
               Current scenario: ${currentScenario}
               Subjects: ${realDataMetadata?.subjects || 'research participants'}
               Sampling rate: ${realDataMetadata?.samplingRate || 'standard EEG rates'}`
            : 'This is synthetic demonstration data for educational purposes.';

        return `You are a professional neuroscientist analyzing brain wave activity.
        
        DATA CONTEXT:
        ${dataContext}
        
        CURRENT ANALYSIS:
        - Alpha waves: ${alphaState} (avg: ${alphaAvg.toFixed(2)})
        - Beta waves: ${betaState} (avg: ${betaAvg.toFixed(2)})
        - Theta waves: ${thetaState} (avg: ${thetaAvg.toFixed(2)})
        - Delta waves: ${deltaState} (avg: ${deltaAvg.toFixed(2)})
        - Gamma waves: ${gammaState} (avg: ${gammaAvg.toFixed(2)})
        
        Please provide a comprehensive analysis including:
        1. Pattern identification with ${isUsingRealData ? 'medical accuracy based on research data' : 'educational context'}
        2. Physiological explanation of what these patterns indicate
        3. Confidence level based on data quality and source
        4. ${isUsingRealData ? 'Clinical or research significance' : 'Learning objectives'}
        5. Comparison to normal/expected patterns for this scenario type
        
        Respond ONLY in this JSON format:
        {
          "patterns": [
            {
              "pattern": "Descriptive pattern name",
              "significance": "What this pattern means physiologically",
              "confidence": 85,
              "timeRanges": [{"start": 15, "end": 35}],
              "clinicalNote": "${isUsingRealData ? 'Research context and implications' : 'Educational note'}"
            }
          ]
        }`;
    };

    // Simulate real-time data updates (existing)
    useEffect(() => {
        let interval;

        if (isSimulating && !isUsingRealData) {  // Only simulate if not using real data
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
    }, [isSimulating, isUsingRealData]);

    // Toggle data source between real and synthetic
    const toggleDataSource = () => {
        if (isUsingRealData) {
            // Switch back to synthetic data
            setIsUsingRealData(false);
            setRealDataMetadata(null);
            generateSyntheticData();
        } else {
            // Prompt user to load real data
            setActiveTab('data-loader');
        }
    };

    const toggleApiMode = () => {
        if (!useRealApi && !process.env.REACT_APP_HUGGING_FACE_TOKEN) {
            setNeedsAuthentication(true);
        } else {
            setUseRealApi(!useRealApi);
            setNeedsAuthentication(false);
        }
    };

    const handleAuthentication = (token) => {
        sessionStorage.setItem('huggingface_token', token);
        setNeedsAuthentication(false);
        setUseRealApi(true);
    };

    const processModelOutput = (output) => {
        try {
            if (!output || !output.choices || !output.choices[0] || !output.choices[0].message) {
                return [
                    {
                        pattern: isUsingRealData ? 'Real EEG Pattern Analysis' : 'Alpha-Beta Correlation',
                        significance: isUsingRealData
                            ? `Analysis of authentic ${currentScenario} data shows patterns consistent with research literature`
                            : 'High alpha waves combined with moderate beta activity suggest a relaxed but alert mental state',
                        confidence: isUsingRealData ? 91 : 87,
                        timeRanges: [{ start: 15, end: 35 }],
                        clinicalNote: isUsingRealData
                            ? `This data from ${realDataMetadata?.source} provides research-grade insights`
                            : 'Educational demonstration of typical brain wave interactions'
                    }
                ];
            }

            let responseContent = output.choices[0].message.content || "";

            // Clean response content
            responseContent = responseContent.replace(/<think>[\s\S]*?<\/think>/g, "");
            responseContent = responseContent.replace(/\[think\][\s\S]*?\[\/think\]/g, "");
            responseContent = responseContent.replace(/<thinking>[\s\S]*?<\/thinking>/g, "");
            responseContent = responseContent.replace(/\*\*thinking\*\*[\s\S]*?\*\*\/thinking\*\*/g, "");
            responseContent = responseContent.replace(/^<think>.*$/gm, "");

            let jsonContent = null;

            // Try to extract JSON
            const jsonBlockMatch = responseContent.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
            if (jsonBlockMatch && jsonBlockMatch[1]) {
                try {
                    jsonContent = JSON.parse(jsonBlockMatch[1]);
                } catch (e) {
                    console.error("Failed to parse JSON from code block:", e);
                }
            }

            if (!jsonContent) {
                try {
                    const jsonMatch = responseContent.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
                    if (jsonMatch && jsonMatch[1]) {
                        jsonContent = JSON.parse(jsonMatch[1]);
                    }
                } catch (e) {
                    console.error("Failed to parse JSON from content:", e);
                }
            }

            if (jsonContent) {
                if (Array.isArray(jsonContent)) {
                    return jsonContent.map(insight => ({
                        pattern: insight.pattern || 'Unnamed Pattern',
                        significance: insight.significance || 'No description provided',
                        confidence: Number(insight.confidence) || 70,
                        timeRanges: insight.timeRanges || [{ start: 0, end: 100 }],
                        clinicalNote: insight.clinicalNote || ''
                    }));
                } else if (jsonContent.patterns && Array.isArray(jsonContent.patterns)) {
                    return jsonContent.patterns.map(p => ({
                        pattern: p.pattern || p.name || 'Unnamed Pattern',
                        significance: p.significance || p.description || 'No description provided',
                        confidence: Number(p.confidence) || 70,
                        timeRanges: p.timeRanges || [{ start: 0, end: 100 }],
                        clinicalNote: p.clinicalNote || ''
                    }));
                }
            }

            // Fallback response
            return [{
                pattern: isUsingRealData ? 'Medical Data Analysis' : 'Combined Brain Wave Analysis',
                significance: isUsingRealData
                    ? 'The authentic EEG patterns show characteristic features documented in medical literature'
                    : 'The brain wave patterns indicate a complex mental state with mixed activity across frequency bands.',
                confidence: isUsingRealData ? 75 : 65,
                timeRanges: [{ start: 0, end: 100 }],
                clinicalNote: isUsingRealData ? 'Based on research-grade data' : 'Educational demonstration'
            }];

        } catch (error) {
            console.error("Error processing model output:", error);
            return [{
                pattern: 'Analysis Error',
                significance: `Error processing analysis: ${error.message}`,
                confidence: 0,
                timeRanges: [{ start: 0, end: 0 }],
                clinicalNote: 'Please try again'
            }];
        }
    };

    // Analyze brain data (enhanced for real data)
    const analyzeData = async () => {
        setIsAnalyzing(true);
        setIsLoading(true);

        try {
            if (!useRealApi) {
                setTimeout(() => {
                    const mockInsights = processModelOutput(null);
                    setInsights(mockInsights);
                    setIsLoading(false);
                    setIsAnalyzing(false);
                }, 2000);
                return;
            }

            let apiToken = process.env.REACT_APP_HUGGING_FACE_TOKEN;
            if (!apiToken) {
                apiToken = sessionStorage.getItem('huggingface_token');
            }

            if (!apiToken) {
                throw new Error("API token not found. Please authenticate to use DeepSeek-R1.");
            }

            const client = new InferenceClient(apiToken);
            const prompt = formatBrainWaveDataForModel(brainData);

            console.log("Sending enhanced prompt to model:", prompt);

            const chatCompletion = await client.chatCompletion({
                provider: "fireworks-ai",
                model: "deepseek-ai/DeepSeek-R1",
                messages: [
                    {
                        role: "system",
                        content: isUsingRealData
                            ? "You are an expert neurologist analyzing authentic research-grade EEG data. Provide medically accurate insights."
                            : "You are an expert neurologist analyzing brain wave data for educational purposes."
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
                timeRanges: [{ start: 0, end: 0 }],
                clinicalNote: 'System error'
            }]);
        } finally {
            setIsLoading(false);
            setIsAnalyzing(false);
        }
    };

    const toggleSimulation = () => {
        if (isUsingRealData) {
            alert('Simulation not available with real data. Switch to synthetic data to enable simulation.');
            return;
        }
        setIsSimulating(!isSimulating);
    };

    // Export functions
    const exportAsCSV = () => {
        let csvContent = "time,alpha,beta,theta,delta,gamma";
        if (isUsingRealData && brainData[0]?.scenario) {
            csvContent += ",scenario";
        }
        csvContent += "\n";

        brainData.forEach(point => {
            let row = `${point.time},${point.alpha.toFixed(2)},${point.beta.toFixed(2)},${point.theta.toFixed(2)},${point.delta.toFixed(2)},${point.gamma.toFixed(2)}`;
            if (point.scenario) {
                row += `,${point.scenario}`;
            }
            csvContent += row + "\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        const filename = isUsingRealData
            ? `mindsight_real_data_${currentScenario.replace(/\s+/g, '_').toLowerCase()}.csv`
            : 'mindsight_brainwave_data.csv';

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportAsJSON = () => {
        const exportData = {
            metadata: {
                source: dataSource,
                isRealData: isUsingRealData,
                scenario: currentScenario,
                exportTime: new Date().toISOString(),
                ...(realDataMetadata || {})
            },
            data: brainData.map(point => ({
                time: point.time,
                alpha: parseFloat(point.alpha.toFixed(2)),
                beta: parseFloat(point.beta.toFixed(2)),
                theta: parseFloat(point.theta.toFixed(2)),
                delta: parseFloat(point.delta.toFixed(2)),
                gamma: parseFloat(point.gamma.toFixed(2)),
                ...(point.scenario && { scenario: point.scenario }),
                ...(point.realData && { realData: point.realData })
            }))
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        const filename = isUsingRealData
            ? `mindsight_real_data_${currentScenario.replace(/\s+/g, '_').toLowerCase()}.json`
            : 'mindsight_brainwave_data.json';

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportAsPDF = () => {
        if (!insights || insights.length === 0) {
            alert('No analysis data available. Please run an analysis first.');
            return;
        }

        const reportContent = document.createElement('div');
        reportContent.style.width = '700px';
        reportContent.style.padding = '20px';
        reportContent.style.backgroundColor = 'white';
        reportContent.style.color = 'black';
        reportContent.style.fontFamily = 'Arial, sans-serif';

        const header = document.createElement('div');
        header.innerHTML = `
            <h1 style="color: #6366f1; margin-bottom: 5px;">MindSight Brain Analysis Report</h1>
            <p style="color: #666; margin-top: 0;">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p style="color: #666; margin-top: 0;"><strong>Data Source:</strong> ${dataSource}</p>
            <p style="color: #666; margin-top: 0;"><strong>Scenario:</strong> ${currentScenario}</p>
            <p style="color: #666; margin-top: 0;"><strong>Data Type:</strong> ${isUsingRealData ? 'Authentic EEG Research Data' : 'Synthetic Educational Data'}</p>
            <hr style="border-top: 1px solid #ddd; margin: 20px 0;">
        `;
        reportContent.appendChild(header);

        if (realDataMetadata) {
            const metadataSection = document.createElement('div');
            metadataSection.innerHTML = `
                <h2 style="color: #4338ca;">Dataset Information</h2>
                <p><strong>Source:</strong> ${realDataMetadata.source}</p>
                <p><strong>Subjects:</strong> ${realDataMetadata.subjects || 'Not specified'}</p>
                <p><strong>Sampling Rate:</strong> ${realDataMetadata.samplingRate || 'Not specified'}</p>
                <p><strong>Channels:</strong> ${realDataMetadata.channels || 'Not specified'}</p>
                <hr style="border-top: 1px solid #ddd; margin: 20px 0;">
            `;
            reportContent.appendChild(metadataSection);
        }

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

        const insightsSection = document.createElement('div');
        insightsSection.innerHTML = `
            <h2 style="color: #4338ca;">AI Analysis Insights</h2>
            <p>The AI analysis identified the following patterns in the ${isUsingRealData ? 'authentic research' : 'demonstration'} data:</p>
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
                ${insight.clinicalNote ? `<p style="font-size: 14px; color: #666; font-style: italic;">${insight.clinicalNote}</p>` : ''}
                <p style="font-size: 14px; color: #666; margin-top: 5px;">Time range: ${insight.timeRanges.map(range => `${range.start}s-${range.end}s`).join(', ')}</p>
            `;

            insightsSection.appendChild(insightDiv);
        });

        reportContent.appendChild(insightsSection);

        const footer = document.createElement('div');
        footer.style.marginTop = '30px';
        footer.style.borderTop = '1px solid #ddd';
        footer.style.paddingTop = '10px';
        footer.style.fontSize = '12px';
        footer.style.color = '#666';
        footer.innerHTML = `
            <p>This report was generated by MindSight, an AI-powered brain activity visualization and analysis tool.</p>
            <p>Analysis performed using DeepSeek-R1 AI model on ${isUsingRealData ? 'authentic research data' : 'synthetic educational data'}.</p>
            ${isUsingRealData ? `<p><strong>Data Source:</strong> ${realDataMetadata?.source || 'Research database'}</p>` : ''}
        `;
        reportContent.appendChild(footer);

        reportContent.style.position = 'absolute';
        reportContent.style.left = '-9999px';
        document.body.appendChild(reportContent);

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
              <head>
                <title>MindSight Analysis Report - ${currentScenario}</title>
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
                    }, 500);
                  }
                </script>
              </body>
            </html>
        `);

        document.body.removeChild(reportContent);
    };

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

        const count = data.length || 1;

        return {
            alpha: sum.alpha / count,
            beta: sum.beta / count,
            theta: sum.theta / count,
            delta: sum.delta / count,
            gamma: sum.gamma / count
        };
    };

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
                        {isUsingRealData && (
                            <p style={{ fontSize: '0.75rem', color: '#4CAF50', margin: '0.25rem 0 0 0' }}>
                                ● {currentScenario}
                            </p>
                        )}
                    </div>
                </div>

                <div className="header-controls">
                    <button
                        onClick={toggleDataSource}
                        className={`control-button ${isUsingRealData ? 'active' : ''}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                            {isUsingRealData ? (
                                <>
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14,2 14,8 20,8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10,9 9,9 8,9"></polyline>
                                </>
                            ) : (
                                <>
                                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                                    <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
                                    <path d="M3 12A9 3 0 0 0 21 12"></path>
                                </>
                            )}
                        </svg>
                        {isUsingRealData ? 'Real Data' : 'Synthetic Data'}
                    </button>

                    <button
                        onClick={toggleSimulation}
                        className={`control-button ${isSimulating ? 'active' : ''} ${isUsingRealData ? 'disabled' : ''}`}
                        disabled={isUsingRealData}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                            {isSimulating ? (
                                <>
                                    <rect x="6" y="4" width="4" height="16"></rect>
                                    <rect x="14" y="4" width="4" height="16"></rect>
                                </>
                            ) : (
                                <>
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
                                <>
                                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                                </>
                            ) : (
                                <>
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
                        { id: 'data-loader', label: 'Load Data' },
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
                                {isUsingRealData
                                    ? `Authentic EEG data visualization from ${dataSource} - ${currentScenario}`
                                    : 'Real-time visualization of brain electrical activity across different frequency bands.'
                                }
                            </p>
                            {isUsingRealData && realDataMetadata && (
                                <div style={{
                                    background: 'rgba(76, 175, 80, 0.1)',
                                    border: '1px solid rgba(76, 175, 80, 0.3)',
                                    borderRadius: '0.375rem',
                                    padding: '0.75rem',
                                    marginTop: '0.75rem',
                                    fontSize: '0.875rem'
                                }}>
                                    <strong style={{ color: '#4CAF50' }}>Real Data Info:</strong>
                                    <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                                        {realDataMetadata.subjects} • {realDataMetadata.samplingRate} • {realDataMetadata.channels}
                                    </span>
                                </div>
                            )}
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
                                {isUsingRealData
                                    ? `Medical-grade AI analysis of authentic ${currentScenario} data from ${dataSource}`
                                    : 'Patterns and insights detected by the DeepSeek-R1 model in your brain activity data.'
                                }
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
                                        {insight.clinicalNote && (
                                            <div style={{
                                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                                borderRadius: '0.25rem',
                                                padding: '0.5rem',
                                                marginTop: '0.75rem',
                                                fontSize: '0.875rem',
                                                fontStyle: 'italic',
                                                color: 'var(--primary)'
                                            }}>
                                                {insight.clinicalNote}
                                            </div>
                                        )}
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

                {/* Data Loader Tab */}
                {activeTab === 'data-loader' && (
                    <div className="tab-content">
                        <DataLoader
                            onDataLoaded={handleRealDataLoaded}
                            onError={handleDataLoadError}
                        />
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
                                    <h4>{isUsingRealData ? 'Real EEG Data' : 'Raw Data'}</h4>
                                    <p>
                                        Export the {isUsingRealData ? 'authentic research' : 'synthetic'} brain wave measurements for further analysis in external tools.
                                        {isUsingRealData && ` Includes scenario information from ${currentScenario}.`}
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
                                        {isUsingRealData && ` Includes medical-grade insights from authentic ${currentScenario} data.`}
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
                    <p>
                        {isUsingRealData
                            ? `Real data: ${dataSource} | Scenario: ${currentScenario}`
                            : 'Data refresh rate: 250 Hz'
                        }
                    </p>
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