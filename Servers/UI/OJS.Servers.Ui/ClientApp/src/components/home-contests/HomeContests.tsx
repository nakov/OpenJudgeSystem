import React, { useCallback, useEffect } from 'react';

import { ContestStatus } from '../../common/contest-types';
import { useHomeContests } from '../../hooks/use-home-contests';
import { setLayout } from '../../pages/shared/set-layout';

import ContestsList from './ContestsList';

const HomeContests = () => {
    const {
        state: {
            activeContests,
            pastContests,
            isLoaded,
        },
        actions: { getForHome },
    } = useHomeContests();

    useEffect(
        () => {
            (async () => {
                await getForHome();
            })();
        },
        [ getForHome ],
    );

    const getContestStatusIndex = useCallback(
        (contestStatus: ContestStatus) => {
            const contestStatusArr = Object.values(ContestStatus);

            return contestStatusArr.indexOf(contestStatus) + 1;
        },
        [],
    );

    return (
        isLoaded
            ? (
                <>
                    <ContestsList
                      title="Active"
                      contests={activeContests}
                      contestStatus={getContestStatusIndex(ContestStatus.Active)}
                    />
                    <ContestsList
                      title="Past"
                      contests={pastContests}
                      contestStatus={getContestStatusIndex(ContestStatus.Past)}
                    />
                </>
            )
            : null
    );
};

export default setLayout(HomeContests);
