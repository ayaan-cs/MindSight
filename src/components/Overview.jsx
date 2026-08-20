import React from 'react';
import { Link } from 'react-router-dom';
import { BANDS } from '../eeg/signal';
import { useEEG } from '../context/EEGContext';

const Overview = () => {
    const { heroTrace, reducedMotion } = useEEG();

    return (
        <main className="screen page-enter">
            <section className="sheet sheet-pad-lg">
                <p className="kicker" style={{ marginBottom: 22 }}>A gentle introduction to brain waves</p>
                <h1 className="hero-title">See what a brain recording actually looks like — and what it means.</h1>
                <div className="hero-copy">
                    <p>EEG is just the electrical chatter of a brain, picked up by sensors resting on the scalp. MindSight draws it the way clinicians read it, measures the rhythms hiding inside it, and then explains what those numbers suggest — in ordinary words.</p>
                    <p>You do not need any background to start. If you have ever wondered what those squiggles actually mean, you are exactly who this was built for.</p>
                </div>
                <div className="hero-actions">
                    <Link to="/load" className="btn btn-primary">Show me a recording →</Link>
                    <Link to="/reference" className="btn btn-ghost">Explain the rhythms first</Link>
                </div>
            </section>

            <section className="sheet" style={{ padding: '0 40px 40px' }}>
                <div className="trace-caption-row">
                    <p className="kicker" style={{ letterSpacing: '0.1em' }}>Here is what ten seconds of a resting brain looks like</p>
                    <p className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {reducedMotion ? 'held still — reduced motion is on' : 'alpha rhythm, eyes closed'}
                    </p>
                </div>
                <div className="trace-frame">
                    <svg
                        viewBox="0 0 1200 260"
                        preserveAspectRatio="none"
                        className="hero-trace"
                        role="img"
                        aria-label="Sample EEG trace from channel O1: a steady alpha rhythm recorded over ten seconds."
                    >
                        <g stroke="#24314d" strokeWidth="1" vectorEffect="non-scaling-stroke">
                            <line x1="0" y1="32.5" x2="1200" y2="32.5" />
                            <line x1="0" y1="97.5" x2="1200" y2="97.5" />
                            <line x1="0" y1="162.5" x2="1200" y2="162.5" />
                            <line x1="0" y1="227.5" x2="1200" y2="227.5" />
                            <line x1="60" y1="0" x2="60" y2="260" />
                            <line x1="180" y1="0" x2="180" y2="260" />
                            <line x1="300" y1="0" x2="300" y2="260" />
                            <line x1="420" y1="0" x2="420" y2="260" />
                            <line x1="540" y1="0" x2="540" y2="260" />
                            <line x1="660" y1="0" x2="660" y2="260" />
                            <line x1="780" y1="0" x2="780" y2="260" />
                            <line x1="900" y1="0" x2="900" y2="260" />
                            <line x1="1020" y1="0" x2="1020" y2="260" />
                            <line x1="1140" y1="0" x2="1140" y2="260" />
                        </g>
                        <g stroke="#33415e" strokeWidth="1" vectorEffect="non-scaling-stroke">
                            <line x1="0" y1="130" x2="1200" y2="130" />
                            <line x1="120" y1="0" x2="120" y2="260" />
                            <line x1="360" y1="0" x2="360" y2="260" />
                            <line x1="600" y1="0" x2="600" y2="260" />
                            <line x1="840" y1="0" x2="840" y2="260" />
                            <line x1="1080" y1="0" x2="1080" y2="260" />
                        </g>
                        <path
                            className="trace-draw"
                            d={heroTrace}
                            pathLength="1000"
                            fill="none"
                            stroke="#f8fafc"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="time-axis">
                        <span>0 s</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10 s</span>
                    </div>
                </div>
                <div className="band-legend">
                    <span className="kicker" style={{ letterSpacing: '0.1em' }}>The five rhythms hiding inside it</span>
                    {BANDS.map((band) => (
                        <span key={band.key} className="band-legend-item">
                            <span aria-hidden="true" className={`band-swatch swatch-${band.key}`} />
                            <span className="mono" style={{ color: band.color }}>{band.symbol}</span>
                            <span>{band.name} {band.range}</span>
                        </span>
                    ))}
                </div>
            </section>

            <section className="sheet" style={{ padding: '0 40px 44px' }}>
                <div className="steps">
                    <div className="step">
                        <p className="step-num">01</p>
                        <h2>Start with a recording</h2>
                        <p>Borrow one of ours, or bring your own <span className="mono" style={{ fontSize: 13 }}>.edf</span> / <span className="mono" style={{ fontSize: 13 }}>.csv</span> file. There is also a practice signal if you just want to poke around first — no commitment.</p>
                    </div>
                    <div className="step">
                        <p className="step-num">02</p>
                        <h2>Look at the wave, then the numbers</h2>
                        <p>The wave itself stays in plain ink, untouched, so you can trust it. Everything the computer worked out from it sits just below in its own colour-coded panel — always kept separate, so you can always tell the two apart.</p>
                    </div>
                    <div className="step">
                        <p className="step-num">03</p>
                        <h2>See what it might mean</h2>
                        <p>You get a plain-language reading, how sure the model is, the exact seconds it looked at, and an honest list of what it cannot tell you.</p>
                    </div>
                </div>
            </section>

            <section className="sheet disclaimer">
                <span className="badge badge-warn">Not a medical device</span>
                <p>Nothing here is a diagnosis, and it is fine to be curious without worrying about that. Sample recordings come from public research archives; the practice signal is generated and clearly labelled wherever it appears.</p>
            </section>
        </main>
    );
};

export default Overview;
