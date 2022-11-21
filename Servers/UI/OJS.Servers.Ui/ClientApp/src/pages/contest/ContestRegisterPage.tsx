import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import isNil from 'lodash/isNil';

import { ContestParticipationType } from '../../common/constants';
import ContestPasswordForm from '../../components/contests/contest-password-form/ContestPasswordForm';
import { useInternalUrlParams } from '../../hooks/common/use-internal-url-params';
import { useCurrentContest } from '../../hooks/use-current-contest';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';
import { asPage } from '../shared/set-page-params';

import styles from './ContestRegisterPage.module.scss';

const ContestRegisterPage = () => {
    const { state: { params } } = useInternalUrlParams();

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
        },
        actions: { register },
    } = useCurrentContest();

    const doesNotRequirePassword = useMemo(() => !isNil(requirePassword) && !requirePassword, [ requirePassword ]);
    const isSubmittedPasswordValid = useMemo(() => !isNil(isPasswordValid) && isPasswordValid, [ isPasswordValid ]);

    useEffect(() => {
        (async () => {
            await register(internalContest);
        })();
    }, [ internalContest, contestIdToNumber, isParticipationOfficial, participationType, register ]);

    useEffect(() => {
        if (doesNotRequirePassword || isSubmittedPasswordValid) {
            navigate(`/contests/${contestId}/${participationType}`);
        }
    }, [ contestId, doesNotRequirePassword, isSubmittedPasswordValid, participationType, navigate ]);

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

export default makePrivate(asPage(setLayout(ContestRegisterPage)));
