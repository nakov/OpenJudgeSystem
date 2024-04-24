import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { ContestParticipationType } from '../../../common/constants';
import ContestCompeteModal from '../../../components/contests/contest-compete-modal/ContestCompeteModal';
import ContestPasswordForm from '../../../components/contests/contest-password-form/ContestPasswordForm';
import Button, { LinkButton } from '../../../components/guidelines/buttons/Button';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import useTheme from '../../../hooks/use-theme';
import { useRegisterUserForContestMutation } from '../../../redux/services/contestsService';
import { flexCenterObjectStyles } from '../../../utils/object-utils';

import styles from './ContestRegister.module.scss';

const ContestRegister = () => {
    const { getColorClassName, themeColors } = useTheme();
    const navigate = useNavigate();
    const { contestId, participationType } = useParams();
    const [ hasAcceptedOnlineModal, setHasAcceptedOnlineModal ] = useState<boolean>(false);

    const textColorClassName = getColorClassName(themeColors.textColor);

    const [
        registerUserForContest, {
            data,
            isLoading,
            error,
        },
    ] = useRegisterUserForContestMutation();

    const {
        id,
        name,
        requirePassword,
        shouldConfirmParticipation,
        duration,
        numberOfProblems,
        isRegisteredSuccessfully,
    } = data || {};

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (!isRegisteredSuccessfully) {
            registerUserForContest({
                id: Number(contestId),
                isOfficial: participationType === ContestParticipationType.Compete,
                password: '',
                hasConfirmedParticipation: hasAcceptedOnlineModal,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!shouldConfirmParticipation && data) {
            setHasAcceptedOnlineModal(true);
        }
    }, [ shouldConfirmParticipation, data ]);

    useEffect(() => {
        if (isLoading) {
            return;
        }
        if (isRegisteredSuccessfully && !shouldConfirmParticipation && !requirePassword) {
            navigate(`/contests/${contestId}/${participationType}`);
        }
    }, [ isLoading, isRegisteredSuccessfully, navigate, contestId, participationType, shouldConfirmParticipation, requirePassword ]);

    const renderContestRegisterBody = useCallback(() => {
        if (!hasAcceptedOnlineModal) {
            return (
                <ContestCompeteModal
                  examName={name || ''}
                  time={duration?.toString() || '-'}
                  problemsCount={numberOfProblems!}
                  onAccept={async () => {
                      setHasAcceptedOnlineModal(true);
                      if (!requirePassword) {
                          await registerUserForContest({
                              id: Number(contestId),
                              isOfficial: participationType === ContestParticipationType.Compete,
                              password: '',
                              hasConfirmedParticipation: true,
                          });
                          navigate(`/contests/${id}/${participationType}`);
                      }
                  }}
                  onDecline={() => navigate('/contests')}
                />
            );
        }
        if (requirePassword) {
            return (
                <ContestPasswordForm
                  contestName={name!}
                  hasConfirmedParticipation={hasAcceptedOnlineModal}
                  onSuccess={() => navigate(`/contests/${id}/${participationType}`)}
                />
            );
        }
        return <div />;
    }, [
        hasAcceptedOnlineModal,
        name,
        duration,
        numberOfProblems,
        contestId,
        id,
        participationType,
        requirePassword,
        setHasAcceptedOnlineModal,
        registerUserForContest,
        navigate,
    ]);
    const getErrorMessage = (error: FetchBaseQueryError | SerializedError, defaultErrorMessage: string): string => {
        if ('status' in error) {
            return 'error' in error
                ? error.error
                : JSON.stringify(error.data);
        }
        if (error.message) {
            return error.message;
        }

        return defaultErrorMessage;
    };

    if (isLoading) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }
    if (error) {
        return (
            <div className={`${textColorClassName} ${styles.regsiterErrorWrapper}`}>
                <div className={styles.errMessage}>
                    {getErrorMessage(error, 'Something went wrong fetching data, please try again!')}
                </div>
                <div className={styles.buttonsWrapper}>
                    <LinkButton to="/contests" text="back to contests" />
                    <Button onClick={() => location.reload()} text="reload page" />
                </div>
                <div className={styles.needHelpWrapper}>
                    Need help? Contact us at:
                    {' '}
                    {' '}
                    <Link to="https://softuni.bg/contacts">https://softuni.bg/contacts</Link>
                </div>
            </div>
        );
    }
    return (
        <div className={styles.contestRegisterWrapper}>
            {renderContestRegisterBody()}
        </div>
    );
};

export default ContestRegister;
