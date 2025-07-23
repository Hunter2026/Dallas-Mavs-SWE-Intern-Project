# NBA Draft Hub

A fully responsive, data-driven **full-stack** application designed to assist NBA front office decision-makers in evaluating prospects for the 2025 NBA Draft.

Built with **React (Vite)** on the frontend and a **Python Flask** backend powered by the **OpenAI API** for AI-generated scouting summaries. Deployed on **AWS Elastic Beanstalk** with custom domain routing, HTTPS support, and bot protection.

---

## Deployment & Infrastructure

- **Elastic Beanstalk (EB)** – Hosts the Flask backend and serves frontend static files.
- **Amazon Route 53** – Handles custom domain routing (`nextupnba.com`).
- **AWS Certificate Manager (ACM)** – Enables HTTPS with a valid SSL certificate.
- **Amazon S3** – Stores static assets and logs with lifecycle policies.
- **Amazon GuardDuty** – Protects against bots, scrapers, and anomalous traffic.
- **OpenAI API** – Generates real-time scouting summaries based on user input.

---

## AI Integration

- Integrates with **OpenAI GPT** via Flask backend.
- Generates professional-style summaries from scouting reports.
- Summary is displayed immediately after form submission.

---

## Data Source

Prospect data is loaded from:

```
project_data.json
```

**Includes:**

- Bio information  
- Scouting rankings (internal Mavericks ratings)  
- Season and game logs  
- Combine measurements  

Data is served from the Flask backend via the `/static/` folder and accessed in the frontend using `fetch()`.

---

## Installation & Deployment

To build the frontend, move static files to the backend, and deploy the full app to AWS Elastic Beanstalk, use the provided script:

```bash
#!/bin/bash
cd frontend
npm run build
rm -rf ../backend/static/assets/*
cp -r dist/assets ../backend/static/
cp dist/index.html ../backend/static/
cd ../backend
eb deploy && eb open
```

---

## Project Structure

### Key Frontend Pages

- **`HomePage.jsx`** – Big Board view with filters, sorting, and comparison selections.
- **`PlayerPage.jsx`** – Individual player bio and ranking details.
- **`StatsMeasurementsPage.jsx`** – Career stats, game logs, and combine metrics.
- **`ScoutFormPage.jsx`** – Interactive scouting form with OpenAI integration.
- **`SubmittedScoutReportPage.jsx`** – Review saved reports from `localStorage`.
- **`ComparePage.jsx`** – Side-by-side player comparisons using charts.

### Core Components

- **`PlayerCard.jsx`** – Reusable card component showing prospect info and rank changes.
- **`CompareChart.jsx`** – Dual bar charts for stats and measurements using Recharts.
- **`MeasurementComparison.jsx`** – Highlights metrics vs. class averages ("Elite", etc.).
- **`PlayerDevelopment.jsx`** – Line chart showing progression in PTS, AST, TRB, etc.
- **`SummaryGenerator.jsx`** – Creates a scouting summary using OpenAI API.

---

## Features Overview

### Navigation

- Route structure handled via `react-router-dom`
- Seamless transitions between views (Big Board → Player → Stats → Report)

### Scouting Reports

- Form includes:
  - Strengths, Weaknesses, Player Comparison
  - NBA Fit, Role, Ceiling, Draft Range
  - Trait sliders (e.g. Shooting, Defense, IQ)
- AI summary appears instantly post-submission
- Reports are temporarily saved to `localStorage`

### Visual Tools

- Dual bar charts for:
  - Combine measurements
  - Career statistical averages
- Line chart for stat development over seasons
- Toggle visibility of specific stats
- ⭐ Gold stars highlight season highs in game logs

### UI/UX

- Built with **Material UI** for consistency
- Responsive layout for desktop, tablet, and mobile
- Tooltips for rank deltas and chart labels
- Intuitive controls for scouts and analysts

---

## Technologies Used

| Layer         | Stack                                  |
|---------------|-----------------------------------------|
| Frontend      | React (Vite), Material UI, Recharts     |
| Backend       | Python Flask, OpenAI API                |
| Routing & SSL | Amazon Route 53 + ACM (HTTPS)           |
| Hosting       | AWS Elastic Beanstalk                   |
| Storage       | AWS S3                                  |
| Security      | AWS GuardDuty                           |

---

## Future Improvements

- Backend database to persist scouting reports
- Scout login/accounts with personalized reports
- Percentile ranks for combine metrics
- Export reports as PDF or JSON
- Add psychological/interview/medical fields
- Admin dashboard for uploading and managing player data

---
