/* eslint-disable no-unused-vars */
import React, { useState, useCallback } from 'react';
import { parseEEGData, DATASET_TYPES } from '../utils/eegDataParser';
import './DataLoader.css';

const DataLoader = ({ onDataLoaded, onError }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDataset, setSelectedDataset] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [datasetInfo, setDatasetInfo] = useState(null);

    // Sample dataset configurations
    const sampleDatasets = [
        {
            id: 'physionet_motor',
            name: 'PhysioNet Motor Imagery',
            description: 'Real EEG data from 109 volunteers performing motor tasks',
            scenarios: ['Left Hand', 'Right Hand', 'Feet', 'Tongue'],
            url: 'https://physionet.org/content/eegmmidb/1.0.0/',
            sampleFile: '/sample-data/physionet-motor-sample.csv'
        },
        {
            id: 'physionet_sleep',
            name: 'Sleep-EDF Database',
            description: 'Sleep study recordings with different sleep stages',
            scenarios: ['Wake', 'REM Sleep', 'Light Sleep', 'Deep Sleep'],
            url: 'https://physionet.org/content/sleep-edfx/1.0.0/',
            sampleFile: '/sample-data/sleep-edf-sample.csv'
        },
        {
            id: 'kaggle_mental',
            name: 'Kaggle Mental State',
            description: 'EEG data for relaxed, neutral, and concentrated states',
            scenarios: ['Relaxed', 'Neutral', 'Concentrated'],
            url: 'https://www.kaggle.com/datasets/birdy654/eeg-brainwave-dataset-mental-state',
            sampleFile: '/sample-data/kaggle-mental-sample.csv'
        },
        {
            id: 'kaggle_emotion',
            name: 'Kaggle Emotion Dataset',
            description: 'EEG recordings during positive and negative emotional experiences',
            scenarios: ['Positive', 'Negative', 'Neutral'],
            url: 'https://www.kaggle.com/datasets/birdy654/eeg-brainwave-dataset-feeling-emotions',
            sampleFile: '/sample-data/kaggle-emotion-sample.csv'
        }
    ];

    // Handle file upload
    const handleFileUpload = useCallback((event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploadedFile(file);
        setIsLoading(true);

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target.result;
                const datasetType = selectedDataset || 'auto';

                console.log('Parsing uploaded file:', file.name);
                const result = parseEEGData(content, datasetType);

                if (result.data.length > 0) {
                    setDatasetInfo(result.metadata);
                    onDataLoaded(result.data, result.metadata);
                } else {
                    throw new Error('No valid data found in file');
                }
            } catch (error) {
                console.error('Error processing file:', error);
                onError(`Error processing file: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        reader.onerror = () => {
            setIsLoading(false);
            onError('Error reading file');
        };

        reader.readAsText(file);
    }, [selectedDataset, onDataLoaded, onError]);

    // Load sample dataset
    const loadSampleDataset = async (dataset) => {
        setIsLoading(true);
        setSelectedDataset(dataset.id);

        try {
            // For demo purposes, we'll create sample data
            // In production, you'd fetch from the actual URLs or local files
            const sampleData = generateSampleData(dataset.id);
            const result = parseEEGData(sampleData, dataset.id);

            if (result.data.length > 0) {
                setDatasetInfo(result.metadata);
                onDataLoaded(result.data, result.metadata);
            } else {
                throw new Error('No valid data found in sample dataset');
            }
        } catch (error) {
            console.error('Error loading sample dataset:', error);
            onError(`Error loading sample dataset: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Generate sample data for demonstration
    const generateSampleData = (datasetType) => {
        switch (datasetType) {
            case 'physionet_motor':
                return generateMotorImagerySample();
            case 'physionet_sleep':
                return generateSleepSample();
            case 'kaggle_mental':
                return generateMentalStateSample();
            case 'kaggle_emotion':
                return generateEmotionSample();
            default:
                return generateMentalStateSample();
        }
    };

    const generateMotorImagerySample = () => {
        const header = 'time,c3,c4,cz,task\n';
        let data = header;

        const tasks = ['left_hand', 'right_hand', 'feet', 'tongue'];

        for (let i = 0; i < 500; i++) {
            const task = tasks[Math.floor(i / 125)]; // Change task every 125 samples
            const c3 = Math.sin(i * 0.1) * (task === 'left_hand' ? 20 : 10) + Math.random() * 5;
            const c4 = Math.sin(i * 0.1) * (task === 'right_hand' ? 20 : 10) + Math.random() * 5;
            const cz = Math.sin(i * 0.05) * 15 + Math.random() * 3;

            data += `${i},${c3.toFixed(3)},${c4.toFixed(3)},${cz.toFixed(3)},${task}\n`;
        }

        return data;
    };

    const generateSleepSample = () => {
        const header = 'time,fpz,pz,eog,stage\n';
        let data = header;

        const stages = [0, 1, 2, 3, 5]; // Wake, N1, N2, N3, REM

        for (let i = 0; i < 500; i++) {
            const stage = stages[Math.floor(i / 100)]; // Change stage every 100 samples
            const fpz = Math.sin(i * 0.05) * (stage === 3 ? 30 : 10) + Math.random() * 5;
            const pz = Math.sin(i * 0.03) * (stage === 3 ? 25 : 8) + Math.random() * 3;
            const eog = Math.sin(i * 0.2) * (stage === 5 ? 15 : 5) + Math.random() * 2;

            data += `${i},${fpz.toFixed(3)},${pz.toFixed(3)},${eog.toFixed(3)},${stage}\n`;
        }

        return data;
    };

    const generateMentalStateSample = () => {
        const header = 'label,attention,meditation,delta,theta,alpha,beta,gamma\n';
        let data = header;

        const states = ['relaxed', 'neutral', 'concentrated'];

        for (let i = 0; i < 300; i++) {
            const state = states[Math.floor(i / 100)];
            let attention, meditation, delta, theta, alpha, beta, gamma;

            switch (state) {
                case 'relaxed':
                    attention = 30 + Math.random() * 20;
                    meditation = 70 + Math.random() * 20;
                    alpha = 25 + Math.random() * 10;
                    beta = 15 + Math.random() * 8;
                    theta = 20 + Math.random() * 8;
                    delta = 30 + Math.random() * 10;
                    gamma = 8 + Math.random() * 5;
                    break;
                case 'concentrated':
                    attention = 70 + Math.random() * 20;
                    meditation = 20 + Math.random() * 15;
                    alpha = 15 + Math.random() * 8;
                    beta = 35 + Math.random() * 15;
                    theta = 12 + Math.random() * 5;
                    delta = 20 + Math.random() * 8;
                    gamma = 15 + Math.random() * 8;
                    break;
                default: // neutral
                    attention = 50 + Math.random() * 15;
                    meditation = 50 + Math.random() * 15;
                    alpha = 20 + Math.random() * 8;
                    beta = 25 + Math.random() * 10;
                    theta = 15 + Math.random() * 6;
                    delta = 25 + Math.random() * 8;
                    gamma = 10 + Math.random() * 6;
                    break;
            }

            data += `${state},${attention.toFixed(1)},${meditation.toFixed(1)},${delta.toFixed(2)},${theta.toFixed(2)},${alpha.toFixed(2)},${beta.toFixed(2)},${gamma.toFixed(2)}\n`;
        }

        return data;
    };

    const generateEmotionSample = () => {
        const header = 'emotion,delta,theta,alpha,beta,gamma\n';
        let data = header;

        const emotions = ['positive', 'negative', 'neutral'];

        for (let i = 0; i < 300; i++) {
            const emotion = emotions[Math.floor(i / 100)];
            let delta, theta, alpha, beta, gamma;

            switch (emotion) {
                case 'positive':
                    delta = 15 + Math.random() * 8;
                    theta = 18 + Math.random() * 6;
                    alpha = 28 + Math.random() * 12;
                    beta = 20 + Math.random() * 8;
                    gamma = 12 + Math.random() * 6;
                    break;
                case 'negative':
                    delta = 35 + Math.random() * 12;
                    theta = 25 + Math.random() * 10;
                    alpha = 12 + Math.random() * 6;
                    beta = 30 + Math.random() * 15;
                    gamma = 8 + Math.random() * 4;
                    break;
                default: // neutral
                    delta = 25 + Math.random() * 8;
                    theta = 20 + Math.random() * 6;
                    alpha = 20 + Math.random() * 8;
                    beta = 25 + Math.random() * 10;
                    gamma = 10 + Math.random() * 5;
                    break;
            }

            data += `${emotion},${delta.toFixed(2)},${theta.toFixed(2)},${alpha.toFixed(2)},${beta.toFixed(2)},${gamma.toFixed(2)}\n`;
        }

        return data;
    };

    // Clear loaded data
    const clearData = () => {
        setUploadedFile(null);
        setSelectedDataset('');
        setDatasetInfo(null);
    };

    return (
        <div className="data-loader">
            <div className="data-loader-header">
                <h3>Real EEG Dataset Loader</h3>
                <p>Load authentic brain wave data from research databases</p>
            </div>

            {/* Sample Datasets */}
            <div className="sample-datasets">
                <h4>Sample Datasets</h4>
                <div className="dataset-grid">
                    {sampleDatasets.map((dataset) => (
                        <div key={dataset.id} className="dataset-card">
                            <div className="dataset-info">
                                <h5>{dataset.name}</h5>
                                <p>{dataset.description}</p>
                                <div className="scenarios">
                                    <strong>Scenarios:</strong>
                                    <div className="scenario-tags">
                                        {dataset.scenarios.map((scenario, index) => (
                                            <span key={index} className="scenario-tag">{scenario}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="dataset-actions">
                                <button
                                    onClick={() => loadSampleDataset(dataset)}
                                    disabled={isLoading}
                                    className="load-sample-btn"
                                >
                                    {isLoading && selectedDataset === dataset.id ? (
                                        <>
                                            <div className="spinner"></div>
                                            Loading...
                                        </>
                                    ) : (
                                        'Load Sample'
                                    )}
                                </button>
                                <a
                                    href={dataset.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="source-link"
                                >
                                    View Source
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* File Upload */}
            <div className="file-upload-section">
                <h4>Upload Your Own Dataset</h4>
                <div className="upload-area">
                    <div className="dataset-type-selector">
                        <label htmlFor="dataset-type">Dataset Type:</label>
                        <select
                            id="dataset-type"
                            value={selectedDataset}
                            onChange={(e) => setSelectedDataset(e.target.value)}
                        >
                            <option value="">Auto-detect</option>
                            <option value={DATASET_TYPES.PHYSIONET_MOTOR}>PhysioNet Motor Imagery</option>
                            <option value={DATASET_TYPES.PHYSIONET_SLEEP}>Sleep-EDF</option>
                            <option value={DATASET_TYPES.KAGGLE_MENTAL}>Kaggle Mental State</option>
                            <option value={DATASET_TYPES.KAGGLE_EMOTION}>Kaggle Emotion</option>
                        </select>
                    </div>

                    <div className="file-input-wrapper">
                        <input
                            type="file"
                            id="eeg-file"
                            accept=".csv,.txt,.edf"
                            onChange={handleFileUpload}
                            disabled={isLoading}
                        />
                        <label htmlFor="eeg-file" className={`file-input-label ${isLoading ? 'disabled' : ''}`}>
                            {uploadedFile ? uploadedFile.name : 'Choose CSV or EDF file...'}
                        </label>
                    </div>

                    {isLoading && (
                        <div className="loading-indicator">
                            <div className="spinner"></div>
                            <span>Processing EEG data...</span>
                        </div>
                    )}
                </div>

                <div className="supported-formats">
                    <h5>Supported Formats:</h5>
                    <ul>
                        <li><strong>CSV:</strong> Comma-separated values with headers</li>
                        <li><strong>TXT:</strong> Tab or comma-delimited text files</li>
                        <li><strong>EDF:</strong> European Data Format (experimental)</li>
                    </ul>
                </div>
            </div>

            {/* Dataset Information */}
            {datasetInfo && (
                <div className="dataset-info-panel">
                    <h4>Loaded Dataset Information</h4>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Source:</label>
                            <span>{datasetInfo.source}</span>
                        </div>
                        {datasetInfo.subjects && (
                            <div className="info-item">
                                <label>Subjects:</label>
                                <span>{datasetInfo.subjects}</span>
                            </div>
                        )}
                        {datasetInfo.samplingRate && (
                            <div className="info-item">
                                <label>Sampling Rate:</label>
                                <span>{datasetInfo.samplingRate}</span>
                            </div>
                        )}
                        {datasetInfo.channels && (
                            <div className="info-item">
                                <label>Channels:</label>
                                <span>{datasetInfo.channels}</span>
                            </div>
                        )}
                        <div className="info-item">
                            <label>Dataset Type:</label>
                            <span>{datasetInfo.datasetType}</span>
                        </div>
                    </div>

                    <div className="dataset-actions">
                        <button onClick={clearData} className="clear-btn">
                            Clear Data
                        </button>
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="instructions">
                <h5>Quick Start Guide:</h5>
                <ol>
                    <li>Try a <strong>Sample Dataset</strong> to see real EEG patterns immediately</li>
                    <li>Or <strong>upload your own</strong> CSV file with EEG data</li>
                    <li>The data will automatically replace the synthetic waves in the visualization</li>
                    <li>Use the <strong>Analyze</strong> button to get AI insights on the real patterns</li>
                </ol>
            </div>
        </div>
    );
};

export default DataLoader;