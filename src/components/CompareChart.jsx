import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, LabelList
} from 'recharts';
import { Box, Typography, Paper } from '@mui/material';

// === Stats to visualize in the career stats chart ===
const statKeys = ['PTS', 'TRB', 'AST', 'STL', 'BLK', 'TOV', 'FG%', '3P%', 'FTP'];

// === Measurement fields with display labels for the measurements chart ===
const measurementKeys = [
    { key: 'heightNoShoes', label: 'Height (No Shoes)' },
    { key: 'heightShoes', label: 'Height (With Shoes)' },
    { key: 'wingspan', label: 'Wingspan' },
    { key: 'reach', label: 'Standing Reach' },
    { key: 'weight', label: 'Weight' },
    { key: 'maxVertical', label: 'Max Vertical' },
    { key: 'noStepVertical', label: 'No-Step Vertical' },
    { key: 'handLength', label: 'Hand Length' },
    { key: 'handWidth', label: 'Hand Width' },
    { key: 'agility', label: 'Agility' },
    { key: 'sprint', label: 'Sprint' },
    { key: 'shuttleBest', label: 'Shuttle Best' },
    { key: 'bodyFat', label: 'Body Fat %' }
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    const unitsMap = {
        'Height (No Shoes)': '"',
        'Height (With Shoes)': '"',
        'Wingspan': '"',
        'Standing Reach': '"',
        'Weight': ' lbs',
        'Max Vertical': '"',
        'No-Step Vertical': '"',
        'Hand Length': '"',
        'Hand Width': '"',
        'Agility': ' sec',
        'Sprint': ' sec',
        'Shuttle Best': ' sec',
        'Body Fat': '%'
    };

    const unit = unitsMap[label] || '';

    return (
        <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="subtitle1"><strong>{label}</strong></Typography>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
                {payload.map((entry, index) => (
                    <li key={index}>
                        {entry.name}: {entry.value !== null ? `${entry.value}${unit}` : 'N/A'}
                    </li>
                ))}
            </ul>
        </Paper>
    );
};

const CompareChart = ({ players, seasonLogs, measurements }) => {
    if (!players || players.length === 0) return null;

    const careerStatData = statKeys.map(stat => {
        const row = { stat };
        players.forEach(player => {
            const logs = seasonLogs.filter(
                l => l.playerId?.toString() === player.playerId.toString()
            );
            const totalGP = logs.reduce((sum, l) => sum + l.GP, 0);
            const total = logs.reduce((sum, l) => sum + (l[stat] ?? 0) * l.GP, 0);
            const avg = totalGP > 0 ? total / totalGP : 0;
            row[player.name] = Number(avg.toFixed(1));
        });
        return row;
    });

    const measurementChartData = measurementKeys.map(({ key, label }) => {
        const row = { measurement: label };
        players.forEach(player => {
            const m = measurements.find(m => m.playerId?.toString() === player.playerId.toString());
            row[player.name] = m && typeof m[key] === 'number' ? m[key] : null;
        });
        return row;
    });

    return (
        <Box sx={{ mt: 6 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>Measurement Comparison</Typography>
            <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: 1500 }}>
                    <ResponsiveContainer width="150%" height={500}>
                        <BarChart
                            data={measurementChartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="measurement" interval={0} />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            {players.map((player, index) => (
                                <Bar
                                    key={player.playerId + '_m'}
                                    dataKey={player.name}
                                    fill={COLORS[index % COLORS.length]}
                                >
                                    <LabelList dataKey={player.name} position="top" />
                                </Bar>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Box>

            <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: 600 }}>Career Stat Comparison</Typography>
            <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: 1200 }}>
                    <ResponsiveContainer width="120%" height={500}>
                        <BarChart
                            data={careerStatData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="stat" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            {players.map((player, index) => (
                                <Bar
                                    key={player.playerId}
                                    dataKey={player.name}
                                    fill={COLORS[index % COLORS.length]}
                                >
                                    <LabelList dataKey={player.name} position="top" />
                                </Bar>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </Box>
    );
};

export default CompareChart;
