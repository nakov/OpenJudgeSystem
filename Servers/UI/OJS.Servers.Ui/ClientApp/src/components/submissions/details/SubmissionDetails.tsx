import * as React from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { isNil } from 'lodash';
import { useSubmissionsDetails } from '../../../hooks/submissions/use-submissions-details';
import CodeEditor from '../../code-editor/CodeEditor';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import List, { ListType, Orientation } from '../../guidelines/lists/List';
import { ISubmissionDetails } from '../../../hooks/submissions/types';
import { Button, ButtonType } from '../../guidelines/buttons/Button';
import concatClassNames from '../../../utils/class-names';
import styles from './SubmissionDetails.module.scss';
import SubmissionResults from '../submission-results/SubmissionResults';

const SubmissionDetails = () => {
    const {
        currentSubmission,
        setCurrentSubmissionId,
        currentProblemSubmissionResults,
        getSubmissionResults,
    } = useSubmissionsDetails();
    // @ts-ignore
    const { content: submissionCode } = currentSubmission || '';

    const problemNameHeadingText = useMemo(
        () => `${currentSubmission?.problem.name} - ${currentSubmission?.problem.id}`,
        [ currentSubmission?.problem.id, currentSubmission?.problem.name ],
    );
    const detailsHeadingText = useMemo(() => `Details #${currentSubmission?.id}`, [ currentSubmission?.id ]);
    const navigate = useNavigate();

    useEffect(() => {
        if (isNil(currentSubmission)) {
            return;
        }

        (async () => {
            await getSubmissionResults(currentSubmission.problem.id);
        })();
    }, [ currentSubmission, getSubmissionResults ]);

    const handleOnSubmissionListItemOnClick = (submissionId: number) => {
        navigate(`/submissions/${submissionId}/details`);
        setCurrentSubmissionId(submissionId);
    };

    const getSubmissionListItemText = useCallback(
        (submissionDetails: ISubmissionDetails) => `#${submissionDetails.id} ${submissionDetails.submissionType} 
                    ${submissionDetails.points}/${submissionDetails.maximumPoints}`,
        [],
    );

    const renderSubmissionListItem = (submissionDetails: ISubmissionDetails) => {
        const selectedClassName = submissionDetails.id === currentSubmission?.id
            ? styles.selected
            : '';

        const className = concatClassNames(
            styles.submissionListItem,
            selectedClassName,
        );
        return (
            <Button
              type={ButtonType.plain}
              className={className}
              onClick={(ev) => {
                  ev.stopPropagation();
                  ev.preventDefault();
                  handleOnSubmissionListItemOnClick(submissionDetails.id);
              }}
            >
                {getSubmissionListItemText(submissionDetails)}
            </Button>
        );
    };

    const renderSubmissionsForProblem =
        () => (
            <List
              keyFunc={(v) => v.id.toString()}
              className={styles.submissionList}
              values={currentProblemSubmissionResults}
              itemFunc={renderSubmissionListItem}
              type={ListType.normal}
              orientation={Orientation.vertical}
            />
        );

    const render = () => {
        if (isNil(currentSubmission)) {
            return (
                <>No details fetched.</>
            );
        }

        return (
            <>
                <div className={styles.detailsWrapper}>
                    <div className={styles.code}>
                        <Heading type={HeadingType.secondary}>{problemNameHeadingText}</Heading>
                        <CodeEditor
                          readOnly
                          code={submissionCode}
                        />
                    </div>
                    <div className={styles.submissionsNavigation}>
                        <Heading type={HeadingType.secondary}>Submissions</Heading>
                        {renderSubmissionsForProblem()}
                    </div>
                    <div className={styles.submissionDetails}>
                        <Heading type={HeadingType.secondary}>{detailsHeadingText}</Heading>
                        <SubmissionResults collapsible />
                    </div>
                </div>
            </>
        );
    };

    return (
        <div>
            {render()}
        </div>
    );
};

export default SubmissionDetails;
