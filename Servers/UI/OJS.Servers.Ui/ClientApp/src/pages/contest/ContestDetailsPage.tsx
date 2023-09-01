import React, { useCallback, useEffect, useMemo } from 'react';
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
import { useAppUrls } from '../../hooks/use-app-urls';
import { useAuth } from '../../hooks/use-auth';
import { useCurrentContest } from '../../hooks/use-current-contest';
import { flexCenterObjectStyles } from '../../utils/object-utils';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';

import styles from './ContestDetailsPage.module.scss';

const compareByOrderBy = (p1: IContestDetailsProblemType, p2: IContestDetailsProblemType) => p1.orderBy - p2.orderBy;

const ContestDetailsPage = () => {
    const { state: { params } } = useRouteUrlParams();
    const {
        state:
            {
                contestDetails,
                contestDetailsError,
                contestDetailsIsLoading,
            },
        actions: { getContestDetails },
    } = useCurrentContest();
    const {
        getParticipateInContestUrl,
        getContestResultsUrl,
        getAdministrationContestProblemsInternalUrl,
        getAdministrationContestEditInternalUrl,
    } = useAppUrls();
    const { state: { user: { permissions: { canAccessAdministration } } } } = useAuth();

    const { contestId, participationType } = params;

    const contestIdToNumber = useMemo(
        () => Number(contestId),
        [ contestId ],
    );

    const isOfficial = useMemo(
        () => participationType === ContestParticipationType.Compete,
        [ participationType ],
    );

    const participantsCountByContestType = useMemo(
        () => isOfficial
            ? `Compete participants: ${contestDetails?.participantsCountByContestType}`
            : `Practice participants: ${contestDetails?.participantsCountByContestType}`,
        [ isOfficial, contestDetails?.participantsCountByContestType ],
    );

    useEffect(
        () => {
            if (!isNil(contestId)) {
                getContestDetails({ id: contestId.toString(), isOfficial });
            }
        },
        [ contestId,
            getContestDetails,
            isOfficial,
        ],
    );

    const renderContestButtons = useCallback(
        () => (
            <div>
                {contestDetails?.canViewResults || canAccessAdministration
                    ? (
                        <LinkButton
                          type={LinkButtonType.secondary}
                          to={getContestResultsUrl({ id: contestId, participationType })}
                          text="Results"
                        />
                    )
                    : null}
                {canAccessAdministration
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
                    : null}
                <LinkButton
                  id="button-card-compete"
                  to={getParticipateInContestUrl({
                      id: contestIdToNumber,
                      participationType: ContestParticipationType.Compete,
                  })}
                  text="Compete"
                  type={LinkButtonType.secondary}
                  state={
                    isOfficial
                        ? ButtonState.enabled
                        : ButtonState.disabled
                }
                />
                <LinkButton
                  id="button-card-practice"
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
            </div>
        ),
        [
            contestId,
            contestIdToNumber,
            getContestResultsUrl,
            getParticipateInContestUrl,
            isOfficial,
            canAccessAdministration,
            participationType,
            getAdministrationContestProblemsInternalUrl,
            getAdministrationContestEditInternalUrl,
            contestDetails?.canViewResults,
        ],
    );

    const renderAllowedSubmissionTypes = useCallback(
        () => {
            if (isNil(contestDetails)) {
                return null;
            }

            const { allowedSubmissionTypes } = contestDetails;

            return allowedSubmissionTypes.map((x) => (
                <span>
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
                    <div className={styles.buttonsContainer}>
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
            if (!isNil(contestDetailsError)) {
                const { detail } = contestDetailsError;
                return renderErrorHeading(detail);
            }

            return null;
        },
        [ renderErrorHeading, contestDetailsError ],
    );

    const renderContestDetailsPage = useCallback(
        () => isNil(contestDetailsError)
            ? contestDetailsIsLoading
                ? (
                    <div style={{ ...flexCenterObjectStyles }}>
                        <SpinningLoader />
                    </div>
                )
                : renderContest()
            : renderErrorMessage(),
        [
            contestDetailsError,
            renderErrorMessage,
            contestDetailsIsLoading,
            renderContest,
        ],
    );

    return renderContestDetailsPage();
};

export default makePrivate(setLayout(ContestDetailsPage, false));
