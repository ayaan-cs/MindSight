import React from 'react';
import { BANDS } from '../eeg/signal';

const BandReference = () => (
    <main className="screen page-enter">
        <section className="sheet sheet-pad">
            <p className="kicker" style={{ marginBottom: 12 }}>Reference</p>
            <h1 className="section-title">The five brain rhythms, in plain words</h1>
            <p className="lede">
                Brain waves are grouped by how fast they wiggle. Faster usually means a more engaged brain, slower means a more restful or sleeping one. None of them is good or bad on its own — you have all five, all the time.
            </p>

            <div className="ref-table">
                <div className="ref-row ref-head">
                    <span className="ref-band">Band</span>
                    <span className="ref-speed">Speed</span>
                    <span className="ref-when">When you tend to see a lot of it</span>
                </div>
                {BANDS.map((band) => (
                    <div key={band.key} className={`ref-row${band.key === 'alpha' ? ' is-alpha' : ''}`}>
                        <span className="ref-band">
                            <span aria-hidden="true" className={`band-glyph glyph-${band.key}`}>{band.symbol}</span>
                            <span style={{ fontSize: 15, fontWeight: 600 }}>{band.name}</span>
                        </span>
                        <span className="ref-speed mono">{band.range}</span>
                        <span className="ref-when">{band.when}</span>
                    </div>
                ))}
            </div>
            <p className="lede" style={{ marginTop: 16, fontSize: 14 }}>
                Wherever these show up in MindSight, each rhythm keeps the same symbol, colour and fill pattern, so you can always tell them apart — colour or no colour.
            </p>
        </section>
    </main>
);

export default BandReference;
