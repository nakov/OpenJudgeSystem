import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { ContestParticipationType } from '../../common/constants';
import { isParticipationTypeValid } from '../../common/contest-helpers';
import { IContestModalInfoType } from '../../common/types';
import Contest from '../../components/contests/contest/Contest';
import ContestPasswordForm from '../../components/contests/contest-password-form/ContestPasswordForm';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import ContestModal from '../../components/modal/ContestModal';
import { useRouteUrlParams } from '../../hooks/common/use-route-url-params';
import { useAuth } from '../../hooks/use-auth';
import { useCurrentContest } from '../../hooks/use-current-contest';
import { flexCenterObjectStyles } from '../../utils/object-utils';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';

import styles from './ContestPage.module.scss';

const ContestPage = () => {
    const { state: { params } } = useRouteUrlParams();
    const navigate = useNavigate();

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
            userHasConfirmedModal,
            contest,
        },
        actions: {
            registerParticipant,
            start,
            clearContestError,
        },
    } = useCurrentContest();

    const { state: { user } } = useAuth();

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

    const modalContest = useMemo(
        () => {
            if (isNil(contest)) {
                return {} as IContestModalInfoType;
            }

            return {
                id: contest.id,
                name: contest.name,
                duration: contest.duration,
                numberOfProblems: contest.numberOfProblems,
            };
        },
        [ contest ],
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

    const renderContestPage = useCallback(
        () => isNil(contestError)
            ? isNil(contest)
                ? (
                    <div style={{ ...flexCenterObjectStyles }}>
                        <SpinningLoader />
                    </div>
                )
                : contest?.isOnline && isParticipationOfficial && !userHasConfirmedModal && !isUserAdmin
                    ? <ContestModal showModal contest={modalContest} />
                    : <Contest />
            : renderErrorMessage(),
        [
            contestError,
            renderErrorMessage,
            userHasConfirmedModal,
            isParticipationOfficial,
            modalContest,
            isUserAdmin,
            contest,
        ],
    );

    useEffect(
        () => {
            if (!isNil(participationType) && !isParticipationTypeValid(participationType)) {
                navigate('/');
            }
        },
        [ navigate, participationType ],
    );

    useEffect(
        () => {
            if (isEmpty(contestId)) {
                return;
            }

            registerParticipant(internalContest);
        },
        [ contestId, internalContest, registerParticipant ],
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

            if (isNil(contest) && isNil(contestError)) {
                return;
            }

            if (!isNil(contest)) {
                const { isOnline } = contest;
                if (userHasConfirmedModal || !isOnline || !isParticipationOfficial) {
                    start(internalContest);
                }
            }
        },
        [
            internalContest,
            isPasswordFormValid,
            isRegisterForContestSuccessful,
            requirePassword,
            start,
            contest,
            userHasConfirmedModal,
            isPasswordValid,
            contestError,
            isParticipationOfficial,
        ],
    );

    return (
        doesRequirePassword && !isPasswordValid
            ? (
                <ContestPasswordForm
                  id={contestIdToNumber}
                  isOfficial={isParticipationOfficial}
                />
            )
            : renderContestPage()
    );
};

export default makePrivate(setLayout(ContestPage, true));
