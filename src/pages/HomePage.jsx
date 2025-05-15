import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div>
            <h1>NBA Draft Hub</h1>
            <Link to="/player/170531">Go to Cooper Flagg's Profile</Link>
        </div>
    );
};

export default HomePage;
