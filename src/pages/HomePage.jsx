import React, { useEffect, useState } from 'react';
import PlayerCard from '../components/PlayerCard.jsx';

// HomePage component displays the main Big Board with all ranked players
const HomePage = () => {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        // Fetch player bios and scout rankings from the local JSON file
        fetch('/intern_project_data.json')
            .then((res) => res.json())
            .then((data) => {
                // Merge scout rankings into each player object by matching playerId
                const rankedPlayers = data.bio.map(player => {
                    const ranking = data.scoutRankings.find(
                        r => r.playerId === player.playerId
                    );
                    return { ...player, scoutRankings: ranking };
                });

                // Sort players by average rank across all scouts (lower = better)
                const sorted = rankedPlayers.sort((a, b) => {
                    const avgA = getAvgRank(a.scoutRankings);
                    const avgB = getAvgRank(b.scoutRankings);
                    return avgA - avgB;
                });

                // Save the sorted player list to state
                setPlayers(sorted);
            });
    }, []);

    // Helper function to calculate average scout ranking for a player
    // Skips non-numeric values and the "playerId" key
    const getAvgRank = (rankings = {}) => {
        const values = Object.entries(rankings)
            .filter(([key, value]) => key !== 'playerId' && typeof value === 'number')
            .map(([_, value]) => value);

        if (values.length === 0) return Infinity; // Unranked players go to the bottom
        const total = values.reduce((sum, rank) => sum + rank, 0);
        return total / values.length;
    };

    return (
        <div>
            <h1>NBA Draft Big Board</h1>

            {/* Render PlayerCard for each sorted player */}
            {players.map(player => (
                <PlayerCard key={player.playerId} player={player} />
            ))}
        </div>
    );
};

export default HomePage;
