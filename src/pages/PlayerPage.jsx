import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Avatar,
    Divider,
} from '@mui/material';

const PlayerPage = () => {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);

    // Fetch player data on load
    useEffect(() => {
        fetch('/intern_project_data.json')
            .then(res => res.json())
            .then(data => {
                const foundPlayer = data.bio.find(p => p.playerId.toString() === id);
                const rankings = data.scoutRankings.find(r => r.playerId.toString() === id);
                setPlayer({ ...foundPlayer, scoutRankings: rankings });
            });
    }, [id]);

    // Calculate age from birthdate
    const calculateAge = (birthDateString) => {
        const birthDate = new Date(birthDateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();

        const hasHadBirthdayThisYear =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

        if (!hasHadBirthdayThisYear) age -= 1;
        return age;
    };

    if (!player) return <Typography>Loading...</Typography>;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* NBA Draft Logo in Top Right */}
            <Box sx={{ position: 'absolute', top: 100, right: 100 }}>
                <img
                    src="/NBA Draft.png"
                    alt="NBA Draft Logo"
                    style={{ width: 300, height: 'auto' }}
                />
            </Box>

            {/* Back link */}
            <Box mb={2}>
                <Button component={Link} to="/" variant="outlined">
                    ← Back to Big Board
                </Button>
            </Box>

            {/* Player Info Card */}
            <Card elevation={3}>
                <CardContent>
                    <Grid container spacing={3}>
                        {/* Avatar and Name */}
                        <Grid item xs={12} sm={4}>
                            {player.photoUrl ? (
                                <Avatar
                                    src={player.photoUrl}
                                    alt={player.name}
                                    sx={{ width: 150, height: 150, mx: 'auto' }}
                                />
                            ) : (
                                <Avatar sx={{ width: 150, height: 150, mx: 'auto' }}>
                                    {player.name[0]}
                                </Avatar>
                            )}
                            <Typography variant="h5" align="center" mt={2}>
                                {player.name}
                            </Typography>
                        </Grid>

                        {/* Bio Info */}
                        <Grid item xs={12} sm={8}>
                            <Typography><strong>Current Team:</strong> {player.currentTeam}</Typography>
                            <Typography><strong>Age:</strong> {calculateAge(player.birthDate)}</Typography>
                            <Typography>
                                <strong>Height:</strong> {Math.floor(player.height / 12)}′ {player.height % 12}″
                            </Typography>
                            <Typography><strong>Weight:</strong> {player.weight} lbs</Typography>
                            <Typography>
                                <strong>Hometown:</strong> {player.homeTown}, {player.homeState || player.homeCountry}
                            </Typography>
                            <Typography><strong>Nationality:</strong> {player.nationality}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Navigation buttons */}
            <Box mt={3} mb={2} display="flex" gap={2} flexWrap="wrap">
                <Button
                    component={Link}
                    to={`/player/${player.playerId}/stats`}
                    variant="contained"
                    color="primary"
                >
                    View Stats & Measurements
                </Button>
                <Button
                    component={Link}
                    to={`/player/${player.playerId}/scouting`}
                    variant="outlined"
                >
                    Write Scouting Report
                </Button>
                <Button
                    component={Link}
                    to={`/player/${player.playerId}/report`}
                    variant="outlined"
                >
                    View Submitted Reports
                </Button>
            </Box>

            {/* Scout Rankings */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>Mavericks Scout Rankings</Typography>
            <Box component="ul" sx={{ pl: 2 }}>
                {Object.entries(player.scoutRankings || {}).map(([scout, rank]) => {
                    if (scout === "playerId") return null;
                    return (
                        <li key={scout}>
                            <Typography variant="body2">
                                {scout}: {rank ?? 'N/A'}
                            </Typography>
                        </li>
                    );
                })}
            </Box>
        </Container>
    );
};

export default PlayerPage;
