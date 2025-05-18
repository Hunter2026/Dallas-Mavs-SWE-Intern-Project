import React, { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Paper, Typography, Box, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

// Define all stats that can be tracked over time
const allStats = ['MP', 'PTS', 'AST', 'TRB', 'STL', 'BLK'];

// Assign each stat a consistent color for the chart
const statColors = {
    MP: '#ff7300',
    PTS: '#8884d8',
    AST: '#82ca9d',
    TRB: '#ffc658',
    STL: '#00bcd4',
    BLK: '#673ab7',
};

const PlayerDevelopment = ({ seasonLogs, player }) => {
    const [selectedStats, setSelectedStats] = useState(allStats); // Stats to display
    const birthYear = player?.birthDate ? new Date(player.birthDate).getFullYear() : null;

    // Aggregate season stats
    const seasonMap = {};
    seasonLogs.forEach(log => {
        const season = log.Season;
        if (!seasonMap[season]) {
            seasonMap[season] = { season, teams: new Set(), count: 0 };
            allStats.forEach(stat => (seasonMap[season][stat] = 0));
        }
        allStats.forEach(stat => {
            seasonMap[season][stat] += typeof log[stat] === 'number' ? log[stat] : 0;
        });
        seasonMap[season].teams.add(log.Team);
        seasonMap[season].count += 1;
    });

    // Format chart data
    const chartData = Object.values(seasonMap)
        .map(season => {
            const row = { season: season.season, teams: [...season.teams].join(', ') };
            allStats.forEach(stat => {
                row[stat] = +(season[stat] / season.count).toFixed(1);
            });
            if (birthYear) row.age = season.season - birthYear;
            return row;
        })
        .sort((a, b) => a.season - b.season);

    // Tooltip component
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const row = payload[0].payload;
            return (
                <Box sx={{ backgroundColor: 'white', border: '1px solid #ccc', p: 1 }}>
                    <Typography variant="subtitle2"><strong>Season:</strong> {label}</Typography>
                    <Typography variant="body2"><em>Teams:</em> {row.teams}</Typography>
                    {row.age !== undefined && (
                        <Typography variant="body2"><em>Age:</em> {row.age}</Typography>
                    )}
                    {payload.map((p, i) => (
                        <Typography variant="body2" key={i}>{p.name}: {p.value}</Typography>
                    ))}
                </Box>
            );
        }
        return null;
    };

    const toggleStat = (stat) => {
        setSelectedStats(prev => prev.includes(stat) ? prev.filter(s => s !== stat) : [...prev, stat]);
    };

    const toggleAll = () => {
        setSelectedStats(prev => (prev.length === allStats.length ? [] : allStats));
    };

    if (chartData.length === 0) {
        return <Typography color="error">No data available to render chart.</Typography>;
    }

    return (
        <Paper elevation={3} sx={{ p: 3, my: 4 }}>
            {/* Title */}
            <Typography variant="h6" gutterBottom>Player Development Over Time</Typography>

            {/* Stat toggles */}
            <FormGroup row sx={{ mb: 2 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={selectedStats.length === allStats.length}
                            onChange={toggleAll}
                        />
                    }
                    label="Select All"
                />
                {allStats.map(stat => (
                    <FormControlLabel
                        key={stat}
                        control={
                            <Checkbox
                                checked={selectedStats.includes(stat)}
                                onChange={() => toggleStat(stat)}
                            />
                        }
                        label={stat}
                    />
                ))}
            </FormGroup>

            {/* Chart */}
            <Box height={400}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="season" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {selectedStats.map(stat => (
                            <Line
                                key={stat}
                                type="monotone"
                                dataKey={stat}
                                stroke={statColors[stat] || '#8884d8'}
                                strokeWidth={3}
                                activeDot={{ r: 6 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

export default PlayerDevelopment;
