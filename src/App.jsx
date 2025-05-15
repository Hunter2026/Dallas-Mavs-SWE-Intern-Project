import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import PlayerPage from './pages/PlayerPage.jsx';
import StatsMeasurementsPage from './pages/StatsMeasurementsPage.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/player/:id" element={<PlayerPage />} />
                <Route path="/player/:id/stats" element={<StatsMeasurementsPage />} />
            </Routes>
        </Router>
    );
}

export default App;
