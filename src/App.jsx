import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Link } from 'react-router-dom';
import { EEGProvider } from './context/EEGContext';
import Overview from './components/Overview';
import LoadData from './components/LoadData';
import Workspace from './components/Workspace';
import BandReference from './components/BandReference';
import ExportView from './components/ExportView';
import About from './components/About';
import AuthModal from './components/AuthModal';
import './App.css';
import './components/MindSight.css';

const NAV = [
    { to: '/', label: 'Overview', end: true },
    { to: '/load', label: 'Load data' },
    { to: '/workspace', label: 'Workspace' },
    { to: '/reference', label: 'Band reference' },
    { to: '/export', label: 'Export' },
    { to: '/about', label: 'About' }
];

function AppShell() {
    return (
        <div className="app-shell">
            <header className="app-header">
                <div className="header-inner">
                    <Link to="/" className="brand">
                        <span className="brand-name">MindSight</span>
                        <span className="brand-tag">EEG viewer &amp; interpreter</span>
                    </Link>
                    <nav className="app-nav" aria-label="Main">
                        {NAV.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </header>

            <div className="app-main">
                <Routes>
                    <Route path="/" element={<Overview />} />
                    <Route path="/load" element={<LoadData />} />
                    <Route path="/workspace" element={<Workspace />} />
                    <Route path="/reference" element={<BandReference />} />
                    <Route path="/export" element={<ExportView />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </div>

            <footer className="app-footer">
                <p>
                    MindSight · a friendly EEG viewer for the curious. Not a medical device and not a diagnosis.
                    Sample data comes from public research archives.
                </p>
            </footer>

            <AuthModal />
        </div>
    );
}

function App() {
    return (
        <Router>
            <EEGProvider>
                <AppShell />
            </EEGProvider>
        </Router>
    );
}

export default App;
