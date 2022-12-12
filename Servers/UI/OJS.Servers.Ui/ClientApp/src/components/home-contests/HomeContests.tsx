import React, { useEffect, useMemo } from 'react';

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

    const contestStatusArr = useMemo(
        () => Object.values(ContestStatus),
        [],
    );

    return (
        <>
            <ContestsList
              title="Active"
              contests={activeContests}
              contestState={contestStatusArr.indexOf(ContestStatus.Active) + 1}
            />
            <ContestsList
              title="Past"
              contests={pastContests}
              contestState={contestStatusArr.indexOf(ContestStatus.Past) + 1}
            />
        </>
    );
};

export default setLayout(HomeContests);
