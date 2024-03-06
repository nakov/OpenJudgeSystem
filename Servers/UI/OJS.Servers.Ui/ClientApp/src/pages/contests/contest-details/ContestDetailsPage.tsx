import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link, useParams } from 'react-router-dom';

import ContestBreadcrumbs from '../../../components/contests/contest-breadcrumbs/ContestBreadcrumbs';
import Button, { ButtonSize, ButtonState } from '../../../components/guidelines/buttons/Button';
import Heading, { HeadingType } from '../../../components/guidelines/headings/Heading';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import useTheme from '../../../hooks/use-theme';
import { setContestDetails } from '../../../redux/features/contestsSlice';
import { useGetContestByIdQuery } from '../../../redux/services/contestsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { flexCenterObjectStyles } from '../../../utils/object-utils';

import styles from './ContestDetailsPage.module.scss';

const ContestDetailsPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { contestId } = useParams();
    const { isLoggedIn } = useAppSelector((state) => state.authorization);
    const { themeColors, getColorClassName } = useTheme();
    const { contestDetails } = useAppSelector((state) => state.contests);
    const { data, isLoading, error } = useGetContestByIdQuery({ id: Number(contestId) });

    const textColorClassName = getColorClassName(themeColors.textColor);
    const {
        id,
        name,
        allowedSubmissionTypes,
        description,
        problems,
        competeParticipantsCount,
        practiceParticipantsCount,
        canBeCompeted,
        canBePracticed,
    } = data ?? {};

    useEffect(() => {
        if (contestDetails?.id !== data?.id) {
            dispatch(setContestDetails({ contest: data ?? null }));
        }
    }, [ data, contestDetails, dispatch ]);

    const renderAllowedLanguages = () => allowedSubmissionTypes?.map((allowedSubmissionType) => (
        <>
            <Link
              className={styles.allowedLanguageLink}
              to={`/contests?strategy=${allowedSubmissionType.id}`}
            >
                {allowedSubmissionType.name}
            </Link>
            {' | '}
        </>
    ));

    const renderProblemsNames = () => {
        if (!problems || problems.length === 0) {
            return 'The problems for this contest are not public.';
        }
        return problems.map((problem) => (
            <div className={styles.problemNameItem}>
                {problem.name}
            </div>
        ));
    };

    const renderContestActionButton = (isCompete: boolean) => {
        const navigateToUrl = isCompete
            ? `contests/${id}/compete`
            : `contests/${id}/practice`;
        const isDisabled = isCompete
            ? !canBeCompeted
            : !canBePracticed;
        return (
            <div className={styles.actionBtnWrapper}>
                <Button
                  text={isCompete
                      ? 'COMPETE'
                      : 'PRACTICE'}
                  state={isDisabled
                      ? ButtonState.disabled
                      : ButtonState.enabled}
                  size={ButtonSize.small}
                  isCompete={isCompete}
                  onClick={() => {
                      if (!isLoggedIn) {
                          navigate('/login');
                          return;
                      }
                      navigate(navigateToUrl);
                  }}
                />
                <Link
                  className={`${isCompete
                      ? styles.greenColor
                      : ''}`}
                  to={`/contests/${id}/compete/results/simple`}
                >
                    <i className="fas fa-user" />
                    <div className={`${styles.underlinedBtnText}`}>
                        { isCompete
                            ? 'compete'
                            : 'practice'}
                        {' '}
                        results
                        {' '}
                        {isCompete
                            ? competeParticipantsCount
                            : practiceParticipantsCount}
                    </div>
                </Link>
            </div>
        );
    };

    if (error) {
        return (
            <div className={textColorClassName}>
                Error fetching details for contest with id:
                {' '}
                {contestId}
                ! Please try again!
            </div>
        );
    }
    if (isLoading) {
        return (
            <div style={{ ...flexCenterObjectStyles, marginTop: 24 }}>
                <SpinningLoader />
            </div>
        );
    }
    return (
        <div className={`${styles.contestDetailsWrapper} ${textColorClassName}`}>
            <ContestBreadcrumbs />
            <Heading className={styles.heading} type={HeadingType.primary}>{name}</Heading>
            <div className={styles.descriptionBoxWrapper}>
                <div>
                    <div className={styles.title}>Contest Details</div>
                    <div dangerouslySetInnerHTML={{ __html: description || 'There is no description for the selected contest.' }} />
                    <div>
                        Allowed languages:
                        {' '}
                        {' '}
                        {renderAllowedLanguages()}
                    </div>
                </div>
                <div>
                    <div className={styles.title}>Problems</div>
                    <div>{renderProblemsNames()}</div>
                </div>
            </div>
            <div className={styles.actionButtonsWrapper}>
                {renderContestActionButton(true)}
                {renderContestActionButton(false)}
            </div>
        </div>
    );
};

export default ContestDetailsPage;
