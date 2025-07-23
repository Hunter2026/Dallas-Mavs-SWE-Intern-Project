import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import CompareChart from '../components/CompareChart.jsx';
import {
    Container,
    Paper,
    Typography,
    Grid,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
    Alert,
    Button
} from '@mui/material';

const ComparePage = () => {
    const location = useLocation(); // React Router hook to access URL query parameters
    const query = new URLSearchParams(location.search); // Parse query string
    const ids = query.get('ids')?.split(',').slice(0, 3) || []; // Extract up to 3 player IDs

    const [players, setPlayers] = useState([]);         // Player bios to be displayed
    const [measurements, setMeasurements] = useState([]); // Measurement data for selected players
    const [seasonLogs, setSeasonLogs] = useState([]);     // Season log data for selected players

    // === Fetch player, measurement, and season data when IDs change ===
    useEffect(() => {
        fetch('/project_data.json')
            .then(res => res.json())
            .then(data => {
                const selectedPlayers = data.bio.filter(p => ids.includes(p.playerId.toString()));
                const selectedMeasurements = data.measurements?.filter(m => ids.includes(m.playerId?.toString())) || [];
                const selectedSeasonLogs = data.seasonLogs?.filter(l => ids.includes(l.playerId?.toString())) || [];

                setPlayers(selectedPlayers);
                setMeasurements(selectedMeasurements);
                setSeasonLogs(selectedSeasonLogs);
            });
    }, [ids]);

    // === Helper: Get a specific measurement value for a player ===
    const getMeasurements = (playerId, key) => {
        const m = measurements.find(m => m.playerId?.toString() === playerId.toString());
        const val = m?.[key];
        return val !== undefined && val !== null ? val : 'N/A';
    };

    // === Helper: Compute career average for a given stat ===
    const getCareerAvg = (playerId, statKey) => {
        const logs = seasonLogs.filter(l => l.playerId?.toString() === playerId.toString());
        const totalGP = logs.reduce((sum, l) => sum + l.GP, 0); // Total games played
        if (totalGP === 0) return '—';
        const total = logs.reduce((sum, l) => sum + (l[statKey] ?? 0) * l.GP, 0); // Weighted sum
        return (total / totalGP).toFixed(1); // Weighted average
    };

    // === Guard clause: If fewer than 2 players are selected ===
    if (!players || players.length < 2) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography variant="h5" gutterBottom>Player Comparison</Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                    Please select at least <strong>two players</strong> to compare.
                </Alert>
                <Button component={Link} to="/" variant="contained">Return to Big Board</Button>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            {/* === Navigation Header === */}
            <Box mb={3}>
                <Button component={Link} to="/" variant="outlined">← Back to Big Board</Button>
            </Box>

            <Typography variant="h4" gutterBottom>Player Comparison</Typography>

            {/* === Comparison Cards for Each Player === */}
            <Grid container spacing={4} justifyContent="center" mb={4}>
                {players.map(player => (
                    <Grid item xs={12} sm={6} md={4} key={player.playerId}>
                        <Paper elevation={3} sx={{ p: 3, minWidth: '280px', maxWidth: '380px', mx: 'auto' }}>
                            <Typography variant="h6">{player.name}</Typography>
                            <Typography variant="body2" gutterBottom><strong>Team:</strong> {player.currentTeam}</Typography>
                            <Typography variant="body2" gutterBottom><strong>League:</strong> {player.league}</Typography>

                            {/* === Player Measurements === */}
                            <Typography variant="subtitle1" sx={{ mt: 2 }}><strong>Measurements</strong></Typography>
                            <List dense>
                                <ListItem><ListItemText primary={<strong>Height (No Shoes):</strong>} secondary={`${getMeasurements(player.playerId, 'heightNoShoes')}"`} /></ListItem>
                                <ListItem><ListItemText primary={<strong>Height (With Shoes):</strong>} secondary={`${getMeasurements(player.playerId, 'heightShoes')}"`} /></ListItem>
                                <ListItem><ListItemText primary={<strong>Wingspan:</strong>} secondary={`${getMeasurements(player.playerId, 'wingspan')}"`} /></ListItem>
                                <ListItem><ListItemText primary={<strong>Standing Reach:</strong>} secondary={`${getMeasurements(player.playerId, 'reach')}"`} /></ListItem>
                                <ListItem><ListItemText primary={<strong>Weight:</strong>} secondary={`${getMeasurements(player.playerId, 'weight')} lbs`} /></ListItem>
                                <ListItem><ListItemText primary={<strong>Max Vertical:</strong>} secondary={`${getMeasurements(player.playerId, 'maxVertical')}"`} /></ListItem>
                                <ListItem><ListItemText primary={<strong>No-Step Vertical:</strong>} secondary={`${getMeasurements(player.playerId, 'noStepVertical')}"`} /></ListItem>
                                <ListItem><ListItemText primary={<strong>Hand Length:</strong>} secondary={`${getMeasurements(player.playerId, 'handLength')}"`} /></ListItem>
                                <ListItem><ListItemText primary={<strong>Hand Width:</strong>} secondary={`${getMeasurements(player.playerId, 'handWidth')}"`} /></ListItem>
                                <ListItem><ListItemText primary={<strong>Agility:</strong>} secondary={`${getMeasurements(player.playerId, 'agility')} sec`} /></ListItem>
                                <ListItem><ListItemText primary={<strong>Sprint:</strong>} secondary={`${getMeasurements(player.playerId, 'sprint')} sec`} /></ListItem>
                                <ListItem><ListItemText primary={<strong>Shuttle Best:</strong>} secondary={`${getMeasurements(player.playerId, 'shuttleBest')} sec`} /></ListItem>
                                <ListItem><ListItemText primary={<strong>Body Fat %:</strong>} secondary={getMeasurements(player.playerId, 'bodyFat')} /></ListItem>
                            </List>

                            {/* === Career Stats Section === */}
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1"><strong>Career Averages</strong></Typography>
                            <List dense>
                                <ListItem><ListItemText primary={<strong>PTS:</strong>} secondary={getCareerAvg(player.playerId, 'PTS')} /></ListItem>
                                <ListItem><ListItemText primary={<strong>TRB:</strong>} secondary={getCareerAvg(player.playerId, 'TRB')} /></ListItem>
                                <ListItem><ListItemText primary={<strong>AST:</strong>} secondary={getCareerAvg(player.playerId, 'AST')} /></ListItem>
                                <ListItem><ListItemText primary={<strong>STL:</strong>} secondary={getCareerAvg(player.playerId, 'STL')} /></ListItem>
                                <ListItem><ListItemText primary={<strong>BLK:</strong>} secondary={getCareerAvg(player.playerId, 'BLK')} /></ListItem>
                                <ListItem><ListItemText primary={<strong>TOV:</strong>} secondary={getCareerAvg(player.playerId, 'TOV')} /></ListItem>
                                <ListItem><ListItemText primary={<strong>FG%:</strong>} secondary={getCareerAvg(player.playerId, 'FG%')} /></ListItem>
                                <ListItem><ListItemText primary={<strong>3P%:</strong>} secondary={getCareerAvg(player.playerId, '3P%')} /></ListItem>
                                <ListItem><ListItemText primary={<strong>FT%:</strong>} secondary={getCareerAvg(player.playerId, 'FTP')} /></ListItem>
                            </List>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* === Comparison Chart Visualization === */}
            <CompareChart
                players={players}
                seasonLogs={seasonLogs}
                measurements={measurements}
            />
        </Container>
    );
};

export default ComparePage;
