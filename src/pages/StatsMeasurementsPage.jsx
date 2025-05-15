import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const StatsMeasurementsPage = () => {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);
    const [measurements, setMeasurements] = useState(null);
    const [gameLogs, setGameLogs] = useState([]);
    const [availableSeasons, setAvailableSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [sortByStat, setSortByStat] = useState(null);

    useEffect(() => {
        fetch('/intern_project_data.json')
            .then(res => res.json())
            .then(data => {
                const foundPlayer = data.bio.find(p => p.playerId.toString() === id);
                setPlayer(foundPlayer);

                const foundMeasurements = data.measurements?.find(
                    m => m.playerId?.toString() === id
                );
                setMeasurements(foundMeasurements);

                const gameLogsForPlayer = data.game_logs?.filter(
                    g => g.playerId?.toString() === id
                ) || [];

                setGameLogs(gameLogsForPlayer);

                const seasons = [...new Set(gameLogsForPlayer.map(g => g.season))].sort((a, b) => b - a);
                setAvailableSeasons(seasons);
                if (seasons.length > 0) setSelectedSeason(seasons[0]);
            });
    }, [id]);

    if (!player) return <p>Loading player data...</p>;

    const filteredLogs = gameLogs.filter(g => g.season === selectedSeason);

    let displayedLogs = [...filteredLogs];

    if (sortByStat) {
        displayedLogs.sort((a, b) => {
            let valA, valB;

            if (sortByStat === 'timePlayed') {
                // Convert "MM:SS" string to a numeric value
                const toMinutes = (str) => {
                    if (!str || !str.includes(':')) return -Infinity;
                    const [min, sec] = str.split(':').map(Number);
                    return min + sec / 60;
                };
                valA = toMinutes(a.timePlayed);
                valB = toMinutes(b.timePlayed);
            } else {
                valA = typeof a[sortByStat] === 'number' ? a[sortByStat] : -Infinity;
                valB = typeof b[sortByStat] === 'number' ? b[sortByStat] : -Infinity;
            }

            return valB - valA; // Descending order
        });
    }


    return (
        <div style={{ padding: '1rem' }}>
            <Link to={`/player/${player.playerId}`} style={{ display: 'inline-block', marginBottom: '1rem' }}>
                ← Back to Player Profile
            </Link>

            <h2>{player.name} – Measurements</h2>

            {measurements ? (
                <ul>
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

            <h2 style={{ marginTop: '2rem' }}>{player.name} – Game Logs</h2>

            {availableSeasons.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
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

            {displayedLogs.length === 0 ? (
                <p>No game logs available for the selected season.</p>
            ) : (
                <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Opponent</th>
                        <th>PTS</th>
                        <th>REB</th>
                        <th>AST</th>
                        <th>STL</th>
                        <th>BLK</th>
                        <th>TOV</th>
                        <th>+/-</th>
                        <th>FGM-FGA</th>
                        <th>3PM-3PA</th>
                        <th>FTM-FTA</th>
                        <th>Fouls</th>
                        <th>Minutes</th>
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
