import React from 'react';
import { useContests } from '../../hooks/use-contests';
import { setLayout } from '../shared/set-layout';

const ContestsPage = () => {
    const { state: { contests } } = useContests();
    // const [ params, setParams ] = useSearchParams();

    console.log(contests);
    // console.log(type);

    return (
        <h1>It works!</h1>
    );
};

export default setLayout(ContestsPage, true);
