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
        <Card
            sx={{
                margin: 2,
                backgroundColor: isSelected ? '#e0f7ff' : 'white',
                border: isSelected ? '2px solid #1976d2' : '1px solid #ccc',
                boxShadow: 2
            }}
        >
            <CardContent>
                {/* Player name as link */}
                <Typography variant="h6" component={Link} to={`/player/${player.playerId}`} sx={{ textDecoration: 'none', color: '#1976d2' }}>
                    {player.name}
                </Typography>

                {/* Team and league info */}
                <Typography variant="body2">Team: {player.currentTeam}</Typography>
                <Typography variant="body2" gutterBottom>League: {player.league}</Typography>

                {/* Scout rankings */}
                <Typography variant="subtitle1" sx={{ mt: 1 }}>Mavericks Scout Rankings:</Typography>
                <List dense>
                    {Object.entries(ranks).map(([scout, rank]) => {
                        if (scout === "playerId") return null;

                        let color = 'text.primary';
                        let delta = null;

                        if (typeof rank === 'number' && average !== null) {
                            delta = +(rank - average).toFixed(1);
                            if (delta < 0) color = 'success.main';
                            if (delta > 0) color = 'error.main';
                        }

                        return (
                            <ListItem key={scout} disablePadding>
                                <ListItemText
                                    primary={
                                        <Typography sx={{ color }} variant="body2">
                                            {scout}: {rank ?? 'N/A'}
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

                {/* Compare button */}
                <Box textAlign="center" mt={2}>
                    <Button
                        variant={isSelected ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={() => onCompareToggle(player)}
                    >
                        {isSelected ? 'Remove from Compare' : 'Add to Compare'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PlayerCard;
