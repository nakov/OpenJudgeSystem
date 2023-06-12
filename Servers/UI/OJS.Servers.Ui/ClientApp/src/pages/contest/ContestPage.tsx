import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { ContestParticipationType } from '../../common/constants';
import { isParticipationTypeValid } from '../../common/contest-helpers';
import Contest from '../../components/contests/contest/Contest';
import ContestPasswordForm from '../../components/contests/contest-password-form/ContestPasswordForm';
import Button, { ButtonSize, LinkButton } from '../../components/guidelines/buttons/Button';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import { useRouteUrlParams } from '../../hooks/common/use-route-url-params';
import { useAppUrls } from '../../hooks/use-app-urls';
import { useCurrentContest } from '../../hooks/use-current-contest';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';

import styles from './ContestPage.module.scss';

const ContestPage = () => {
    const { state: { params } } = useRouteUrlParams();
    const navigate = useNavigate();
    const [ open, setOpen ] = useState(false);
    const { getParticipateInContestUrl } = useAppUrls();

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
            contest,
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

    const renderModal = useCallback(
        () => {
            if (isNil(contest)) {
                return null;
            }

            return (
                <div>
                    <Modal
                      open={open}
                      onClose={() => setOpen(false)}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                        <Box className={styles.modal}>
                            <Typography id="modal-modal-title" variant="h6" className={styles.modalHeading}>
                                <>
                                    Starting now you will have
                                    {' '}
                                    {contest.duration}
                                    {' '}
                                    hours to complete the contest
                                    {' '}
                                    {contest.name}
                                    {' '}
                                    { contest.numberOfProblems}
                                    .
                                </>
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                Duis mollis, est non commodo luctus, nisi erat porttitor ligula?
                            </Typography>
                            <div>
                                <LinkButton
                                  id="button-card-compete"
                                  to={getParticipateInContestUrl({
                                      id: contest.id,
                                      participationType: ContestParticipationType.Compete,
                                      problemIndex: 1,
                                  })}
                                  text="Compete"
                                  size={ButtonSize.small}
                                />
                                <Button onClick={() => setOpen(false)} size={ButtonSize.small}>Cancel</Button>
                            </div>
                        </Box>
                    </Modal>
                </div>
            );
        },
        [ getParticipateInContestUrl, open, contest ],
    );

    const renderContestPage = useMemo(
        () => isNil(contestError)
            ? <Contest />
            : renderErrorMessage(),
        [ contestError, renderErrorMessage ],
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
            : renderContestPage
    );
};

export default makePrivate(setLayout(ContestPage, true));
