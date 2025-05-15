import React, { useEffect, useState } from 'react';
import PlayerCard from '../components/PlayerCard.jsx';

const HomePage = () => {
    const [players, setPlayers] = useState([]);
    const [sortBy, setSortBy] = useState('average'); // 'average' or a specific scout name like 'ESPN Rank'

    useEffect(() => {
        fetch('/intern_project_data.json')
            .then((res) => res.json())
            .then((data) => {
                const merged = data.bio.map(player => {
                    const ranking = data.scoutRankings.find(r => r.playerId === player.playerId);
                    return { ...player, scoutRankings: ranking };
                });

                const sorted = [...merged].sort((a, b) => {
                    const rankA = getRankValue(a.scoutRankings, sortBy);
                    const rankB = getRankValue(b.scoutRankings, sortBy);
                    return rankA - rankB;
                });

                setPlayers(sorted);
            });
    }, [sortBy]); // Re-run when sortBy changes

    // Helper to get rank by selected method
    const getRankValue = (rankings = {}, key) => {
        if (!rankings) return Infinity;

        if (key === 'average') {
            const values = Object.entries(rankings)
                .filter(([k, v]) => k !== 'playerId' && typeof v === 'number');
            if (values.length === 0) return Infinity;
            const sum = values.reduce((acc, [_, val]) => acc + val, 0);
            return sum / values.length;
        }

        return typeof rankings[key] === 'number' ? rankings[key] : Infinity;
    };

    return (
        <div>
            <h1>NBA Draft Big Board</h1>

            {/* Dropdown to select sort method */}
            <label htmlFor="sortSelect"><strong>Sort By:</strong>{' '}</label>
            <select
                id="sortSelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ marginBottom: '1rem' }}
            >
                <option value="average">Average Scout Ranking</option>
                <option value="ESPN Rank">ESPN Rank</option>
                <option value="Sam Vecenie Rank">Sam Vecenie Rank</option>
                <option value="Kevin O'Connor Rank">Kevin O'Connor Rank</option>
                <option value="Kyle Boone Rank">Kyle Boone Rank</option>
                <option value="Gary Parrish Rank">Gary Parrish Rank</option>
            </select>

            {/* Render player cards */}
            {players.map(player => (
                <PlayerCard key={player.playerId} player={player} />
            ))}
        </div>
    );
};

export default HomePage;
