import React from 'react';

// Measurement stats to compare, including labels
const statFields = [
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
    { key: 'bodyFat', label: 'Body Fat %' },
];

const MeasurementComparison = ({ player, measurements }) => {
    if (!player || !Array.isArray(measurements) || measurements.length === 0) return null;

    // Find current player's measurement entry
    const current = measurements.find(m => m.playerId === player.playerId);
    if (!current) return <p>No measurements to compare.</p>;

    // Use all other players as peer group
    const peers = measurements.filter(m => m.playerId !== player.playerId);

    // Compute averages for each stat
    const averages = {};
    statFields.forEach(({ key }) => {
        const values = peers.map(p => p[key]).filter(v => typeof v === 'number' && !isNaN(v));
        const avg = values.length > 0 ? values.reduce((sum, v) => sum + v, 0) / values.length : null;
        averages[key] = avg;
    });

    // Comparison label logic
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

    return (
        <div style={{ marginTop: '2rem', background: '#eef4ff', padding: '1rem', borderRadius: '6px' }}>
            <h3>Measurement Comparison to Peers</h3>
            <ul>
                {statFields.map(({ key, label }) => {
                    const val = current[key];
                    const avg = averages[key];
                    const isReverse = key === 'sprint' || key === 'agility'; // lower = better

                    const formattedVal = val != null && !isNaN(val) ? val : 'N/A';
                    const formattedAvg = avg != null && !isNaN(avg) ? avg.toFixed(1) : 'N/A';
                    const labelText = getLabel(val, avg, isReverse);

                    return (
                        <li key={key}>
                            <strong>{label}:</strong> {formattedVal} ({labelText}, Avg: {formattedAvg})
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default MeasurementComparison;
