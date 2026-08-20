export const CHANNELS = [
    { code: 'Fp1', plain: 'front left — near the eyes', seed: 0.7 },
    { code: 'C3', plain: 'motor strip, left side', seed: 2.1 },
    { code: 'C4', plain: 'motor strip, right side', seed: 3.9 },
    { code: 'O1', plain: 'back left — vision area', seed: 5.3 }
];

export const WINDOWS = ['10 s', '5 s', '30 s'];
export const WINDOW_SECONDS = [10, 5, 30];

export const BANDS = [
    {
        key: 'delta',
        symbol: 'δ',
        name: 'Delta',
        short: 'deep sleep',
        range: '0.5–4 Hz',
        speed: 'slowest',
        color: '#60a5fa',
        border: '#1d4ed8',
        typical: 28,
        fillClass: 'band-fill-delta',
        when: 'Deep, dreamless sleep. Plenty of it at night; a lot of it in a wide-awake adult is unusual and worth a second look.'
    },
    {
        key: 'theta',
        symbol: 'θ',
        name: 'Theta',
        short: 'drowsy, drifting',
        range: '4–8 Hz',
        speed: 'slow',
        color: '#c084fc',
        border: '#7e22ce',
        typical: 34,
        fillClass: 'band-fill-theta',
        when: 'Drifting off, light sleep, deep meditation — or that fuzzy moment right before you nod off in a lecture.'
    },
    {
        key: 'alpha',
        symbol: 'α',
        name: 'Alpha',
        short: 'calm, eyes closed',
        range: '8–13 Hz',
        speed: 'medium',
        color: '#34d399',
        border: '#059669',
        typical: 46,
        fillClass: 'band-fill-alpha',
        when: 'Awake but relaxed, especially with eyes closed. Strongest at the back of the head, over the visual areas — and it drops the moment you open your eyes.'
    },
    {
        key: 'beta',
        symbol: 'β',
        name: 'Beta',
        short: 'alert, thinking',
        range: '13–30 Hz',
        speed: 'fast',
        color: '#fbbf24',
        border: '#b45309',
        typical: 40,
        fillClass: 'band-fill-beta',
        when: 'Alert, concentrating, holding a conversation, planning a movement. Also rises with anxiety and some medications.'
    },
    {
        key: 'gamma',
        symbol: 'γ',
        name: 'Gamma',
        short: 'hard mental work',
        range: '30–100 Hz',
        speed: 'fastest',
        color: '#f472b6',
        border: '#be185d',
        typical: 14,
        fillClass: 'band-fill-gamma',
        when: 'Brief bursts during demanding mental work. Easily confused with muscle tension from the jaw or neck, so treat large gamma with suspicion.'
    }
];

export const PRESETS = {
    rest: {
        id: 'rest',
        name: 'Resting state, eyes closed',
        real: true,
        source: 'PhysioNet EEGMMIDB',
        provenance: 'PhysioNet EEGMMIDB, subject S004 (real)',
        scenario: 'Mental State Classification',
        samplingRate: '160 Hz',
        channels: '4 channels',
        duration: '10 s excerpt',
        description: 'The best place to begin: a calm, awake brain with a strong steady rhythm at the back of the head. 4 channels · 10 s excerpt · 160 Hz.',
        cta: 'Open recording →',
        bands: { delta: 9.4, theta: 14.2, alpha: 31.6, beta: 12.8, gamma: 3.1 },
        quality: '9.6 of 10 s',
        conf: 82,
        confWord: 'High',
        headline: 'A calm, awake brain with the eyes closed.',
        body: 'Alpha rhythm dominates and is strongest at the back of the head, which is what you expect from someone resting quietly with their eyes shut. Fast beta activity is low, so the person does not appear to be concentrating on a task. Nothing in the window looks unusual for a healthy adult at rest.',
        evidence: [
            { text: 'Alpha energy is the largest of the five bands and peaks on channel O1, over the visual areas.', range: '4.2 – 6.4 s · O1' },
            { text: 'Beta stays low and steady, with no bursts suggesting effort or agitation.', range: 'whole window · all channels' },
            { text: 'Slow-versus-fast ratio of 1.11 sits inside the usual awake resting range.', range: 'derived from panel 02' }
        ]
    },
    motor: {
        id: 'motor',
        name: 'Imagining a hand movement',
        real: true,
        source: 'PhysioNet EEGMMIDB',
        provenance: 'PhysioNet EEGMMIDB, motor imagery task (real)',
        scenario: 'Motor Imagery Task',
        samplingRate: '160 Hz',
        channels: '4 channels',
        duration: '10 s',
        description: 'Someone imagines squeezing their hand — and the rhythm over the movement area quietly drops while they do it. Fun to spot. 4 channels · 10 s · 160 Hz.',
        cta: 'Open recording →',
        bands: { delta: 8.1, theta: 11.5, alpha: 18.3, beta: 24.7, gamma: 5.8 },
        quality: '9.1 of 10 s',
        conf: 68,
        confWord: 'Moderate',
        headline: 'Motor areas look active, consistent with imagined movement.',
        body: 'The rhythm over the left motor strip drops away in the middle of the window while beta rises — the pattern normally seen when someone plans or imagines a movement rather than resting. The effect is clearer on C3 than C4, which fits an imagined right-hand movement, but a single 10-second window is thin evidence.',
        evidence: [
            { text: 'Alpha falls on C3 while C4 holds steady — a side difference over the motor strip.', range: '4.2 – 6.4 s · C3 vs C4' },
            { text: 'Beta energy is the largest band in this window, unusual for a resting recording.', range: 'whole window' },
            { text: 'Arousal ratio of 1.35 indicates an engaged rather than resting state.', range: 'derived from panel 02' }
        ]
    },
    demo: {
        id: 'demo',
        name: 'Practice signal (not a real brain)',
        real: false,
        source: 'generated',
        provenance: 'synthetic sine mixture — no human subject',
        scenario: 'Mixed Activity',
        samplingRate: '250 Hz',
        channels: '4 channels',
        duration: 'practice',
        description: 'Made-up waves for getting comfortable with the controls. Great for exploring, but it says nothing about any real person.',
        cta: 'Try the practice signal →',
        bands: { delta: 20.5, theta: 15.1, alpha: 22.4, beta: 28.9, gamma: 9.7 },
        quality: '10 of 10 s',
        conf: 41,
        confWord: 'Low',
        headline: 'A mixture of every band at once — no real brain state to name.',
        body: 'This signal was generated from sine waves of similar size in every band, so it has no physiological story behind it. The model can describe the numbers but there is nothing to interpret. Load one of the real recordings to see a reading worth reading.',
        evidence: [
            { text: 'No band clearly dominates, which does not match any documented resting or task state.', range: 'whole window' },
            { text: 'Band energies are unnaturally steady over time — real EEG fluctuates far more.', range: 'whole window' },
            { text: 'Marked synthetic at the source, so physiological interpretation is not appropriate.', range: 'provenance flag' }
        ]
    }
};

export function bandWeights(bands) {
    return {
        d: bands.delta / 22,
        t: bands.theta / 22,
        a: bands.alpha / 22,
        b: bands.beta / 22,
        g: bands.gamma / 22
    };
}

export function buildTracePath(seed, weights, phase, width = 1000, height = 78, motorC3 = false) {
    const w = motorC3 ? { ...weights, a: weights.a * 0.45, b: weights.b * 1.3 } : weights;
    const n = 220;
    const mid = height / 2;
    const k = height / 78;
    let d = '';
    for (let i = 0; i <= n; i++) {
        const x = (i / n) * width;
        const u = (i / n) * 60 + phase;
        const v =
            Math.sin(u * 0.55 + seed) * 6 * w.d +
            Math.sin(u * 1.15 + seed * 1.7) * 5 * w.t +
            Math.sin(u * 2.6 + seed * 0.6) * 5.2 * w.a +
            Math.sin(u * 5.4 + seed * 2.3) * 2.6 * w.b +
            Math.sin(u * 11.5 + seed * 3.1) * 1.1 * w.g +
            Math.sin(u * 17.3 + seed * 4.4) * 0.5;
        const y = Math.max(3, Math.min(height - 3, mid - v * k));
        d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    return d.trim();
}

export function nextBrainSample(time, bands) {
    return {
        time,
        delta: bands.delta + Math.sin(time * 0.03) * 2.2 + Math.random() * 1.1,
        theta: bands.theta + Math.sin(time * 0.07 + 1) * 2.0 + Math.random() * 1.0,
        alpha: bands.alpha + Math.sin(time * 0.1 + 0.4) * 2.8 + Math.random() * 1.3,
        beta: bands.beta + Math.sin(time * 0.05 + 1.2) * 2.1 + Math.random() * 1.1,
        gamma: bands.gamma + Math.sin(time * 0.15 + 2) * 1.0 + Math.random() * 0.7
    };
}

export function generateBrainData(bands, samples = 100) {
    const data = [];
    for (let i = 0; i < samples; i++) {
        data.push(nextBrainSample(i, bands));
    }
    return data;
}

export function computeAverages(data) {
    const empty = { delta: 0, theta: 0, alpha: 0, beta: 0, gamma: 0 };
    if (!data || data.length === 0) return empty;
    const sum = data.reduce((acc, point) => {
        acc.delta += Number(point.delta) || 0;
        acc.theta += Number(point.theta) || 0;
        acc.alpha += Number(point.alpha) || 0;
        acc.beta += Number(point.beta) || 0;
        acc.gamma += Number(point.gamma) || 0;
        return acc;
    }, { ...empty });
    const n = data.length;
    return {
        delta: sum.delta / n,
        theta: sum.theta / n,
        alpha: sum.alpha / n,
        beta: sum.beta / n,
        gamma: sum.gamma / n
    };
}

export function computeRatios(averages) {
    const safe = (a, b) => (b && b !== 0 ? a / b : 0);
    return {
        thetaBeta: safe(averages.theta, averages.beta),
        betaAlpha: safe(averages.beta, averages.alpha),
        alphaTheta: safe(averages.alpha, averages.theta)
    };
}

export function barWidth(value, max = 40) {
    return `${Math.min(100, (value / max) * 100).toFixed(1)}%`;
}

export function confidenceWord(pct) {
    if (pct >= 75) return 'High';
    if (pct >= 50) return 'Moderate';
    return 'Low';
}

export function prefersReducedMotion() {
    try {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
        return false;
    }
}
