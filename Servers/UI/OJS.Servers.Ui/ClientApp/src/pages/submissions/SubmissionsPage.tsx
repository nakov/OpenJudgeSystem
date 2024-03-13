import React from 'react';

import PageBreadcrumbs from '../../components/guidelines/breadcrumb/PageBreadcrumbs';
import RecentSubmissions from '../../components/submissions/recent-submissions/RecentSubmissions';
import { setLayout } from '../shared/set-layout';

const SubmissionsPage = () => (
    <>
        <PageBreadcrumbs
          keyPrefix="submissions"
          items={[ 'Submissions' ]}
        />
        <RecentSubmissions />
    </>

);

export default setLayout(SubmissionsPage);
