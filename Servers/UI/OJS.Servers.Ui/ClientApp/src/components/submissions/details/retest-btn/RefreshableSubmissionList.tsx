import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isNil from 'lodash/isNil';

import {
    isRegularUserParticipantAndNotInRole, isUserNotParticipantAndNotInRole,
} from '../../../../common/submission-helpers';
import { ISubmissionDetailsReduxState } from '../../../../common/types';
import { setCurrentPage } from '../../../../redux/features/submissionDetailsSlice';
import { preciseFormatDate } from '../../../../utils/dates';
import { encodeAsUrlParam, getUserProfileInfoUrlByUsername } from '../../../../utils/urls';
import Button, { ButtonSize, ButtonType, LinkButton, LinkButtonType } from '../../../guidelines/buttons/Button';
import Heading, { HeadingType } from '../../../guidelines/headings/Heading';
import PaginationControls from '../../../guidelines/pagination/PaginationControls';
import SubmissionsList from '../../submissions-list/SubmissionsList';
import RetestButton from '../refreshable-submission-list/RetestButton';

import styles from './RefreshableSubmissionList.module.scss';

interface IRefreshableSubmissionListProps {
    reload: () => void;
}
const RefreshableSubmissionList = ({ reload }: IRefreshableSubmissionListProps) => {
    const dispatch = useDispatch();
    const {
        currentSubmission,
        currentSubmissionResults,
    } = useSelector((state: {submissionDetails: ISubmissionDetailsReduxState}) => state.submissionDetails);
    const handlePageChange = useCallback(
        (page: number) => {
            dispatch(setCurrentPage(page));
        },
        [ dispatch ],
    );

    const handleReloadClick = useCallback(
        async () => {
            reload();
        },
        [ reload ],
    );

    const renderButtonsSection = useCallback(() => (
        <div className={styles.buttonsSection}>
            <Button
              onClick={handleReloadClick}
              text="Reload"
              type={ButtonType.secondary}
              className={styles.submissionReloadBtn}
            />
            { currentSubmission?.userIsInRoleForContest
                ? <RetestButton />
                : null}
        </div>
    ), [ currentSubmission?.userIsInRoleForContest, handleReloadClick ]);

    const renderSubmissionInfo = useCallback(
        () => {
            if (isNil(currentSubmission)) {
                return null;
            }

            const { user: { userName } } = currentSubmission;

            if (isUserNotParticipantAndNotInRole(currentSubmission, userName)) {
                return null;
            }

            const { createdOn } = currentSubmission;

            const createdOnSection = (
                <p className={styles.submissionInfoParagraph}>
                    Created on:
                    {' '}
                    {preciseFormatDate(createdOn)}
                </p>
            );

            if (isRegularUserParticipantAndNotInRole(currentSubmission, userName)) {
                return (
                    <div className={styles.submissionInfo}>
                        {createdOnSection}
                    </div>
                );
            }

            const {
                modifiedOn,
                startedExecutionOn,
                completedExecutionOn,
            } = currentSubmission;

            return (
                <div className={styles.submissionInfo}>
                    {createdOnSection}
                    <p className={styles.submissionInfoParagraph}>
                        Modified on:
                        {' '}
                        {isNil(modifiedOn)
                            ? 'never'
                            : preciseFormatDate(modifiedOn)}
                    </p>
                    <p className={styles.submissionInfoParagraph}>
                        Started execution on:
                        {' '}
                        {isNil(startedExecutionOn)
                            ? 'never'
                            : preciseFormatDate(startedExecutionOn)}
                    </p>
                    <p className={styles.submissionInfoParagraph}>
                        Completed execution on:
                        {' '}
                        {isNil(completedExecutionOn)
                            ? 'never'
                            : preciseFormatDate(completedExecutionOn)}
                    </p>
                    <p className={styles.submissionInfoParagraph}>
                        Username:
                        {' '}
                        <LinkButton
                          type={LinkButtonType.plain}
                          size={ButtonSize.none}
                          to={getUserProfileInfoUrlByUsername(encodeAsUrlParam(userName))}
                          text={userName}
                          internalClassName={styles.redirectButton}
                        />
                    </p>
                </div>
            );
        },
        [ currentSubmission ],
    );

    return (
        <div className={styles.navigation}>
            <div style={{ marginBottom: '24px' }}>
                <Heading type={HeadingType.secondary}>Submissions</Heading>
            </div>
            {currentSubmissionResults && (
                <>
                    <SubmissionsList
                      items={currentSubmissionResults.items ?? []}
                      selectedSubmission={currentSubmission}
                      className={styles.submissionsList}
                    />
                    <PaginationControls
                      count={currentSubmissionResults.pagesCount}
                      page={currentSubmissionResults.pageNumber}
                      onChange={handlePageChange}
                    />
                    { renderButtonsSection() }
                    { renderSubmissionInfo() }
                </>
            )}
        </div>
    );
};

export default RefreshableSubmissionList;
