import React from 'react';
import { Link } from 'react-router-dom';

// PlayerCard displays a single prospect's summary + rankings + compare option
const PlayerCard = ({ player, onCompareToggle, isSelected }) => {
    const ranks = player.scoutRankings || {};

    // Extract numeric scout ranks
    const numericRanks = Object.entries(ranks)
        .filter(([key, value]) => key !== "playerId" && typeof value === 'number')
        .map(([, rank]) => rank);

    // Compute average rank
    const average =
        numericRanks.length > 0
            ? numericRanks.reduce((sum, r) => sum + r, 0) / numericRanks.length
            : null;

    return (
        <div style={{
            border: '1px solid gray',
            margin: '10px',
            padding: '10px',
            backgroundColor: isSelected ? '#e0f7ff' : 'white'
        }}>
            {/* Link to player profile */}
            <Link to={`/player/${player.playerId}`}>
                <h3>{player.name}</h3>
            </Link>

            {/* Team and league info */}
            <p>Team: {player.currentTeam}</p>
            <p>League: {player.league}</p>

            {/* Scout rankings with color and deltas */}
            <p><strong>Mavericks Scout Rankings:</strong></p>
            <ul>
                {Object.entries(ranks).map(([scout, rank]) => {
                    if (scout === "playerId") return null;

                    let color = 'black';
                    let delta = null;

                    if (typeof rank === 'number' && average !== null) {
                        delta = +(rank - average).toFixed(1);
                        if (delta < 0) color = 'green';
                        if (delta > 0) color = 'red';
                    }

                    return (
                        <li key={scout} style={{ color }}>
                            {scout}: {rank ?? 'N/A'}
                            {delta !== null && (
                                <span> ({delta > 0 ? '+' : ''}{delta})</span>
                            )}
                        </li>
                    );
                })}
            </ul>

            {/* Compare toggle button */}
            <button
                onClick={() => onCompareToggle(player)}
                style={{
                    marginTop: '0.5rem',
                    backgroundColor: isSelected ? '#0077cc' : '#f0f0f0',
                    color: isSelected ? 'white' : 'black',
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                {isSelected ? 'Remove from Compare' : 'Add to Compare'}
            </button>
        </div>
    );
};

export default PlayerCard;
