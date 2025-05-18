import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PlayerCard from '../components/PlayerCard.jsx';

const HomePage = () => {
    const [players, setPlayers] = useState([]);           // Full merged player list
    const [sortBy, setSortBy] = useState('average');      // Scout sort method
    const [searchQuery, setSearchQuery] = useState('');   // Search text
    const [teamFilter, setTeamFilter] = useState('');     // Team dropdown value
    const [leagueFilter, setLeagueFilter] = useState(''); // League dropdown value

    const [allTeams, setAllTeams] = useState([]);         // Unique teams
    const [allLeagues, setAllLeagues] = useState([]);     // Unique leagues

    const [compareList, setCompareList] = useState([]);   // Selected players for comparison

    // Fetch and prepare data
    useEffect(() => {
        fetch('/intern_project_data.json')
            .then((res) => res.json())
            .then((data) => {
                const merged = data.bio.map(player => {
                    const ranking = data.scoutRankings.find(r => r.playerId === player.playerId);
                    return { ...player, scoutRankings: ranking };
                });

                // Populate team/league dropdowns
                setAllTeams([...new Set(merged.map(p => p.currentTeam).filter(Boolean))].sort());
                setAllLeagues([...new Set(merged.map(p => p.league).filter(Boolean))].sort());

                // Sort based on scout rank method
                const sorted = [...merged].sort((a, b) => {
                    const rankA = getRankValue(a.scoutRankings, sortBy);
                    const rankB = getRankValue(b.scoutRankings, sortBy);
                    return rankA - rankB;
                });

                setPlayers(sorted);
            });
    }, [sortBy]);

    // Get ranking value (by scout or average)
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

    // Handle toggling player in comparison list
    const toggleCompare = (player) => {
        setCompareList(prev => {
            const exists = prev.find(p => p.playerId === player.playerId);
            if (exists) {
                return prev.filter(p => p.playerId !== player.playerId);
            } else if (prev.length < 3) {
                return [...prev, player];
            } else {
                alert("You can only compare up to 3 players.");
                return prev;
            }
        });
    };

    // Apply filters and search to player list
    const filteredPlayers = players
        .filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (!teamFilter || p.currentTeam === teamFilter) &&
            (!leagueFilter || p.league === leagueFilter)
        );

    return (
        <div>
            <h1>NBA Draft Big Board</h1>

            {/* === Comparison Cart UI === */}
            {compareList.length > 0 && (
                <div style={{ background: '#eef4ff', padding: '1rem', marginBottom: '1rem', borderRadius: '6px' }}>
                    <strong>Comparing:</strong> {compareList.map(p => p.name).join(', ')}
                    <Link to={`/compare?ids=${compareList.map(p => p.playerId).join(',')}`}>
                        <button style={{ marginLeft: '1rem' }}>View Comparison</button>
                    </Link>
                </div>
            )}

            {/* === Search Input === */}
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

            {/* === Team Filter Dropdown === */}
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

            {/* === League Filter Dropdown === */}
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

            {/* === Sort Dropdown === */}
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

            {/* === Render Filtered Players === */}
            {filteredPlayers.map(player => (
                <PlayerCard
                    key={player.playerId}
                    player={player}
                    onCompareToggle={toggleCompare}
                    isSelected={compareList.some(p => p.playerId === player.playerId)}
                />
            ))}
        </div>
    );
};

export default HomePage;
