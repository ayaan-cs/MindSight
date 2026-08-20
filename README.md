# MindSight

<p align="center">
  <img src="images/mindsight-logo.png" alt="MindSight Logo" width="300">
</p>

## EEG viewer and interpreter

MindSight is a web app for looking at a brain recording the way a clinician reads chart paper, measuring the rhythms inside it, and then asking a language model what those numbers might suggest — in ordinary words.

It is one workspace, not two products. You can borrow a public research sample, try a labelled practice signal, or drop your own file. Nothing here is a diagnosis, and MindSight is not a medical device.

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Hugging Face](https://img.shields.io/badge/Hugging%20Face-API-FFD21E?logo=huggingface&logoColor=white)](https://huggingface.co/)
[![DeepSeek-R1](https://img.shields.io/badge/DeepSeek--R1-AI%20Model-6366F1)](https://huggingface.co/)
[![Demo](https://img.shields.io/badge/Live-Demo-FF5757)](https://mindsight-demo.netlify.app/)

## How a reading is organised

The workspace keeps three kinds of information visibly separate:

1. **The wave itself** — what the sensors picked up, drawn on chart paper. Nothing has been measured or interpreted yet.
2. **What we measured** — how much of that wave sits in each rhythm. These are plain numbers, the same every time.
3. **What it might mean** — a language model reads those numbers and explains them. The panel is kept apart on purpose: it is a suggestion that can be wrong, not a measurement.

Only the band values and ratios go to the model, never the file.

## Features

- **One merged viewer** for sample recordings, uploads, measurements, and interpretation.
- **Pattern-coded brain rhythms.** Delta, theta, alpha, beta, and gamma keep the same symbol, colour, and fill so they stay distinguishable without relying on hue.
- **Plain-language labels** for channels, ratios, and caveats.
- **Optional DeepSeek-R1 reading** with confidence, evidence, and a list of what the output cannot tell you.
- **Data you can borrow or bring:** PhysioNet-style resting-state and motor-imagery excerpts, a labelled practice signal, or a local `.csv` / `.edf` / `.json` file.
- **Export with provenance.** CSV, JSON, and a printed report that always say whether the signal was a real brain or generated.

## Brain rhythms

| Band | Frequency | In plain words |
|------|-----------|----------------|
| Delta | 0.5–4 Hz | Deep, dreamless sleep |
| Theta | 4–8 Hz | Drowsy, drifting, light sleep |
| Alpha | 8–13 Hz | Calm and awake, especially with eyes closed |
| Beta | 13–30 Hz | Alert, thinking, concentrating |
| Gamma | 30–100 Hz | Brief bursts during demanding mental work |

None of them is good or bad on its own — a brain has all five, all the time. Faster usually means a more engaged brain; slower usually means a more restful or sleeping one.

## Screens

- **Overview** — what EEG is, a sample trace, and the three-step reading model.
- **Load data** — borrow a recording, try the practice signal, or drop your own file.
- **Workspace** — 01 the wave itself, 02 what we measured, 03 what it might mean.
- **Band reference** — the five rhythms in the same glyphs used everywhere else.
- **Export** — CSV samples, JSON measurements, and a printed report with provenance.
- **About** — project background and contact.

## Technology

- **Frontend:** React
- **Routing:** React Router
- **AI:** Hugging Face Inference API with DeepSeek-R1 (optional; a local reading is available without a token)
- **Styling:** CSS with IBM Plex Sans and IBM Plex Mono
- **Parsing:** Client-side EEG loaders for CSV and related research formats

## Getting started

### Prerequisites

- Node.js 16.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ayaan-cs/MindSight.git
   cd MindSight
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Optional — create a `.env` file if you want live DeepSeek-R1 readings:
   ```
   REACT_APP_HUGGING_FACE_TOKEN=your_token_here
   REACT_APP_USE_REAL_API=true
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Using the application

1. Start on Overview, or skip straight to Load data.
2. Open a resting-state sample, a motor-imagery excerpt, or the practice signal. You can also drop a local file; it stays in the browser.
3. In the workspace, play or pause the montage and change the time window if you want a closer look.
4. Read panel 02 for band energy, ratios, and signal quality.
5. In panel 03, ask what it might mean. Use a local reading, or authenticate to send the measurements to DeepSeek-R1.
6. Export CSV, JSON, or a printed report. Every download records where the signal came from.

## Privacy

- Files you drop are read in the browser and are not uploaded to a MindSight server.
- If you run a live reading, only band measurements and ratios are sent to the model — not the original file.
- API tokens are stored in environment variables or, if entered in the app, only for the current browser session.

## Not a medical device

MindSight is for education and curiosity. Sample recordings come from public research archives. The practice signal is generated and labelled wherever it appears. A model reading is not a diagnosis.

## Contributing

Contributions are welcome. Please open a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the Apache License 2.0 — see the [LICENSE](LICENSE) file for details.

## Contact

**Ayaan A. Syed** — [LinkedIn](http://www.linkedin.com/in/ayaan-syed) — [GitHub](https://github.com/ayaan-cs)

Project link: [https://mindsight-app.netlify.app/](https://mindsight-app.netlify.app/)

---

<p align="center">
  <em>See what a brain recording actually looks like — and what it means.</em>
</p>
