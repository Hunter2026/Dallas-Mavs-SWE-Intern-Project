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
    // === State hooks for filters, sorting, and player comparison list ===
    const [players, setPlayers] = useState([]);               // Holds all players with merged bio and rankings
    const [sortBy, setSortBy] = useState('average');          // Current sorting criteria
    const [searchQuery, setSearchQuery] = useState('');       // Current text in the search bar
    const [teamFilter, setTeamFilter] = useState('');         // Selected team filter
    const [leagueFilter, setLeagueFilter] = useState('');     // Selected league filter
    const [allTeams, setAllTeams] = useState([]);             // All unique teams for dropdown
    const [allLeagues, setAllLeagues] = useState([]);         // All unique leagues for dropdown
    const [compareList, setCompareList] = useState([]);       // List of players selected for comparison (max 3)
    const [snackOpen, setSnackOpen] = useState(false);        // Controls the visibility of snackbar

    // === Load player data from JSON file and populate filters/sort players ===
    useEffect(() => {
        fetch('/project_data.json')
            .then((res) => res.json())
            .then((data) => {
                // Merge bio and rankings into a single object per player
                const merged = data.bio.map(player => {
                    const ranking = data.scoutRankings.find(r => r.playerId === player.playerId);
                    return { ...player, scoutRankings: ranking };
                });

                // Extract unique teams and leagues for dropdown filters
                setAllTeams([...new Set(merged.map(p => p.currentTeam).filter(Boolean))].sort());
                setAllLeagues([...new Set(merged.map(p => p.league).filter(Boolean))].sort());

                // Sort players using current sort criteria
                const sorted = [...merged].sort((a, b) => {
                    const rankA = getRankValue(a.scoutRankings, sortBy);
                    const rankB = getRankValue(b.scoutRankings, sortBy);
                    return rankA - rankB;
                });

                setPlayers(sorted);
            });
    }, [sortBy]); // Reload whenever sort method changes

    // === Helper function to determine ranking value for sorting ===
    const getRankValue = (rankings = {}, key) => {
        if (!rankings) return Infinity; // No data means lowest priority

        if (key === 'average') {
            const values = Object.entries(rankings)
                .filter(([k, v]) => k !== 'playerId' && typeof v === 'number');
            if (values.length === 0) return Infinity;
            const sum = values.reduce((acc, [_, val]) => acc + val, 0);
            return sum / values.length;
        }

        return typeof rankings[key] === 'number' ? rankings[key] : Infinity;
    };

    // === Add/remove a player from the comparison list (max 3 players) ===
    const toggleCompare = (player) => {
        const exists = compareList.find(p => p.playerId === player.playerId);

        if (exists) {
            // Remove player if already in list
            setCompareList(compareList.filter(p => p.playerId !== player.playerId));
        } else if (compareList.length < 3) {
            // Add player if under limit
            setCompareList([...compareList, player]);
        } else {
            // Show snackbar warning if limit exceeded
            setSnackOpen(true);
        }
    };

    // === Filter players based on search input, team, and league ===
    const filteredPlayers = players.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!teamFilter || p.currentTeam === teamFilter) &&
        (!leagueFilter || p.league === leagueFilter)
    );

    // === Clear all filters ===
    const resetFilters = () => {
        setSearchQuery('');
        setTeamFilter('');
        setLeagueFilter('');
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* === Title and Top Logo === */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: { xs: 'none', sm: 'block' },
                    width: { sm: 60, md: 100, lg: 140, xl: 180 },
                }}
            >
                <Box
                    component="img"
                    src="/mavs.png"
                    alt="Mavericks Logo"
                    sx={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain',
                    }}
                />
            </Box>

            {/* Title */}
            <Typography
                variant="h3"
                align="center"
                sx={{
                    mt: { xs: 4, md: 2 },
                    mb: 4,
                    fontWeight: 600,
                    fontSize: { xs: '1.75rem', md: '2.5rem' },
                }}
            >
                NextUp NBA Draft Hub
            </Typography>

            {/* === Comparison Preview Banner === */}
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

            {/* === Filter Controls Section === */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                {/* Search bar for player names */}
                <TextField
                    label="Search Player"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ minWidth: 200 }}
                />

                {/* Dropdown for team selection */}
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

                {/* Dropdown for league selection */}
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

                {/* Dropdown for sorting method */}
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

                {/* Button to reset all filters */}
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={resetFilters}
                    sx={{ minWidth: 150 }}
                >
                    Reset Filters
                </Button>
            </Stack>

            {/* === Grid of Player Cards === */}
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

            {/* === Snackbar for Too Many Comparisons === */}
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
