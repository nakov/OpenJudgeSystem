import React, { useCallback, useEffect, useMemo } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { ContestParticipationType } from '../../common/constants';
import { isParticipationTypeValid } from '../../common/contest-helpers';
import Contest from '../../components/contests/contest/Contest';
import ContestPasswordForm from '../../components/contests/contest-password-form/ContestPasswordForm';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import { useRouteUrlParams } from '../../hooks/common/use-route-url-params';
import { useCurrentContest } from '../../hooks/use-current-contest';
import HomePage from '../home/HomePage';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';

import styles from './ContestPage.module.scss';

const ContestPage = () => {
    const { state: { params } } = useRouteUrlParams();

    const {
        contestId,
        participationType,
    } = params;

    const {
        state: {
            requirePassword,
            isPasswordValid,
            contestError,
            isRegisterForContestSuccessful,
        },
        actions: {
            registerParticipant,
            start,
        },
    } = useCurrentContest();

    const contestIdToNumber = useMemo(
        () => Number(contestId),
        [ contestId ],
    );

    const isParticipationOfficial = useMemo(
        () => participationType === ContestParticipationType.Compete,
        [ participationType ],
    );

    const doesRequirePassword = useMemo(
        () => !isNil(requirePassword) && requirePassword,
        [ requirePassword ],
    );

    const isPasswordFormValid = useMemo(
        () => !requirePassword || isPasswordValid,
        [ isPasswordValid, requirePassword ],
    );

    const internalContest = useMemo(
        () => ({
            id: contestIdToNumber,
            isOfficial: isParticipationOfficial,
        }),
        [ contestIdToNumber, isParticipationOfficial ],
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
            if (!isNil(contestError)) {
                const { detail } = contestError;
                return renderErrorHeading(detail);
            }

            return null;
        },
        [ renderErrorHeading, contestError ],
    );

    const renderContestPage = useMemo(
        () => isNil(contestError)
            ? <Contest />
            : renderErrorMessage(),
        [ contestError, renderErrorMessage ],
    );

    const renderPage = useMemo(
        () => isParticipationTypeValid(participationType)
            ? renderContestPage
            : <HomePage />,
        [ participationType, renderContestPage ],
    );

    useEffect(
        () => {
            if (isEmpty(contestId)) {
                return;
            }

            (async () => {
                await registerParticipant(internalContest);
            })();
        },
        [ contestId, internalContest, registerParticipant ],
    );

    useEffect(
        () => {
            if (!isRegisterForContestSuccessful) {
                return;
            }

            if (isNil(requirePassword)) {
                return;
            }

            if (!isPasswordFormValid) {
                return;
            }

            (async () => {
                await start(internalContest);
            })();
        },
        [ internalContest, isPasswordFormValid, isRegisterForContestSuccessful, requirePassword, start ],
    );

    return (
        doesRequirePassword
            ? (
                <ContestPasswordForm
                  id={contestIdToNumber}
                  isOfficial={isParticipationOfficial}
                />
            )
            : renderPage
    );
};

export default makePrivate(setLayout(ContestPage, true));
