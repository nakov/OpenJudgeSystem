import React, { useCallback, useEffect } from 'react';

import HomeContests from '../../components/home-contests/HomeContests';
import HomeHeader from '../../components/home-header/HomeHeader';
import { useHomeContests } from '../../hooks/use-home-contests';
import { useHomeStatistics } from '../../hooks/use-home-statistics';
import { useLoading } from '../../hooks/use-loading';
import { setLayout } from '../shared/set-layout';

const HomePage = () => {
    const { actions: { getForHome } } = useHomeContests();
    const { actions: { load: getHomeStatistics } } = useHomeStatistics();
    const { startLoading, stopLoading } = useLoading();
    const HomeHeaderWithLayout = setLayout(HomeHeader);

    const load = useCallback(
        async () => {
            startLoading();
            await Promise.all([
                getForHome(),
                getHomeStatistics(),
            ]);
            stopLoading();
        },
        [ getForHome, getHomeStatistics, startLoading, stopLoading ],
    );

    useEffect(
        () => {
            (async () => {
                await load();
            })();
        },
        [ load ],
    );

    return (
        <>
            <HomeHeaderWithLayout />
            <HomeContests />
        </>
    );
};

export default setLayout(HomePage, true);
