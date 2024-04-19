import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import ContestCompeteModal from '../../../components/contests/contest-compete-modal/ContestCompeteModal';
import ContestPasswordForm from '../../../components/contests/contest-password-form/ContestPasswordForm';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { useRegisterUserForContestMutation } from '../../../redux/services/contestsService';
import { flexCenterObjectStyles } from '../../../utils/object-utils';

import styles from './ContestRegister.module.scss';

const ContestRegister = () => {
    const navigate = useNavigate();
    const { contestId, participationType } = useParams();
    const [ hasAcceptedOnlineModal, setHasAcceptedOnlineModal ] = useState<boolean>(false);

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
        isOfficial,
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
            registerUserForContest({ id: Number(contestId), isOfficial: participationType === 'compete', password: '' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ isRegisteredSuccessfully, isLoading ]);

    useEffect(() => {
        if (!shouldConfirmParticipation) {
            setHasAcceptedOnlineModal(true);
        }
    }, [ shouldConfirmParticipation ]);

    useEffect(() => {
        if (isLoading) {
            return;
        }
        if (isRegisteredSuccessfully) {
            navigate(`/contests/${contestId}/${participationType}`);
        }
    }, [ isLoading, isRegisteredSuccessfully, navigate, contestId, participationType ]);

    const renderContestRegisterBody = useCallback(() => {
        if (shouldConfirmParticipation && !hasAcceptedOnlineModal) {
            return (
                <ContestCompeteModal
                  examName={name!}
                  time={duration!.toString()}
                  problemsCount={numberOfProblems!}
                  onAccept={() => {
                      setHasAcceptedOnlineModal(true);
                      if (!requirePassword) {
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
                  id={Number(contestId)}
                  isOfficial={isOfficial!}
                  contestName={name!}
                  onSuccess={() => navigate(`/contests/${id}/${participationType}`)}
                />
            );
        }
        return <div />;
    }, [
        shouldConfirmParticipation,
        hasAcceptedOnlineModal,
        name,
        duration,
        numberOfProblems,
        contestId,
        isOfficial,
        id,
        participationType,
        requirePassword,
        setHasAcceptedOnlineModal,
        navigate,
    ]);

    if (isLoading) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }
    if (error) {
        return <div>Error fetching user register information! PLease try again.</div>;
    }
    return (
        <div className={styles.contestRegisterWrapper}>
            {renderContestRegisterBody()}
        </div>
    );
};

export default ContestRegister;
