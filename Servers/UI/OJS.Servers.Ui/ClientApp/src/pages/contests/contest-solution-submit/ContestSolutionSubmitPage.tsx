import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ContestBreadcrumbs from '../../../components/contests/contest-breadcrumbs/ContestBreadcrumbs';
import ContestProblems from '../../../components/contests/contest-problems/ContestProblems';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import useTheme from '../../../hooks/use-theme';
import { setContestDetails } from '../../../redux/features/contestsSlice';
import { useGetContestByIdQuery } from '../../../redux/services/contestsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { flexCenterObjectStyles } from '../../../utils/object-utils';

import styles from './ContestSolutionSubmitPage.module.scss';

const ContestSolutionSubmitPage = () => {
    const { contestId } = useParams();
    const { themeColors, getColorClassName } = useTheme();
    const dispatch = useAppDispatch();

    const { contestDetails } = useAppSelector((state) => state.contests);
    const { data, isLoading, error } = useGetContestByIdQuery({ id: Number(contestId) });

    useEffect(() => {
        if (data?.id !== contestDetails?.id) {
            dispatch(setContestDetails({ contest: data ?? null }));
        }
    }, [ data, contestDetails?.id, dispatch ]);

    const { name } = data || {};

    const textColorClassName = getColorClassName(themeColors.textColor);

    if (isLoading) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }
    if (error) {
        return <div>Error loading details for contest! Please try again later!</div>;
    }
    return (
        <div className={`${styles.contestSolutionSubmitWrapper} ${textColorClassName}`}>
            <ContestBreadcrumbs />
            <div className={styles.title}>{name}</div>
            <div className={styles.problemsAndEditorWrapper}>
                <ContestProblems problems={data?.problems || []} />
                <div>editor</div>
            </div>
        </div>
    );
};

export default ContestSolutionSubmitPage;
