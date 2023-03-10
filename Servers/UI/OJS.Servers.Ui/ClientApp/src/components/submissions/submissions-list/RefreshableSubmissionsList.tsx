import React from 'react';

import SubmissionsList, { ISubmissionsListProps } from './SubmissionsList';

interface IRefreshableSubmissionsListProps extends ISubmissionsListProps{
    itemFunc?: () => React.ReactElement;
}

const RefreshableSubmissionsList = ({
    items,
    selectedSubmission,
    className = '',
    itemFunc,
}: IRefreshableSubmissionsListProps) => (
    <>
        <SubmissionsList
          items={items}
          selectedSubmission={selectedSubmission}
          className={className}
        />
        {itemFunc?.()}
    </>
);
export default RefreshableSubmissionsList;
