import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import SummaryGenerator from '../components/SummaryGenerator';
import {
    Container,
    Typography,
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Slider,
    Box,
    Paper,
    Grid,
    Alert
} from '@mui/material';

// Dropdown constants
const roles = ['Starter', 'Role Player', 'Bench', 'Developmental'];
const ceilings = ['Hall of Famer', 'All-NBA', 'All-Star', 'High-Level Starter', 'Starter', 'Rotation Player', 'Fringe Roster'];
const draftRanges = ['Lottery', 'Mid 1st', 'Late 1st', '2nd Round', 'Undrafted'];
const traits = ['Shooting', 'Ball Handling', 'Defense', 'Athleticism', 'IQ', 'Motor'];

const ScoutFormPage = ({ onSubmit }) => {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);
    const [submittedReport, setSubmittedReport] = useState(null);
    const reportRef = useRef(null);

    // Form fields state
    const [strengths, setStrengths] = useState('');
    const [weaknesses, setWeaknesses] = useState('');
    const [comparison, setComparison] = useState('');
    const [fit, setFit] = useState('');
    const [role, setRole] = useState('');
    const [ceiling, setCeiling] = useState('');
    const [range, setRange] = useState('');
    const [ratings, setRatings] = useState(traits.reduce((acc, t) => ({ ...acc, [t]: 5 }), {}));
    const [error, setError] = useState(null);

    // Fetch player info on mount
    useEffect(() => {
        fetch('/intern_project_data.json')
            .then(res => res.json())
            .then(data => {
                const foundPlayer = data.bio.find(p => p.playerId.toString() === id);
                setPlayer(foundPlayer);
            });
    }, [id]);

    // Update trait rating
    const handleChange = (trait, value) => {
        setRatings(prev => ({ ...prev, [trait]: Number(value) }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate all required fields
        if (!strengths.trim() || !weaknesses.trim() || !comparison.trim() || !fit.trim() || !role || !ceiling || !range || Object.values(ratings).some(val => typeof val !== 'number' || val < 0 || val > 10)) {
            setError('Please complete all fields before submitting.');
            return;
        }

        const report = {
            strengths,
            weaknesses,
            comparison,
            fit,
            role,
            ceiling,
            range,
            ratings,
            createdAt: new Date().toLocaleString(),
        };

        if (onSubmit) {
            onSubmit(report);
        } else {
            console.log('Scouting Report:', report);
        }

        setSubmittedReport(report);

        const existing = localStorage.getItem(`report_player_${id}`);
        let existingReports = [];
        try {
            const parsed = JSON.parse(existing);
            existingReports = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
            existingReports = [];
        }
        const updatedReports = [report, ...existingReports];
        localStorage.setItem(`report_player_${id}`, JSON.stringify(updatedReports));

        // Reset fields
        setStrengths('');
        setWeaknesses('');
        setComparison('');
        setFit('');
        setRole('');
        setCeiling('');
        setRange('');
        setRatings(traits.reduce((acc, t) => ({ ...acc, [t]: 5 }), {}));
        setError(null);
    };

    // Scroll to submitted report
    useEffect(() => {
        if (submittedReport && reportRef.current) {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    reportRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
                });
            }, 150);
        }
    }, [submittedReport]);

    if (!player) return <Typography>Loading player info...</Typography>;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* NBA Scout Report in Top Right */}
            <Box sx={{ position: 'absolute', top: 16, right: 100 }}>
                <img
                    src="/NBA Scout Report.png"
                    alt="NBA Scout Report Logo"
                    style={{ width: 350, height: 'auto' }}
                />
            </Box>

            {/* Back to profile */}
            <Box mb={2}>
                <Button component={Link} to={`/player/${player.playerId}`} variant="outlined">
                    ← Back to Player Profile
                </Button>
            </Box>

            <Typography variant="h4" gutterBottom>{player.name} - Scouting Report</Typography>

            {/* Link to stats */}
            <Box mb={2}>
                <Button component={Link} to={`/player/${id}/stats`} variant="contained">
                    View Stats & Measurements
                </Button>
            </Box>

            {/* Scouting Form */}
            <Paper sx={{ p: 3 }} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>Scouting Evaluation</Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* Text fields */}
                <TextField
                    label={`Strengths (${strengths.trim().split(/\s+/).filter(Boolean).length} words)`}
                    multiline
                    fullWidth
                    rows={2}
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label={`Weaknesses (${weaknesses.trim().split(/\s+/).filter(Boolean).length} words)`}
                    multiline
                    fullWidth
                    rows={2}
                    value={weaknesses}
                    onChange={(e) => setWeaknesses(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Player Comparison"
                    fullWidth
                    value={comparison}
                    onChange={(e) => setComparison(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Best NBA Fit (Team)"
                    fullWidth
                    value={fit}
                    onChange={(e) => setFit(e.target.value)}
                    margin="normal"
                />

                {/* Select dropdowns with improved width */}
                <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Projected Role</InputLabel>
                            <Select value={role} label="Projected Role" onChange={(e) => setRole(e.target.value)} sx={{ minWidth: 250 }}>
                                {roles.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Ceiling</InputLabel>
                            <Select value={ceiling} label="Ceiling" onChange={(e) => setCeiling(e.target.value)} sx={{ minWidth: 250 }}>
                                {ceilings.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Draft Range</InputLabel>
                            <Select value={range} label="Draft Range" onChange={(e) => setRange(e.target.value)} sx={{ minWidth: 250 }}>
                                {draftRanges.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/* Trait sliders */}
                <Box mt={4}>
                    <Typography variant="subtitle1" gutterBottom>Trait Ratings (0–10)</Typography>
                    {traits.map(trait => (
                        <Box key={trait} sx={{ mb: 2 }}>
                            <Typography gutterBottom>{trait}: {ratings[trait]}</Typography>
                            <Slider
                                value={ratings[trait]}
                                min={0}
                                max={10}
                                step={1}
                                onChange={(e, val) => handleChange(trait, val)}
                                valueLabelDisplay="auto"
                            />
                        </Box>
                    ))}
                </Box>

                {/* Submit button */}
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
                    Submit Scouting Report
                </Button>
            </Paper>

            {/* Submitted report display */}
            {submittedReport && (
                <Box ref={reportRef} mt={4} p={3} bgcolor="#f9f9f9" borderRadius={2}>
                    <Typography variant="h6">Report Submitted</Typography>
                    <Typography variant="body2" gutterBottom><strong>Submitted:</strong> {submittedReport.createdAt}</Typography>
                    <Typography><strong>Strengths:</strong> {submittedReport.strengths}</Typography>
                    <Typography><strong>Weaknesses:</strong> {submittedReport.weaknesses}</Typography>
                    <Typography><strong>Player Comparison:</strong> {submittedReport.comparison}</Typography>
                    <Typography><strong>Best NBA Fit:</strong> {submittedReport.fit}</Typography>
                    <Typography><strong>Projected Role:</strong> {submittedReport.role}</Typography>
                    <Typography><strong>Projected Ceiling:</strong> {submittedReport.ceiling}</Typography>
                    <Typography><strong>Draft Range:</strong> {submittedReport.range}</Typography>
                    <Box mt={2}>
                        <Typography variant="subtitle1">Trait Ratings:</Typography>
                        <ul>
                            {Object.entries(submittedReport.ratings).map(([trait, value]) => (
                                <li key={trait}><strong>{trait}:</strong> {value}</li>
                            ))}
                        </ul>
                    </Box>
                    <SummaryGenerator report={submittedReport} />
                </Box>
            )}
        </Container>
    );
};

export default ScoutFormPage;
