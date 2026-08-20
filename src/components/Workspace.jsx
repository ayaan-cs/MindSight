import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BANDS, barWidth } from '../eeg/signal';
import { useEEG } from '../context/EEGContext';
import './MindSight.css';

const ChannelTrace = ({ channel }) => (
    <div className="channel-row">
        <div className="channel-meta">
            <span className="channel-code">{channel.code}</span>
            <span className="channel-plain">{channel.plain}</span>
        </div>
        <div className="channel-plot">
            <svg viewBox="0 0 1000 78" preserveAspectRatio="none" role="img" aria-label={channel.aria}>
                <g stroke="#24314d" strokeWidth="1" vectorEffect="non-scaling-stroke">
                    <line x1="0" y1="19.5" x2="1000" y2="19.5" />
                    <line x1="0" y1="58.5" x2="1000" y2="58.5" />
                </g>
                <g stroke="#33415e" strokeWidth="1" vectorEffect="non-scaling-stroke">
                    <line x1="0" y1="39" x2="1000" y2="39" />
                    <line x1="100" y1="0" x2="100" y2="78" />
                    <line x1="200" y1="0" x2="200" y2="78" />
                    <line x1="300" y1="0" x2="300" y2="78" />
                    <line x1="400" y1="0" x2="400" y2="78" />
                    <line x1="500" y1="0" x2="500" y2="78" />
                    <line x1="600" y1="0" x2="600" y2="78" />
                    <line x1="700" y1="0" x2="700" y2="78" />
                    <line x1="800" y1="0" x2="800" y2="78" />
                    <line x1="900" y1="0" x2="900" y2="78" />
                </g>
                <path
                    d={channel.path}
                    fill="none"
                    stroke="#f8fafc"
                    strokeWidth="1.4"
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    </div>
);

const Workspace = () => {
    const navigate = useNavigate();
    const {
        recordingName,
        isRealData,
        metadata,
        channels,
        averages,
        ratios,
        playing,
        reducedMotion,
        windowLabel,
        windowSeconds,
        isAnalyzing,
        hasReading,
        reading,
        useRealApi,
        togglePlay,
        cycleWindow,
        toggleApiMode,
        analyzeData
    } = useEEG();

    const playLabel = reducedMotion ? 'Advance' : (playing ? 'Pause trace' : 'Play trace');
    const ticks = Array.from({ length: 10 }, (_, i) => i < Math.round((reading?.confidence || 0) / 10));

    return (
        <main className="screen page-enter">
            <div className="session-bar">
                <div className="session-name">
                    <span className="kicker" style={{ letterSpacing: '0.1em' }}>Loaded recording</span>
                    <span className="session-title">{recordingName}</span>
                </div>
                {isRealData ? (
                    <span className="badge badge-real">Real data · {metadata?.source || 'research archive'}</span>
                ) : (
                    <span className="badge badge-synth">Synthetic · not a real brain</span>
                )}
                <span className="mono session-meta">
                    {metadata?.channels || '4 channels'} · {metadata?.samplingRate || '160 Hz'} · {windowSeconds} s window
                </span>
                <button type="button" className="btn btn-ghost btn-sm session-change" onClick={() => navigate('/load')}>
                    Change recording
                </button>
            </div>

            <section className="zone zone-raw" aria-labelledby="zone-raw">
                <div className="zone-head">
                    <span className="zone-num">01</span>
                    <div className="zone-copy">
                        <h2 id="zone-raw">The wave itself</h2>
                        <p>This is exactly what the sensors picked up, drawn on chart paper. Nothing has been measured or interpreted yet — it is just the wave.</p>
                    </div>
                    <div className="zone-actions">
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={togglePlay}
                            aria-pressed={reducedMotion ? undefined : playing}
                            style={{ minWidth: 104 }}
                        >
                            {playLabel}
                        </button>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={cycleWindow}>
                            Window: {windowLabel}
                        </button>
                    </div>
                </div>

                {reducedMotion && (
                    <p className="motion-note">
                        Your system asks for reduced motion, so the trace is held still. Use <strong>Advance</strong> to step through the recording.
                    </p>
                )}

                <div className="zone-body">
                    <div className="montage">
                        <div className="montage-inner">
                            {channels.map((channel) => (
                                <ChannelTrace key={channel.code} channel={channel} />
                            ))}
                            {hasReading && <div className="reading-bracket" aria-hidden="true" />}
                            <div className="montage-axis">
                                <div className="axis-label">time →</div>
                                <div className="axis-ticks">
                                    <span>0 s</span>
                                    <span>{Math.round(windowSeconds * 0.2)}</span>
                                    <span>{Math.round(windowSeconds * 0.4)}</span>
                                    <span>{Math.round(windowSeconds * 0.6)}</span>
                                    <span>{Math.round(windowSeconds * 0.8)}</span>
                                    <span>{windowSeconds} s</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="scale-notes">
                        <p>Vertical scale 50 µV per division</p>
                        <p>Grid 1 s × 25 µV</p>
                        {hasReading && <p>▮ Bracketed 4.2–6.4 s = the segment cited in panel 03</p>}
                    </div>
                </div>
            </section>

            <section className="zone zone-measured" aria-labelledby="zone-measured">
                <div className="zone-head">
                    <span className="zone-num">02</span>
                    <div className="zone-copy">
                        <h2 id="zone-measured">What we measured</h2>
                        <p>Now the arithmetic: how much of the wave above sits in each rhythm. These are plain measurements, not opinions, and you would get the same numbers every time.</p>
                    </div>
                </div>

                <div className="measure-grid">
                    <div className="band-table">
                        <div className="band-table-head">
                            <span>Band energy in this window</span>
                            <span>µV²</span>
                        </div>
                        {BANDS.map((band) => {
                            const value = averages[band.key];
                            return (
                                <div key={band.key} className={`band-row${band.key === 'alpha' ? ' is-alpha' : ''}`}>
                                    <div className="band-id">
                                        <span aria-hidden="true" className={`band-glyph glyph-${band.key}`}>{band.symbol}</span>
                                        <span>
                                            <strong>{band.name} — {band.short}</strong>
                                            <span className="band-range">{band.range} · {band.speed}</span>
                                        </span>
                                    </div>
                                    <div className="band-bar">
                                        <div className={band.fillClass} style={{ width: barWidth(value) }} />
                                        <span className="typical-mark" style={{ left: `${band.typical}%` }} aria-hidden="true" />
                                    </div>
                                    <span className="band-value">{value.toFixed(1)}</span>
                                </div>
                            );
                        })}
                        <p className="band-footnote">
                            Each bar carries its own fill pattern as well as its colour, so the bands stay distinguishable without relying on hue. The <span className="mono">┊</span> dotted mark is the typical level for a calm awake adult.
                        </p>
                    </div>

                    <div className="measure-side">
                        <div className="side-card">
                            <p className="kicker" style={{ letterSpacing: '0.1em', marginBottom: 12 }}>A few comparisons worth knowing</p>
                            <div className="ratio-row">
                                <span>Slow vs. fast <em>(theta ÷ beta)</em></span>
                                <strong className="mono">{ratios.thetaBeta.toFixed(2)}</strong>
                            </div>
                            <div className="ratio-row">
                                <span>Arousal <em>(beta ÷ alpha)</em></span>
                                <strong className="mono">{ratios.betaAlpha.toFixed(2)}</strong>
                            </div>
                            <div className="ratio-row last">
                                <span>Signal quality <em>(usable seconds)</em></span>
                                <strong className="mono">{metadata?.quality || reading?.quality || '—'}</strong>
                            </div>
                        </div>
                        <div className="side-card">
                            <p className="kicker" style={{ letterSpacing: '0.1em', marginBottom: 10 }}>How this was measured</p>
                            <p className="side-copy">If you are curious about the method: a Fourier transform over 2-second windows with 50 % overlap, averaged across the four sensors. Same recipe every time, and no model involved yet.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="zone zone-model" aria-labelledby="zone-model" data-dark="1">
                <div className="zone-head">
                    <span className="zone-num model-num">03</span>
                    <div className="zone-copy">
                        <h2 id="zone-model">What it might mean</h2>
                        <p>Here a language model reads those measurements and explains them in plain words. We keep this panel visibly separate from the data on purpose: it is a helpful suggestion that can be wrong, not a measurement.</p>
                    </div>
                </div>

                {!hasReading ? (
                    <div className="model-empty">
                        <div className="model-empty-box">
                            <p className="empty-lead">Ready when you are — the measurements above are all set.</p>
                            <p className="empty-copy">Only the numbers and comparisons go to the model, never your file. It comes back with a description, how sure it is, and the seconds it looked at.</p>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={analyzeData}
                                disabled={isAnalyzing}
                                style={{ fontWeight: 600, background: '#6366f1', borderColor: '#6366f1' }}
                            >
                                {isAnalyzing ? 'Reading the measurements…' : 'Tell me what this means'}
                            </button>
                            <button type="button" className="api-toggle" onClick={toggleApiMode}>
                                {useRealApi ? 'Using live DeepSeek-R1' : 'Using a local reading (no API)'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="reading-grid page-enter">
                            <div>
                                <p className="kicker" style={{ letterSpacing: '0.1em', marginBottom: 12 }}>Reading</p>
                                <p className="reading-headline">{reading.headline}</p>
                                <p className="reading-body">{reading.body}</p>
                                <div className="confidence">
                                    <p className="kicker" style={{ letterSpacing: '0.1em', marginBottom: 10 }}>Confidence</p>
                                    <div className="conf-row">
                                        <span className="conf-pct">{reading.confidence}%</span>
                                        <span className="conf-ticks" aria-hidden="true">
                                            {ticks.map((filled, i) => (
                                                <span key={i} className={`conf-tick${filled ? ' filled' : ''}`} />
                                            ))}
                                        </span>
                                        <span className="conf-word">
                                            {reading.confWord} — {ticks.filter(Boolean).length} of 10 blocks filled
                                        </span>
                                    </div>
                                    <p className="conf-note">This is simply how well the numbers match the pattern the model named. It is not a score for how healthy the recording is.</p>
                                </div>
                            </div>
                            <div className="reading-side">
                                <div className="evidence-card">
                                    <p className="kicker" style={{ letterSpacing: '0.1em', marginBottom: 12 }}>Why it thinks so</p>
                                    <ul>
                                        {(reading.evidence || []).map((item, i) => (
                                            <li key={i}>
                                                <span>{item.text}</span>
                                                <span className="mono evidence-range">{item.range}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="caveat-card">
                                    <p className="kicker caveat-kicker">What this cannot tell you</p>
                                    <ul>
                                        <li>Whether anything is medically wrong. There is no diagnosis in this output.</li>
                                        <li>What the person was thinking. Bands describe rhythm, not content.</li>
                                        <li>Anything about the seconds outside the window shown above.</li>
                                    </ul>
                                </div>
                                <div className="model-meta">
                                    <p>model: deepseek-r1 · temp 0.3</p>
                                    <p>input: 5 band values + 3 ratios</p>
                                    <p>data: {metadata?.provenance || (isRealData ? 'research archive' : 'synthetic sine mixture — no human subject')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="reading-actions">
                            <button type="button" className="btn-model" onClick={analyzeData} disabled={isAnalyzing}>
                                {isAnalyzing ? 'Reading…' : 'Run again'}
                            </button>
                            <button type="button" className="btn-model" onClick={() => navigate('/export')}>
                                Export signal + reading
                            </button>
                            <button type="button" className="btn-model" onClick={toggleApiMode}>
                                {useRealApi ? 'Using live API' : 'Using local reading'}
                            </button>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
};

export default Workspace;
