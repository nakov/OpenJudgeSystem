import React from 'react';
import { useContests } from '../../hooks/use-contests';
import { setLayout } from '../shared/set-layout';

const ContestsPage = () => {
    const { state: { contests } } = useContests();
    console.log(contests);

    return (
        <h1>It works!</h1>
    );
};

export default setLayout(ContestsPage, true);
