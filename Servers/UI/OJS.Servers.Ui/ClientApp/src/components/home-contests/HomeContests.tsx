import React, { useCallback, useEffect } from 'react';

import { ContestStatus } from '../../common/contest-types';
import { IIndexContestsType, useHomeContests } from '../../hooks/use-home-contests';
import { setLayout } from '../../pages/shared/set-layout';

import ContestsList from './ContestsList';

const HomeContests = () => {
    const maxContestsToDisplay = 3;
    const {
        state: {
            activeContests,
            pastContests,
        },
        actions: { getForHome },
    } = useHomeContests();

    const contestsToDisplay = useCallback(
        (contests: IIndexContestsType[]) => contests.slice(0, maxContestsToDisplay),
        [],
    );

    useEffect(() => {
        (async () => {
            await getForHome();
        })();
    }, [ getForHome ]);

    return (
        <>
            <ContestsList
              title="Active"
              contests={contestsToDisplay(activeContests)}
              contestState={ContestStatus.Active}
            />
            <ContestsList
              title="Past"
              contests={contestsToDisplay(pastContests)}
              contestState={ContestStatus.Past}
            />
        </>
    );
};

export default setLayout(HomeContests);
