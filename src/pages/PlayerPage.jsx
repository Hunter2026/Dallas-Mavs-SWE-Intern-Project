import React from 'react';
import { useParams } from 'react-router-dom';

const PlayerPage = () => {
    const { id } = useParams();

    return <div>Player profile for ID: {id}</div>;
};

export default PlayerPage;
