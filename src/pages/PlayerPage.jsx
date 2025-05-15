import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// PlayerPage displays full profile info and a scouting report form for a given player
const PlayerPage = () => {
    const { id } = useParams(); // Extract player ID from the route
    const [player, setPlayer] = useState(null); // Player object (bio + rankings)
    const [reportText, setReportText] = useState(''); // Text input for scouting report
    const [scoutingReports, setScoutingReports] = useState([]); // Array of submitted reports

    // Fetch player data and matching scout rankings on page load
    useEffect(() => {
        fetch('/intern_project_data.json')
            .then(res => res.json())
            .then(data => {
                // Find the player bio and scout rankings by playerId
                const foundPlayer = data.bio.find(p => p.playerId.toString() === id);
                const rankings = data.scoutRankings.find(r => r.playerId.toString() === id);
                setPlayer({ ...foundPlayer, scoutRankings: rankings });
            });
    }, [id]);

    // Handle submitting a new scouting report
    const handleReportSubmit = (e) => {
        e.preventDefault();
        if (reportText.trim() !== '') {
            setScoutingReports(prev => [...prev, reportText.trim()]);
            setReportText('');
        }
    };

    const calculateAge = (birthDateString) => {
        const birthDate = new Date(birthDateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();

        const hasHadBirthdayThisYear =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

        if (!hasHadBirthdayThisYear) {
            age -= 1;
        }

        return age;
    };


    // Show loading state while data is being fetched
    if (!player) return <p>Loading...</p>;

    return (
        <div style={{ padding: '1rem' }}>
            {/* Back link to the Big Board */}
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem' }}>
                ← Back to Big Board
            </Link>

            {/* Player Basic Info */}
            <h2>{player.name}</h2>
            {player.photoUrl && (
                <img src={player.photoUrl} alt={player.name} width="150" />
            )}
            <p><strong>Current Team:</strong> {player.currentTeam}</p>
            <p><strong>Age:</strong> {calculateAge(player.birthDate)}</p>
            <p>
                <strong>Height:</strong>{' '}
                {Math.floor(player.height / 12)}&apos; {player.height % 12}&quot;
            </p>
            <p><strong>Weight:</strong> {player.weight} lbs</p>
            <p>
                <strong>Hometown:</strong> {player.homeTown}, {player.homeState || player.homeCountry}
            </p>

            <Link to={`/player/${player.playerId}/stats`}>
                <button style={{ marginTop: '1rem' }}>View Stats & Measurements</button>
            </Link>

            {/* Scout Rankings Display */}
            <h3>Mavericks Scout Rankings</h3>
            <ul>
                {Object.entries(player.scoutRankings || {}).map(([scout, rank]) => {
                    if (scout === "playerId") return null; // Skip ID field
                    return (
                        <li key={scout}>
                            {scout}: {rank ?? 'N/A'}
                        </li>
                    );
                })}
            </ul>

            {/* Scouting Report Form */}
            <h3>Submit Scouting Report</h3>
            <form onSubmit={handleReportSubmit}>
                <textarea
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="Write your report here..."
                    rows={4}
                    cols={50}
                />
                <br />
                <button type="submit">Submit</button>
            </form>

            {/* Display List of Submitted Reports (from local state) */}
            {scoutingReports.length > 0 && (
                <>
                    <h4>Submitted Reports:</h4>
                    <ul>
                        {scoutingReports.map((report, index) => (
                            <li key={index}>{report}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default PlayerPage;
