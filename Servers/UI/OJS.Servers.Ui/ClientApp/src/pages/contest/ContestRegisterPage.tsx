import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import isNil from 'lodash/isNil';

import { ContestParticipationType } from '../../common/constants';
import ContestPasswordForm from '../../components/contests/contest-password-form/ContestPasswordForm';
import { useRouteUrlParams } from '../../hooks/common/use-route-url-params';
import { useCurrentContest } from '../../hooks/use-current-contest';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';

import styles from './ContestRegisterPage.module.scss';

const ContestRegisterPage = () => {
    const { state: { params } } = useRouteUrlParams();

    const {
        contestId,
        participationType,
    } = params;

    const navigate = useNavigate();

    const contestIdToNumber = useMemo(() => Number(contestId), [ contestId ]);
    const isParticipationOfficial = useMemo(() => participationType === ContestParticipationType.Compete, [ participationType ]);
    const internalContest = useMemo(
        () => ({
            id: contestIdToNumber,
            isOfficial: isParticipationOfficial,
        }),
        [ contestIdToNumber, isParticipationOfficial ],
    );

    const {
        state: {
            requirePassword,
            isPasswordValid,
            contestError,
        },
        actions: { register },
    } = useCurrentContest();

    const doesNotRequirePassword = useMemo(
        () => (!isNil(requirePassword) && !requirePassword) || isNil(contestError),
        [ requirePassword, contestError ],
    );
    const isSubmittedPasswordValid = useMemo(() => !isNil(isPasswordValid) && isPasswordValid, [ isPasswordValid ]);

    useEffect(() => {
        (async () => {
            await register(internalContest);
        })();
    }, [ internalContest, contestIdToNumber, isParticipationOfficial, participationType, register ]);

    useEffect(() => {
        if (isNil(contestId) || isNil(participationType)) {
            return;
        }

        if (doesNotRequirePassword || isSubmittedPasswordValid) {
            navigate(`/contests/${contestId}/${participationType}`);
        }
    }, [ contestId, doesNotRequirePassword, isSubmittedPasswordValid, participationType, navigate, requirePassword ]);

    return (
        <div className={styles.container}>
            {
                requirePassword
                    ? (
                        <ContestPasswordForm
                          id={contestIdToNumber}
                          isOfficial={isParticipationOfficial}
                        />
                    )
                    : <p>No password required. Redirecting to contest.</p>
            }
        </div>
    );
};

export default makePrivate(setLayout(ContestRegisterPage));
