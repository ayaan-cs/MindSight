import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { InferenceClient } from '@huggingface/inference';
import {
    formatBrainWaveDataForModelEnhanced,
    processEnhancedModelOutput
} from '../utils/enhancedAI';
import { parseEEGData } from '../utils/eegDataParser';
import {
    CHANNELS,
    PRESETS,
    WINDOWS,
    WINDOW_SECONDS,
    bandWeights,
    buildTracePath,
    generateBrainData,
    computeAverages,
    computeRatios,
    confidenceWord,
    prefersReducedMotion
} from '../eeg/signal';

const EEGContext = createContext(null);

const defaultPreset = PRESETS.demo;

function metadataFromPreset(preset) {
    return {
        source: preset.source,
        datasetType: preset.id,
        subjects: preset.real ? 'research participants' : 'none (generated)',
        samplingRate: preset.samplingRate,
        channels: preset.channels,
        provenance: preset.provenance,
        quality: preset.quality
    };
}

export function EEGProvider({ children }) {
    const [presetId, setPresetId] = useState(defaultPreset.id);
    const [recordingName, setRecordingName] = useState(defaultPreset.name);
    const [isRealData, setIsRealData] = useState(defaultPreset.real);
    const [currentScenario, setCurrentScenario] = useState(defaultPreset.scenario);
    const [metadata, setMetadata] = useState(() => metadataFromPreset(defaultPreset));
    const [brainData, setBrainData] = useState(() => generateBrainData(defaultPreset.bands));
    const [phase, setPhase] = useState(0);
    const [playing, setPlaying] = useState(true);
    const [windowIndex, setWindowIndex] = useState(0);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [hasReading, setHasReading] = useState(false);
    const [insights, setInsights] = useState([]);
    const [overallAssessment, setOverallAssessment] = useState(null);
    const [useRealApi, setUseRealApi] = useState(false);
    const [needsAuthentication, setNeedsAuthentication] = useState(false);
    const [loadError, setLoadError] = useState(null);
    const [isLoadingFile, setIsLoadingFile] = useState(false);

    const analyzeTimer = useRef(null);

    useEffect(() => {
        const reduced = prefersReducedMotion();
        setReducedMotion(reduced);
        if (reduced) setPlaying(false);

        let media;
        try {
            media = window.matchMedia('(prefers-reduced-motion: reduce)');
            const onChange = (event) => {
                setReducedMotion(event.matches);
                if (event.matches) setPlaying(false);
            };
            media.addEventListener('change', onChange);
            return () => media.removeEventListener('change', onChange);
        } catch (e) {
            return undefined;
        }
    }, []);

    useEffect(() => {
        if (!playing || reducedMotion) return undefined;
        const id = setInterval(() => {
            setPhase((prev) => prev + 0.9);
        }, 70);
        return () => clearInterval(id);
    }, [playing, reducedMotion]);

    const averages = useMemo(() => computeAverages(brainData), [brainData]);
    const ratios = useMemo(() => computeRatios(averages), [averages]);
    const weights = useMemo(() => bandWeights(averages), [averages]);

    const channels = useMemo(() => (
        CHANNELS.map((channel, index) => ({
            ...channel,
            aria: `${channel.code} — ${channel.plain}, EEG trace`,
            path: buildTracePath(
                channel.seed,
                weights,
                phase + index * 1.3,
                1000,
                78,
                presetId === 'motor' && channel.code === 'C3'
            )
        }))
    ), [weights, phase, presetId]);

    const heroTrace = useMemo(
        () => buildTracePath(1.4, { d: 0.8, t: 1.0, a: 2.5, b: 0.7, g: 0.3 }, phase, 1200, 260),
        [phase]
    );

    const resetReading = () => {
        setHasReading(false);
        setInsights([]);
        setOverallAssessment(null);
        setIsAnalyzing(false);
    };

    const loadPreset = useCallback((id) => {
        const preset = PRESETS[id];
        if (!preset) return;
        setPresetId(id);
        setRecordingName(preset.name);
        setIsRealData(preset.real);
        setCurrentScenario(preset.scenario);
        setMetadata(metadataFromPreset(preset));
        setBrainData(generateBrainData(preset.bands));
        resetReading();
        setLoadError(null);
    }, []);

    const loadParsedData = useCallback((data, info, name) => {
        const nextMeta = {
            ...(info || {}),
            quality: `${Math.min(10, (data.length / 16)).toFixed(1)} of 10 s`,
            provenance: info?.provenance || `${info?.source || 'uploaded file'} (stays in the browser)`
        };
        setBrainData(data);
        setMetadata(nextMeta);
        setIsRealData(true);
        setPresetId('upload');
        setRecordingName(name || nextMeta.source || 'Uploaded recording');
        setCurrentScenario(
            nextMeta.datasetType === 'physionet_motor' ? 'Motor Imagery Task'
                : nextMeta.datasetType === 'physionet_sleep' ? 'Sleep Study'
                    : nextMeta.datasetType === 'kaggle_mental' ? 'Mental State Classification'
                        : nextMeta.datasetType === 'kaggle_emotion' ? 'Emotion Recognition'
                            : 'Real EEG Data'
        );
        resetReading();
        setLoadError(null);
    }, []);

    const loadFile = useCallback((file, datasetType = 'auto') => {
        if (!file) return Promise.resolve(false);
        setIsLoadingFile(true);
        setLoadError(null);

        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const result = parseEEGData(event.target.result, datasetType);
                    if (!result.data || result.data.length === 0) {
                        throw new Error('No valid data found in file');
                    }
                    loadParsedData(result.data, result.metadata, file.name);
                    resolve(true);
                } catch (error) {
                    setLoadError(error.message);
                    resolve(false);
                } finally {
                    setIsLoadingFile(false);
                }
            };
            reader.onerror = () => {
                setIsLoadingFile(false);
                setLoadError('Error reading file');
                resolve(false);
            };
            reader.readAsText(file);
        });
    }, [loadParsedData]);

    const togglePlay = () => {
        if (reducedMotion) {
            setPhase((prev) => prev + 14);
            return;
        }
        setPlaying((prev) => !prev);
    };

    const cycleWindow = () => {
        setWindowIndex((prev) => (prev + 1) % WINDOWS.length);
    };

    const toggleApiMode = () => {
        if (!useRealApi && !process.env.REACT_APP_HUGGING_FACE_TOKEN && !sessionStorage.getItem('huggingface_token')) {
            setNeedsAuthentication(true);
            return;
        }
        setUseRealApi((prev) => !prev);
        setNeedsAuthentication(false);
    };

    const handleAuthentication = (token) => {
        sessionStorage.setItem('huggingface_token', token);
        setNeedsAuthentication(false);
        setUseRealApi(true);
    };

    const curatedReading = useMemo(() => {
        const preset = PRESETS[presetId];
        if (!preset) return null;
        return {
            headline: preset.headline,
            body: preset.body,
            confidence: preset.conf,
            confWord: preset.confWord,
            evidence: preset.evidence,
            quality: preset.quality
        };
    }, [presetId]);

    const reading = useMemo(() => {
        if (!hasReading) return null;
        if (curatedReading && !useRealApi && insights.length === 0) {
            return curatedReading;
        }
        const primary = insights[0];
        const confidence = primary?.confidence ?? 70;
        return {
            headline: primary?.pattern || overallAssessment?.brainState || 'A reading of this window',
            body: primary?.significance || overallAssessment?.clinicalSignificance || 'The model reviewed the band measurements for this window.',
            confidence,
            confWord: confidenceWord(confidence),
            evidence: insights.slice(0, 3).map((insight) => ({
                text: insight.clinicalNote || insight.significance,
                range: insight.timeRanges
                    ? insight.timeRanges.map((range) => `${range.start}s–${range.end}s`).join(', ')
                    : 'this window'
            })),
            quality: overallAssessment?.dataQuality || metadata?.samplingRate
        };
    }, [hasReading, curatedReading, useRealApi, insights, overallAssessment, metadata]);

    const analyzeData = useCallback(async () => {
        setIsAnalyzing(true);
        setHasReading(false);

        const finishWithCurated = () => {
            const result = processEnhancedModelOutput(null, isRealData, currentScenario);
            setInsights(result.patterns);
            setOverallAssessment(result.overallAssessment);
            setHasReading(true);
            setIsAnalyzing(false);
        };

        try {
            if (!useRealApi) {
                if (analyzeTimer.current) clearTimeout(analyzeTimer.current);
                analyzeTimer.current = setTimeout(() => {
                    if (PRESETS[presetId]) {
                        setInsights([]);
                        setOverallAssessment({
                            brainState: PRESETS[presetId].headline,
                            clinicalSignificance: PRESETS[presetId].body,
                            dataQuality: PRESETS[presetId].quality,
                            recommendations: 'Educational reading only — not a diagnosis.'
                        });
                        setHasReading(true);
                        setIsAnalyzing(false);
                    } else {
                        finishWithCurated();
                    }
                }, 1200);
                return;
            }

            let apiToken = process.env.REACT_APP_HUGGING_FACE_TOKEN;
            if (!apiToken) {
                apiToken = sessionStorage.getItem('huggingface_token');
            }
            if (!apiToken) {
                throw new Error('API token not found. Please authenticate to use DeepSeek-R1.');
            }

            const client = new InferenceClient(apiToken);
            const prompt = formatBrainWaveDataForModelEnhanced(
                brainData,
                currentScenario,
                metadata,
                isRealData
            );

            const chatCompletion = await client.chatCompletion({
                provider: 'fireworks-ai',
                model: 'deepseek-ai/DeepSeek-R1',
                messages: [
                    {
                        role: 'system',
                        content: isRealData
                            ? 'You are an expert neurologist analyzing authentic research-grade EEG data. Provide medically accurate insights in plain language. This is not a diagnosis.'
                            : 'You are an expert neurologist analyzing brain wave data for educational purposes. Speak in plain language. This is not a diagnosis.'
                    },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 512,
                temperature: 0.3
            });

            const result = processEnhancedModelOutput(chatCompletion, isRealData, currentScenario);
            setInsights(result.patterns);
            setOverallAssessment(result.overallAssessment);
            setHasReading(true);
        } catch (error) {
            if (error.message.includes('API token') || error.message.includes('Authentication')) {
                setNeedsAuthentication(true);
            }
            setInsights([{
                pattern: 'Analysis Error',
                significance: error.message || 'Unknown error occurred.',
                confidence: 0,
                timeRanges: [{ start: 0, end: 0 }],
                clinicalNote: 'System error'
            }]);
            setHasReading(true);
        } finally {
            setIsAnalyzing(false);
        }
    }, [useRealApi, presetId, isRealData, currentScenario, brainData, metadata]);

    const exportAsCSV = () => {
        let csvContent = 'time,alpha,beta,theta,delta,gamma';
        if (brainData[0]?.scenario) csvContent += ',scenario';
        csvContent += '\n';
        brainData.forEach((point) => {
            let row = `${point.time},${Number(point.alpha).toFixed(2)},${Number(point.beta).toFixed(2)},${Number(point.theta).toFixed(2)},${Number(point.delta).toFixed(2)},${Number(point.gamma).toFixed(2)}`;
            if (point.scenario) row += `,${point.scenario}`;
            csvContent += `${row}\n`;
        });
        downloadBlob(csvContent, 'text/csv;charset=utf-8;', filename('csv'));
    };

    const exportAsJSON = () => {
        const exportData = {
            metadata: {
                name: recordingName,
                source: metadata?.source,
                isRealData,
                scenario: currentScenario,
                provenance: metadata?.provenance,
                exportTime: new Date().toISOString(),
                averages,
                ratios,
                ...(metadata || {})
            },
            data: brainData.map((point) => ({
                time: point.time,
                alpha: parseFloat(Number(point.alpha).toFixed(2)),
                beta: parseFloat(Number(point.beta).toFixed(2)),
                theta: parseFloat(Number(point.theta).toFixed(2)),
                delta: parseFloat(Number(point.delta).toFixed(2)),
                gamma: parseFloat(Number(point.gamma).toFixed(2)),
                ...(point.scenario && { scenario: point.scenario })
            }))
        };
        downloadBlob(JSON.stringify(exportData, null, 2), 'application/json', filename('json'));
    };

    const exportAsPDF = () => {
        if (!hasReading) {
            alert('No reading yet. Run the interpreter in the workspace first.');
            return;
        }
        const reportContent = document.createElement('div');
        reportContent.style.width = '700px';
        reportContent.style.padding = '20px';
        reportContent.style.backgroundColor = 'white';
        reportContent.style.color = 'black';
        reportContent.style.fontFamily = 'IBM Plex Sans, Arial, sans-serif';
        reportContent.innerHTML = `
            <h1 style="color:#4338ca;margin-bottom:4px;">MindSight EEG report</h1>
            <p style="color:#475569;margin:0 0 4px;">Generated ${new Date().toLocaleString()}</p>
            <p style="color:#475569;margin:0 0 4px;"><strong>Recording:</strong> ${recordingName}</p>
            <p style="color:#475569;margin:0 0 16px;"><strong>Provenance:</strong> ${metadata?.provenance || (isRealData ? 'research data' : 'synthetic practice signal')}</p>
            <p style="font-size:12px;color:#92400e;border:1px solid #b45309;background:#fffbeb;padding:8px;">Not a medical device and not a diagnosis.</p>
            <hr style="border:none;border-top:1px solid #cbd5e1;margin:20px 0;">
            <h2 style="color:#312e81;">02 · Measurements</h2>
            <ul>
              <li>Delta: ${averages.delta.toFixed(1)} µV²</li>
              <li>Theta: ${averages.theta.toFixed(1)} µV²</li>
              <li>Alpha: ${averages.alpha.toFixed(1)} µV²</li>
              <li>Beta: ${averages.beta.toFixed(1)} µV²</li>
              <li>Gamma: ${averages.gamma.toFixed(1)} µV²</li>
              <li>Theta ÷ beta: ${ratios.thetaBeta.toFixed(2)}</li>
              <li>Beta ÷ alpha: ${ratios.betaAlpha.toFixed(2)}</li>
            </ul>
            <h2 style="color:#312e81;">03 · Reading</h2>
            <p><strong>${reading?.headline || ''}</strong></p>
            <p>${reading?.body || ''}</p>
            <p>Confidence: ${reading?.confidence ?? '—'}% (${reading?.confWord || ''})</p>
            ${(reading?.evidence || []).map((item) => `<p>${item.text} <em>${item.range}</em></p>`).join('')}
        `;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<html><head><title>MindSight report — ${recordingName}</title></head><body>${reportContent.innerHTML}<script>window.onload=function(){setTimeout(function(){window.print();},400);}</script></body></html>`);
        printWindow.document.close();
    };

    const filename = (ext) => {
        const slug = recordingName.replace(/\s+/g, '_').toLowerCase();
        return `mindsight_${slug}.${ext}`;
    };

    const value = {
        CHANNELS,
        WINDOWS,
        presetId,
        recordingName,
        isRealData,
        currentScenario,
        metadata,
        brainData,
        channels,
        heroTrace,
        averages,
        ratios,
        playing,
        reducedMotion,
        windowIndex,
        windowLabel: WINDOWS[windowIndex],
        windowSeconds: WINDOW_SECONDS[windowIndex],
        isAnalyzing,
        hasReading,
        reading,
        insights,
        overallAssessment,
        useRealApi,
        needsAuthentication,
        loadError,
        isLoadingFile,
        loadPreset,
        loadFile,
        loadParsedData,
        togglePlay,
        cycleWindow,
        toggleApiMode,
        handleAuthentication,
        setNeedsAuthentication,
        analyzeData,
        exportAsCSV,
        exportAsJSON,
        exportAsPDF
    };

    return (
        <EEGContext.Provider value={value}>
            {children}
        </EEGContext.Provider>
    );
}

export function useEEG() {
    const context = useContext(EEGContext);
    if (!context) {
        throw new Error('useEEG must be used within EEGProvider');
    }
    return context;
}

function downloadBlob(content, type, name) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
