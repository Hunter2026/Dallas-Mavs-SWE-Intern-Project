import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import SummaryGenerator from '../components/SummaryGenerator';

// Define constant dropdown options for roles, ceilings, draft range, and traits
const roles = ['Starter', 'Role Player', 'Bench', 'Developmental'];
const ceilings = ['Hall of Famer', 'All-NBA', 'All-Star', 'High-Level Starter', 'Starter', 'Rotation Player', 'Fringe Roster'];
const draftRanges = ['Lottery', 'Mid 1st', 'Late 1st', '2nd Round', 'Undrafted'];
const traits = ['Shooting', 'Ball Handling', 'Defense', 'Athleticism', 'IQ', 'Motor'];

// Main component for the scouting form page
const ScoutFormPage = ({ onSubmit }) => {
    const { id } = useParams(); // Get the player ID from the URL
    const [player, setPlayer] = useState(null); // Store the fetched player object
    const [submittedReport, setSubmittedReport] = useState(null); // Store the most recent scouting report

    const reportRef = useRef(null); // Ref to scroll to the report summary when it's submitted

    // State variables for form fields
    const [strengths, setStrengths] = useState('');
    const [weaknesses, setWeaknesses] = useState('');
    const [comparison, setComparison] = useState('');
    const [fit, setFit] = useState('');
    const [role, setRole] = useState('');
    const [ceiling, setCeiling] = useState('');
    const [range, setRange] = useState('');
    const [ratings, setRatings] = useState(
        traits.reduce((acc, trait) => ({ ...acc, [trait]: 5 }), {}) // Default all traits to 5/10
    );
    const [error, setError] = useState(null); // Track validation errors

    // Fetch player bio from JSON file on component mount or when `id` changes
    useEffect(() => {
        fetch('/intern_project_data.json')
            .then(res => res.json())
            .then(data => {
                const foundPlayer = data.bio.find(p => p.playerId.toString() === id);
                setPlayer(foundPlayer);
            });
    }, [id]);

    // Handler for updating a specific trait's value
    const handleChange = (trait, value) => {
        setRatings(prev => ({ ...prev, [trait]: Number(value) }));
    };

    // Form submit handler
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate required fields and ratings range
        if (
            !strengths.trim() ||
            !weaknesses.trim() ||
            !comparison.trim() ||
            !fit.trim() ||
            !role ||
            !ceiling ||
            !range ||
            Object.values(ratings).some(val => typeof val !== 'number' || val < 0 || val > 10)
        ) {
            setError('Please complete all fields before submitting.');
            return;
        }

        // Create the scouting report object
        const report = {
            strengths,
            weaknesses,
            comparison,
            fit,
            role,
            ceiling,
            range,
            ratings,
            createdAt: new Date().toLocaleString(), // Timestamp
        };

        // Pass report to parent handler if provided, else fallback to console log
        if (onSubmit) {
            onSubmit(report);
        } else {
            console.log('Scouting Report:', report);
        }

        // Save latest report to local state
        setSubmittedReport(report);

        // Load existing reports from localStorage and prepend new one
        const existing = localStorage.getItem(`report_player_${id}`);
        let existingReports = [];

        try {
            const parsed = JSON.parse(existing);
            existingReports = Array.isArray(parsed) ? parsed : [parsed]; // Legacy single report support
        } catch {
            existingReports = [];
        }

        const updatedReports = [report, ...existingReports];
        localStorage.setItem(`report_player_${id}`, JSON.stringify(updatedReports));

        // Reset the form inputs
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

    // Smooth scroll to report after submission
    useEffect(() => {
        if (submittedReport && reportRef.current) {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    reportRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
                });
            }, 150);
        }
    }, [submittedReport]);

    // Display loading indicator until player is loaded
    if (!player) return <p>Loading player info...</p>;

    return (
        <div style={{ padding: '1rem' }}>
            {/* Back button to player profile */}
            <Link to={`/player/${player.playerId}`} style={{ display: 'inline-block', marginBottom: '1rem' }}>
                ← Back to Player Profile
            </Link>

            {/* Player name and section title */}
            <h2>{player.name} - Scouting Report</h2>

            {/* Button to navigate to player stats page */}
            <Link to={`/player/${id}/stats`}>
                <button style={{ marginBottom: '1rem' }}>View Stats & Measurements</button>
            </Link>

            {/* Scouting form begins */}
            <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
                <h4>Scouting Evaluation</h4>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {/* Strengths field */}
                <label><strong>Strengths:</strong> <span style={{ fontSize: '0.9em', color: '#666' }}>({strengths.trim().split(/\s+/).filter(Boolean).length} words)</span></label><br />
                <textarea value={strengths} onChange={(e) => setStrengths(e.target.value)} rows={2} cols={50} /><br /><br />

                {/* Weaknesses field */}
                <label><strong>Weaknesses:</strong> <span style={{ fontSize: '0.9em', color: '#666' }}>({weaknesses.trim().split(/\s+/).filter(Boolean).length} words)</span></label><br />
                <textarea value={weaknesses} onChange={(e) => setWeaknesses(e.target.value)} rows={2} cols={50} /><br /><br />

                {/* Player comparison */}
                <label><strong>Player Comparison:</strong></label><br />
                <input value={comparison} onChange={(e) => setComparison(e.target.value)} /><br /><br />

                {/* Best team fit */}
                <label><strong>Best NBA Fit (Team):</strong></label><br />
                <input value={fit} onChange={(e) => setFit(e.target.value)} /><br /><br />

                {/* Role selector */}
                <label><strong>Projected Role:</strong></label><br />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">-- Select --</option>
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select><br /><br />

                {/* Ceiling selector */}
                <label><strong>Projected Ceiling:</strong></label><br />
                <select value={ceiling} onChange={(e) => setCeiling(e.target.value)}>
                    <option value="">-- Select --</option>
                    {ceilings.map(c => <option key={c} value={c}>{c}</option>)}
                </select><br /><br />

                {/* Draft range selector */}
                <label><strong>Draft Range:</strong></label><br />
                <select value={range} onChange={(e) => setRange(e.target.value)}>
                    <option value="">-- Select --</option>
                    {draftRanges.map(r => <option key={r} value={r}>{r}</option>)}
                </select><br /><br />

                {/* Trait sliders */}
                <fieldset style={{ border: '1px solid #ccc', padding: '1rem' }}>
                    <legend><strong>Trait Ratings (0–10):</strong></legend>
                    {traits.map(trait => (
                        <div key={trait} style={{ marginBottom: '0.5rem' }}>
                            <label>{trait}: {ratings[trait]}</label><br />
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={ratings[trait]}
                                onChange={(e) => handleChange(trait, e.target.value)}
                            />
                        </div>
                    ))}
                </fieldset>

                {/* Submit button */}
                <button type="submit" style={{ marginTop: '1rem' }}>Submit Scouting Report</button>
            </form>

            {/* Confirmation section with submitted report and summary */}
            {submittedReport && (
                <div
                    ref={reportRef}
                    style={{ marginTop: '2rem', background: '#f9f9f9', padding: '1rem', borderRadius: '6px' }}>
                    <h4>Report Submitted</h4>
                    <p><strong>Submitted:</strong> {submittedReport.createdAt}</p>
                    <p><strong>Strengths:</strong> {submittedReport.strengths}</p>
                    <p><strong>Weaknesses:</strong> {submittedReport.weaknesses}</p>
                    <p><strong>Player Comparison:</strong> {submittedReport.comparison}</p>
                    <p><strong>Best NBA Fit:</strong> {submittedReport.fit}</p>
                    <p><strong>Projected Role:</strong> {submittedReport.role}</p>
                    <p><strong>Projected Ceiling:</strong> {submittedReport.ceiling}</p>
                    <p><strong>Draft Range:</strong> {submittedReport.range}</p>

                    {/* Trait summary list */}
                    <h5>Trait Ratings:</h5>
                    <ul>
                        {Object.entries(submittedReport.ratings).map(([trait, value]) => (
                            <li key={trait}><strong>{trait}:</strong> {value}</li>
                        ))}
                    </ul>

                    {/* Auto-generated summary */}
                    <SummaryGenerator report={submittedReport} />
                </div>
            )}
        </div>
    );
};

export default ScoutFormPage;
