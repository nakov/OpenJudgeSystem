import React from 'react';

import SubmissionsList, { ISubmissionsListProps } from './SubmissionsList';

type IRefreshableSubmissionsListProps = ISubmissionsListProps

const RefreshableSubmissionsList = ({
    items,
    selectedSubmission,
    className = '',
}: IRefreshableSubmissionsListProps) => (
    <SubmissionsList
      items={items}
      selectedSubmission={selectedSubmission}
      className={className}
    />
);

export default RefreshableSubmissionsList;
