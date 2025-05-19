# NBA Draft Hub

A dynamic React application for evaluating prospects in the 2025 NBA Draft. This tool combines stats, scouting reports, and comparison charts to help scouts analyze player performance and potential.

---

## Data Source

All player information (bio, scout rankings, stats, measurements) is stored in:
```
public/intern_project_data.json
```

The app uses `fetch()` to load this data client-side.

---

## Installation

1. **Install dependencies:**
    ```bash
    npm install react react-dom
    npm install react-router-dom
    npm install recharts
    npm install @mui/material @emotion/react @emotion/styled
    ```

2. **Run the app:**
    ```bash
    npm run dev
    ```
   
---

## Project Structure

## Key Pages
- **HomePage.jsx** – Big board view with player cards, filtering, sorting, and comparison selection.
- **PlayerPage.jsx** – Individual player profile with bio, scout rankings, and navigation.
- **StatsMeasurementsPage.jsx** – Displays player measurements, career stats, and game logs.
- **ScoutFormPage.jsx** – Interactive scouting report form including trait sliders and dropdowns.
- **SubmittedScoutReportPage.jsx** – Shows previously submitted scouting reports per player.
- **ComparePage.jsx** – Enables side-by-side comparison of up to three players.

## Key Components

### CompareChart.jsx
- Renders dual bar charts: one for measurements, another for career stats.
- Uses Recharts and MUI.
- Accepts up to 3 players for comparison.
- Includes custom tooltip and responsive styling.

### MeasurementComparison.jsx
- Compares a single player's measurements to peers in the same draft class.
- Uses labels like “Elite”, “Above Avg”, or “Below Avg” based on statistical deltas.
- Displays data as a styled MUI list.

### PlayerCard.jsx
- Used in the HomePage to show individual prospect info.
- Displays scout rankings with color-coded rank deltas.
- Includes “Add to Compare” toggle button.

### PlayerDevelopment.jsx
- Displays a line chart of season-by-season performance for selected stats (PTS, AST, TRB, etc.).
- Allows toggling of individual stats and “Select All”.
- Includes tooltip with age and team info.

### SummaryGenerator.jsx
- AI-style summary generator for scouting reports.
- Extracts keywords, classifies traits, and summarizes potential based on role vs. ceiling gap.
- Enhances reports for fast consumption.

---

Each component is modular and styled with Material UI for consistency and responsiveness.

---

## Features

### Navigation
- Navigate from big board to player pages.
- Access player profile, stats/measurements, scouting form, and reports.

### Player Evaluation
- View scout rankings (ESPN, Sam Vecenie, etc.)
- Display measurements and advanced stats (season/game-level).
- Sort game logs and filter by season.
- Career and season averages computed dynamically.

### Visual Insights
- Player development charts show trends in PTS, MIN, AST, etc.
- Bar chart comparisons of player measurements and stats.

### Scouting Tools
- Submit detailed reports including:
  - Strengths, weaknesses, player comparison
  - Best NBA fit, projected role, ceiling, draft range
  - Trait sliders: shooting, handling, defense, etc.
- Generated summaries for quick insights.
- Saved to `localStorage` and viewable on report pages.

### Comparison Tool
- Select up to 3 players for side-by-side comparison.
- Compare measurements and career averages in text and chart form.

### Material UI
- Styled using MUI for clean layout and responsive design.

---

## Future Improvements
- Backend integration for persistent report storage.
- Expand to include combine invites, interview grades, and team meetings.
- Enhanced filtering and custom scout profiles.

