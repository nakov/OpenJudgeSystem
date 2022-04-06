import * as React from 'react';
import { useEffect } from 'react';
import { useContests } from '../../hooks/contests/use-contests';
import { setLayout } from '../../pages/shared/set-layout';
import ContestsList from './ContestsList';

const HomeContests = () => {
    const {
        activeContests,
        pastContests,
        getForHome,
    } = useContests();

    useEffect(() => {
        (async () => {
            await getForHome();
        })();
    }, [ getForHome ]);

    return (
        <>
            <ContestsList title="Active" contests={activeContests} />
            <ContestsList title="Past" contests={pastContests} />
        </>
    );
};

export default setLayout(HomeContests);
