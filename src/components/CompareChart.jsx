import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, LabelList
} from 'recharts';

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

// Colors used for bars corresponding to each player (supports up to 3)
const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

// === Custom tooltip component ===
// Shows tooltips with units or 'N/A' if data is missing
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
        <div style={{ background: 'white', border: '1px solid #ccc', padding: 10 }}>
            <strong>{label}</strong>
            <ul style={{ margin: 0, paddingLeft: 15 }}>
                {payload.map((entry, index) => (
                    <li key={index}>
                        {entry.name}: {entry.value !== null ? `${entry.value}${unit}` : 'N/A'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

// === Main chart component that renders both measurement and career stat comparisons ===
const CompareChart = ({ players, seasonLogs, measurements }) => {
    if (!players || players.length === 0) return null;

    // === Build chart data for career stats ===
    const careerStatData = statKeys.map(stat => {
        const row = { stat }; // X-axis label

        players.forEach((player) => {
            // Filter logs for this player
            const logs = seasonLogs.filter(
                l => l.playerId?.toString() === player.playerId.toString()
            );
            const totalGP = logs.reduce((sum, l) => sum + l.GP, 0); // Total games played
            const total = logs.reduce((sum, l) => sum + (l[stat] ?? 0) * l.GP, 0); // Weighted stat total
            const avg = totalGP > 0 ? total / totalGP : 0; // Avoid division by zero
            row[player.name] = Number(avg.toFixed(1)); // Add player's stat avg to row
        });

        return row;
    });

    // === Build chart data for measurements ===
    const measurementChartData = measurementKeys.map(({ key, label }) => {
        const row = { measurement: label }; // X-axis label

        players.forEach(player => {
            const m = measurements.find(m => m.playerId?.toString() === player.playerId.toString());
            row[player.name] = m && typeof m[key] === 'number' ? m[key] : null; // Add value or null
        });

        return row;
    });

    return (
        <div style={{ marginTop: '2rem' }}>
            {/* === Measurement Bar Chart === */}
            <h3 style={{ marginTop: '3rem' }}>Measurement Comparison</h3>
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

            {/* === Career Stat Bar Chart === */}
            <h3>Career Stat Comparison</h3>
            <ResponsiveContainer width="125%" height={500}>
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
        </div>
    );
};

export default CompareChart;
