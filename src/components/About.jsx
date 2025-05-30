import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './About.css';

const About = () => {
    const form = useRef();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    // EmailJS configuration - Replace with your actual values
    const EMAILJS_CONFIG = {
        SERVICE_ID: 'your_service_id', // Replace with your EmailJS service ID
        TEMPLATE_ID: 'your_template_id', // Replace with your EmailJS template ID
        PUBLIC_KEY: 'your_public_key' // Replace with your EmailJS public key
    };

    const sendEmail = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        emailjs.sendForm(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            form.current,
            EMAILJS_CONFIG.PUBLIC_KEY
        )
            .then((result) => {
                console.log('Email sent successfully:', result.text);
                setSubmitStatus('success');
                setIsSubmitting(false);
                form.current.reset(); // Clear the form
            })
            .catch((error) => {
                console.error('Email sending failed:', error.text);
                setSubmitStatus('error');
                setIsSubmitting(false);
            });
    };

    const getStatusMessage = () => {
        if (submitStatus === 'success') {
            return (
                <div className="status-message success">
                    ✅ Thank you! Your message has been sent successfully. We'll get back to you soon.
                </div>
            );
        } else if (submitStatus === 'error') {
            return (
                <div className="status-message error">
                    ❌ Sorry, there was an error sending your message. Please try again or contact us directly via LinkedIn.
                </div>
            );
        }
        return null;
    };

    return (
        <div className="about-page">
            <div className="about-hero">
                <div className="hero-content">
                    <h1>About MindSight</h1>
                    <p className="hero-subtitle">
                        Advanced neuroscience platform combining authentic research-grade EEG data
                        with cutting-edge AI analysis for education and research
                    </p>
                </div>
            </div>

            <div className="about-content">
                <section className="project-overview">
                    <h2>Project Overview</h2>
                    <p>
                        <strong>MindSight</strong> is a comprehensive neuroscience platform that bridges the gap between
                        educational demonstrations and research-grade analysis. Our dual-platform architecture allows
                        users to experience both synthetic educational data and authentic medical datasets from major
                        research institutions.
                    </p>

                    <div className="research-highlight">
                        <h3>🔬 Dual-Platform Architecture</h3>
                        <p>
                            Experience both educational demonstrations and research-grade analysis in one comprehensive platform.
                            Switch between modes to compare synthetic educational data with authentic medical datasets.
                        </p>
                    </div>
                </section>

                <section className="features-section">
                    <h2>Core Features</h2>
                    <div className="features-grid">
                        <div className="feature-item">
                            <h4>🧠 Authentic Medical Data Integration</h4>
                            <ul>
                                <li>PhysioNet Medical Database</li>
                                <li>OpenNeuro Research Archive</li>
                                <li>Kaggle Scientific Datasets</li>
                            </ul>
                            <p>Real EEG datasets from motor imagery, sleep studies, mental state classification, and emotion recognition research.</p>
                        </div>

                        <div className="feature-item">
                            <h4>🤖 Advanced AI Medical Intelligence</h4>
                            <ul>
                                <li>Enhanced DeepSeek-R1 with specialized neuroscience knowledge</li>
                                <li>Scenario-specific analysis with medical terminology</li>
                                <li>Clinical significance assessment with therapeutic context</li>
                                <li>Pattern detection for ERD, sleep stages, ADHD markers</li>
                            </ul>
                        </div>

                        <div className="feature-item">
                            <h4>📊 Professional Research Features</h4>
                            <ul>
                                <li>Medical-grade confidence scoring and normal range comparisons</li>
                                <li>Comprehensive clinical reports with research context</li>
                                <li>Data export capabilities for external analysis tools</li>
                                <li>Educational content for medical students and professionals</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="applications-section">
                    <h2>🎓 Applications & Use Cases</h2>
                    <div className="applications-grid">
                        <div className="app-item">
                            <strong>🏥 Medical Education</strong>
                            <p>Neuroscience course integration with authentic research data and medical student training with real clinical patterns.</p>
                        </div>
                        <div className="app-item">
                            <strong>🔬 Research & Development</strong>
                            <p>EEG analysis method validation, brain-computer interface development, and neurofeedback therapy research.</p>
                        </div>
                        <div className="app-item">
                            <strong>👨‍⚕️ Clinical Training</strong>
                            <p>Sleep disorder diagnosis, motor rehabilitation assessment, and attention deficit evaluation.</p>
                        </div>
                        <div className="app-item">
                            <strong>🧪 Algorithm Testing</strong>
                            <p>Synthetic data provides foundation for hardware integration and method validation before live EEG implementation.</p>
                        </div>
                    </div>
                </section>

                <section className="platform-comparison">
                    <h2>⚖️ Platform Comparison</h2>
                    <div className="comparison-table">
                        <div className="comparison-header">
                            <div className="feature-col">Feature</div>
                            <div className="original-col">Original Platform</div>
                            <div className="research-col">Research Platform</div>
                        </div>

                        <div className="comparison-row">
                            <div className="feature-col">Data Source</div>
                            <div className="original-col">Synthetic educational data</div>
                            <div className="research-col">Authentic PhysioNet datasets</div>
                        </div>

                        <div className="comparison-row">
                            <div className="feature-col">Analysis</div>
                            <div className="original-col">AI pattern recognition</div>
                            <div className="research-col">FFT + spectral + medical AI</div>
                        </div>

                        <div className="comparison-row">
                            <div className="feature-col">Reporting</div>
                            <div className="original-col">Basic insights</div>
                            <div className="research-col">Clinical PDF reports</div>
                        </div>

                        <div className="comparison-row">
                            <div className="feature-col">Use Case</div>
                            <div className="original-col">Education & demonstration</div>
                            <div className="research-col">Research & clinical training</div>
                        </div>
                    </div>
                </section>

                <section className="data-sources-section">
                    <h2>🔮 Data Sources & Future Integration</h2>

                    <div className="data-highlight">
                        <h3>📊 Current: Research Data Platform</h3>
                        <p>
                            <strong>Authentic Medical Data:</strong> MindSight processes real EEG recordings from major medical institutions,
                            university research labs, and peer-reviewed scientific studies.
                        </p>
                    </div>

                    <div className="synthetic-explanation">
                        <h3>🎓 Educational Foundation</h3>
                        <p>
                            <strong>Synthetic Educational Data:</strong> For demonstration and learning purposes, MindSight generates
                            realistic brain wave patterns based on established medical literature. This synthetic data serves as the foundation for:
                        </p>
                        <ul>
                            <li>🎓 Educational demonstrations before implementing real hardware</li>
                            <li>🧪 Algorithm testing and validation</li>
                            <li>🎨 User interface development and training</li>
                            <li>🔌 Future integration with live EEG acquisition systems</li>
                        </ul>
                    </div>

                    <div className="roadmap">
                        <h3>🚀 Development Roadmap</h3>
                        <div className="roadmap-grid">
                            <div className="phase">
                                <strong>Phase 1: Current ✅</strong>
                                <p>Research data platform with authentic medical database integration and advanced AI analysis</p>
                            </div>
                            <div className="phase">
                                <strong>Phase 2: Hardware 🔄</strong>
                                <p>Real-time EEG connectivity (OpenBCI, Muse, NeuroSky) with direct brain signal acquisition</p>
                            </div>
                            <div className="phase">
                                <strong>Phase 3: Clinical 🔮</strong>
                                <p>Medical device integration, therapeutic neurofeedback, and professional diagnostic support</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="tech-stack">
                    <h2>🛠️ Enhanced Technology Stack</h2>
                    <div className="tech-grid">
                        <div className="tech-category">
                            <h4>🎨 Frontend Framework</h4>
                            <ul>
                                <li><span className="tech-label">React 18:</span> Modern component-based architecture</li>
                                <li><span className="tech-label">Recharts:</span> Professional data visualization library</li>
                                <li><span className="tech-label">CSS3:</span> Medical-grade user interface design</li>
                            </ul>
                        </div>

                        <div className="tech-category">
                            <h4>🤖 AI & Machine Learning</h4>
                            <ul>
                                <li><span className="tech-label">DeepSeek-R1:</span> Enhanced with medical intelligence via Hugging Face</li>
                                <li><span className="tech-label">Pattern Recognition:</span> Advanced statistical analysis for EEG patterns</li>
                                <li><span className="tech-label">Medical Knowledge:</span> Specialized neuroscience prompt engineering</li>
                            </ul>
                        </div>

                        <div className="tech-category">
                            <h4>📊 Data Processing & Integration</h4>
                            <ul>
                                <li><span className="tech-label">Multi-format Parser:</span> PhysioNet EDF, CSV, research formats</li>
                                <li><span className="tech-label">Real-time Processing:</span> Advanced statistics and frequency analysis</li>
                                <li><span className="tech-label">Data Validation:</span> Research-grade quality assessment</li>
                            </ul>
                        </div>

                        <div className="tech-category">
                            <h4>🗃️ Research Database Integration</h4>
                            <ul>
                                <li><span className="tech-label">PhysioNet API:</span> Direct medical research database access</li>
                                <li><span className="tech-label">OpenNeuro:</span> Neuroscience research data compatibility</li>
                                <li><span className="tech-label">Kaggle Datasets:</span> Scientific EEG study data processing</li>
                            </ul>
                        </div>

                        <div className="tech-category">
                            <h4>📄 Export & Analysis Tools</h4>
                            <ul>
                                <li><span className="tech-label">PDF Reports:</span> Clinical-grade analysis documentation</li>
                                <li><span className="tech-label">Data Export:</span> CSV/JSON formats for external tools</li>
                                <li><span className="tech-label">Citations:</span> Proper research attribution and references</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="team-section">
                    <div className="section-header">
                        <h2>👨‍💻 Development Team</h2>
                        <p className="section-subtitle">
                            Meet the passionate developers behind MindSight, combining expertise in neuroscience
                            and cutting-edge technology to advance brain analysis tools.
                        </p>
                    </div>

                    <div className="team-grid">
                        <div className="team-card">
                            <div className="member-avatar">👨‍💻</div>
                            <h3 className="member-name">Ayaan A. Syed</h3>
                            <div className="member-role">Full-Stack Developer & Creator</div>
                            <p className="member-description">
                                Full-stack developer and creator of MindSight. Passionate about the
                                intersection of neuroscience and technology. Envisioned and developed
                                MindSight to provide advanced EEG analysis tools for education and research.
                            </p>
                            <div className="member-links">
                                <a href="https://github.com/ayaan-cs" target="_blank" rel="noopener noreferrer" className="member-link">
                                    <span className="link-icon">📱</span>
                                    GitHub
                                </a>
                                <a href="http://www.linkedin.com/in/ayaan-syed" target="_blank" rel="noopener noreferrer" className="member-link">
                                    <span className="link-icon">💼</span>
                                    LinkedIn
                                </a>
                            </div>
                        </div>

                        <div className="team-card">
                            <div className="member-avatar">👨‍🔬</div>
                            <h3 className="member-name">Zaayan M. Javed</h3>
                            <div className="member-role">Full-Stack Developer</div>
                            <p className="member-description">
                                Guh
                            </p>
                            <div className="member-links">
                                <a href="https://github.com/ZaayanJ" target="_blank" rel="noopener noreferrer" className="member-link">
                                    <span class="link-icon">📱</span>
                                    GitHub
                                </a>
                                <a href="https://www.linkedin.com/in/zaayan-javed/" target="_blank" rel="noopener noreferrer" className="member-link">
                                    <span className="link-icon">💼</span>
                                    LinkedIn
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="open-source-section">
                    <h2>🌟 Open Source & Collaboration</h2>
                    <div className="open-source-content">
                        <p>
                            MindSight is developed as an open-source project to advance neuroscience education and research.
                            We welcome contributions from developers, researchers, and clinicians who share our vision of
                            making advanced brain analysis tools accessible to everyone.
                        </p>

                        <div className="contribution-areas">
                            <h3>Ways to Contribute:</h3>
                            <ul>
                                <li>🔧 <strong>Code Contributions:</strong> Feature development, bug fixes, performance improvements</li>
                                <li>📊 <strong>Data Science:</strong> New analysis algorithms, ML model improvements</li>
                                <li>🏥 <strong>Medical Expertise:</strong> Clinical validation, medical terminology, use case refinement</li>
                                <li>📚 <strong>Documentation:</strong> User guides, API documentation, tutorials</li>
                                <li>🎨 <strong>Design:</strong> UI/UX improvements, accessibility enhancements</li>
                                <li>🧪 <strong>Testing:</strong> Quality assurance, user experience testing</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="contact-section">
                    <h2>📞 Get In Touch</h2>
                    <div className="contact-intro">
                        <p>
                            Have questions, suggestions, or want to collaborate on MindSight?
                            We'd love to hear from you! Whether you're a researcher, clinician,
                            developer, or just curious about neuroscience technology.
                        </p>
                    </div>

                    <div className="contact-container">
                        <div className="contact-form-section">
                            <div className="contact-form">
                                <h3>Send a Message</h3>
                                <form className="message-form" onSubmit={(e) => {
                                    e.preventDefault();
                                    alert('Thank you for your message! This is a demo form. Please use the LinkedIn or GitHub links to contact us directly.');
                                }}>
                                    <div className="form-group">
                                        <label htmlFor="name">Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            placeholder="your.email@example.com"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="subject">Subject *</label>
                                        <select id="subject" name="subject" required>
                                            <option value="">Select a topic...</option>
                                            <option value="collaboration">🤝 Collaboration Opportunity</option>
                                            <option value="research">🔬 Research Partnership</option>
                                            <option value="clinical">🏥 Clinical Implementation</option>
                                            <option value="technical">🔧 Technical Question</option>
                                            <option value="bug">🐛 Bug Report</option>
                                            <option value="feature">💡 Feature Request</option>
                                            <option value="education">🎓 Educational Use</option>
                                            <option value="other">💬 Other</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="organization">Organization (Optional)</label>
                                        <input
                                            type="text"
                                            id="organization"
                                            name="organization"
                                            placeholder="University, Hospital, Company, etc."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="message">Message *</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows="5"
                                            placeholder="Tell us about your project, question, or how you'd like to collaborate..."
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="send-button">
                                        <span className="button-icon">📧</span>
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="contact-info-section">
                            <div className="contact-methods">
                                <h3>Other Ways to Connect</h3>

                                <div className="contact-method">
                                    <div className="method-icon">💼</div>
                                    <div className="method-content">
                                        <h4>Professional Network</h4>
                                        <p>Connect on LinkedIn for professional discussions and updates</p>
                                        <a href="http://www.linkedin.com/in/ayaan-syed" target="_blank" rel="noopener noreferrer" className="contact-link">
                                            LinkedIn Profile
                                        </a>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <div className="method-icon">👨‍💻</div>
                                    <div className="method-content">
                                        <h4>Open Source Contributions</h4>
                                        <p>Contribute to the project or report issues on GitHub</p>
                                        <a href="https://github.com/ayaan-cis" target="_blank" rel="noopener noreferrer" className="contact-link">
                                            GitHub Repository
                                        </a>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <div className="method-icon">🔬</div>
                                    <div className="method-content">
                                        <h4>Research Collaboration</h4>
                                        <p>Interested in joint research or academic partnerships</p>
                                        <span className="contact-note">Use the contact form for research inquiries</span>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <div className="method-icon">🏥</div>
                                    <div className="method-content">
                                        <h4>Clinical Implementation</h4>
                                        <p>Exploring MindSight for clinical or educational use</p>
                                        <span className="contact-note">Contact us to discuss implementation</span>
                                    </div>
                                </div>
                            </div>

                            <div className="response-info">
                                <h4>📬 Response Times</h4>
                                <ul>
                                    <li><strong>General inquiries:</strong> 24-48 hours</li>
                                    <li><strong>Research partnerships:</strong> 2-3 business days</li>
                                    <li><strong>Technical issues:</strong> Same day (if urgent)</li>
                                    <li><strong>Bug reports:</strong> 24 hours</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="contact-footer">
                        <div className="footer-note">
                            <p>
                                <strong>🌍 Open to Global Collaboration:</strong> We welcome partnerships
                                with researchers, clinicians, and developers worldwide. MindSight is designed
                                to advance neuroscience education and research across all institutions.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;