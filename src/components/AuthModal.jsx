import React from 'react';
import { useEEG } from '../context/EEGContext';

const AuthModal = () => {
    const { needsAuthentication, setNeedsAuthentication, handleAuthentication } = useEEG();
    const [token, setToken] = React.useState('');

    if (!needsAuthentication) return null;

    return (
        <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <div className="auth-modal-content">
                <h3 id="auth-title">DeepSeek-R1 API authentication</h3>
                <p>Enter your Hugging Face API token to use the live model. Only band measurements are sent — never the file itself.</p>
                <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Hugging Face API token"
                    className="auth-input"
                />
                <div className="auth-buttons">
                    <button className="btn btn-ghost btn-sm" type="button" onClick={() => setNeedsAuthentication(false)}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary btn-sm"
                        type="button"
                        onClick={() => handleAuthentication(token)}
                        disabled={!token}
                    >
                        Authenticate
                    </button>
                </div>
                <p className="auth-note">This token is stored only for this browser session.</p>
            </div>
        </div>
    );
};

export default AuthModal;
