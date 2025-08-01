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
    const { id } = useParams(); // Extracts the player ID from the URL
    const [player, setPlayer] = useState(null); // Holds the full player data including bio and rankings

    // === Fetch player data when component mounts or when `id` changes ===
    useEffect(() => {
        fetch('/project_data.json')
            .then(res => res.json())
            .then(data => {
                // Find the player bio by matching playerId from URL
                const foundPlayer = data.bio.find(p => p.playerId.toString() === id);
                // Get scout rankings for that player
                const rankings = data.scoutRankings.find(r => r.playerId.toString() === id);
                // Merge both and store in state
                setPlayer({ ...foundPlayer, scoutRankings: rankings });
            });
    }, [id]);

    // === Utility: Calculate player's age based on birthdate ===
    const calculateAge = (birthDateString) => {
        const birthDate = new Date(birthDateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();

        // Adjust age if the player hasn't had their birthday yet this year
        const hasHadBirthdayThisYear =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

        if (!hasHadBirthdayThisYear) age -= 1;
        return age;
    };

    // === Show loading message while data is being fetched ===
    if (!player) return <Typography>Loading...</Typography>;

    // === Utility: Extract YouTube video ID from either standard or shortened URL formats ===
    const extractYoutubeId = (url) => {
        try {
            const urlObj = new URL(url);

            // Handle shortened format like: https://youtu.be/VIDEO_ID
            if (urlObj.hostname.includes("youtu.be")) {
                return urlObj.pathname.slice(1); // Removes the leading slash and returns the video ID
            }

            // Handle standard format like: https://www.youtube.com/watch?v=VIDEO_ID
            return urlObj.searchParams.get("v");
        } catch {
            // If the URL is invalid or cannot be parsed, return null
            return null;
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* === NBA Draft Logo in Top Right === */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 100,
                    right: 16,
                    display: { xs: 'none', sm: 'block' }, // hide on phones
                    width: { sm: 180, md: 250, lg: 300, xl: 350 }, // scale for screen size
                }}
            >
                <Box
                    component="img"
                    src="/nba_draft.png"
                    alt="NBA Draft Logo"
                    sx={{
                        width: '100%',
                        height: 'auto',
                    }}
                />
            </Box>

            {/* === Back Navigation Button === */}
            <Box mb={2}>
                <Button component={Link} to="/" variant="outlined">
                    ← Back to Big Board
                </Button>
            </Box>

            {/* === Main Player Info Card === */}
            <Card elevation={3}>
                <CardContent>
                    <Grid container spacing={3}>
                        {/* === Left Column: Player Image and Name === */}
                        <Grid item xs={12} sm={4}>
                            {player.photoUrl ? (
                                <Avatar
                                    src={player.photoUrl}
                                    alt={player.name}
                                    sx={{
                                        width: { xs: 100, sm: 120, md: 150 },
                                        height: { xs: 100, sm: 120, md: 150 },
                                        mx: 'auto',
                                    }}
                                />
                            ) : (
                                <Avatar
                                    sx={{
                                        width: { xs: 100, sm: 120, md: 150 },
                                        height: { xs: 100, sm: 120, md: 150 },
                                        mx: 'auto',
                                    }}
                                >
                                    {player.name[0]}
                                </Avatar>
                            )}
                            <Typography variant="h5" align="center" mt={2}>
                                {player.name}
                            </Typography>
                        </Grid>

                        {/* === Right Column: Player Bio Information === */}
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

            {/* === Navigation Buttons to Additional Player Pages === */}
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

            {/* === Divider and Scout Rankings Section === */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>Mavericks Scout Rankings</Typography>

            {/* === Scout Rankings List === */}
            <Box component="ul" sx={{ pl: 2 }}>
                {Object.entries(player.scoutRankings || {}).map(([scout, rank]) => {
                    if (scout === "playerId") return null; // Skip internal ID field
                    return (
                        <li key={scout}>
                            <Typography variant="body2">
                                {scout}: {rank ?? 'N/A'} {/* Show N/A if rank is undefined/null */}
                            </Typography>
                        </li>
                    );
                })}

            </Box>
            {/* === Highlight Reel === */}
            {player.youtubeID && extractYoutubeId(player.youtubeID) && (
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>Highlight Reel</Typography>
                    <Box
                        sx={{
                            position: 'relative',
                            paddingBottom: '56.25%',
                            height: 0,
                            overflow: 'hidden',
                            borderRadius: 2,
                            boxShadow: 3
                        }}
                    >
                        <iframe
                            src={`https://www.youtube.com/embed/${extractYoutubeId(player.youtubeID)}`}
                            title="Player Highlight"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%'
                            }}
                        />
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default PlayerPage;
