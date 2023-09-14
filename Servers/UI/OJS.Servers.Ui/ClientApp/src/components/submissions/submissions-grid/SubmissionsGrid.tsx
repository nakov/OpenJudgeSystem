import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { IDictionary } from '../../../common/common-types';
import { ISubmissionResponseModel, usePublicSubmissions } from '../../../hooks/submissions/use-public-submissions';
import { useAuth } from '../../../hooks/use-auth';
import { usePages } from '../../../hooks/use-pages';
import { format } from '../../../utils/number-utils';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import List from '../../guidelines/lists/List';
import PaginationControls from '../../guidelines/pagination/PaginationControls';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';
import SubmissionGridRow from '../submission-grid-row/SubmissionGridRow';

import SubmissionStateLink from './SubmissionStateLink';

import styles from './SubmissionsGrid.module.scss';

const selectedSubmissionsStateMapping = {
    1: 'All',
    2: 'In Queue',
    3: 'Pending',
} as IDictionary<string>;

enum toggleValues {
    allSubmissions = 'all submissions',
    mySubmissions = 'my submissions',
}

const SubmissionsGrid = () => {
    const [ selectedActive, setSelectedActive ] = useState<number>(1);
    const [ activeToggleElement, setActiveToggleElement ] = useState<toggleValues>(toggleValues.allSubmissions);

    const {
        state: {
            userSubmissions,
            userSubmissionsLoading,
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
            initiateUserSubmissionsQuery,
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

    useEffect(() => {
        if (activeToggleElement === toggleValues.mySubmissions) {
            initiateUserSubmissionsQuery();
        }
    }, [ activeToggleElement, initiateUserSubmissionsQuery ]);

    const handleSelectSubmissionType = useCallback((typeKey: number) => {
        if (selectedActive) {
            clearPageValue();

            setSelectedActive(typeKey);
        }
    }, [ clearPageValue, selectedActive ]);

    const handleToggleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const clickedElement = e.target as HTMLButtonElement;
        const { textContent } = clickedElement;

        if (textContent?.toLowerCase() === toggleValues.allSubmissions) {
            setActiveToggleElement(toggleValues.allSubmissions);
        } else {
            setActiveToggleElement(toggleValues.mySubmissions);
        }

        changePage(1);
    }, [ changePage ]);

    useEffect(
        () => {
            if (totalSubmissionsCount === 0 || activeToggleElement === toggleValues.mySubmissions) {
                return;
            }

            selectedSubmissionStateToRequestMapping[selectedActive]();
        },
        [
            activeToggleElement,
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
            const toggleSubmissions = activeToggleElement === toggleValues.allSubmissions
                ? publicSubmissions
                : userSubmissions;

            return (
                <>
                    { (isInRole && activeToggleElement === toggleValues.allSubmissions) && (
                        <Heading type={HeadingType.secondary}>
                            Submissions awaiting execution:
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
                    )}
                    { ((isInRole || activeToggleElement === toggleValues.mySubmissions) && toggleSubmissions.length > 0) && (
                    <PaginationControls
                      count={pagesCount}
                      page={currentPage}
                      onChange={handlePageChange}
                    />
                    ) }
                </>
            );
        },
        [
            user,
            totalUnprocessedSubmissionsCount,
            selectedActive,
            handleSelectSubmissionType,
            pagesCount,
            currentPage,
            handlePageChange,
            activeToggleElement,
            publicSubmissions,
            userSubmissions,
        ],
    );

    const renderToggleButton = useCallback(() => (
        <div className={styles.toggleButtonWrapper}>
            <button
              type="button"
              className={`${activeToggleElement === toggleValues.allSubmissions
                  ? styles.activeElement
                  : ''}`}
              onClick={(e) => handleToggleClick(e)}
            >
                ALL SUBMISSIONS
            </button>
            <button
              type="button"
              className={`${activeToggleElement === toggleValues.mySubmissions
                  ? styles.activeElement
                  : ''}`}
              onClick={(e) => handleToggleClick(e)}
            >
                MY SUBMISSIONS
            </button>
        </div>
    ), [ activeToggleElement, handleToggleClick ]);

    const renderSubmissionsList = useCallback(
        () => {
            const toggleSubmissions = activeToggleElement === toggleValues.allSubmissions
                ? publicSubmissions
                : userSubmissions;

            const submissions = selectedActive === 1
                ? toggleSubmissions
                : selectedActive === 2
                    ? unprocessedSubmissions
                    : pendingSubmissions;

            if (activeToggleElement === toggleValues.mySubmissions && userSubmissionsLoading) {
                return (
                    <div style={{ ...flexCenterObjectStyles }}>
                        <SpinningLoader />
                    </div>
                );
            }

            if (submissions.length === 0) {
                return (
                    <div className={styles.noSubmissionsFound}>
                        No submissions found.
                    </div>
                );
            }

            return (
                <List
                  values={submissions || []}
                  itemFunc={renderSubmissionRow}
                  itemClassName={styles.submissionRow}
                  fullWidth
                />
            );
        },
        [
            activeToggleElement,
            publicSubmissions,
            userSubmissions,
            selectedActive,
            unprocessedSubmissions,
            pendingSubmissions,
            userSubmissionsLoading,
            renderSubmissionRow,
        ],
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
            {renderToggleButton()}
            {renderPrivilegedComponent()}
            {renderSubmissionsList()}
        </>
    );
};

export default SubmissionsGrid;
