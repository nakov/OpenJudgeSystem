import * as React from 'react';
import { useCallback } from 'react';
import { useContests } from '../../../hooks/use-contests';
import Heading from '../../guidelines/headings/Heading';
import CodeEditor from '../../code-editor/CodeEditor';
import ExecutionTypeSelector from '../execution-type-selector/ExecutionTypeSelector';
import List from '../../guidelines/lists/List';
import { Button } from '../../guidelines/buttons/Button';
import styles from './SubmissionBox.module.scss';
import { useSubmissions } from '../../../hooks/submissions/use-submissions';
import { ISubmissionTypeType } from '../../../common/types';

const SubmissionBox = () => {
    const {
        currentProblem,
        setSubmissionType,
    } = useContests();
    const {
        submit,
        setCode,
    } = useSubmissions();

    const renderSubmissionTypesSelectors = useCallback(
        (submissionType: ISubmissionTypeType) => {
            const { id, name } = submissionType;
            const { allowedSubmissionTypes } = currentProblem || {};
            const isSelected = allowedSubmissionTypes && allowedSubmissionTypes.length === 1
                ? true
                : submissionType.isSelectedByDefault;

            return (
                <ExecutionTypeSelector
                  id={id}
                  value={name}
                  isSelected={isSelected}
                  onSelect={() => setSubmissionType(id)}
                />
            );
        },
        [ currentProblem, setSubmissionType ],
    );

    const renderSubmissionTypesSelectorsList = useCallback(
        () => {
            if (currentProblem == null) {
                return null;
            }
            const { allowedSubmissionTypes } = currentProblem;

            return (
                <List
                  className={styles.submissionTypesList}
                  values={allowedSubmissionTypes}
                  itemFunc={renderSubmissionTypesSelectors}
                  orientation="horizontal"
                  wrap
                />
            );
        },
        [ currentProblem, renderSubmissionTypesSelectors ],
    );

    const handleOnSubmit = useCallback(async () => {
        await submit();
        setCode('');
    }, [ setCode, submit ]);

    const taskText = 'Task: ';

    return (
        <div className={styles.contestMainWrapper}>
            <Heading type="secondary" className={styles.heading}>
                {taskText}
                <span className={styles.taskName}>
                    {currentProblem?.name}
                </span>
            </Heading>
            <div className={styles.contestInnerLayout}>
                <div className={styles.editorAndProblemControlsWrapper}>
                    <CodeEditor />
                    <div className={styles.contestSubmitControlsWrapper}>
                        <div className={styles.executionTypeSelectors}>
                            {renderSubmissionTypesSelectorsList()}
                        </div>
                        <div className={styles.submitButtonContainer}>
                            <Button
                              type="primary"
                              text="Submit"
                              onClick={handleOnSubmit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionBox;
