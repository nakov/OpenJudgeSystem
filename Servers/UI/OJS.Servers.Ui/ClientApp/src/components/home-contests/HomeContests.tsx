import React, { useEffect } from 'react';

import { ContestStatus } from '../../common/contest-types';
import { useHomeContests } from '../../hooks/use-home-contests';
import { setLayout } from '../../pages/shared/set-layout';

import ContestsList from './ContestsList';

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
              contestState={ContestStatus.Active}
            />
            <ContestsList
              title="Past"
              contests={pastContests}
              contestState={ContestStatus.Past}
            />
        </>
    );
};

export default setLayout(HomeContests);
