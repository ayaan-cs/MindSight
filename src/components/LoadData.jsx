import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRESETS } from '../eeg/signal';
import { useEEG } from '../context/EEGContext';

const LoadData = () => {
    const navigate = useNavigate();
    const { loadPreset, loadFile, isLoadingFile, loadError } = useEEG();
    const [dragOver, setDragOver] = useState(false);

    const openPreset = (id) => {
        loadPreset(id);
        navigate('/workspace');
    };

    const handleFile = async (file) => {
        const ok = await loadFile(file);
        if (ok) navigate('/workspace');
    };

    return (
        <main className="screen page-enter">
            <section className="sheet sheet-pad">
                <p className="kicker" style={{ marginBottom: 12 }}>Step 1 of 3 · pick something to look at</p>
                <h1 className="section-title">What would you like to look at?</h1>
                <p className="lede">Any of these is a fine place to start. Each one tells you where it came from and whether it is a real brain or a practice signal, and you can swap it out any time without losing your place.</p>

                <h2 className="kicker" style={{ margin: '36px 0 14px', letterSpacing: '0.12em' }}>Recordings you can borrow</h2>
                <div className="card-grid">
                    {['rest', 'motor', 'demo'].map((id) => {
                        const preset = PRESETS[id];
                        return (
                            <button key={id} type="button" className="record-card" onClick={() => openPreset(id)}>
                                <span className={`badge ${preset.real ? 'badge-real' : 'badge-synth'}`}>
                                    {preset.real ? 'Real · PhysioNet' : 'Synthetic · generated'}
                                </span>
                                <h3>{preset.name}</h3>
                                <p>{preset.description}</p>
                                <span className="record-cta">{preset.cta}</span>
                            </button>
                        );
                    })}
                </div>

                <h2 className="kicker" style={{ margin: '40px 0 14px', letterSpacing: '0.12em' }}>Bring your own file</h2>
                <div className="drop-grid">
                    <div
                        className="dropzone"
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setDragOver(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file) handleFile(file);
                        }}
                        style={dragOver ? { borderColor: 'var(--muted)' } : undefined}
                    >
                        <p style={{ fontSize: 16, fontWeight: 600 }}>Drop an EEG file here</p>
                        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
                            Or pick one from your computer. Files stay in your browser — nothing is uploaded anywhere.
                        </p>
                        <label className="btn btn-ghost btn-sm file-btn">
                            Choose file
                            <input
                                type="file"
                                accept=".edf,.csv,.json,.txt"
                                disabled={isLoadingFile}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFile(file);
                                }}
                            />
                        </label>
                        <p className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>
                            {isLoadingFile ? 'Reading file…' : '.edf · .csv · .json — up to 50 MB'}
                        </p>
                        {loadError && <p className="error-note">{loadError}</p>}
                    </div>
                    <div className="need-box">
                        <h3>What we need to see in it</h3>
                        <ul>
                            <li><span className="mono">1</span><span>One column of time in seconds, or a stated sampling rate.</span></li>
                            <li><span className="mono">2</span><span>One column per channel, in microvolts (µV).</span></li>
                            <li><span className="mono">3</span><span>Channel names in the header row — <span className="mono" style={{ fontSize: 13 }}>Fp1, C3, C4, O1</span> and so on.</span></li>
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default LoadData;
