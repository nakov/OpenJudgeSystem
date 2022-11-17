import React, { useEffect } from 'react';

import { ContestStatus } from '../../common/contest-types';
import { PageTitles } from '../../common/page-titles';
import { useHomeContests } from '../../hooks/use-home-contests';
import { setLayout } from '../../pages/shared/set-layout';
import { ChangePageTitle } from '../common/ChangePageTitle';

import ContestsList from './ContestsList';

const HomeContests = () => {
    const {
        state: {
            activeContests,
            pastContests,
        },
        actions: { getForHome },
    } = useHomeContests();

    ChangePageTitle(PageTitles.default);

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
