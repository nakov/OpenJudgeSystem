import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { isNil } from 'lodash';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';
import { useCurrentContest } from '../../hooks/use-current-contest';
import ContestPasswordForm from '../../components/contests/contest-password-form/ContestPasswordForm';
import { ContestParticipationType } from '../../common/constants';
import styles from './ContestRegisterPage.module.scss';

const ContestRegisterPage = () => {
    const {
        contestId,
        participationType,
    } = useParams();
    const navigate = useNavigate();

    const contestIdToNumber = useMemo(() => Number(contestId), [ contestId ]);
    const isParticipationOfficial = useMemo(() => participationType === ContestParticipationType.Compete, [ participationType ]);
    const internalContest = useMemo(
        () => ({
            id: contestIdToNumber,
            isOfficial: isParticipationOfficial,
        })
        , [ contestIdToNumber, isParticipationOfficial ],
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

export default makePrivate(setLayout(ContestRegisterPage));
