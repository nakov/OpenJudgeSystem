import React, { useCallback } from 'react';

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
    } = useHomeContests();

    const getContestStatusIndex = useCallback(
        (contestStatus: ContestStatus) => {
            const contestStatusArr = Object.values(ContestStatus);

            return contestStatusArr.indexOf(contestStatus) + 1;
        },
        [],
    );

    return (
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
    );
};

export default setLayout(HomeContests);
