import * as React from 'react';
import HomeContests from '../../components/home-contests/HomeContests';
import HomeHeader from '../../components/home-header/HomeHeader';
import { setLayout } from '../shared/set-layout';

const HomePage = () => (
    <>
        <HomeHeader />
        <HomeContests />
    </>
);

export default setLayout(HomePage, true);
