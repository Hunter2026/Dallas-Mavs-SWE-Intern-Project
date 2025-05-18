import React from 'react';
import { Link } from 'react-router-dom';

// PlayerCard component displays basic player info and scout rankings
const PlayerCard = ({ player }) => {
    // Safely extract scout rankings or default to empty object
    const ranks = player.scoutRankings || {};

    // Extract only numeric rankings (ignore "playerId" and non-number values)
    const numericRanks = Object.entries(ranks)
        .filter(([key, value]) => key !== "playerId" && typeof value === 'number')
        .map(([, rank]) => rank);

    // Compute average rank across all scouts (for comparison)
    const average =
        numericRanks.length > 0
            ? numericRanks.reduce((sum, r) => sum + r, 0) / numericRanks.length
            : null;

    return (
        <div style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
            {/* Player name links to their profile page */}
            <Link to={`/player/${player.playerId}`}>
                <h3>{player.name}</h3>
            </Link>

            {/* Display basic player info */}
            <p>Team: {player.currentTeam}</p>
            <p>League: {player.league}</p>

            {/* Show scout rankings with visual indicators */}
            <p><strong>Mavericks Scout Rankings:</strong></p>
            <ul>
                {Object.entries(ranks).map(([scout, rank]) => {
                    // Skip non-scout entries
                    if (scout === "playerId") return null;

                    let color = 'black';  // default color
                    let delta = null;     // difference from average

                    // If ranking is numeric and average exists, calculate delta and color
                    if (typeof rank === 'number' && average !== null) {
                        delta = +(rank - average).toFixed(1); // round to 1 decimal
                        if (delta < 0) color = 'green';       // Higher than average (better rank)
                        if (delta > 0) color = 'red';         // Lower than average (worse rank)
                    }

                    return (
                        <li key={scout} style={{ color }}>
                            {/* Display scout name and rank */}
                            {scout}: {rank ?? 'N/A'}

                            {/* Show delta from average if available */}
                            {delta !== null && (
                                <span> ({delta > 0 ? '+' : ''}{delta})</span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default PlayerCard;
