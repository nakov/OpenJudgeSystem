import React from 'react';

import HomeContests from '../../components/home-contests/HomeContests';
import HomeHeader from '../../components/home-header/HomeHeader';
import { setLayout } from '../shared/set-layout';

const HomePage = () => {
    const HomeHeaderWithLayout = setLayout(HomeHeader);

    return (
        <>
            <HomeHeaderWithLayout />
            <HomeContests />
        </>
    );
};

export default setLayout(HomePage, true);
