import React from 'react';
import { useEEG } from '../context/EEGContext';

const ExportView = () => {
    const { exportAsCSV, exportAsJSON, exportAsPDF, hasReading, recordingName, isRealData, metadata } = useEEG();

    return (
        <main className="screen page-enter">
            <section className="sheet sheet-pad">
                <p className="kicker" style={{ marginBottom: 12 }}>Export</p>
                <h1 className="section-title">Take it all with you</h1>
                <p className="lede">
                    Every download says where the signal came from and whether it was a real brain or a practice signal, so nothing can be mistaken for something it is not.
                </p>
                <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>
                    Current recording: {recordingName} · {isRealData ? metadata?.source || 'research data' : 'synthetic · not a real brain'}
                </p>

                <div className="card-grid" style={{ marginTop: 28 }}>
                    <div className="export-card">
                        <span className="mono" style={{ fontSize: 13, color: 'var(--muted)' }}>CSV</span>
                        <strong>Raw samples</strong>
                        <p>One row per sample, one column per band, in µV². What panel 01 draws from.</p>
                        <button type="button" className="btn btn-primary btn-sm" onClick={exportAsCSV}>Download .csv</button>
                    </div>
                    <div className="export-card">
                        <span className="mono" style={{ fontSize: 13, color: 'var(--muted)' }}>JSON</span>
                        <strong>Measurements</strong>
                        <p>Band energies, ratios and the analysis settings from panel 02, with provenance.</p>
                        <button type="button" className="btn btn-primary btn-sm" onClick={exportAsJSON}>Download .json</button>
                    </div>
                    <div className="export-card">
                        <span className="mono" style={{ fontSize: 13, color: 'var(--muted)' }}>PDF</span>
                        <strong>Printed report</strong>
                        <p>Trace, measurements and the model&apos;s reading with its caveats — in that order, on one sheet.</p>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={exportAsPDF}
                            disabled={!hasReading}
                        >
                            {hasReading ? 'Build report' : 'Run a reading first'}
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ExportView;
