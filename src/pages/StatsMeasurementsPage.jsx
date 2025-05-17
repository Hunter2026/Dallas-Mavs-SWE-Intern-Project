import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PlayerDevelopment from '../components/PlayerDevelopment';

const StatsMeasurementsPage = () => {
    const { id } = useParams(); // Extract player ID from URL params

    // State hooks to store player data
    const [player, setPlayer] = useState(null);              // Basic player info (name, ID)
    const [measurements, setMeasurements] = useState(null);  // Combine measurements (height, weight, wingspan, etc.)
    const [gameLogs, setGameLogs] = useState([]);            // Individual game logs
    const [seasonLogs, setSeasonLogs] = useState([]);        // Season averages
    const [availableSeasons, setAvailableSeasons] = useState([]); // All seasons played
    const [selectedSeason, setSelectedSeason] = useState(null);   // Current season to display
    const [sortByStat, setSortByStat] = useState(null);      // Stat to sort game logs by

    // Load all player-related data when the component mounts
    useEffect(() => {
        fetch('/intern_project_data.json')
            .then(res => res.json())
            .then(data => {
                // Find player bio
                const foundPlayer = data.bio.find(p => p.playerId.toString() === id);
                setPlayer(foundPlayer);

                // Find measurements (optional chaining in case data is missing)
                const foundMeasurements = data.measurements?.find(
                    m => m.playerId?.toString() === id
                );
                setMeasurements(foundMeasurements);

                // Filter game logs belonging to this player
                const gameLogsForPlayer = data.game_logs?.filter(
                    g => g.playerId?.toString() === id
                ) || [];
                setGameLogs(gameLogsForPlayer);

                // Filter season averages for this player
                const logsForPlayer = data.seasonLogs?.filter(
                    s => s.playerId?.toString() === id
                ) || [];
                setSeasonLogs(logsForPlayer);

                // Combine unique seasons from both game logs and season logs
                const seasonsFromGames = gameLogsForPlayer.map(g => g.season);
                const seasonsFromAverages = logsForPlayer.map(s => s.Season);
                const combinedSeasons = [...new Set([...seasonsFromGames, ...seasonsFromAverages])].sort((a, b) => b - a);
                setAvailableSeasons(combinedSeasons);

                // Default to the most recent season
                if (combinedSeasons.length > 0) {
                    setSelectedSeason(combinedSeasons[0]);
                }
            });
    }, [id]);

    // Loading screen while data fetch is pending
    if (!player) return <p>Loading player data...</p>;

    // Filter game logs by selected season
    const filteredLogs = gameLogs.filter(g => g.season === selectedSeason);
    let displayedLogs = [...filteredLogs];

    // Sort game logs if a specific stat is selected
    if (sortByStat) {
        displayedLogs.sort((a, b) => {
            let valA, valB;

            if (sortByStat === 'timePlayed') {
                // Convert "MM:SS" time format to numeric minutes for sorting
                const toMinutes = (str) => {
                    if (!str || !str.includes(':')) return -Infinity;
                    const [min, sec] = str.split(':').map(Number);
                    return min + sec / 60;
                };
                valA = toMinutes(a.timePlayed);
                valB = toMinutes(b.timePlayed);
            } else {
                // Default numeric sorting, fallback to -Infinity for missing data
                valA = typeof a[sortByStat] === 'number' ? a[sortByStat] : -Infinity;
                valB = typeof b[sortByStat] === 'number' ? b[sortByStat] : -Infinity;
            }

            return valB - valA; // Descending order
        });
    }

    return (
        <div style={{ padding: '1rem' }}>
            {/* Navigation back to player profile */}
            <Link to={`/player/${player.playerId}`} style={{ display: 'block', marginBottom: '1rem' }}>
                ← Back to Player Profile
            </Link>

            {/* === Player Measurements Section === */}
            <h2>{player.name} – Measurements</h2>

            <Link to={`/player/${id}/scouting`} style={{ display: 'block', marginBottom: '1rem' }}>
                <button>Write Scouting Report</button>
            </Link>

            {measurements ? (
                <ul>
                    {/* Display individual measurement fields */}
                    <li><strong>Height (No Shoes):</strong> {measurements.heightNoShoes}"</li>
                    <li><strong>Height (With Shoes):</strong> {measurements.heightShoes}"</li>
                    <li><strong>Wingspan:</strong> {measurements.wingspan}"</li>
                    <li><strong>Standing Reach:</strong> {measurements.reach}"</li>
                    <li><strong>Weight:</strong> {measurements.weight} lbs</li>
                    <li><strong>Max Vertical:</strong> {measurements.maxVertical}"</li>
                    <li><strong>No-Step Vertical:</strong> {measurements.noStepVertical}"</li>
                    <li><strong>Hand Length:</strong> {measurements.handLength}"</li>
                    <li><strong>Hand Width:</strong> {measurements.handWidth}"</li>
                    <li><strong>Agility:</strong> {measurements.agility} sec</li>
                    <li><strong>Sprint:</strong> {measurements.sprint} sec</li>
                    <li><strong>Shuttle Best:</strong> {measurements.shuttleBest} sec</li>
                    <li><strong>Body Fat %:</strong> {measurements.bodyFat ?? 'N/A'}</li>
                </ul>
            ) : (
                <p>No measurements available for this player.</p>
            )}

            {/* === Career Averages Section === */}
            <h2 style={{ marginTop: '2rem' }}>{player.name} – Career Averages</h2>
            {seasonLogs.length > 0 ? (
                (() => {
                    const totalGP = seasonLogs.reduce((sum, s) => sum + s.GP, 0);

                    // Weighted average utility based on GP (games played)
                    const weightedAvg = (key) => {
                        const total = seasonLogs.reduce((sum, s) => sum + (s[key] ?? 0) * s.GP, 0);
                        return totalGP > 0 ? (total / totalGP).toFixed(1) : '—';
                    };

                    // Render averages table
                    return (
                        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '2rem' }}>
                            <thead>
                            <tr>
                                <th>GP</th><th>MP</th><th>PTS</th><th>REB</th><th>AST</th>
                                <th>STL</th><th>BLK</th><th>TOV</th><th>Fouls</th>
                                <th>FG%</th><th>3P%</th><th>FT%</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{totalGP}</td>
                                <td>{weightedAvg('MP')}</td>
                                <td>{weightedAvg('PTS')}</td>
                                <td>{weightedAvg('TRB')}</td>
                                <td>{weightedAvg('AST')}</td>
                                <td>{weightedAvg('STL')}</td>
                                <td>{weightedAvg('BLK')}</td>
                                <td>{weightedAvg('TOV')}</td>
                                <td>{weightedAvg('PF')}</td>
                                <td>{weightedAvg('FG%')}</td>
                                <td>{weightedAvg('3P%')}</td>
                                <td>{weightedAvg('FTP')}</td>
                            </tr>
                            </tbody>
                        </table>
                    );
                })()
            ) : (
                <p>No season data available to calculate career averages.</p>
            )}

            {/* === Player Development Chart === */}
            <PlayerDevelopment seasonLogs={seasonLogs} player={player} />

            {/* === Season Selector Dropdown === */}
            {availableSeasons.length > 0 && (
                <div style={{ marginTop: '5rem', marginBottom: '1rem' }}>
                    <label htmlFor="seasonSelect"><strong>Select Season:</strong>{' '}</label>
                    <select
                        id="seasonSelect"
                        value={selectedSeason}
                        onChange={(e) => setSelectedSeason(Number(e.target.value))}
                    >
                        {availableSeasons.map(season => (
                            <option key={season} value={season}>{season}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* === Season Averages Table === */}
            <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>{player.name} – Season Averages</h2>
            {selectedSeason && (() => {
                const logs = seasonLogs.filter(s => s.Season === selectedSeason);
                return logs.length > 0 ? (
                    <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '2rem' }}>
                        <thead>
                        <tr>
                            <th>Team</th><th>League</th><th>GP</th><th>MP</th><th>PTS</th>
                            <th>REB</th><th>AST</th><th>STL</th><th>BLK</th><th>TOV</th>
                            <th>Fouls</th><th>FG%</th><th>3P%</th><th>FT%</th>
                        </tr>
                        </thead>
                        <tbody>
                        {logs.map((seasonLog, index) => (
                            <tr key={index}>
                                <td>{seasonLog.Team}</td>
                                <td>{seasonLog.League}</td>
                                <td>{seasonLog.GP}</td>
                                <td>{seasonLog.MP}</td>
                                <td>{seasonLog.PTS}</td>
                                <td>{seasonLog.TRB}</td>
                                <td>{seasonLog.AST}</td>
                                <td>{seasonLog.STL}</td>
                                <td>{seasonLog.BLK}</td>
                                <td>{seasonLog.TOV}</td>
                                <td>{seasonLog.PF}</td>
                                <td>{seasonLog['FG%']}</td>
                                <td>{seasonLog['3P%']}</td>
                                <td>{seasonLog.FTP}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No season stats available for the selected year.</p>
                );
            })()}

            {/* === Game Logs Section === */}
            <h2 style={{ marginTop: '2rem' }}>{player.name} – Game Logs</h2>

            {/* Sort stat dropdown */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="statSort"><strong>Sort By Stat:</strong>{' '}</label>
                <select
                    id="statSort"
                    value={sortByStat || ''}
                    onChange={(e) => setSortByStat(e.target.value || null)}
                >
                    <option value="">-- None --</option>
                    <option value="pts">Points</option>
                    <option value="reb">Rebounds</option>
                    <option value="ast">Assists</option>
                    <option value="stl">Steals</option>
                    <option value="blk">Blocks</option>
                    <option value="tov">Turnovers</option>
                    <option value="plusMinus">Plus/Minus</option>
                    <option value="fgm">FG Made</option>
                    <option value="fga">FG Attempted</option>
                    <option value="tpm">3P Made</option>
                    <option value="tpa">3P Attempted</option>
                    <option value="ftm">FT Made</option>
                    <option value="fta">FT Attempted</option>
                    <option value="pf">Fouls</option>
                    <option value="timePlayed">Minutes Played</option>
                </select>
            </div>

            {/* Display game log table or fallback message */}
            {displayedLogs.length === 0 ? (
                <p>No game logs available for the selected season.</p>
            ) : (
                <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                    <tr>
                        <th>Date</th><th>Opponent</th><th>PTS</th><th>REB</th><th>AST</th>
                        <th>STL</th><th>BLK</th><th>TOV</th><th>+/-</th><th>FGM-FGA</th>
                        <th>3PM-3PA</th><th>FTM-FTA</th><th>Fouls</th><th>Minutes</th>
                    </tr>
                    </thead>
                    <tbody>
                    {displayedLogs.map((game, index) => (
                        <tr key={index}>
                            <td>{game.date.split(' ')[0]}</td>
                            <td>{game.opponent}</td>
                            <td>{game.pts}</td>
                            <td>{game.reb}</td>
                            <td>{game.ast}</td>
                            <td>{game.stl}</td>
                            <td>{game.blk}</td>
                            <td>{game.tov}</td>
                            <td>{game.plusMinus ?? '—'}</td>
                            <td>{game.fgm}-{game.fga}</td>
                            <td>{game.tpm ?? game['3PM']}-{game.tpa ?? game['3PA']}</td>
                            <td>{game.ftm}-{game.fta}</td>
                            <td>{game.pf}</td>
                            <td>{game.timePlayed}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StatsMeasurementsPage;
