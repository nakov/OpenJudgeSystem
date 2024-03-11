import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link, useParams } from 'react-router-dom';

import ContestBreadcrumbs from '../../../components/contests/contest-breadcrumbs/ContestBreadcrumbs';
import ContestButton from '../../../components/contests/contest-button/ContestButton';
import Button from '../../../components/guidelines/buttons/Button';
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
    const { internalUser: user } = useAppSelector((state) => state.authorization);
    const { themeColors, getColorClassName } = useTheme();
    const { contestDetails, selectedCategory } = useAppSelector((state) => state.contests);
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
              key={`contest-sub-strat-btn-${allowedSubmissionType.id}`}
              className={styles.allowedLanguageLink}
              to={`/contests?category=${selectedCategory?.id}&strategy=${allowedSubmissionType.id}`}
            >
                {allowedSubmissionType.name}
            </Link>
            {' | '}
        </>
    ));

    const renderProblemsNames = () => {
        if (!problems) {
            return 'The problems for this contest are not public.';
        }
        return problems.map((problem) => (
            <div className={styles.problemNameItem}>
                {problem.name}
            </div>
        ));
    };

    const renderAdministrationButtons = () => (
        <div>
            <Button onClick={() => navigate(`/administration-new/contests/${id}`)}>Edit</Button>
            <Button className={styles.adminBtn} onClick={() => navigate(`/contests/${id}/compete/results/full`)}>Full Results</Button>
        </div>
    );

    const renderContestActionButton = (isCompete: boolean) => {
        const isDisabled = isCompete
            ? !canBeCompeted
            : !canBePracticed;
        return (
            <div className={styles.actionBtnWrapper}>
                <ContestButton isCompete={isCompete} isDisabled={isDisabled} id={id!} />
                <Link
                  className={`${isDisabled
                      ? styles.disabledLink
                      : ''} ${isCompete
                      ? styles.greenColor
                      : ''}`}
                  to={`/contests/${id}/${isCompete
                      ? 'compete'
                      : 'practice'}/results/simple`}
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
            <div>
                {user.canAccessAdministration && renderAdministrationButtons()}
            </div>
            <div className={styles.actionButtonsWrapper}>
                {renderContestActionButton(true)}
                {renderContestActionButton(false)}
            </div>
        </div>
    );
};

export default ContestDetailsPage;
