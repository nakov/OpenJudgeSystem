import * as React from 'react';
import { useCallback } from 'react';

import { isNil } from 'lodash';
import Heading from '../../guidelines/headings/Heading';
import CodeEditor from '../../code-editor/CodeEditor';
import List from '../../guidelines/lists/List';
import { Button } from '../../guidelines/buttons/Button';
import ExecutionTypeSelector from '../execution-type-selector/ExecutionTypeSelector';

import { ISubmissionTypeType } from '../../../common/types';

import { useContests } from '../../../hooks/use-contests';
import { useSubmissions } from '../../../hooks/submissions/use-submissions';
import { useProblems } from '../../../hooks/use-problems';

import styles from './SubmissionBox.module.scss';

const SubmissionBox = () => {
    const { setSubmissionType } = useContests();
    const {
        actions: {
            submitCode,
            updateSubmissionCode,
        },
    } = useSubmissions();

    const { state: { currentProblem } } = useProblems();

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
            if (isNil(currentProblem)) {
                return null;
            }
            const { allowedSubmissionTypes } = currentProblem || {};
            if (isNil(allowedSubmissionTypes)) {
                return null;
            }

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
        await submitCode();
        updateSubmissionCode('');
    }, [ submitCode, updateSubmissionCode ]);

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
