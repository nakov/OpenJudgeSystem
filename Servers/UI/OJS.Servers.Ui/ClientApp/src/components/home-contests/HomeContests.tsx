import React, { useEffect } from 'react';
import { setLayout } from '../../pages/shared/set-layout';
import ContestsList from './ContestsList';
import { useHomeContests } from '../../hooks/use-home-contests';
import { ContestState } from '../../common/contest-types';

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
              contestState={ContestState.Active}
            />
            <ContestsList
              title="Past"
              contests={pastContests}
              contestState={ContestState.Past}
            />
        </>
    );
};

export default setLayout(HomeContests);
