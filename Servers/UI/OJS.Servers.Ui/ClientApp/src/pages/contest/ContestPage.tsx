import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { ContestParticipationType } from '../../common/constants';
import { isParticipationTypeValid } from '../../common/contest-helpers';
import Contest from '../../components/contests/contest/Contest';
import ContestPasswordForm from '../../components/contests/contest-password-form/ContestPasswordForm';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import ContestModal from '../../components/modal/ContestModal';
import { useRouteUrlParams } from '../../hooks/common/use-route-url-params';
import { useAuth } from '../../hooks/use-auth';
import { useCurrentContest } from '../../hooks/use-current-contest';
import { useModal } from '../../hooks/use-modal';
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
            startedModalUserParticipation,
            contest,
        },
        actions: {
            registerParticipant,
            start,
            clearContestError,
            setStartedModalUserParticipation,
        },
    } = useCurrentContest();

    const {
        state: { modalContest },
        actions: { setModalContest },
    } = useModal();
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

    const renderErrorMessageAndSetStartedUserParticipation = useCallback(
        () => {
            if (!isNil(contestError)) {
                const { detail } = contestError;
                setStartedModalUserParticipation(false);
                return renderErrorHeading(detail);
            }

            return null;
        },
        [ renderErrorHeading, contestError, setStartedModalUserParticipation ],
    );

    const renderContestPage = useCallback(
        () => isNil(contestError)
            ? isNil(contest)
                ? (
                    <div style={{ ...flexCenterObjectStyles }}>
                        <SpinningLoader />
                    </div>
                )
                : isParticipationOfficial && contest?.isOnline && !isUserAdmin && !startedModalUserParticipation
                    ? <ContestModal contest={modalContest} />
                    : <Contest />
            : renderErrorMessageAndSetStartedUserParticipation(),
        [
            contestError,
            renderErrorMessageAndSetStartedUserParticipation,
            startedModalUserParticipation,
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
                if (startedModalUserParticipation || !isOnline || !isParticipationOfficial) {
                    start(internalContest);
                }

                setModalContest({
                    id: contest.id,
                    name: contest.name,
                    duration: contest.duration,
                    numberOfProblems: contest.numberOfProblems,
                });
            }
        },
        [
            internalContest,
            isPasswordFormValid,
            isRegisterForContestSuccessful,
            requirePassword,
            start,
            contest,
            setModalContest,
            startedModalUserParticipation,
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
