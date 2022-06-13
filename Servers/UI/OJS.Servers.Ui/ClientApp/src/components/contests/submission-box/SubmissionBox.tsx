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

const SubmissionBox = () => {
    // const { setSubmissionType } = useHomeContests();
    const { actions: { selectSubmissionTypeById } } = useSubmissions();
    const {
        actions: {
            submit,
            updateSubmissionCode,
        },
    } = useSubmissions();

    const { state: { currentProblem } } = useProblems();

    const handleSelectExecutionType = useCallback(
        (id) => {
            selectSubmissionTypeById(id);
        },
        [ selectSubmissionTypeById ],
    );

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
                  onSelect={() => handleSelectExecutionType(id)}
                />
            );
        },
        [ currentProblem, handleSelectExecutionType ],
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
                  orientation={Orientation.horizontal}
                  wrap
                />
            );
        },
        [ currentProblem, renderSubmissionTypesSelectors ],
    );

    const handleOnSubmit = useCallback(async () => {
        await submit();
        updateSubmissionCode('');
    }, [ submit, updateSubmissionCode ]);

    const taskText = 'Task: ';

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
                    <CodeEditor />
                    <div className={styles.contestSubmitControlsWrapper}>
                        <div className={styles.executionTypeSelectors}>
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
