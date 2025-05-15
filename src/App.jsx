import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import PlayerPage from './pages/PlayerPage.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/player/:id" element={<PlayerPage />} />
            </Routes>
        </Router>
    );
}

export default App;
