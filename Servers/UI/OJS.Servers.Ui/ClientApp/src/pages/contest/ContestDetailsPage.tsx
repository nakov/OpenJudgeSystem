import React, { useCallback, useEffect, useMemo } from 'react';
import isNil from 'lodash/isNil';

import { ContestParticipationType } from '../../common/constants';
import { IContestDetailsProblemType, IProblemResourceType } from '../../common/types';
import { ButtonSize, ButtonState, LinkButton, LinkButtonType } from '../../components/guidelines/buttons/Button';
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
                isContestDetailsLoadingSuccessful,
                isUserParticipant,
            },
        actions: { getContestDetails },
    } = useCurrentContest();
    const {
        getParticipateInContestUrl,
        getContestResultsUrl,
        getAdministrationContestProblemsInternalUrl,
        getAdministrationContestEditInternalUrl,
    } = useAppUrls();
    const { state: { user } } = useAuth();

    const { contestId, participationType } = params;

    useEffect(
        () => {
            console.log(params);
            if (isNil(contestDetails) && isNil(contestDetailsError) && !contestDetailsIsLoading && !isNil(contestId)) {
                console.log('TEST');
                getContestDetails({ id: contestId.toString(), official: participationType });
            }
        },
        [ contestId,
            getContestDetails,
            contestDetailsError,
            contestDetailsIsLoading,
            contestDetails,
            isContestDetailsLoadingSuccessful,
            params,
            participationType,
        ],
    );

    const isUserAdmin = useMemo(
        () => {
            const { permissions: { canAccessAdministration } } = user;

            return canAccessAdministration;
        },
        [ user ],
    );

    const contestIdToNumber = useMemo(
        () => Number(contestId),
        [ contestId ],
    );

    const isOfficial = useMemo(
        () => !!contestDetails?.canBeCompeted,
        [ contestDetails?.canBeCompeted ],
    );

    const renderContestButtons = useCallback(
        () => (
            <div>
                {isUserParticipant || isUserAdmin
                    ? (
                        <LinkButton
                          type={LinkButtonType.secondary}
                          to={getContestResultsUrl({ id: contestId, participationType })}
                          text="Results"
                        />
                    )
                    : null}
                {isUserAdmin
                    ? (
                        <>
                            <LinkButton
                              type={LinkButtonType.secondary}
                              to={getAdministrationContestProblemsInternalUrl(contestIdToNumber.toString())}
                              text="Problems"
                            />
                            <LinkButton
                              type={LinkButtonType.secondary}
                              to={getAdministrationContestEditInternalUrl(contestIdToNumber.toString())}
                              text="Edit"
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
                  size={ButtonSize.small}
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
                  size={ButtonSize.small}
                />
            </div>
        ),
        [
            contestId,
            contestIdToNumber,
            getContestResultsUrl,
            getParticipateInContestUrl,
            isOfficial,
            isUserParticipant,
            isUserAdmin,
            participationType,
            getAdministrationContestProblemsInternalUrl,
            getAdministrationContestEditInternalUrl,
        ],
    );

    const renderResources = useCallback(
        (resources: IProblemResourceType[]) => resources.map((r) => <ProblemResource resource={r} />),
        [],
    );

    const renderTask = useCallback(
        (problem: IContestDetailsProblemType) => {
            const { resources } = problem;
            if (isNil(resources)) {
                return (<div>{problem.name}</div>);
            }

            return (
                <>
                    <div>{problem.name}</div>
                    {renderResources(resources)}
                </>

            );
        },
        [ renderResources ],
    );

    const renderTasksList = useCallback(
        () => {
            if (isNil(contestDetails)) {
                return null;
            }

            const { problems } = contestDetails;
            if (isNil(problems)) {
                return null;
            }

            return (
                <List
                  values={contestDetails.problems.sort(compareByOrderBy)}
                  itemFunc={renderTask}
                />
            );
        },
        [ renderTask, contestDetails ],
    );

    const renderContestDetails = useCallback(
        () => {
            if (isNil(contestDetails)) {
                return null;
            }

            return (
                <div className={styles.contestContainer}>
                    <div className={styles.descriptionAndProblemsContainer}>
                        <div>{contestDetails?.description}</div>
                        <div>{renderTasksList()}</div>
                    </div>
                    <div className={styles.buttonsContainer}>
                        {renderContestButtons()}
                    </div>
                </div>
            );
        },
        [ renderTasksList, contestDetails, renderContestButtons ],
    );

    const renderErrorHeading = useCallback(
        (message: string) => (
            <div className={styles.headingContest}>
                <Heading
                  type={HeadingType.primary}
                  className={styles.contestHeading}
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
                : renderContestDetails()
            : renderErrorMessage(),
        [
            contestDetailsError,
            renderErrorMessage,
            contestDetailsIsLoading,
            renderContestDetails,
        ],
    );

    return renderContestDetailsPage();
};

export default makePrivate(setLayout(ContestDetailsPage, true));
