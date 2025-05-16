import React, { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

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

// Main component to visualize player stat development over seasons
const PlayerDevelopment = ({ seasonLogs, player }) => {
    const [selectedStats, setSelectedStats] = useState(allStats); // Track which stats the user wants to view

    // Extract birth year to calculate player's age each season
    const birthYear = player?.birthDate
        ? new Date(player.birthDate).getFullYear()
        : null;

    // Aggregate all stats and team info per season
    const seasonMap = {};
    seasonLogs.forEach(log => {
        const season = log.Season;

        // Initialize season entry if it doesn't exist
        if (!seasonMap[season]) {
            seasonMap[season] = {
                season,
                teams: new Set(),
                count: 0 // Track how many logs per season to calculate averages
            };
            // Initialize stat totals
            allStats.forEach(stat => seasonMap[season][stat] = 0);
        }

        // Sum each stat if valid
        allStats.forEach(stat => {
            seasonMap[season][stat] += typeof log[stat] === 'number' ? log[stat] : 0;
        });

        // Track team(s) played for and increment entry count
        seasonMap[season].teams.add(log.Team);
        seasonMap[season].count += 1;
    });

    // Convert aggregated map into chart-ready data
    const chartData = Object.values(seasonMap)
        .map(season => {
            const row = {
                season: season.season,
                teams: [...season.teams].join(', ') // Display multiple teams if necessary
            };

            // Calculate average for each stat
            allStats.forEach(stat => {
                row[stat] = +(season[stat] / season.count).toFixed(1);
            });

            // Append age if birth year is available
            if (birthYear) {
                row.age = season.season - birthYear;
            }

            return row;
        })
        .sort((a, b) => a.season - b.season); // Sort chronologically

    // Custom tooltip to show team(s), age, and stat values on hover
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const row = payload[0].payload;
            return (
                <div style={{ background: 'white', padding: 10, border: '1px solid #ccc' }}>
                    <strong>Season: {label}</strong><br />
                    <em>Teams:</em> {row.teams}<br />
                    {row.age !== undefined && <div><em>Age:</em> {row.age}</div>}
                    {payload.map((p, i) => (
                        <div key={i}>{p.name}: {p.value}</div>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Toggle individual stat on/off for the chart
    const toggleStat = (stat) => {
        setSelectedStats(prev =>
            prev.includes(stat)
                ? prev.filter(s => s !== stat)
                : [...prev, stat]
        );
    };

    // Toggle all stats on or off
    const toggleAll = () => {
        setSelectedStats(prev =>
            prev.length === allStats.length ? [] : allStats
        );
    };

    // Handle case where no data is available
    if (chartData.length === 0) {
        return <p style={{ color: 'red' }}>No data available to render chart.</p>;
    }

    return (
        <div style={{ width: '100%', margin: '3rem 0' }}>
            <h2 style={{ marginBottom: '1rem' }}>Player Development Over Time</h2>

            {/* === Stat Filter Controls === */}
            <div style={{ marginBottom: '1rem' }}>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedStats.length === allStats.length}
                        onChange={toggleAll}
                    />{' '}
                    <strong>Select All</strong>
                </label>
                <div style={{ marginTop: '0.5rem' }}>
                    {allStats.map(stat => (
                        <label key={stat} style={{ marginRight: '1rem' }}>
                            <input
                                type="checkbox"
                                checked={selectedStats.includes(stat)}
                                onChange={() => toggleStat(stat)}
                            />{' '}
                            {stat}
                        </label>
                    ))}
                </div>
            </div>

            {/* === Stat Development Line Chart === */}
            <div style={{ width: '100%', height: '400px', minHeight: '400px' }}>
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
            </div>
        </div>
    );
};

export default PlayerDevelopment;
