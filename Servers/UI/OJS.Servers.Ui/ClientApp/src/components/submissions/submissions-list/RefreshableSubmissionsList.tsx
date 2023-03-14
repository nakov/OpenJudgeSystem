import React from 'react';

import SubmissionsList, { ISubmissionsListProps } from './SubmissionsList';

interface IRefreshableSubmissionsListProps extends ISubmissionsListProps{
    externalElements?: () => React.ReactElement;
}

const RefreshableSubmissionsList = ({
    items,
    selectedSubmission,
    className = '',
    externalElements,
}: IRefreshableSubmissionsListProps) => (
    <>
        <SubmissionsList
          items={items}
          selectedSubmission={selectedSubmission}
          className={className}
        />
        {externalElements?.()}
    </>
);
export default RefreshableSubmissionsList;
