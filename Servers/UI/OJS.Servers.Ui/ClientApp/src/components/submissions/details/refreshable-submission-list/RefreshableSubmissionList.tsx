import React, { ReactNode, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isNil from 'lodash/isNil';

import { ISubmissionDetailsReduxState } from '../../../../common/types';
import { useAuth } from '../../../../hooks/use-auth';
import { setCurrentPage } from '../../../../redux/features/submissionDetailsSlice';
import { preciseFormatDate } from '../../../../utils/dates';
import Button, { ButtonType } from '../../../guidelines/buttons/Button';
import Heading, { HeadingType } from '../../../guidelines/headings/Heading';
import PaginationControls from '../../../guidelines/pagination/PaginationControls';
import SubmissionsList from '../../submissions-list/SubmissionsList';

import styles from './RefreshableSubmissionList.module.scss';

interface IRefreshableSubmissionListProps {
    reload: () => void;

 renderRetestButton: () => ReactNode;
}
const RefreshableSubmissionList = ({ renderRetestButton, reload }: IRefreshableSubmissionListProps) => {
    const { state: { user: { permissions: { canAccessAdministration } } } } = useAuth();
    const dispatch = useDispatch();
    const { currentSubmission, currentSubmissionResults } =
    useSelector((state: {submissionDetails: ISubmissionDetailsReduxState}) => state.submissionDetails);
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
            {renderRetestButton()}
        </div>
    ), [ handleReloadClick, renderRetestButton ]);

    const renderSubmissionInfo = useCallback(
        () => {
            if (!canAccessAdministration || isNil(currentSubmission)) {
                return null;
            }

            const { createdOn, modifiedOn, startedExecutionOn, completedExecutionOn, user: { userName } } = currentSubmission;

            return (
                <div className={styles.submissionInfo}>
                    <p className={styles.submissionInfoParagraph}>
                        Created on:
                        {' '}
                        {preciseFormatDate(createdOn)}
                    </p>
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
                        {userName}
                    </p>
                </div>
            );
        },
        [ currentSubmission, canAccessAdministration ],
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
