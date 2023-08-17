import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { IDictionary } from '../../../common/common-types';
import { ISubmissionResponseModel, usePublicSubmissions } from '../../../hooks/submissions/use-public-submissions';
import { useAuth } from '../../../hooks/use-auth';
import { usePages } from '../../../hooks/use-pages';
import { format } from '../../../utils/number-utils';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import List from '../../guidelines/lists/List';
import PaginationControls from '../../guidelines/pagination/PaginationControls';
import SubmissionGridRow from '../submission-grid-row/SubmissionGridRow';

import SubmissionStateLink from './SubmissionStateLink';

import styles from './SubmissionsGrid.module.scss';

const selectedSubmissionsStateMapping = {
    1: 'All',
    2: 'In Queue',
    3: 'Pending',
} as IDictionary<string>;

const SubmissionsGrid = () => {
    const [ selectedActive, setSelectedActive ] = useState<number>(1);

    const {
        state: {
            publicSubmissions,
            unprocessedSubmissions,
            pendingSubmissions,
            totalSubmissionsCount,
            totalUnprocessedSubmissionsCount,
        },
        actions: {
            initiatePublicSubmissionsQuery,
            initiateUnprocessedSubmissionsQuery,
            initiatePendingSubmissionsQuery,
        },
    } = usePublicSubmissions();

    const { state: { user } } = useAuth();

    const selectedSubmissionStateToRequestMapping = useMemo(
        () => ({
            1: initiatePublicSubmissionsQuery,
            2: initiateUnprocessedSubmissionsQuery,
            3: initiatePendingSubmissionsQuery,
        } as IDictionary<() => void>),
        [ initiatePendingSubmissionsQuery, initiatePublicSubmissionsQuery, initiateUnprocessedSubmissionsQuery ],
    );

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

    const handleSelectSubmissionType = useCallback((typeKey: number) => {
        if (selectedActive) {
            clearPageValue();

            setSelectedActive(typeKey);
        }
    }, [ clearPageValue, selectedActive ]);

    useEffect(
        () => {
            if (totalSubmissionsCount === 0) {
                return;
            }

            selectedSubmissionStateToRequestMapping[selectedActive]();
        },
        [
            initiatePendingSubmissionsQuery,
            initiatePublicSubmissionsQuery,
            initiateUnprocessedSubmissionsQuery,
            selectedActive,
            selectedSubmissionStateToRequestMapping,
            totalSubmissionsCount,
        ],
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
                            <SubmissionStateLink
                              stateIndex={1}
                              isSelected={selectedActive === 1}
                              text={selectedSubmissionsStateMapping[1]}
                              handleOnSelect={handleSelectSubmissionType}
                            />
                            /
                            <SubmissionStateLink
                              stateIndex={2}
                              isSelected={selectedActive === 2}
                              text={selectedSubmissionsStateMapping[2]}
                              handleOnSelect={handleSelectSubmissionType}
                            />
                            /
                            <SubmissionStateLink
                              stateIndex={3}
                              isSelected={selectedActive === 3}
                              text={selectedSubmissionsStateMapping[3]}
                              handleOnSelect={handleSelectSubmissionType}
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
        [
            user,
            totalUnprocessedSubmissionsCount,
            selectedActive,
            handleSelectSubmissionType,
            pagesCount,
            currentPage,
            handlePageChange,
        ],
    );

    const renderSubmissionsList = useCallback(
        () => {
            const submissions = selectedActive === 1
                ? publicSubmissions
                : selectedActive === 2
                    ? unprocessedSubmissions
                    : pendingSubmissions;

            return (
                <List
                  values={submissions}
                  itemFunc={renderSubmissionRow}
                  itemClassName={styles.submissionRow}
                  fullWidth
                />
            );
        },
        [ pendingSubmissions, publicSubmissions, renderSubmissionRow, selectedActive, unprocessedSubmissions ],
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
