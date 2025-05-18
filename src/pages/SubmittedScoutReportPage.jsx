import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SummaryGenerator from '../components/SummaryGenerator';
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
    const { id } = useParams();
    const [reports, setReports] = useState([]);
    const [player, setPlayer] = useState(null);

    // Load saved reports from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(`report_player_${id}`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const safeReports = Array.isArray(parsed)
                    ? parsed.filter(r => r && typeof r === 'object' && r.createdAt)
                    : (parsed && parsed.createdAt ? [parsed] : []);

                setReports(safeReports);
            } catch (e) {
                console.error('Corrupt scouting data for player', id);
                setReports([]);
            }
        } else {
            setReports([]);
        }
    }, [id]);

    // Fetch player bio info
    useEffect(() => {
        fetch('/intern_project_data.json')
            .then(res => res.json())
            .then(data => {
                const found = data.bio.find(p => p.playerId.toString() === id);
                setPlayer(found);
            });
    }, [id]);

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* NBA Scout Report Profile in Top Right */}
            <Box sx={{ position: 'absolute', top: 16, right: 100 }}>
                <img
                    src="/Scouting Report Profile.png"
                    alt="Scouting Report Profile Logo"
                    style={{ width: 350, height: 'auto' }}
                />
            </Box>

            {/* Back link */}
            <Box mb={2}>
                <Button component={Link} to={`/player/${id}`} variant="outlined">
                    ← Back to Player Profile
                </Button>
            </Box>

            {/* Title */}
            <Typography variant="h4" gutterBottom>
                {player ? `${player.name} – Scouting Reports` : 'Scouting Reports'}
            </Typography>

            {/* No reports */}
            {reports.length === 0 ? (
                <Typography>No scouting reports submitted yet for this player.</Typography>
            ) : (
                <>
                    {/* Most recent report */}
                    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h6">Latest Report</Typography>
                        <Typography variant="body2" gutterBottom><strong>Submitted:</strong> {reports[0].createdAt}</Typography>
                        <Typography><strong>Strengths:</strong> {reports[0].strengths}</Typography>
                        <Typography><strong>Weaknesses:</strong> {reports[0].weaknesses}</Typography>
                        <Typography><strong>Player Comparison:</strong> {reports[0].comparison}</Typography>
                        <Typography><strong>Best NBA Fit:</strong> {reports[0].fit}</Typography>
                        <Typography><strong>Projected Role:</strong> {reports[0].role}</Typography>
                        <Typography><strong>Projected Ceiling:</strong> {reports[0].ceiling}</Typography>
                        <Typography><strong>Draft Range:</strong> {reports[0].range}</Typography>

                        {/* Trait ratings */}
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

                        {/* Summary output */}
                        <SummaryGenerator report={reports[0]} />
                    </Paper>

                    {/* Previous reports */}
                    {reports.length > 1 && (
                        <>
                            <Typography variant="h5" gutterBottom>Previous Reports</Typography>
                            {reports.slice(1).map((rep, index) => (
                                <Paper key={index} elevation={1} sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5' }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Submitted: {rep.createdAt}
                                    </Typography>
                                    <Typography><strong>Strengths:</strong> {rep.strengths}</Typography>
                                    <Typography><strong>Weaknesses:</strong> {rep.weaknesses}</Typography>
                                    <Typography><strong>Player Comparison:</strong> {rep.comparison}</Typography>
                                    <Typography><strong>Best Fit:</strong> {rep.fit}</Typography>
                                    <Typography><strong>Projected Role:</strong> {rep.role}</Typography>
                                    <Typography><strong>Projected Ceiling:</strong> {rep.ceiling}</Typography>
                                    <Typography><strong>Draft Range:</strong> {rep.range}</Typography>

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

                                    <SummaryGenerator report={rep} />
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
