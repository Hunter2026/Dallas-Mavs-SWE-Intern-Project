
NBA Draft Hub

A fully responsive, data-driven React application built with Vite to help NBA front office decision-makers evaluate prospects for the 2025 NBA Draft. 
This tool integrates public scouting rankings, statistical breakdowns, custom reports, and comparison charts — all styled using Material UI.

---

Data Source

All prospect data is stored in:

public/intern_project_data.json

This includes:
- Bio information
- Scouting rankings (treated as internal Mavericks scout ratings)
- Season and game logs
- Combine measurements

The app uses fetch() to load this JSON data into the frontend.

---

Installation

1. Install dependencies:
   npm install

2. Run the development server:
   npm run dev

---

Project Structure

Key Pages

- HomePage.jsx – Main "Big Board" view showing all prospects. Includes team/league filters, name search, display versions, and sorting by scout. Allows selecting players for comparison.
- PlayerPage.jsx – Shows an individual player's profile, including bio, scout rankings, and navigation links.
- StatsMeasurementsPage.jsx – Displays season-by-season/career averages/totals, game logs, and combine measurements. Includes development chart and filters for stats and seasons. Highlights game log *season highs* with gold stars.
- ScoutFormPage.jsx – Interactive form for submitting new scouting reports. Features dropdowns, sliders, and multi-line inputs. Automatically generates AI-style scouting summary after submission.
- SubmittedScoutReportPage.jsx – View previously submitted reports (stored via localStorage). Allows deletion and review of past evaluations.
- ComparePage.jsx – Side-by-side comparison of up to 3 players. Dual bar charts for combine measurements and career averages.

Key Components

- PlayerCard.jsx – Reusable card showing a prospect on the Big Board. Color-coded rank deltas for scouts.
- CompareChart.jsx – Dual bar charts using Recharts to show stat and measurement comparisons. Responsive layout with custom tooltip support.
- MeasurementComparison.jsx – Compares a player's measurements to peer averages. Labels metrics as "Elite", "Above Avg", etc.
- PlayerDevelopment.jsx – Line chart for stats over time (PTS, AST, TRB, etc.). Toggles for showing/hiding individual stats. Tooltip shows team and age per season.
- SummaryGenerator.jsx – Dynamically generates a text summary from scouting input. Uses keywords, trait ratings, and projection gaps.

---

Features Overview

Navigation
- Navigate between Big Board → Player Profile → Stats, Reports, and Scouting Form.
- Fully integrated with react-router-dom.

Player Evaluation
- View bio, team, and nationality.
- See all Mavericks scout rankings.
- Color-coded rank deltas help identify outliers.
- Game logs include ⭐ gold stars for season-high stats.
- Displays career averages and per-season breakdowns.
- Dynamic sorting of logs and filtering by season.

Scouting Reports
- Form to submit reports with:
  - Strengths, Weaknesses, Player Comparison
  - Best NBA Fit, Role, Ceiling, Draft Range
  - Trait sliders (0–10) for Shooting, Handling, IQ, etc.
- Summary generator condenses reports into a readable format.
- Reports saved in local state (localStorage) and shown in the Submitted Reports page.

Visual Tools
- Compare multiple players’ combine measurements and stat averages.
- Use responsive charts and labeled bars for clarity.
- Toggle individual stats in player development view.

UI & UX
- Built with Material UI (MUI) for consistent, modern design.
- Responsive layout for laptop, tablet, and mobile viewing.
- Tooltips for chart insights and ranking deltas.
- Intuitive interaction design for scouts and analysts.

---

Technologies Used

- React + Vite (frontend-only)
- Material UI (MUI) – layout, input components, typography
- Recharts – bar charts and line charts
- React Router DOM – navigation between pages
- LocalStorage – temporary storage of submitted reports

---

Future Improvements

- Add backend/API for report persistence across sessions.
- Enable custom scout profiles and notes.
- Show percentile ranks for combine metrics.
- Import/export player reports as PDF or JSON.
- Integrate interview, medical, and psychological evaluation fields.

---