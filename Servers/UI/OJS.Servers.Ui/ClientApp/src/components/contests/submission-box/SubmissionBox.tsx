import * as React from 'react';
import { useCallback } from 'react';

import { isNil } from 'lodash';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import CodeEditor from '../../code-editor/CodeEditor';
import List, { Orientation } from '../../guidelines/lists/List';
import { Button } from '../../guidelines/buttons/Button';
import ExecutionTypeSelector from '../execution-type-selector/ExecutionTypeSelector';

import { ISubmissionTypeType } from '../../../common/types';

import { useSubmissions } from '../../../hooks/submissions/use-submissions';
import { useProblems } from '../../../hooks/use-problems';

import styles from './SubmissionBox.module.scss';
import concatClassNames from '../../../utils/class-names';

const SubmissionBox = () => {
    const { actions: { selectSubmissionTypeById } } = useSubmissions();
    const {
        state: {
            submissionCode,
            selectedSubmissionType,
        },
        actions: {
            submit,
            updateSubmissionCode,
        },
    } = useSubmissions();

    const { state: { currentProblem } } = useProblems();
    const { allowedSubmissionTypes } = currentProblem || {};

    const handleCodeChanged = useCallback(
        (newValue: string) => {
            updateSubmissionCode(newValue);
        },
        [ updateSubmissionCode ],
    );

    const handleSelectExecutionType = useCallback(
        (id: number) => {
            selectSubmissionTypeById(id);
        },
        [ selectSubmissionTypeById ],
    );

    const renderSubmissionTypesSelectors = useCallback(
        (submissionType: ISubmissionTypeType) => {
            const { id, name } = submissionType;
            const isSelected = allowedSubmissionTypes && allowedSubmissionTypes.length === 1
                ? true
                : submissionType.isSelectedByDefault;

            return (
                <ExecutionTypeSelector
                  id={id}
                  value={name}
                  isSelected={isSelected}
                  onSelect={() => handleSelectExecutionType(id)}
                />
            );
        },
        [ allowedSubmissionTypes, handleSelectExecutionType ],
    );

    const renderSubmissionTypesSelectorsList = useCallback(
        () => {
            if (isNil(currentProblem)) {
                return null;
            }

            if (isNil(allowedSubmissionTypes)) {
                return null;
            }

            return (
                <List
                  className={styles.submissionTypesList}
                  values={allowedSubmissionTypes}
                  itemFunc={renderSubmissionTypesSelectors}
                  orientation={Orientation.horizontal}
                  wrap
                />
            );
        },
        [ allowedSubmissionTypes, currentProblem, renderSubmissionTypesSelectors ],
    );

    const handleOnSubmit = useCallback(async () => {
        await submit();
        updateSubmissionCode('');
    }, [ submit, updateSubmissionCode ]);

    const taskText = 'Task: ';
    const executionTypeListClass = 'executionTypeLis';
    const executionTypeListClassName = concatClassNames(
        styles.executionTypeSelectors,
        executionTypeListClass,
    );

    return (
        <div className={styles.contestMainWrapper}>
            <Heading
              type={HeadingType.secondary}
              className={styles.heading}
            >
                {taskText}
                <span className={styles.taskName}>
                    {currentProblem?.name}
                </span>
            </Heading>
            <div className={styles.contestInnerLayout}>
                <div className={styles.editorAndProblemControlsWrapper}>
                    <CodeEditor
                      selectedSubmissionType={selectedSubmissionType!}
                      code={submissionCode}
                      onCodeChange={handleCodeChanged}
                    />
                    <div className={styles.contestSubmitControlsWrapper}>
                        <div className={executionTypeListClassName}>
                            {renderSubmissionTypesSelectorsList()}
                        </div>
                        <div className={styles.submitButtonContainer}>
                            <Button
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
