import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import PlayerPage from './pages/PlayerPage.jsx';
import StatsMeasurementsPage from './pages/StatsMeasurementsPage.jsx';
import ScoutFormPage from './pages/ScoutFormPage.jsx';
import SubmittedScoutReportPage from './pages/SubmittedScoutReportPage.jsx';
import ComparePage from "./pages/ComparePage.jsx";

function App() {
    const [displayMode, setDisplayMode] = useState('laptop'); // 'laptop', 'tablet', 'phone'

    // Update the body class based on selected mode
    useEffect(() => {
        document.body.classList.remove('mode-laptop', 'mode-tablet', 'mode-phone');
        document.body.classList.add(`mode-${displayMode}`);
    }, [displayMode]);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <HomePage
                            displayMode={displayMode}
                            setDisplayMode={setDisplayMode}
                        />
                    }
                />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/player/:id" element={<PlayerPage />} />
                <Route path="/player/:id/stats" element={<StatsMeasurementsPage />} />
                <Route path="/player/:id/scouting" element={<ScoutFormPage />} />
                <Route path="/player/:id/report" element={<SubmittedScoutReportPage />} />
            </Routes>
        </Router>
    );
}

export default App;
