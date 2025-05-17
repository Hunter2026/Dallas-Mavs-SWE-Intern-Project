import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// Component for displaying a full player profile page, including bio and scouting report links
const PlayerPage = () => {
    const { id } = useParams(); // Extract player ID from the route (URL parameter)
    const [player, setPlayer] = useState(null); // Stores the combined player bio and scout ranking data
    const [scoutingReports, setScoutingReports] = useState([]); // Stores text-based scouting reports (not used directly here)

    // Fetch player bio and scout ranking data on initial render or when `id` changes
    useEffect(() => {
        fetch('/intern_project_data.json')
            .then(res => res.json())
            .then(data => {
                // Find matching bio and scout ranking by playerId
                const foundPlayer = data.bio.find(p => p.playerId.toString() === id);
                const rankings = data.scoutRankings.find(r => r.playerId.toString() === id);
                // Combine bio and rankings into one player object
                setPlayer({ ...foundPlayer, scoutRankings: rankings });
            });
    }, [id]);

    // Helper function to calculate age from birthdate
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

    // Display loading text while player data is being fetched
    if (!player) return <p>Loading...</p>;

    return (
        <div style={{ padding: '1rem' }}>
            {/* Navigation link back to the big board */}
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem' }}>
                ← Back to Big Board
            </Link>

            {/* Display player basic info */}
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
            <p><strong>Nationality:</strong> {player.nationality}</p>

            {/* Navigation buttons to other player-specific pages */}
            <Link to={`/player/${player.playerId}/stats`}>
                <button style={{ marginTop: '1rem' }}>View Stats & Measurements</button>
            </Link>

            <Link to={`/player/${player.playerId}/scouting`}>
                <button style={{ marginTop: '0.5rem' }}>Write Scouting Report</button>
            </Link>

            <Link to={`/player/${player.playerId}/report`}>
                <button>View Submitted Scouting Reports</button>
            </Link>

            {/* Display scout rankings associated with this player */}
            <h3>Mavericks Scout Rankings</h3>
            <ul>
                {Object.entries(player.scoutRankings || {}).map(([scout, rank]) => {
                    if (scout === "playerId") return null; // Skip internal ID field
                    return (
                        <li key={scout}>
                            {scout}: {rank ?? 'N/A'} {/* Show N/A if no ranking provided */}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default PlayerPage;
