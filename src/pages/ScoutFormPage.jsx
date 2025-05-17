import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import SummaryGenerator from '../components/SummaryGenerator';

// Predefined options for select dropdowns
const roles = ['Starter', 'Role Player', 'Bench', 'Developmental'];
const ceilings = ['Hall of Famer', 'All-NBA', 'All-Star', 'High-Level Starter', 'Starter', 'Rotation Player', 'Fringe Roster'];
const draftRanges = ['Lottery', 'Mid 1st', 'Late 1st', '2nd Round', 'Undrafted'];
const traits = ['Shooting', 'Ball Handling', 'Defense', 'Athleticism', 'IQ', 'Motor'];

// Main component for the scouting form
const ScoutFormPage = ({ onSubmit }) => {
    const { id } = useParams(); // Gets the player ID from the URL
    const [player, setPlayer] = useState(null); // Holds player data once fetched
    const [submittedReport, setSubmittedReport] = useState(null); // Stores submitted report for confirmation view

    // State variables for form fields
    const reportRef = useRef(null); // Used to scroll to confirmation after submit
    const [strengths, setStrengths] = useState('');
    const [weaknesses, setWeaknesses] = useState('');
    const [comparison, setComparison] = useState('');
    const [fit, setFit] = useState('');
    const [role, setRole] = useState('');
    const [ceiling, setCeiling] = useState('');
    const [range, setRange] = useState('');
    const [ratings, setRatings] = useState(
        traits.reduce((acc, trait) => ({ ...acc, [trait]: 5 }), {}) // Initialize each trait with default rating 5
    );
    const [error, setError] = useState(null); // Holds any form validation error

    // Fetch player data when component mounts or ID changes
    useEffect(() => {
        fetch('/intern_project_data.json')
            .then(res => res.json())
            .then(data => {
                const foundPlayer = data.bio.find(p => p.playerId.toString() === id);
                setPlayer(foundPlayer);
            });
    }, [id]);

    // Updates individual trait rating
    const handleChange = (trait, value) => {
        setRatings(prev => ({ ...prev, [trait]: Number(value) }));
    };

    // Handles form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate all fields
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

        // Compile report object
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

        // Send report to parent or console as fallback
        if (onSubmit) {
            onSubmit(report);
        } else {
            console.log('Scouting Report:', report);
        }

        setSubmittedReport(report); // Save for display
        setTimeout(() => {
            requestAnimationFrame(() => {
                reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            });
        }, 100);

        // Reset form fields
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

    // Show loading state until player is fetched
    if (!player) return <p>Loading player info...</p>;

    return (
        <div style={{ padding: '1rem' }}>
            {/* Back to profile link */}
            <Link to={`/player/${player.playerId}`} style={{ display: 'inline-block', marginBottom: '1rem' }}>
                ← Back to Player Profile
            </Link>

            {/* Player name and header */}
            <h2>{player.name} - Scouting Report</h2>

            {/* Navigation to stats and measurements page */}
            <Link to={`/player/${id}/stats`}>
                <button style={{ marginBottom: '1rem' }}>View Stats & Measurements</button>
            </Link>

            {/* Main form */}
            <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
                <h4>Scouting Evaluation</h4>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {/* Strengths input */}
                <label><strong>Strengths:</strong> <span style={{ fontSize: '0.9em', color: '#666' }}>({strengths.trim().split(/\s+/).filter(Boolean).length} words)</span></label><br />
                <textarea value={strengths} onChange={(e) => setStrengths(e.target.value)} rows={2} cols={50} /><br /><br />

                {/* Weaknesses input */}
                <label><strong>Weaknesses:</strong> <span style={{ fontSize: '0.9em', color: '#666' }}>({weaknesses.trim().split(/\s+/).filter(Boolean).length} words)</span></label><br />
                <textarea value={weaknesses} onChange={(e) => setWeaknesses(e.target.value)} rows={2} cols={50} /><br /><br />

                {/* Comparison input */}
                <label><strong>Player Comparison:</strong></label><br />
                <input value={comparison} onChange={(e) => setComparison(e.target.value)} /><br /><br />

                {/* Fit input */}
                <label><strong>Best NBA Fit (Team):</strong></label><br />
                <input value={fit} onChange={(e) => setFit(e.target.value)} /><br /><br />

                {/* Role dropdown */}
                <label><strong>Projected Role:</strong></label><br />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">-- Select --</option>
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select><br /><br />

                {/* Ceiling dropdown */}
                <label><strong>Projected Ceiling:</strong></label><br />
                <select value={ceiling} onChange={(e) => setCeiling(e.target.value)}>
                    <option value="">-- Select --</option>
                    {ceilings.map(c => <option key={c} value={c}>{c}</option>)}
                </select><br /><br />

                {/* Draft range dropdown */}
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

            {/* Confirmation of submission */}
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

                    {/* Trait ratings summary */}
                    <h5>Trait Ratings:</h5>
                    <ul>
                        {Object.entries(submittedReport.ratings).map(([trait, value]) => (
                            <li key={trait}><strong>{trait}:</strong> {value}</li>
                        ))}
                    </ul>

                    {/* Summary component */}
                    <SummaryGenerator report={submittedReport} />
                </div>
            )}
        </div>
    );
};

export default ScoutFormPage;
