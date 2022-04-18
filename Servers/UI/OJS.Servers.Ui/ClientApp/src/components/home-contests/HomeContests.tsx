import React, { useEffect } from 'react';
import { setLayout } from '../../pages/shared/set-layout';
import ContestsList from './ContestsList';
import { useHomeContests } from '../../hooks/use-home-contests';

const HomeContests = () => {
    const {
        state: {
            activeContests,
            pastContests,
        },
        actions: { getForHome },
    } = useHomeContests();

    useEffect(() => {
        (async () => {
            await getForHome();
        })();
    }, [ getForHome ]);

    return (
        <>
            <ContestsList
              title="Active"
              contests={activeContests}

            />
            <ContestsList
              title="Past"
              contests={pastContests}
            />
        </>
    );
};

export default setLayout(HomeContests);
