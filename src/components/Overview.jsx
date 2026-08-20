import React from 'react';
import { Link } from 'react-router-dom';
import { BANDS } from '../eeg/signal';
import { useEEG } from '../context/EEGContext';
import BandChart from './BandChart';

const Overview = () => {
    const { chartData, reducedMotion } = useEEG();

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
                        {reducedMotion ? 'held still — reduced motion is on' : 'five frequency bands, live'}
                    </p>
                </div>
                <div className="trace-frame">
                    <BandChart data={chartData} height={280} showLegend={false} className="hero" />
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
