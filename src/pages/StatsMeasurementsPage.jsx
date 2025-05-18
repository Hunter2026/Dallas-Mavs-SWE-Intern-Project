import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PlayerDevelopment from '../components/PlayerDevelopment';
import MeasurementComparison from '../components/MeasurementComparison';
import {
    Container,
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from '@mui/material';

const StatsMeasurementsPage = () => {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);
    const [measurements, setMeasurements] = useState([]);
    const [playerMeasurements, setPlayerMeasurements] = useState(null);
    const [gameLogs, setGameLogs] = useState([]);
    const [seasonLogs, setSeasonLogs] = useState([]);
    const [availableSeasons, setAvailableSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [sortByStat, setSortByStat] = useState(null);

    // Load all player-related data
    useEffect(() => {
        fetch('/intern_project_data.json')
            .then(res => res.json())
            .then(data => {
                const foundPlayer = data.bio.find(p => p.playerId.toString() === id);
                setPlayer(foundPlayer);

                const allMeasurements = data.measurements || [];
                setMeasurements(allMeasurements);
                const foundPlayerMeasurements = allMeasurements.find(m => m.playerId?.toString() === id);
                setPlayerMeasurements(foundPlayerMeasurements);

                const gameLogsForPlayer = data.game_logs?.filter(g => g.playerId?.toString() === id) || [];
                setGameLogs(gameLogsForPlayer);

                const logsForPlayer = data.seasonLogs?.filter(s => s.playerId?.toString() === id) || [];
                setSeasonLogs(logsForPlayer);

                const seasonsFromGames = gameLogsForPlayer.map(g => g.season);
                const seasonsFromAverages = logsForPlayer.map(s => s.Season);
                const combinedSeasons = [...new Set([...seasonsFromGames, ...seasonsFromAverages])].sort((a, b) => b - a);
                setAvailableSeasons(combinedSeasons);
                if (combinedSeasons.length > 0) setSelectedSeason(combinedSeasons[0]);
            });
    }, [id]);

    if (!player) return <Typography>Loading player data...</Typography>;

    const filteredLogs = gameLogs.filter(g => g.season === selectedSeason);
    let displayedLogs = [...filteredLogs];

    if (sortByStat) {
        displayedLogs.sort((a, b) => {
            const toMinutes = str => {
                if (!str || !str.includes(':')) return -Infinity;
                const [min, sec] = str.split(':').map(Number);
                return min + sec / 60;
            };
            const valA = sortByStat === 'timePlayed' ? toMinutes(a.timePlayed) : a[sortByStat] ?? -Infinity;
            const valB = sortByStat === 'timePlayed' ? toMinutes(b.timePlayed) : b[sortByStat] ?? -Infinity;
            return valB - valA;
        });
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* NBA Draft Combine Photos in Top Right */}
            <Box sx={{ position: 'absolute', top: 16, right: 600 }}>
                <img
                    src="/NBA Draft Combine 1.png"
                    alt="NBA Draft Combine Logo"
                    style={{ width: 250, height: 'auto' }}
                />
            </Box>

            <Box sx={{ position: 'absolute', top: 16, right: 300 }}>
                <img
                    src="/NBA Draft Combine 2.png"
                    alt="NBA Draft Combine Logo"
                    style={{ width: 280, height: 'auto' }}
                />
            </Box>

            <Box sx={{ position: 'absolute', top: 16, right: 25 }}>
                <img
                    src="/NBA Draft Combine 3.png"
                    alt="NBA Draft Combine Logo"
                    style={{ width: 250, height: 'auto' }}
                />
            </Box>

            {/* Header navigation */}
            <Box mb={2}>
                <Button component={Link} to={`/player/${player.playerId}`} variant="outlined">
                    ← Back to Player Profile
                </Button>
            </Box>

            {/* Measurements */}
            <Typography variant="h4" gutterBottom>{player.name} – Measurements</Typography>
            <Button component={Link} to={`/player/${id}/scouting`} variant="contained" sx={{ mb: 2 }}>
                Write Scouting Report
            </Button>

            {playerMeasurements ? (
                <Paper sx={{ p: 2, mb: 4 }}>
                    <ul>
                        <li><strong>Height (No Shoes):</strong> {playerMeasurements.heightNoShoes ? `${playerMeasurements.heightNoShoes}"` : 'N/A'}</li>
                        <li><strong>Height (With Shoes):</strong> {playerMeasurements.heightShoes ? `${playerMeasurements.heightShoes}"` : 'N/A'}</li>
                        <li><strong>Wingspan:</strong> {playerMeasurements.wingspan ? `${playerMeasurements.wingspan}"` : 'N/A'}</li>
                        <li><strong>Standing Reach:</strong> {playerMeasurements.reach ? `${playerMeasurements.reach}"` : 'N/A'}</li>
                        <li><strong>Weight:</strong> {playerMeasurements.weight ? `${playerMeasurements.weight} lbs` : 'N/A'}</li>
                        <li><strong>Max Vertical:</strong> {playerMeasurements.maxVertical ? `${playerMeasurements.maxVertical}"` : 'N/A'}</li>
                        <li><strong>No-Step Vertical:</strong> {playerMeasurements.noStepVertical ? `${playerMeasurements.noStepVertical}"` : 'N/A'}</li>
                        <li><strong>Hand Length:</strong> {playerMeasurements.handLength ? `${playerMeasurements.handLength}"` : 'N/A'}</li>
                        <li><strong>Hand Width:</strong> {playerMeasurements.handWidth ? `${playerMeasurements.handWidth}"` : 'N/A'}</li>
                        <li><strong>Agility:</strong> {playerMeasurements.agility ? `${playerMeasurements.agility} sec` : 'N/A'}</li>
                        <li><strong>Sprint:</strong> {playerMeasurements.sprint ? `${playerMeasurements.sprint} sec` : 'N/A'}</li>
                        <li><strong>Shuttle Best:</strong> {playerMeasurements.shuttleBest ? `${playerMeasurements.shuttleBest} sec` : 'N/A'}</li>
                        <li><strong>Body Fat %:</strong> {playerMeasurements.bodyFat ? `${playerMeasurements.bodyFat}%` : 'N/A'}</li>
                    </ul>
                    <MeasurementComparison player={player} measurements={measurements} />
                </Paper>
            ) : <Typography>No measurements available for this player.</Typography>}

            {/* Career Averages */}
            <Typography variant="h4" gutterBottom>{player.name} – Career Averages</Typography>
            {seasonLogs.length > 0 ? (() => {
                const totalGP = seasonLogs.reduce((sum, s) => sum + s.GP, 0);
                const weightedAvg = (key) => {
                    const total = seasonLogs.reduce((sum, s) => sum + (s[key] ?? 0) * s.GP, 0);
                    return totalGP > 0 ? (total / totalGP).toFixed(1) : '—';
                };
                return (
                    <TableContainer component={Paper} sx={{ mb: 6 }}$1>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>GP</TableCell><TableCell>MP</TableCell><TableCell>PTS</TableCell><TableCell>REB</TableCell><TableCell>AST</TableCell>
                                    <TableCell>STL</TableCell><TableCell>BLK</TableCell><TableCell>TOV</TableCell><TableCell>Fouls</TableCell>
                                    <TableCell>FG%</TableCell><TableCell>3P%</TableCell><TableCell>FT%</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{totalGP}</TableCell>
                                    <TableCell>{weightedAvg('MP')}</TableCell>
                                    <TableCell>{weightedAvg('PTS')}</TableCell>
                                    <TableCell>{weightedAvg('TRB')}</TableCell>
                                    <TableCell>{weightedAvg('AST')}</TableCell>
                                    <TableCell>{weightedAvg('STL')}</TableCell>
                                    <TableCell>{weightedAvg('BLK')}</TableCell>
                                    <TableCell>{weightedAvg('TOV')}</TableCell>
                                    <TableCell>{weightedAvg('PF')}</TableCell>
                                    <TableCell>{weightedAvg('FG%')}</TableCell>
                                    <TableCell>{weightedAvg('3P%')}</TableCell>
                                    <TableCell>{weightedAvg('FTP')}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                );
            })() : <Typography>No season data available to calculate career averages.</Typography>}

            {/* Development Chart */}
            <PlayerDevelopment seasonLogs={seasonLogs} player={player} />

            {/* Season dropdown */}
            {availableSeasons.length > 0 && (
                <FormControl fullWidth sx={{ mt: 5, mb: 2 }}>
                    <InputLabel>Select Season</InputLabel>
                    <Select
                        value={selectedSeason}
                        label="Select Season"
                        onChange={(e) => setSelectedSeason(Number(e.target.value))}
                    >
                        {availableSeasons.map(season => (
                            <MenuItem key={season} value={season}>{season}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            {/* Season Averages */}
            <Typography variant="h4" gutterBottom>{player.name} – Season Averages</Typography>
            {selectedSeason && (() => {
                const logs = seasonLogs.filter(s => s.Season === selectedSeason);
                return logs.length > 0 ? (
                    <TableContainer component={Paper} sx={{ mb: 6 }}$1>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Team</TableCell><TableCell>League</TableCell><TableCell>GP</TableCell><TableCell>MP</TableCell><TableCell>PTS</TableCell>
                                    <TableCell>REB</TableCell><TableCell>AST</TableCell><TableCell>STL</TableCell><TableCell>BLK</TableCell>
                                    <TableCell>TOV</TableCell><TableCell>Fouls</TableCell><TableCell>FG%</TableCell><TableCell>3P%</TableCell><TableCell>FT%</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logs.map((seasonLog, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{seasonLog.Team}</TableCell>
                                        <TableCell>{seasonLog.League}</TableCell>
                                        <TableCell>{seasonLog.GP}</TableCell>
                                        <TableCell>{seasonLog.MP}</TableCell>
                                        <TableCell>{seasonLog.PTS}</TableCell>
                                        <TableCell>{seasonLog.TRB}</TableCell>
                                        <TableCell>{seasonLog.AST}</TableCell>
                                        <TableCell>{seasonLog.STL}</TableCell>
                                        <TableCell>{seasonLog.BLK}</TableCell>
                                        <TableCell>{seasonLog.TOV}</TableCell>
                                        <TableCell>{seasonLog.PF}</TableCell>
                                        <TableCell>{seasonLog['FG%']}</TableCell>
                                        <TableCell>{seasonLog['3P%']}</TableCell>
                                        <TableCell>{seasonLog.FTP}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : <Typography>No season stats available for the selected year.</Typography>;
            })()}

            {/* Game Logs */}
            <Typography variant="h4" gutterBottom>{player.name} – Game Logs</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Sort By Stat</InputLabel>
                <Select
                    value={sortByStat || ''}
                    label="Sort By Stat"
                    onChange={(e) => setSortByStat(e.target.value || null)}
                >
                    <MenuItem value="">-- None --</MenuItem>
                    <MenuItem value="pts">Points</MenuItem>
                    <MenuItem value="reb">Rebounds</MenuItem>
                    <MenuItem value="ast">Assists</MenuItem>
                    <MenuItem value="stl">Steals</MenuItem>
                    <MenuItem value="blk">Blocks</MenuItem>
                    <MenuItem value="tov">Turnovers</MenuItem>
                    <MenuItem value="plusMinus">Plus/Minus</MenuItem>
                    <MenuItem value="fgm">FG Made</MenuItem>
                    <MenuItem value="fga">FG Attempted</MenuItem>
                    <MenuItem value="tpm">3P Made</MenuItem>
                    <MenuItem value="tpa">3P Attempted</MenuItem>
                    <MenuItem value="ftm">FT Made</MenuItem>
                    <MenuItem value="fta">FT Attempted</MenuItem>
                    <MenuItem value="pf">Fouls</MenuItem>
                    <MenuItem value="timePlayed">Minutes Played</MenuItem>
                </Select>
            </FormControl>

            {displayedLogs.length === 0 ? (
                <Typography>No game logs available for the selected season.</Typography>
            ) : (
                <TableContainer component={Paper} sx={{ mb: 6 }}$1>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell><TableCell>Opponent</TableCell><TableCell>PTS</TableCell><TableCell>REB</TableCell><TableCell>AST</TableCell>
                                <TableCell>STL</TableCell><TableCell>BLK</TableCell><TableCell>TOV</TableCell><TableCell>+/-</TableCell>
                                <TableCell>FGM-FGA</TableCell><TableCell>3PM-3PA</TableCell><TableCell>FTM-FTA</TableCell><TableCell>Fouls</TableCell><TableCell>Minutes</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedLogs.map((game, index) => (
                                <TableRow key={index}>
                                    <TableCell>{game.date.split(' ')[0]}</TableCell>
                                    <TableCell>{game.opponent}</TableCell>
                                    <TableCell>{game.pts}</TableCell>
                                    <TableCell>{game.reb}</TableCell>
                                    <TableCell>{game.ast}</TableCell>
                                    <TableCell>{game.stl}</TableCell>
                                    <TableCell>{game.blk}</TableCell>
                                    <TableCell>{game.tov}</TableCell>
                                    <TableCell>{game.plusMinus ?? '—'}</TableCell>
                                    <TableCell>{game.fgm}-{game.fga}</TableCell>
                                    <TableCell>{game.tpm ?? game['3PM']}-{game.tpa ?? game['3PA']}</TableCell>
                                    <TableCell>{game.ftm}-{game.fta}</TableCell>
                                    <TableCell>{game.pf}</TableCell>
                                    <TableCell>{game.timePlayed}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default StatsMeasurementsPage;
