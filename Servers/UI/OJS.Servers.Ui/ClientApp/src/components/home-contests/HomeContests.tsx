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

    return (
        isLoaded
            ? (
                <>
                    <ContestsList
                      title={ContestStatus.Active}
                      contests={activeContests}
                      contestStatus={ContestStatus.Active}
                    />
                    <ContestsList
                      title={ContestStatus.Past}
                      contests={pastContests}
                      contestStatus={ContestStatus.Past}
                    />
                </>
            )
            : null
    );
};

export default setLayout(HomeContests);
