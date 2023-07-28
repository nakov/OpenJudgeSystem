import React, { useCallback, useMemo, useState } from 'react';

import { IPublicSubmissionResponseModel, usePublicSubmissions } from '../../../hooks/submissions/use-public-submissions';
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

    const btnId = useMemo(
        () => {
            const privilegedIdBtn = generateId();
            return `btn-submit-${privilegedIdBtn}`;
        },
        [],
    );

    const handleShowSubmissionsInQueue = useCallback(
        () => {
            if (!selectedActive) {
                setSelectedActive(true);
            }
        },
        [ selectedActive ],
    );

    const handlePublicSubmissions = useCallback(
        () => {
            if (selectedActive) {
                setSelectedActive(false);
            }
        },
        [ selectedActive ],
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
                            0
                            {' '}
                            (
                            <Button
                              id={btnId}
                              onClick={handleShowSubmissionsInQueue}
                              type={ButtonType.submit}
                              internalClassName={`${styles.privilegedButtonClassName} 
                              ${selectedActive
                                  ? `${styles.active}`
                                  : ''}
                             `}
                              text="Show submissions in queue"
                            />
                            /
                            <Button
                              id={btnId}
                              onClick={handlePublicSubmissions}
                              internalClassName={`${styles.privilegedButtonClassName} 
                              ${!selectedActive
                                  ? `${styles.active}`
                                  : ''}
                             `}
                              text="Show all solutions"
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
        [ btnId, currentPage, handlePageChange, handlePublicSubmissions, handleShowSubmissionsInQueue, pagesCount, selectedActive, user ],
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
