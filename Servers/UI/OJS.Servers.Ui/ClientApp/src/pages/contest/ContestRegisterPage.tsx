import * as React from 'react';
import { useParams } from 'react-router';
import { useEffect } from 'react';
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

    const {
        state: { requirePassword },
        actions: { register },
    } = useCurrentContest();

    useEffect(() => {
        (async () => {
            const internalContest = {
                id: Number(contestId),
                isOfficial: participationType === ContestParticipationType.Compete,
            };
            await register(internalContest);
        })();
    }, [ contestId, participationType, register ]);

    return (
        <div className={styles.container}>
            {
                requirePassword
                    ? (
                        <ContestPasswordForm />
                    )
                    : <p>no pass</p>
            }
        </div>
    );
};

export default makePrivate(setLayout(ContestRegisterPage));
