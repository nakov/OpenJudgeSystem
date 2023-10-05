import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { ContestParticipationType } from '../../common/constants';
import { IContestDetailsProblemType, IProblemResourceType } from '../../common/types';
import { ButtonState, LinkButton, LinkButtonType } from '../../components/guidelines/buttons/Button';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import List from '../../components/guidelines/lists/List';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import ProblemResource from '../../components/problems/problem-resource/ProblemResource';
import { useRouteUrlParams } from '../../hooks/common/use-route-url-params';
import { useCurrentContest } from '../../hooks/use-current-contest';
import { usePageTitles } from '../../hooks/use-page-titles';
import { flexCenterObjectStyles } from '../../utils/object-utils';
import {
    getAdministrationContestEditInternalUrl,
    getAdministrationContestProblemsInternalUrl,
    getContestResultsUrl,
    getParticipateInContestUrl,
} from '../../utils/urls';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';

import styles from './ContestDetailsPage.module.scss';

const compareByOrderBy = (p1: IContestDetailsProblemType, p2: IContestDetailsProblemType) => p1.orderBy - p2.orderBy;

const getButtonAccessibility = (canParticipate: boolean | undefined, isAdminOrLecturer: boolean | undefined) => {
    const isAccessible = canParticipate || isAdminOrLecturer;
    const isAccessibleForAdminOrLecturerInContest = !canParticipate && isAdminOrLecturer;
    return { isAccessible, isAccessibleForAdminOrLecturerInContest };
};

const ContestDetailsPage = () => {
    const { state: { params } } = useRouteUrlParams();
    const {
        state:
            {
                contestDetails,
                contestError,
                contestDetailsIsLoading,
            },
        actions: {
            getContestDetails,
            clearContestError,
        },
    } = useCurrentContest();
    const { actions: { setPageTitle } } = usePageTitles();
    const navigate = useNavigate();

    const contestTitle = useMemo(
        () => `${contestDetails?.name}`,
        [ contestDetails?.name ],
    );

    useEffect(
        () => {
            setPageTitle(contestTitle);
        },
        [ contestTitle, setPageTitle ],
    );

    const { contestId } = params;

    const contestIdToNumber = useMemo(
        () => Number(contestId),
        [ contestId ],
    );

    const isOfficial = useMemo(
        () => {
            if (isNil(contestDetails)) {
                return null;
            }

            return contestDetails?.canBeCompeted;
        },
        [ contestDetails ],
    );

    const participantsCountByContestType = useMemo(
        () => isNil(isOfficial)
            ? ''
            : isOfficial
                ? `Compete participants: ${contestDetails?.participantsCountByContestType}`
                : `Practice participants: ${contestDetails?.participantsCountByContestType}`,
        [ isOfficial, contestDetails?.participantsCountByContestType ],
    );

    const {
        isAccessible: canAccessCompeteButton,
        isAccessibleForAdminOrLecturerInContest: competableOnlyForAdminAndLecturers,
    } = useMemo(
        () => getButtonAccessibility(contestDetails?.canBeCompeted, contestDetails?.isAdminOrLecturerInContest),
        [ contestDetails ],
    );

    const {
        isAccessible: canAccessPracticeButton,
        isAccessibleForAdminOrLecturerInContest: practicableOnlyForAdminOrLecturers,
    } = useMemo(
        () => getButtonAccessibility(contestDetails?.canBePracticed, contestDetails?.isAdminOrLecturerInContest),
        [ contestDetails ],
    );

    useEffect(
        () => {
            if (!isNil(contestId)) {
                getContestDetails({ id: contestId.toString() });
            }
        },
        [ contestId,
            getContestDetails,
            isOfficial,
        ],
    );

    useEffect(
        () => {
            if (isNil(contestError)) {
                return () => null;
            }

            const timer = setTimeout(() => {
                clearContestError();
                navigate('/');
            }, 5000);

            return () => clearTimeout(timer);
        },
        [ contestError, navigate, clearContestError ],
    );

    const renderContestButtons = useCallback(
        () => (
            <div className={styles.buttonsContainer}>
                {
                    contestDetails?.canViewResults || contestDetails?.isAdminOrLecturerInContest
                        ? (
                            <LinkButton
                              type={LinkButtonType.secondary}
                              to={getContestResultsUrl({ id: contestId, participationType: ContestParticipationType.Compete })}
                              text="Results"
                            />
                        )
                        : null
                }
                {
                    contestDetails?.isAdminOrLecturerInContest
                        ? (
                            <>
                                <LinkButton
                                  type={LinkButtonType.secondary}
                                  to={getAdministrationContestProblemsInternalUrl(contestIdToNumber.toString())}
                                  text="Problems"
                                  isToExternal
                                />
                                <LinkButton
                                  type={LinkButtonType.secondary}
                                  to={getAdministrationContestEditInternalUrl(contestIdToNumber.toString())}
                                  text="Edit"
                                  isToExternal
                                />
                            </>
                        )
                        : null
                }
                {
                    canAccessCompeteButton
                        ? (
                            <LinkButton
                              id="button-card-compete"
                              internalClassName={competableOnlyForAdminAndLecturers
                                  ? styles.adminAccessibleButton
                                  : ''}
                              to={getParticipateInContestUrl({
                                  id: contestIdToNumber,
                                  participationType: ContestParticipationType.Compete,
                              })}
                              text="Compete"
                              state={
                        isOfficial
                            ? ButtonState.enabled
                            : ButtonState.disabled
                    }
                            />
                        )
                        : null
                }
                {
                    canAccessPracticeButton
                        ? (
                            <LinkButton
                              id="button-card-practice"
                              internalClassName={practicableOnlyForAdminOrLecturers
                                  ? styles.adminAccessibleButton
                                  : ''}
                              to={getParticipateInContestUrl({
                                  id: contestIdToNumber,
                                  participationType: ContestParticipationType.Practice,
                              })}
                              text="Practice"
                              type={LinkButtonType.secondary}
                              state={
                              isOfficial
                                  ? ButtonState.disabled
                                  : ButtonState.enabled
                    }
                            />
                        )
                        : null
                }
            </div>
        ),
        [
            contestId,
            contestIdToNumber,
            practicableOnlyForAdminOrLecturers,
            canAccessPracticeButton,
            competableOnlyForAdminAndLecturers,
            canAccessCompeteButton,
            contestDetails?.canViewResults,
            contestDetails?.isAdminOrLecturerInContest,
            isOfficial,
        ],
    );

    const renderAllowedSubmissionTypes = useCallback(
        () => {
            if (isNil(contestDetails)) {
                return null;
            }

            const { allowedSubmissionTypes } = contestDetails;

            return allowedSubmissionTypes.map((x) => (
                <span key={x.id}>
                    {' '}
                    {x.name}
                    {' '}
                    |
                </span>
            ));
        },
        [ contestDetails ],
    );

    const renderResource = useCallback(
        (resource: IProblemResourceType) => <ProblemResource resource={resource} />,
        [],
    );

    const renderTask = useCallback(
        (problem: IContestDetailsProblemType) => {
            const { resources } = problem;
            if (isNil(resources)) {
                return (<div>{problem.name}</div>);
            }

            return (
                <div className={styles.taskNameAndResources}>
                    <div className={styles.taskName}>{problem.name}</div>
                    <List
                      values={resources}
                      itemFunc={renderResource}
                      className={styles.resources}
                      itemClassName={styles.resource}
                    />
                </div>
            );
        },
        [ renderResource ],
    );

    const renderTasksList = useCallback(
        (problems: IContestDetailsProblemType[]) => (
            isEmpty(problems)
                ? (
                    <div>
                        <div className={styles.problemsHeading}>Problems</div>
                        <div className={styles.emptyProblemsMessage}>The problems for this contest are not public.</div>
                    </div>
                )
                : (
                    <div>
                        <div className={styles.problemsHeading}>Problems</div>
                        <List
                          values={problems.sort(compareByOrderBy)}
                          itemFunc={renderTask}
                          className={styles.tasksListSideNavigation}
                          itemClassName={styles.taskListItem}
                        />
                    </div>
                )
        ),
        [ renderTask ],
    );

    const renderContest = useCallback(
        () => {
            if (isNil(contestDetails) || isNil(contestDetails.problems)) {
                return null;
            }

            const { problems } = contestDetails;

            return (
                <div className={styles.container}>
                    <div className={styles.headingContest}>{contestDetails?.name}</div>
                    <div className={styles.contestDetailsAndTasks}>
                        <div className={styles.detailsContainer}>
                            <div className={styles.detailsHeading}>Contest details</div>
                            <div
                              dangerouslySetInnerHTML={{
                                  __html: isNil(contestDetails?.description)
                                      ? 'There is no description for the selected contest.'
                                      : contestDetails?.description,
                              }}
                            />
                            <div className={styles.allowedLanguages}>
                                Allowed languages:
                                {' '}
                                {renderAllowedSubmissionTypes()}
                            </div>
                            <div>
                                Contest participants:
                                {' '}
                                {contestDetails?.totalContestParticipantsCount}
                            </div>
                            <div>
                                {participantsCountByContestType}
                            </div>
                        </div>
                        {renderTasksList(problems)}
                    </div>
                    <div>
                        {renderContestButtons()}
                    </div>
                </div>
            );
        },
        [ renderTasksList, contestDetails, renderContestButtons, renderAllowedSubmissionTypes, participantsCountByContestType ],
    );

    const renderErrorHeading = useCallback(
        (message: string) => (
            <div className={styles.headingContest}>
                <Heading
                  type={HeadingType.primary}
                  className={styles.contestErrorHeading}
                >
                    {message}
                </Heading>
            </div>
        ),
        [],
    );

    const renderErrorMessage = useCallback(
        () => {
            if (!isNil(contestError)) {
                const { detail } = contestError;
                return renderErrorHeading(detail);
            }

            return null;
        },
        [ renderErrorHeading, contestError ],
    );

    const renderContestDetailsPage = useCallback(
        () => isNil(contestError)
            ? contestDetailsIsLoading
                ? (
                    <div style={{ ...flexCenterObjectStyles }}>
                        <SpinningLoader />
                    </div>
                )
                : renderContest()
            : renderErrorMessage(),
        [
            contestError,
            renderErrorMessage,
            contestDetailsIsLoading,
            renderContest,
        ],
    );

    return renderContestDetailsPage();
};

export default makePrivate(setLayout(ContestDetailsPage, false));
