import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ISubmissionResponseModel, usePublicSubmissions } from '../../../hooks/submissions/use-public-submissions';
import { useAuth } from '../../../hooks/use-auth';
import { usePages } from '../../../hooks/use-pages';
import generateId from '../../../utils/id-generator';
import { format } from '../../../utils/number-utils';
import Button, { ButtonType } from '../../guidelines/buttons/Button';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import List from '../../guidelines/lists/List';
import PaginationControls from '../../guidelines/pagination/PaginationControls';
import SubmissionGridRow from '../submission-grid-row/SubmissionGridRow';

import styles from './SubmissionsGrid.module.scss';

const SubmissionsGrid = () => {
    const [ selectedActive, setSelectedActive ] = useState<boolean>(true);

    const {
        state: {
            publicSubmissions,
            unprocessedSubmissions,
            totalSubmissionsCount,
            totalUnprocessedSubmissionsCount,
        },
        actions: {
            initiatePublicSubmissionsQuery,
            initiateUnprocessedSubmissionsQuery,
        },
    } = usePublicSubmissions();

    const { state: { user } } = useAuth();

    const {
        state: { currentPage, pagesInfo },
        changePage,
        clearPageValue,
    } = usePages();

    const handlePageChange = useCallback(
        (page: number) => changePage(page),
        [ changePage ],
    );

    const renderSubmissionRow = useCallback(
        (submission: ISubmissionResponseModel) => (
            <SubmissionGridRow submission={submission} />
        ),
        [],
    );

    const btnId = useMemo(
        () => {
            const privilegedIdBtn = generateId();
            return `btn-submit-${privilegedIdBtn}`;
        },
        [],
    );

    const handleShowSubmissionsInQueue = useCallback(
        () => {
            if (selectedActive) {
                clearPageValue();

                setSelectedActive(false);
            }
        },
        [ selectedActive, clearPageValue ],
    );

    const handlePublicSubmissions = useCallback(
        () => {
            if (!selectedActive) {
                clearPageValue();

                setSelectedActive(true);
            }
        },
        [ clearPageValue, selectedActive ],
    );

    useEffect(
        () => {
            if (totalSubmissionsCount === 0) {
                return;
            }

            if (selectedActive) {
                initiatePublicSubmissionsQuery();
            } else {
                initiateUnprocessedSubmissionsQuery();
            }
        },
        [ initiatePublicSubmissionsQuery, initiateUnprocessedSubmissionsQuery, selectedActive, totalSubmissionsCount ],
    );

    const { pagesCount } = pagesInfo;
    const renderPrivilegedComponent = useCallback(
        () => {
            const { isInRole } = user;
            if (isInRole) {
                return (
                    <>
                        <Heading type={HeadingType.secondary}>
                            Submissions in queue:
                            {' '}
                            {totalUnprocessedSubmissionsCount}
                            {' '}
                            (
                            <Button
                              id={btnId}
                              onClick={handlePublicSubmissions}
                              internalClassName={`${styles.privilegedButtonClassName} 
                              ${selectedActive
                                  ? `${styles.active}`
                                  : ''}
                             `}
                              text="All"
                            />
                            /
                            <Button
                              id={btnId}
                              onClick={handleShowSubmissionsInQueue}
                              type={ButtonType.submit}
                              internalClassName={`${styles.privilegedButtonClassName} 
                              ${!selectedActive
                                  ? `${styles.active}`
                                  : ''}
                             `}
                              text="In Queue"
                            />
                            )
                        </Heading>
                        <PaginationControls
                          count={pagesCount}
                          page={currentPage}
                          onChange={handlePageChange}
                        />
                    </>
                );
            }

            return null;
        },
        [ btnId, currentPage, handlePageChange, handlePublicSubmissions,
            handleShowSubmissionsInQueue, pagesCount, selectedActive, totalUnprocessedSubmissionsCount, user ],
    );

    const renderSubmissionsList = useCallback(
        () => {
            const submissions = selectedActive
                ? publicSubmissions
                : unprocessedSubmissions;

            return (
                <List
                  values={submissions}
                  itemFunc={renderSubmissionRow}
                  itemClassName={styles.submissionRow}
                  fullWidth
                />
            );
        },
        [ publicSubmissions, renderSubmissionRow, selectedActive, unprocessedSubmissions ],
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
            {renderSubmissionsList()}
        </>
    );
};

export default SubmissionsGrid;
