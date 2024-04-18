import React, { useCallback, useEffect, useMemo } from 'react';
import isNil from 'lodash/isNil';

import { ContestParticipationType, ContestResultType } from '../../common/constants';
import { contestParticipationType } from '../../common/contest-helpers';
import ContestBreadcrumbs from '../../components/contests/contest-breadcrumbs/ContestBreadcrumbs';
import ContestResultsGrid from '../../components/contests/contest-results-grid/ContestResultsGrid';
import { LinkButton, LinkButtonType } from '../../components/guidelines/buttons/Button';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import { useRouteUrlParams } from '../../hooks/common/use-route-url-params';
import { usePageTitles } from '../../hooks/use-page-titles';
import { useGetContestResultsQuery } from '../../redux/services/contestsService';
import { flexCenterObjectStyles } from '../../utils/object-utils';
import { capitalizeFirstLetter } from '../../utils/string-utils';
import { getContestDetailsAppUrl } from '../../utils/urls';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';

import styles from './ContestResultPage.module.scss';

const ContestResultsPage = () => {
    const { state: { params } } = useRouteUrlParams();
    const { contestId, participationType: participationUrlType, resultType } = params;
    const official = participationUrlType === ContestParticipationType.Compete;
    const full = resultType === ContestResultType.Full;

    const participationType = contestParticipationType(official);

    const {
        data: contestResults,
        isLoading,
        error: contestResultsError,
    } = useGetContestResultsQuery({
        id: Number(contestId),
        official,
        full,
    });

    const { actions: { setPageTitle } } = usePageTitles();

    const contestResultsPageTitle = useMemo(
        () => isNil(contestResults)
            ? 'Loading'
            : `Results for ${contestResults.name}`,
        [ contestResults ],
    );

    useEffect(
        () => {
            setPageTitle(contestResultsPageTitle);
        },
        [ contestResultsPageTitle, setPageTitle, contestId ],
    );

    const renderErrorHeading = useCallback(
        (message: string) => (
            <div className={styles.headingResults}>
                <Heading
                  type={HeadingType.primary}
                  className={styles.contestResultsHeading}
                >
                    {message}
                </Heading>
            </div>
        ),
        [],
    );

    const renderErrorMessage = useCallback(
        () => {
            if (!isNil(contestResultsError)) {
                return renderErrorHeading('Error loading contest results');
            }

            return null;
        },
        [ contestResultsError, renderErrorHeading ],
    );

    return (
        isNil(contestResultsError)
            ? !isLoading
                ? (
                    <>
                        <div>
                            <ContestBreadcrumbs />
                        </div>
                        <Heading
                          type={HeadingType.primary}
                          className={styles.contestResultsHeading}
                        >
                            {capitalizeFirstLetter(participationType)}
                            {' '}
                            Results For Contest
                            {' '}
                            <LinkButton
                              to={getContestDetailsAppUrl(contestId)}
                              text={contestResults?.name}
                              type={LinkButtonType.plain}
                              className={styles.contestName}
                            />
                        </Heading>
                        <ContestResultsGrid items={contestResults ?? null} />
                    </>
                )
                : (
                    <div style={{ ...flexCenterObjectStyles }}>
                        <SpinningLoader />
                    </div>
                )
            : renderErrorMessage()
    );
};

export default makePrivate(setLayout(ContestResultsPage));
