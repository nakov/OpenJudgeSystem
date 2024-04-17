import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Tooltip } from '@mui/material';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { ButtonSize, LinkButton, LinkButtonType } from '../../components/guidelines/buttons/Button';
import SubmissionGridRow from '../../components/submissions/submission-grid-row/SubmissionGridRow';
import {
    IContestResultsParticipationType,
    IContestResultsType,
} from '../../hooks/contests/types';
import { useContestCategories } from '../../hooks/use-contest-categories';
import useTheme from '../../hooks/use-theme';
import { IAuthorizationReduxState } from '../../redux/features/authorizationSlice';
import isNilOrEmpty from '../../utils/check-utils';
import concatClassNames from '../../utils/class-names';

import styles from './ContestResultsGrid.module.scss';

interface IContestResultsGridProps {
    items: IContestResultsType | null;
}

const ContestResultsGrid = ({ items }: IContestResultsGridProps) => {
    const { state: { categoriesFlat }, actions: { load: loadCategories } } = useContestCategories();
    const [ isCategoriesRequestSent, setIsCategoriesRequestSent ] = useState(false);
    const { isDarkMode, getColorClassName, themeColors } = useTheme();

    const { internalUser } = useSelector((state: {authorization: IAuthorizationReduxState}) => state.authorization);

    useEffect(
        () => {
            if (isEmpty(categoriesFlat) && !isCategoriesRequestSent) {
                setIsCategoriesRequestSent(true);
                (async () => {
                    await loadCategories();
                })();
            }
        },
        [ categoriesFlat, isCategoriesRequestSent, loadCategories ],
    );

    const getColumns = useCallback((results: IContestResultsType) => {
        const problemResultColumns = results.problems?.map((p) => p.name);

        return [ 'N' ]
            .concat('Participants')
            .concat(problemResultColumns)
            .concat('Total Result');
    }, []);

    const headerClassName = concatClassNames(
        styles.contestResultsGridHeader,
        isDarkMode
            ? styles.darkContestResultsGridHeader
            : styles.lightContestResultsGridHeader,
        getColorClassName(themeColors.textColor),
    );

    const rowClassName = concatClassNames(
        styles.row,
        isDarkMode
            ? styles.darkRow
            : styles.lightRow,
        getColorClassName(themeColors.textColor),
    );

    const renderParticipantResult = useCallback((participantResult: IContestResultsParticipationType, problemId: number) => {
        const problemResult = participantResult
            .problemResults
            .find((pr) => pr.problemId === problemId);

        const bestSubmission = problemResult?.bestSubmission;

        return (items!.userIsInRoleForContest || participantResult.participantUsername === internalUser.userName) && !isNil(bestSubmission)
            ? (
                <td>
                    <LinkButton
                      className={styles.pointsResult}
                      type={LinkButtonType.plain}
                      size={ButtonSize.small}
                      text={`${bestSubmission.points}`}
                      to={`/submissions/${bestSubmission.id}/details`}
                    />
                </td>
            )
            : <td>{bestSubmission?.points || '-'}</td>;
    }, [ items, internalUser ]);

    return (
        <table className={styles.contestResultsGrid}>
            <thead>
                <tr className={headerClassName}>
                    {
                        getColumns(items!).map((column) => {
                            if (column.length > 20) {
                                return (
                                    <td>
                                        <Tooltip title={column}>
                                            <p>{`${column.substring(0, 19)}...`}</p>
                                        </Tooltip>
                                    </td>
                                );
                            }

                            return (<td>{column}</td>);
                        })
                    }
                </tr>
            </thead>
            <tbody>
                {
                    !isNil(items) && !isEmpty(items) && items.results.map((participantResult, index) => (
                        <tr key={index} className={rowClassName}>
                            <td>{index + 1}</td>
                            <td>{participantResult.participantUsername}</td>
                            {
                                isNilOrEmpty(participantResult.problemResults)
                                    ? items?.problems.map((p) => (<td>-</td>))
                                    : items?.problems
                                        .map((p) => renderParticipantResult(participantResult, p.id))
                            }
                            {
                                isNilOrEmpty(participantResult.problemResults)
                                    ? <td>0</td>
                                    : <td>{participantResult.total}</td>
                            }
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
};

export default ContestResultsGrid;
