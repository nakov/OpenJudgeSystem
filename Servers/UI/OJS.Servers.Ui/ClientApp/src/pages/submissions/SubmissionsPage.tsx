import React from 'react';

import MetaTags from '../../components/common/MetaTags';
import PageBreadcrumbs, { IPageBreadcrumbsItem } from '../../components/guidelines/breadcrumb/PageBreadcrumbs';
import RecentSubmissions from '../../components/submissions/recent-submissions/RecentSubmissions';

const SubmissionsPage = () => (
    <>
        <MetaTags
          title="Recent Submissions - SoftUni Judge"
          description={
                'View the latest coding submissions on SoftUni Judge. Track progress, ' +
                'analyze recent solutions, and improve your programming skills.'
            }
        />
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

export default SubmissionsPage;
