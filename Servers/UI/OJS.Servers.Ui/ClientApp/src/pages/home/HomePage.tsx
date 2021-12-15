import * as React from 'react';
import { setLayout } from '../shared/set-layout';
import HomeContests from '../../components/home-contests/HomeContests';

const HomePage = () => (
    <>
        <HomeContests />
    </>
);

export default setLayout(HomePage);
