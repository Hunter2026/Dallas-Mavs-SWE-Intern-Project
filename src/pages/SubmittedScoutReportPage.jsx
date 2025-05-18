import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SummaryGenerator from '../components/SummaryGenerator';

// Component to view all scouting reports submitted for a specific player
const SubmittedScoutReportPage = () => {
    const { id } = useParams(); // Get player ID from URL
    const [reports, setReports] = useState([]); // List of scouting reports
    const [player, setPlayer] = useState(null); // Player bio information

    // Load all submitted reports for this player from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(`report_player_${id}`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const safeReports = Array.isArray(parsed)
                    ? parsed.filter(r => r && typeof r === 'object' && r.createdAt)
                    : (parsed && parsed.createdAt ? [parsed] : []);

                setReports(safeReports);
            } catch (e) {
                console.error('Corrupt scouting data for player', id);
                setReports([]);
            }
        } else {
            setReports([]);
        }
    }, [id]);

    // Fetch player bio information from static JSON
    useEffect(() => {
        fetch('/intern_project_data.json')
            .then(res => res.json())
            .then(data => {
                const found = data.bio.find(p => p.playerId.toString() === id);
                setPlayer(found);
            });
    }, [id]);

    return (
        <div style={{ padding: '1rem' }}>
            {/* Back navigation link to the player profile page */}
            <Link to={`/player/${id}`}>← Back to Player Profile</Link>

            {/* Page title */}
            <h2>{player ? `${player.name} – Scouting Reports` : 'Scouting Reports'}</h2>

            {/* Show message if no reports exist */}
            {reports.length === 0 ? (
                <p>No scouting reports submitted yet for this player.</p>
            ) : (
                <>
                    {/* Display the latest submitted report (most recent first) */}
                    <h3>Latest Report</h3>
                    <p><strong>Submitted:</strong> {reports[0].createdAt}</p>
                    <p><strong>Strengths:</strong> {reports[0].strengths}</p>
                    <p><strong>Weaknesses:</strong> {reports[0].weaknesses}</p>
                    <p><strong>Player Comparison:</strong> {reports[0].comparison}</p>
                    <p><strong>Best NBA Fit:</strong> {reports[0].fit}</p>
                    <p><strong>Projected Role:</strong> {reports[0].role}</p>
                    <p><strong>Projected Ceiling:</strong> {reports[0].ceiling}</p>
                    <p><strong>Draft Range:</strong> {reports[0].range}</p>

                    {/* Display individual trait ratings */}
                    <h5>Trait Ratings:</h5>
                    <ul>
                        {Object.entries(reports[0].ratings).map(([trait, value]) => (
                            <li key={trait}><strong>{trait}:</strong> {value}</li>
                        ))}
                    </ul>

                    {/* Generate a summary based on the report data */}
                    <SummaryGenerator report={reports[0]} />

                    {/* Show previous reports if more than one exists */}
                    {reports.length > 1 && (
                        <>
                            <h3 style={{ marginTop: '3rem' }}>Previous Reports</h3>
                            {reports.slice(1).map((rep, index) => (
                                <div
                                    key={index}
                                    style={{
                                        marginBottom: '2rem',
                                        padding: '1rem',
                                        background: '#f4f4f4',
                                        border: '1px solid #ccc',
                                        borderRadius: '6px',
                                    }}
                                >
                                    {/* Metadata and report details */}
                                    <h4>Submitted: {rep.createdAt}</h4>
                                    <p><strong>Strengths:</strong> {rep.strengths}</p>
                                    <p><strong>Weaknesses:</strong> {rep.weaknesses}</p>
                                    <p><strong>Player Comparison:</strong> {rep.comparison}</p>
                                    <p><strong>Best Fit:</strong> {rep.fit}</p>
                                    <p><strong>Projected Role:</strong> {rep.role}</p>
                                    <p><strong>Projected Ceiling:</strong> {rep.ceiling}</p>
                                    <p><strong>Draft Range:</strong> {rep.range}</p>

                                    {/* Trait ratings list */}
                                    <h5>Trait Ratings:</h5>
                                    <ul>
                                        {Object.entries(rep.ratings).map(([trait, value]) => (
                                            <li key={trait}><strong>{trait}:</strong> {value}</li>
                                        ))}
                                    </ul>

                                    {/* Summary for each past report */}
                                    <SummaryGenerator report={rep} />
                                </div>
                            ))}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default SubmittedScoutReportPage;
