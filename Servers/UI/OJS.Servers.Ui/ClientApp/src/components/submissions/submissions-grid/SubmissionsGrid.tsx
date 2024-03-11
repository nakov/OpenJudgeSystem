import React, {useCallback, useState} from 'react';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IPagedResultType, IPublicSubmission } from '../../../common/types';
import useTheme from '../../../hooks/use-theme';
import { IAuthorizationReduxState } from '../../../redux/features/authorizationSlice';
import concatClassNames from '../../../utils/class-names';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import PaginationControls from '../../guidelines/pagination/PaginationControls';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';
import SubmissionGridRow from '../submission-grid-row/SubmissionGridRow';

import styles from './SubmissionsGrid.module.scss';

interface ISubmissionsGridProps {
    isDataLoaded: boolean;
    submissions: IPagedResultType<IPublicSubmission>;
    handlePageChange: (page: number) => void;
}

const SubmissionsGrid = ({
    isDataLoaded,
    submissions,
    handlePageChange,
}: ISubmissionsGridProps) => {
    const { isDarkMode, getColorClassName, themeColors } = useTheme();

    const { internalUser: user } =
        useSelector((state: {authorization: IAuthorizationReduxState}) => state.authorization);

    const onPageChange = useCallback(
        (page: number) => {
            handlePageChange(page);
        },
        [ handlePageChange ],
    );

    const headerClassName = concatClassNames(
        styles.submissionsGridHeader,
        isDarkMode
            ? styles.darkSubmissionsGridHeader
            : styles.lightSubmissionsGridHeader,
        getColorClassName(themeColors.textColor),
    );

    const renderSubmissionsGrid = useCallback(
        () => {
            if (!isDataLoaded) {
                return (
                    <div style={{ ...flexCenterObjectStyles, marginTop: '10px' }}>
                        <SpinningLoader />
                    </div>
                );
            }

            if (isEmpty(submissions.items)) {
                return (
                    <div className={concatClassNames(
                        styles.noSubmissionsFound, 
                        getColorClassName(themeColors.textColor))}>
                        No submissions found.
                    </div>
                );
            }

            return (
                <table className={styles.submissionsGrid}>
                    <thead>
                    <tr className={headerClassName}>
                        <td>ID</td>
                        <td>Task</td>
                        <td>From</td>
                        {
                            user.isAdmin
                                ? <td/>
                                : null
                        }
                        <td className={styles.tdRight}>Result</td>
                        {
                            user.isAdmin
                                ? <td>Execution Result</td>
                                : null
                        }
                        <td className={styles.tdRight}>Strategy</td>
                        <td/>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            !isNil(submissions.items) && !isEmpty(submissions.items)
                                ? submissions.items.map((s) => (
                                    <SubmissionGridRow submission={s}/>
                                ))
                                : null
                        }
                    </tbody>
                </table>
        );
        },
        [ isDataLoaded, headerClassName, submissions, user.isAdmin ],
    );

    return (
        <>
            {renderSubmissionsGrid()}
            {!isEmpty(submissions) && submissions.pagesCount !== 0 && (
                <PaginationControls
                  count={submissions.pagesCount}
                  page={submissions.pageNumber}
                  onChange={onPageChange}
                />
            )}
        </>
    );
};

export default SubmissionsGrid;
