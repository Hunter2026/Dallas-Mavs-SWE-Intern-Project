import React, { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Paper, Typography, Box, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

// === List of all statistics that can be tracked over multiple seasons ===
const allStats = ['MP', 'PTS', 'AST', 'TRB', 'STL', 'BLK'];

// === Assign a unique color to each stat for consistency in the chart ===
const statColors = {
    MP: '#ff7300',
    PTS: '#8884d8',
    AST: '#82ca9d',
    TRB: '#ffc658',
    STL: '#00bcd4',
    BLK: '#673ab7',
};

const PlayerDevelopment = ({ seasonLogs, player }) => {
    const [selectedStats, setSelectedStats] = useState(allStats); // Which stats are visible on the chart

    // Extract birth year from player bio for age calculation
    const birthYear = player?.birthDate ? new Date(player.birthDate).getFullYear() : null;

    // === Aggregate all seasons into a normalized map ===
    const seasonMap = {};
    seasonLogs.forEach(log => {
        const season = log.Season;
        if (!seasonMap[season]) {
            seasonMap[season] = { season, teams: new Set(), count: 0 };
            allStats.forEach(stat => (seasonMap[season][stat] = 0));
        }

        // Accumulate each stat value
        allStats.forEach(stat => {
            seasonMap[season][stat] += typeof log[stat] === 'number' ? log[stat] : 0;
        });

        seasonMap[season].teams.add(log.Team); // Track team(s) played for in that season
        seasonMap[season].count += 1; // Count entries for averaging later
    });

    // === Format aggregated season data into a chart-friendly array ===
    const chartData = Object.values(seasonMap)
        .map(season => {
            const row = {
                season: season.season,
                teams: [...season.teams].join(', '),
            };

            // Compute average per stat across logs for the same season
            allStats.forEach(stat => {
                row[stat] = +(season[stat] / season.count).toFixed(1);
            });

            if (birthYear) row.age = season.season - birthYear; // Add age column if possible
            return row;
        })
        .sort((a, b) => a.season - b.season); // Sort chronologically

    // === Custom tooltip for detailed hover info on data points ===
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
                        <Typography variant="body2" key={i}>
                            {p.name}: {p.value}
                        </Typography>
                    ))}
                </Box>
            );
        }
        return null;
    };

    // === Toggle a single stat's visibility ===
    const toggleStat = (stat) => {
        setSelectedStats(prev =>
            prev.includes(stat)
                ? prev.filter(s => s !== stat)
                : [...prev, stat]
        );
    };

    // === Toggle all stats on/off ===
    const toggleAll = () => {
        setSelectedStats(prev =>
            prev.length === allStats.length ? [] : allStats
        );
    };

    // === If there's no data to display, show a message instead of a chart ===
    if (chartData.length === 0) {
        return <Typography color="error">No data available to render chart.</Typography>;
    }

    return (
        <Paper elevation={3} sx={{ p: 3, my: 4 }}>
            {/* === Chart Title === */}
            <Typography variant="h6" gutterBottom>Player Development Over Time</Typography>

            {/* === Checkbox Controls for Stat Selection === */}
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

            {/* === Render Chart Using Recharts === */}
            <Box height={400}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="season" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {/* === Draw one line per selected stat === */}
                        {selectedStats.map(stat => (
                            <Line
                                key={stat}
                                type="monotone"
                                dataKey={stat}
                                stroke={statColors[stat] || '#8884d8'} // fallback color
                                strokeWidth={3}
                                activeDot={{ r: 6 }} // emphasis on active point
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

export default PlayerDevelopment;
