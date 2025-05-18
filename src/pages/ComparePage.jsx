import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import CompareChart from '../components/CompareChart';

// ComparePage displays side-by-side comparisons of up to three players
const ComparePage = () => {
    const location = useLocation(); // Access the current location object
    const query = new URLSearchParams(location.search); // Parse URL query parameters

    // Extract player IDs from the query string, limiting to 3 players
    const ids = query.get('ids')?.split(',').slice(0, 3) || [];

    // State to hold relevant data for comparison
    const [players, setPlayers] = useState([]);          // Basic bio info
    const [measurements, setMeasurements] = useState([]); // Combine data from Combine/Pro Day
    const [seasonLogs, setSeasonLogs] = useState([]);     // Seasonal performance data

    // Fetch relevant data when the selected IDs change
    useEffect(() => {
        fetch('/intern_project_data.json')
            .then(res => res.json())
            .then(data => {
                // Filter the data for the selected player IDs
                const selectedPlayers = data.bio.filter(p => ids.includes(p.playerId.toString()));
                const selectedMeasurements = data.measurements?.filter(m => ids.includes(m.playerId?.toString())) || [];
                const selectedSeasonLogs = data.seasonLogs?.filter(l => ids.includes(l.playerId?.toString())) || [];

                // Store in local state
                setPlayers(selectedPlayers);
                setMeasurements(selectedMeasurements);
                setSeasonLogs(selectedSeasonLogs);
            });
    }, [ids]);

    // Utility function to retrieve a specific measurement for a player
    const getMeasurements = (playerId, key) => {
        const m = measurements.find(m => m.playerId?.toString() === playerId.toString());
        const val = m?.[key];
        return val !== undefined && val !== null ? val : 'N/A';
    };

    // Utility function to compute a player's career average for a given stat
    const getCareerAvg = (playerId, statKey) => {
        const logs = seasonLogs.filter(l => l.playerId?.toString() === playerId.toString());
        const totalGP = logs.reduce((sum, l) => sum + l.GP, 0); // GP = Games Played
        if (totalGP === 0) return '—'; // Avoid divide-by-zero
        const total = logs.reduce((sum, l) => sum + (l[statKey] ?? 0) * l.GP, 0); // Weighted average
        return (total / totalGP).toFixed(1);
    };

    // Require at least 2 players for meaningful comparison
    if (!players || players.length < 2) {
        return (
            <div style={{ padding: '2rem' }}>
                <h2>Player Comparison</h2>
                <p>Please select at least <strong>two players</strong> to compare.</p>
                <p>Return to the <Link to="/">Big Board</Link> and add more players to your comparison cart.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '1rem' }}>
            {/* Navigation back to main draft board */}
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem' }}>
                ← Back to Big Board
            </Link>

            <h2>Player Comparison</h2>

            {/* Comparison grid layout */}
            {players.length === 0 ? (
                <p>No players selected.</p>
            ) : (
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    {players.map(player => (
                        <div
                            key={player.playerId}
                            style={{
                                border: '1px solid #ccc',
                                padding: '1rem',
                                flex: 1,
                                minWidth: '300px'
                            }}
                        >
                            {/* Player basic info */}
                            <h3>{player.name}</h3>
                            <p><strong>Team:</strong> {player.currentTeam}</p>
                            <p><strong>League:</strong> {player.league}</p>

                            {/* Measurement section */}
                            <h4>Measurements</h4>
                            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                                <li><strong>Height (No Shoes):</strong> {getMeasurements(player.playerId, 'heightNoShoes')}"</li>
                                <li><strong>Height (With Shoes):</strong> {getMeasurements(player.playerId, 'heightShoes')}"</li>
                                <li><strong>Wingspan:</strong> {getMeasurements(player.playerId, 'wingspan')}"</li>
                                <li><strong>Standing Reach:</strong> {getMeasurements(player.playerId, 'reach')}"</li>
                                <li><strong>Weight:</strong> {getMeasurements(player.playerId, 'weight')} lbs</li>
                                <li><strong>Max Vertical:</strong> {getMeasurements(player.playerId, 'maxVertical')}"</li>
                                <li><strong>No-Step Vertical:</strong> {getMeasurements(player.playerId, 'noStepVertical')}"</li>
                                <li><strong>Hand Length:</strong> {getMeasurements(player.playerId, 'handLength')}"</li>
                                <li><strong>Hand Width:</strong> {getMeasurements(player.playerId, 'handWidth')}"</li>
                                <li><strong>Agility:</strong> {getMeasurements(player.playerId, 'agility')} sec</li>
                                <li><strong>Sprint:</strong> {getMeasurements(player.playerId, 'sprint')} sec</li>
                                <li><strong>Shuttle Best:</strong> {getMeasurements(player.playerId, 'shuttleBest')} sec</li>
                                <li><strong>Body Fat %:</strong> {getMeasurements(player.playerId, 'bodyFat')}</li>
                            </ul>

                            {/* Career averages section */}
                            <h4>Career Averages</h4>
                            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                                <li><strong>PTS:</strong> {getCareerAvg(player.playerId, 'PTS')}</li>
                                <li><strong>TRB:</strong> {getCareerAvg(player.playerId, 'TRB')}</li>
                                <li><strong>AST:</strong> {getCareerAvg(player.playerId, 'AST')}</li>
                                <li><strong>STL:</strong> {getCareerAvg(player.playerId, 'STL')}</li>
                                <li><strong>BLK:</strong> {getCareerAvg(player.playerId, 'BLK')}</li>
                                <li><strong>TOV:</strong> {getCareerAvg(player.playerId, 'TOV')}</li>
                                <li><strong>FG%:</strong> {getCareerAvg(player.playerId, 'FG%')}</li>
                                <li><strong>3P%:</strong> {getCareerAvg(player.playerId, '3P%')}</li>
                                <li><strong>FT%:</strong> {getCareerAvg(player.playerId, 'FTP')}</li>
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* Chart visualizing comparison between players */}
            <CompareChart players={players} seasonLogs={seasonLogs} measurements={measurements} />
        </div>
    );
};

export default ComparePage;
