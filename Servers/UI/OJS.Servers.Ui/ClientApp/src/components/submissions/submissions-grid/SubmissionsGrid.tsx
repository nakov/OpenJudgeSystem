import React, { useCallback } from 'react';

import { IPublicSubmissionResponseModel, usePublicSubmissions } from '../../../hooks/submissions/use-public-submissions';
import { useAuth } from '../../../hooks/use-auth';
import { usePages } from '../../../hooks/use-pages';
import { format } from '../../../utils/number-utils';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import List from '../../guidelines/lists/List';
import PaginationControls from '../../guidelines/pagination/PaginationControls';
import SubmissionGridRow from '../submission-grid-row/SubmissionGridRow';

import styles from './SubmissionsGrid.module.scss';

const SubmissionsGrid = () => {
    const {
        state: {
            publicSubmissions,
            totalSubmissionsCount,
        },
    } = usePublicSubmissions();
    const { state: { user } } = useAuth();

    const {
        state: { currentPage, pagesInfo },
        changePage,
    } = usePages();

    const handlePageChange = useCallback(
        (page: number) => changePage(page),
        [ changePage ],
    );

    const renderSubmissionRow = useCallback(
        (submission: IPublicSubmissionResponseModel) => (
            <SubmissionGridRow submission={submission} />
        ),
        [],
    );

    const { pagesCount } = pagesInfo;
    const renderPrivilegedComponent = useCallback(
        () => {
            const { isInRole } = user;
            if (isInRole) {
                return (
                    <PaginationControls
                      count={pagesCount}
                      page={currentPage}
                      onChange={handlePageChange}
                    />
                );
            }

            return null;
        },
        [ currentPage, handlePageChange, pagesCount, user ],
    );

    return (
        <>
            <Heading type={HeadingType.primary}>
                Latest
                {' '}
                {publicSubmissions.length}
                {' '}
                submissions out of
                {' '}
                {format(totalSubmissionsCount)}
                {' '}
                total
            </Heading>
            {renderPrivilegedComponent()}
            <List
              values={publicSubmissions}
              itemFunc={renderSubmissionRow}
              itemClassName={styles.submissionRow}
              fullWidth
            />
        </>
    );
};

export default SubmissionsGrid;
