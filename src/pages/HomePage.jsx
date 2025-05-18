import React, { useEffect, useState } from 'react';
import PlayerCard from '../components/PlayerCard.jsx';

const HomePage = () => {
    const [players, setPlayers] = useState([]);           // Full merged list
    const [sortBy, setSortBy] = useState('average');      // Sort method
    const [searchQuery, setSearchQuery] = useState('');   // Text search
    const [teamFilter, setTeamFilter] = useState('');     // Selected team
    const [leagueFilter, setLeagueFilter] = useState(''); // Selected league

    const [allTeams, setAllTeams] = useState([]);         // For filter dropdown
    const [allLeagues, setAllLeagues] = useState([]);     // For filter dropdown

    useEffect(() => {
        fetch('/intern_project_data.json')
            .then((res) => res.json())
            .then((data) => {
                const merged = data.bio.map(player => {
                    const ranking = data.scoutRankings.find(r => r.playerId === player.playerId);
                    return { ...player, scoutRankings: ranking };
                });

                // Populate team and league options
                setAllTeams([...new Set(merged.map(p => p.currentTeam).filter(Boolean))].sort());
                setAllLeagues([...new Set(merged.map(p => p.league).filter(Boolean))].sort());

                // Sort players initially by the chosen method
                const sorted = [...merged].sort((a, b) => {
                    const rankA = getRankValue(a.scoutRankings, sortBy);
                    const rankB = getRankValue(b.scoutRankings, sortBy);
                    return rankA - rankB;
                });

                setPlayers(sorted);
            });
    }, [sortBy]);

    // Helper to get scout rank or average
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

    // Apply all filters to player list
    const filteredPlayers = players
        .filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (!teamFilter || p.currentTeam === teamFilter) &&
            (!leagueFilter || p.league === leagueFilter)
        );

    return (
        <div>
            <h1>NBA Draft Big Board</h1>

            {/* === Search by Player Name === */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="playerSearch"><strong>Search Player:</strong>{' '}</label>
                <input
                    id="playerSearch"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type player name..."
                    style={{ padding: '0.5rem', width: '200px' }}
                />
            </div>

            {/* === Filter by Team === */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="teamFilter"><strong>Filter by Team:</strong>{' '}</label>
                <select
                    id="teamFilter"
                    value={teamFilter}
                    onChange={(e) => setTeamFilter(e.target.value)}
                >
                    <option value="">All Teams</option>
                    {allTeams.map(team => (
                        <option key={team} value={team}>{team}</option>
                    ))}
                </select>
            </div>

            {/* === Filter by League === */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="leagueFilter"><strong>Filter by League:</strong>{' '}</label>
                <select
                    id="leagueFilter"
                    value={leagueFilter}
                    onChange={(e) => setLeagueFilter(e.target.value)}
                >
                    <option value="">All Leagues</option>
                    {allLeagues.map(league => (
                        <option key={league} value={league}>{league}</option>
                    ))}
                </select>
            </div>

            {/* === Sort by Scout Ranking === */}
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

            {/* === Display Matching Players === */}
            {filteredPlayers.map(player => (
                <PlayerCard key={player.playerId} player={player} />
            ))}
        </div>
    );
};

export default HomePage;
