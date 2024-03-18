import React from 'react';

import PageBreadcrumbs, { IPageBreadcrumbsItem } from '../../components/guidelines/breadcrumb/PageBreadcrumbs';
import RecentSubmissions from '../../components/submissions/recent-submissions/RecentSubmissions';
import { setLayout } from '../shared/set-layout';

const SubmissionsPage = () => (
    <>
        <PageBreadcrumbs
          keyPrefix="submissions"
          items={[
              {
                  text: 'Submissions',
                  to: '/submissions',
              } as IPageBreadcrumbsItem,
          ]}
        />
        <RecentSubmissions />
    </>

);

export default setLayout(SubmissionsPage);
