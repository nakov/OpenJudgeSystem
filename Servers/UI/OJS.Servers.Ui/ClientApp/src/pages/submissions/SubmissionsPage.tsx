import React  from 'react';

import RecentSubmissions from '../../components/submissions/recent-submissions/RecentSubmissions';
import { setLayout } from '../shared/set-layout';

const SubmissionsPage = () => {
    return (
        <RecentSubmissions />
    );
};

export default setLayout(SubmissionsPage);
