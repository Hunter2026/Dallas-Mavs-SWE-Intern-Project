import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SummaryGenerator from '../components/SummaryGenerator.jsx';
import {
    Container,
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    Button
} from '@mui/material';

const SubmittedScoutReportPage = () => {
    const { id } = useParams(); // Get the player ID from the URL
    const [reports, setReports] = useState([]); // Array of scouting reports for the player
    const [player, setPlayer] = useState(null); // Bio data of the player

    // === Load saved scouting reports from localStorage on component mount ===
    useEffect(() => {
        const saved = localStorage.getItem(`report_player_${id}`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Ensure only valid report objects are used
                const safeReports = Array.isArray(parsed)
                    ? parsed.filter(r => r && typeof r === 'object' && r.createdAt)
                    : (parsed && parsed.createdAt ? [parsed] : []);

                setReports(safeReports);
            } catch (e) {
                // Log an error if JSON parsing fails (corrupt localStorage data)
                console.error('Corrupt scouting data for player', id);
                setReports([]);
            }
        } else {
            setReports([]);
        }
    }, [id]);

    // === Fetch player bio information for display (name, etc.) ===
    useEffect(() => {
        fetch('/project_data.json')
            .then(res => res.json())
            .then(data => {
                const found = data.bio.find(p => p.playerId.toString() === id);
                setPlayer(found);
            });
    }, [id]);

    // === Delete a specific report by its createdAt timestamp ===
    const handleDeleteReport = (timestamp) => {
        const updated = reports.filter(r => r.createdAt !== timestamp); // Remove report from array
        setReports(updated); // Update state
        localStorage.setItem(`report_player_${id}`, JSON.stringify(updated)); // Sync with localStorage
    };

    return (
        <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
            {/* === NBA Logo at Top Right === */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: { xs: 'none', sm: 'block' }, // hide on phones
                    width: { sm: '180px', md: '300px', lg: '350px', xl: '400px' }, // responsive scaling
                }}
            >
                <Box
                    component="img"
                    src="/scouting_report_profile.png"
                    alt="Scouting Report Profile"
                    sx={{
                        width: '100%',
                        height: 'auto',
                    }}
                />
            </Box>

            {/* === Navigation Back to Player Page === */}
            <Box mb={2}>
                <Button component={Link} to={`/player/${id}`} variant="outlined">
                    ← Back to Player Profile
                </Button>
            </Box>

            {/* === Page Header === */}
            <Typography variant="h4" sx={{ mt: { xs: 8, md: 0 } }} gutterBottom>
                {player ? `${player.name} – Scouting Reports` : 'Scouting Reports'}
            </Typography>

            {/* === If no reports submitted yet === */}
            {reports.length === 0 ? (
                <Typography>No scouting reports submitted yet for this player.</Typography>
            ) : (
                <>
                    {/* === Display Most Recent Report === */}
                    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h6">Latest Report</Typography>
                        <Typography variant="body2" gutterBottom><strong>Submitted:</strong> {reports[0].createdAt}</Typography>
                        {reports[0].reportTag && (
                            <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>
                                <strong>Tag:</strong> {reports[0].reportTag}
                            </Typography>
                        )}
                        <Typography><strong>Strengths:</strong> {reports[0].strengths}</Typography>
                        <Typography><strong>Weaknesses:</strong> {reports[0].weaknesses}</Typography>
                        <Typography><strong>Player Comparison:</strong> {reports[0].comparison}</Typography>
                        <Typography><strong>Best NBA Fit:</strong> {reports[0].fit}</Typography>
                        <Typography><strong>Projected Role:</strong> {reports[0].role}</Typography>
                        <Typography><strong>Projected Ceiling:</strong> {reports[0].ceiling}</Typography>
                        <Typography><strong>Draft Range:</strong> {reports[0].range}</Typography>

                        {/* === Display Trait Ratings in a List === */}
                        <Box mt={2}>
                            <Typography variant="subtitle1">Trait Ratings:</Typography>
                            <List dense>
                                {Object.entries(reports[0].ratings).map(([trait, value]) => (
                                    <ListItem key={trait} disablePadding>
                                        <ListItemText primary={`${trait}: ${value}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>

                        {/* === Auto-Generated Summary Component === */}
                        <SummaryGenerator report={reports[0]} scrollOnGenerate={false} />

                        {/* === Option to Delete the Latest Report === */}
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            sx={{ mt: 4 }}
                            onClick={() => handleDeleteReport(reports[0].createdAt)}
                        >
                            Delete Report
                        </Button>
                    </Paper>

                    {/* === Show older reports, if any === */}
                    {reports.length > 1 && (
                        <>
                            <Typography variant="h5" gutterBottom>Previous Reports</Typography>
                            {reports.slice(1).map((rep, index) => (
                                <Paper
                                    key={index}
                                    elevation={1}
                                    sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5' }}
                                >
                                    <Typography variant="subtitle2" gutterBottom>
                                        <strong>Submitted</strong>: {rep.createdAt}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}> <strong>Tag:</strong> {rep.reportTag}</Typography>
                                    <Typography><strong>Strengths:</strong> {rep.strengths}</Typography>
                                    <Typography><strong>Weaknesses:</strong> {rep.weaknesses}</Typography>
                                    <Typography><strong>Player Comparison:</strong> {rep.comparison}</Typography>
                                    <Typography><strong>Best Fit:</strong> {rep.fit}</Typography>
                                    <Typography><strong>Projected Role:</strong> {rep.role}</Typography>
                                    <Typography><strong>Projected Ceiling:</strong> {rep.ceiling}</Typography>
                                    <Typography><strong>Draft Range:</strong> {rep.range}</Typography>

                                    {/* Trait ratings for each previous report */}
                                    <Box mt={2}>
                                        <Typography variant="subtitle1">Trait Ratings:</Typography>
                                        <List dense>
                                            {Object.entries(rep.ratings).map(([trait, value]) => (
                                                <ListItem key={trait} disablePadding>
                                                    <ListItemText primary={`${trait}: ${value}`} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>

                                    {/* Summary for older report */}
                                    <SummaryGenerator report={rep} scrollOnGenerate={false} />

                                    {/* Delete button for older report */}
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        sx={{ mt: 4 }}
                                        onClick={() => handleDeleteReport(rep.createdAt)}
                                    >
                                        Delete Report
                                    </Button>
                                </Paper>
                            ))}
                        </>
                    )}
                </>
            )}
        </Container>
    );
};

export default SubmittedScoutReportPage;
