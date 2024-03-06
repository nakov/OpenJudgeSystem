import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { IDictionary } from '../../../common/common-types';
import { ISubmissionResponseModel } from '../../../common/types';
import { usePublicSubmissions } from '../../../hooks/submissions/use-public-submissions';
import { usePages } from '../../../hooks/use-pages';
import useTheme from '../../../hooks/use-theme';
import { IAuthorizationReduxState } from '../../../redux/features/authorizationSlice';
import concatClassNames from '../../../utils/class-names';
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

const defaultState = { state: { selectedActive: 1 } };

const SubmissionsGrid = () => {
    const [ selectedActive, setSelectedActive ] = useState<number>(defaultState.state.selectedActive);
    const {
        state: {
            publicSubmissions,
            totalSubmissionsCount,
            totalUnprocessedSubmissionsCount,
            areSubmissionsLoading,
        },
        actions: {
            loadTotalUnprocessedSubmissionsCount,
            initiatePublicSubmissionsQuery,
            initiateUnprocessedSubmissionsQuery,
            initiatePendingSubmissionsQuery,
            clearPageValues,
            clearPageInformation,
        },
    } = usePublicSubmissions();

    const { isDarkMode, getColorClassName, themeColors } = useTheme();

    const { internalUser: user } =
        useSelector((state: {authorization: IAuthorizationReduxState}) => state.authorization);
    const {
        state: { currentPage, pagesInfo },
        changePage,
    } = usePages();

    const selectedSubmissionStateToRequestMapping = useMemo(
        () => ({
            1: initiatePublicSubmissionsQuery,
            2: initiateUnprocessedSubmissionsQuery,
            3: initiatePendingSubmissionsQuery,
        } as IDictionary<() => void>),
        [ initiatePublicSubmissionsQuery, initiateUnprocessedSubmissionsQuery, initiatePendingSubmissionsQuery ],
    );

    useEffect(
        () => {
            if (!user.isAdmin) {
                return;
            }

            (async () => {
                await loadTotalUnprocessedSubmissionsCount();
            })();
        },
        [ loadTotalUnprocessedSubmissionsCount, user.isAdmin ],
    );

    const handlePageChange = useCallback(
        (page: number) => changePage(page),
        [ changePage ],
    );

    const handleSelectSubmissionType = useCallback(
        (typeKey: number) => {
            if (selectedActive) {
                clearPageValues();

                setSelectedActive(typeKey);
            }
        },
        [ clearPageValues, selectedActive ],
    );

    useEffect(
        () => {
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

    useEffect(
        () => () => {
            clearPageInformation();
        },
        [ clearPageInformation ],
    );

    const { pagesCount } = pagesInfo;

    const renderPrivilegedComponent = useCallback(
        () => {
            const { isAdmin } = user;

            return (
                isAdmin && (
                    <Heading
                      type={HeadingType.secondary}
                    >
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
                )
            );
        },
        [ user, totalUnprocessedSubmissionsCount, selectedActive, handleSelectSubmissionType ],
    );

    const renderSubmissionRow = useCallback(
        (submission: ISubmissionResponseModel, index: number) => (
            <SubmissionGridRow
              isFirst={index === 0}
              submission={submission}
            />
        ),
        [],
    );

    const headerClassName = concatClassNames(
        styles.submissionsGridHeader,
        isDarkMode
            ? styles.darkSubmissionsGridHeader
            : styles.lightSubmissionsGridHeader,
        getColorClassName(themeColors.textColor),
    );

    const renderSubmissionsList = useCallback(
        () => {
            if (areSubmissionsLoading) {
                return (
                    <div style={{ ...flexCenterObjectStyles, marginTop: '10px' }}>
                        <SpinningLoader />
                    </div>
                );
            }

            if (publicSubmissions.length === 0) {
                return (
                    <div className={styles.noSubmissionsFound}>
                        No submissions found.
                    </div>
                );
            }

            return (
                <table className={styles.submissionsGrid}>
                    <tr className={headerClassName}>
                        <td>ID</td>
                        <td>Task</td>
                        <td>From</td>
                        <td className={styles.tdRight}>Result</td>
                        {
                            user.isAdmin
                                ? <td>Execution Result</td>
                                : null
                        }
                        <td />
                        <td />
                    </tr>
                    {
                        publicSubmissions.map((s) => (
                            <SubmissionGridRow submission={s} />
                        ))
                    }
                </table>
            );
        },
        [ areSubmissionsLoading, publicSubmissions, user.isAdmin ],
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
            {publicSubmissions?.length > 0 && (
                <PaginationControls
                  count={pagesCount}
                  page={currentPage}
                  onChange={handlePageChange}
                />
            )}
        </>
    );
};

export default SubmissionsGrid;
