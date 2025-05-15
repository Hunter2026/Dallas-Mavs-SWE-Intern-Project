// Import React and React hooks
import React, { useEffect, useState } from 'react';

// Main App component
function App() {
    // State to hold the array of player data from the JSON
    const [players, setPlayers] = useState([]);

    // Fetch player data from the public folder when the component mounts
    useEffect(() => {
        fetch('/intern_project_data.json') // Fetch the JSON file from the public directory
            .then((res) => res.json())     // Parse the response as JSON
            .then((data) => setPlayers(data.bio)) // Set the 'bio' array into state
            .catch((err) => console.error('Error loading JSON:', err)); // Handle errors
    }, []);

    return (
        <div>
            <h1>NBA Draft Hub</h1>
            <ul>
                {/* Map through players array and display each name + team */}
                {players.map((player, index) => (
                    <li key={index}>
                        <strong>{player.name}</strong> - {player.currentTeam}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
