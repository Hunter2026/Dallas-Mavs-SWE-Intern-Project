import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    Paper,
    Stack,
    Grid,
    Snackbar,
    Alert
} from '@mui/material';
import PlayerCard from '../components/PlayerCard.jsx';

const HomePage = () => {
    // === State hooks for filters, sorting, and comparison ===
    const [players, setPlayers] = useState([]);               // Full merged player list
    const [sortBy, setSortBy] = useState('average');          // Sorting method
    const [searchQuery, setSearchQuery] = useState('');       // Search input
    const [teamFilter, setTeamFilter] = useState('');         // Team dropdown
    const [leagueFilter, setLeagueFilter] = useState('');     // League dropdown
    const [allTeams, setAllTeams] = useState([]);             // Available team options
    const [allLeagues, setAllLeagues] = useState([]);         // Available league options
    const [compareList, setCompareList] = useState([]);       // Players selected for comparison
    const [snackOpen, setSnackOpen] = useState(false);        // Snackbar open state for max compare limit

    // === Load and prepare player data on component mount or when sort changes ===
    useEffect(() => {
        fetch('/intern_project_data.json')
            .then((res) => res.json())
            .then((data) => {
                // Merge bio and ranking info into single player object
                const merged = data.bio.map(player => {
                    const ranking = data.scoutRankings.find(r => r.playerId === player.playerId);
                    return { ...player, scoutRankings: ranking };
                });

                // Populate unique team and league filter options
                setAllTeams([...new Set(merged.map(p => p.currentTeam).filter(Boolean))].sort());
                setAllLeagues([...new Set(merged.map(p => p.league).filter(Boolean))].sort());

                // Sort merged players using current sorting method
                const sorted = [...merged].sort((a, b) => {
                    const rankA = getRankValue(a.scoutRankings, sortBy);
                    const rankB = getRankValue(b.scoutRankings, sortBy);
                    return rankA - rankB;
                });

                setPlayers(sorted);
            });
    }, [sortBy]);

    // === Helper: Get value to sort by (average or individual scout rank) ===
    const getRankValue = (rankings = {}, key) => {
        if (!rankings) return Infinity;

        if (key === 'average') {
            const values = Object.entries(rankings)
                .filter(([k, v]) => k !== 'playerId' && typeof v === 'number');
            if (values.length === 0) return Infinity;
            const sum = values.reduce((acc, [_, val]) => acc + val, 0);
            return sum / values.length;
        }

        return typeof rankings[key] === 'number' ? rankings[key] : Infinity;
    };

    // === Toggle a player in/out of the comparison list ===
    const toggleCompare = (player) => {
        const exists = compareList.find(p => p.playerId === player.playerId);

        if (exists) {
            // Remove player directly
            setCompareList(compareList.filter(p => p.playerId !== player.playerId));
        } else if (compareList.length < 3) {
            // Add player
            setCompareList([...compareList, player]);
        } else {
            // Show snackbar if attempting to add a 4th player
            setSnackOpen(true);
        }
    };

    // === Apply filters and search to player list ===
    const filteredPlayers = players.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!teamFilter || p.currentTeam === teamFilter) &&
        (!leagueFilter || p.league === leagueFilter)
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Page Title with Mavericks Logo */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight={600}>
                    NBA Draft Big Board
                </Typography>

                {/* Mavericks logo image */}
                <img
                    src="/mavs.png"
                    alt="Mavericks Logo"
                    style={{
                        height: 110,
                        objectFit: 'contain'
                    }}
                />
            </Box>

            {/* === Comparison Banner === */}
            {compareList.length > 0 && (
                <Paper elevation={3} sx={{ p: 2, mb: 3, bgcolor: '#eef4ff' }}>
                    <Typography variant="body1" component="span">
                        <strong>Comparing:</strong> {compareList.map(p => p.name).join(', ')}
                    </Typography>
                    <Button
                        component={Link}
                        to={`/compare?ids=${compareList.map(p => p.playerId).join(',')}`}
                        variant="contained"
                        color="primary"
                        sx={{ ml: 2 }}
                    >
                        View Comparison
                    </Button>
                </Paper>
            )}

            {/* === Filter Section === */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                {/* Search Input */}
                <TextField
                    label="Search Player"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ minWidth: 200 }}
                />

                {/* Team Filter Dropdown */}
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="team-label">Filter by Team</InputLabel>
                    <Select
                        labelId="team-label"
                        value={teamFilter}
                        label="Filter by Team"
                        onChange={(e) => setTeamFilter(e.target.value)}
                    >
                        <MenuItem value="">All Teams</MenuItem>
                        {allTeams.map(team => (
                            <MenuItem key={team} value={team}>{team}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* League Filter Dropdown */}
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="league-label">Filter by League</InputLabel>
                    <Select
                        labelId="league-label"
                        value={leagueFilter}
                        label="Filter by League"
                        onChange={(e) => setLeagueFilter(e.target.value)}
                    >
                        <MenuItem value="">All Leagues</MenuItem>
                        {allLeagues.map(league => (
                            <MenuItem key={league} value={league}>{league}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Sort Method Dropdown */}
                <FormControl sx={{ minWidth: 250 }}>
                    <InputLabel id="sort-label">Sort By</InputLabel>
                    <Select
                        labelId="sort-label"
                        value={sortBy}
                        label="Sort By"
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <MenuItem value="average">Average Scout Ranking</MenuItem>
                        <MenuItem value="ESPN Rank">ESPN Rank</MenuItem>
                        <MenuItem value="Sam Vecenie Rank">Sam Vecenie Rank</MenuItem>
                        <MenuItem value="Kevin O'Connor Rank">Kevin O'Connor Rank</MenuItem>
                        <MenuItem value="Kyle Boone Rank">Kyle Boone Rank</MenuItem>
                        <MenuItem value="Gary Parrish Rank">Gary Parrish Rank</MenuItem>
                    </Select>
                </FormControl>
            </Stack>

            {/* === Player Cards Grid === */}
            <Grid container spacing={3}>
                {filteredPlayers.map(player => (
                    <Grid item xs={12} sm={6} md={4} key={player.playerId}>
                        <PlayerCard
                            player={player}
                            onCompareToggle={toggleCompare}
                            isSelected={compareList.some(p => p.playerId === player.playerId)}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* === Snackbar for Max Compare Limit === */}
            <Snackbar
                open={snackOpen}
                autoHideDuration={3000}
                onClose={() => setSnackOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackOpen(false)}
                    severity="warning"
                    sx={{ width: '100%' }}
                >
                    You can only compare up to 3 players.
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default HomePage;
