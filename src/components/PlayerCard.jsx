import React from 'react';
import { Link } from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    List,
    ListItem,
    ListItemText
} from '@mui/material';

// === Component: PlayerCard ===
// Renders a single player's summary, scout rankings, and comparison toggle option
const PlayerCard = ({ player, onCompareToggle, isSelected }) => {
    const ranks = player.scoutRankings || {}; // Fallback if rankings are not available

    // === Extract numeric rankings only (ignore playerId and nulls) ===
    const numericRanks = Object.entries(ranks)
        .filter(([key, value]) => key !== "playerId" && typeof value === 'number')
        .map(([, rank]) => rank);

    // === Calculate average of numeric rankings for delta comparison ===
    const average =
        numericRanks.length > 0
            ? numericRanks.reduce((sum, r) => sum + r, 0) / numericRanks.length
            : null;

    return (
        <Card
            sx={{
                margin: 2,
                backgroundColor: isSelected ? '#e0f7ff' : 'white', // Highlight if selected for comparison
                border: isSelected ? '2px solid #1976d2' : '1px solid #ccc',
                boxShadow: 2
            }}
        >
            <CardContent>
                {/* === Player Name (clickable link to player profile page) === */}
                <Typography
                    variant="h6"
                    component={Link}
                    to={`/player/${player.playerId}`}
                    sx={{ textDecoration: 'none', color: '#1976d2' }}
                >
                    {player.name}
                </Typography>

                {/* === Basic Info: Team & League === */}
                <Typography variant="body2">Team: {player.currentTeam}</Typography>
                <Typography variant="body2" gutterBottom>League: {player.league}</Typography>

                {/* === Scout Rankings Section === */}
                <Typography variant="subtitle1" sx={{ mt: 1 }}>Mavericks Scout Rankings:</Typography>
                <List dense>
                    {Object.entries(ranks).map(([scout, rank]) => {
                        if (scout === "playerId") return null; // Skip playerId key

                        let color = 'text.primary'; // Default text color
                        let delta = null;

                        // Compute delta vs average and set color accordingly
                        if (typeof rank === 'number' && average !== null) {
                            delta = +(rank - average).toFixed(1); // Difference from average
                            if (delta < 0) color = 'success.main'; // Better than avg
                            if (delta > 0) color = 'error.main';   // Worse than avg
                        }

                        return (
                            <ListItem key={scout} disablePadding>
                                <ListItemText
                                    primary={
                                        <Typography sx={{ color }} variant="body2">
                                            {scout}: {rank ?? 'N/A'}
                                            {/* Show delta if applicable */}
                                            {delta !== null && (
                                                <span> ({delta > 0 ? '+' : ''}{delta})</span>
                                            )}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        );
                    })}
                </List>

                {/* === Compare Button === */}
                <Box textAlign="center" mt={2}>
                    <Button
                        variant={isSelected ? 'contained' : 'outlined'} // Contained if selected
                        color="primary"
                        onClick={() => onCompareToggle(player)} // Trigger callback
                    >
                        {isSelected ? 'Remove from Compare' : 'Add to Compare'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PlayerCard;
