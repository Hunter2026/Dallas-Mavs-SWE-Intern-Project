import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

// Define measurement fields with labels and units
const statFields = [
    { key: 'heightNoShoes', label: 'Height (No Shoes)', unit: '"' },
    { key: 'heightShoes', label: 'Height (With Shoes)', unit: '"' },
    { key: 'wingspan', label: 'Wingspan', unit: '"' },
    { key: 'reach', label: 'Standing Reach', unit: '"' },
    { key: 'weight', label: 'Weight', unit: ' lbs' },
    { key: 'maxVertical', label: 'Max Vertical', unit: '"' },
    { key: 'noStepVertical', label: 'No-Step Vertical', unit: '"' },
    { key: 'handLength', label: 'Hand Length', unit: '"' },
    { key: 'handWidth', label: 'Hand Width', unit: '"' },
    { key: 'agility', label: 'Agility', unit: ' sec' },
    { key: 'sprint', label: 'Sprint', unit: ' sec' },
    { key: 'shuttleBest', label: 'Shuttle Best', unit: ' sec' },
    { key: 'bodyFat', label: 'Body Fat %', unit: '%' },
];

const MeasurementComparison = ({ player, measurements }) => {
    // Guard clause: if no player or data
    if (!player || !Array.isArray(measurements) || measurements.length === 0) return null;

    // Find the current player's measurements
    const current = measurements.find(m => m.playerId === player.playerId);
    if (!current) return <Typography>No measurements to compare.</Typography>;

    // Get peer group (everyone except current player)
    const peers = measurements.filter(m => m.playerId !== player.playerId);

    // Compute average values for each measurement field
    const averages = {};
    statFields.forEach(({ key }) => {
        const values = peers.map(p => p[key]).filter(v => typeof v === 'number' && !isNaN(v));
        const avg = values.length > 0 ? values.reduce((sum, v) => sum + v, 0) / values.length : null;
        averages[key] = avg;
    });

    // Compare value to average and return label
    const getLabel = (value, avg, reverse = false) => {
        if (value == null || isNaN(value) || avg == null) return 'N/A';
        const diff = value - avg;
        if (!reverse) {
            if (diff >= 5) return 'Elite';
            if (diff >= 1) return 'Above Avg';
            if (diff <= -1) return 'Below Avg';
            return 'Average';
        } else {
            if (diff <= -0.3) return 'Elite';
            if (diff <= -0.1) return 'Above Avg';
            if (diff >= 0.3) return 'Below Avg';
            return 'Average';
        }
    };

    // Render styled measurement list with labels
    return (
        <Paper elevation={2} sx={{ mt: 4, p: 2, backgroundColor: '#eef4ff', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom><strong>Measurement Comparison to Peers</strong></Typography>
            <List dense>
                {statFields.map(({ key, label, unit }) => {
                    const val = current[key];
                    const avg = averages[key];
                    const isReverse = key === 'sprint' || key === 'agility'; // lower = better for these

                    // Format values with unit or fallback to N/A
                    const formattedVal = val != null && !isNaN(val) ? `${val}${unit}` : 'N/A';
                    const formattedAvg = avg != null && !isNaN(avg) ? `${avg.toFixed(1)}${unit}` : 'N/A';

                    const labelText = getLabel(val, avg, isReverse);

                    return (
                        <ListItem key={key} disablePadding>
                            <ListItemText
                                primary={<span><strong>{label}:</strong> {formattedVal} ({labelText}, Avg: {formattedAvg})</span>}
                            />
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );
};

export default MeasurementComparison;
