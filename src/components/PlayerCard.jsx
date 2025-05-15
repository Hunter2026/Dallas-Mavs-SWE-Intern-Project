import React from 'react';
import { Link } from 'react-router-dom';

// PlayerCard component displays basic player info and scout rankings
const PlayerCard = ({ player }) => {
    // Safely access scout rankings object
    const ranks = player.scoutRankings || {};

    // Extract numeric rankings only (ignore non-number values like playerId)
    const numericRanks = Object.entries(ranks)
        .filter(([key, value]) => key !== "playerId" && typeof value === 'number')
        .map(([, rank]) => rank);

    // Compute the average rank across all scouts for this player
    const average =
        numericRanks.length > 0
            ? numericRanks.reduce((sum, r) => sum + r, 0) / numericRanks.length
            : null;

    return (
        <div style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
            {/* Player name links to the profile page */}
            <Link to={`/player/${player.playerId}`}>
                <h3>{player.name}</h3>
            </Link>

            {/* Basic player info */}
            <p>Team: {player.currentTeam}</p>
            <p>League: {player.league}</p>

            {/* List of scout rankings with visual indication of high/low opinions */}
            <p><strong>Mavericks Scout Rankings:</strong></p>
            <ul>
                {Object.entries(ranks).map(([scout, rank]) => {
                    if (scout === "playerId") return null;

                    // Color-code based on how the scout's ranking compares to average
                    let color = 'black';
                    if (typeof rank === 'number' && average !== null) {
                        if (rank < average) color = 'green'; // High opinion
                        if (rank > average) color = 'red';   // Low opinion
                    }

                    return (
                        <li key={scout} style={{ color }}>
                            {scout}: {rank ?? 'N/A'}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default PlayerCard;
