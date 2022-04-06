import * as React from 'react';
import { useCallback } from 'react';
import { useContests } from '../../../hooks/contests/use-contests';
import Heading from '../../guidelines/headings/Heading';
import CodeEditor from '../../code-editor/CodeEditor';
import Tabs from '../../guidelines/tabs/Tabs';
import ExecutionTypeSelector from '../execution-type-selector/ExecutionTypeSelector';
import List from '../../guidelines/lists/List';
import { ISubmissionTypeType } from '../../../hooks/contests/types';
import { Button } from '../../guidelines/buttons/Button';
import styles from './ContestMainNavigation.module.scss';
import { useSubmissions } from '../../../hooks/submissions/use-submissions';
import ProblemResources from '../../problems/problem-resources/ProblemResources';
import SubmissionResults from '../../problems/problem-submissions/SubmissionResults';

const ContestMainNavigation = () => {
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
                />
            );
        },
        [ currentProblem, renderSubmissionTypesSelectors ],
    );

    const handleOnSubmit = useCallback(async () => {
        await submit();
        setCode('');
    }, [ setCode, submit ]);

    return (
        <div className={styles.contestMainWrapper}>
            <Heading type="secondary">{currentProblem?.name}</Heading>
            <div className={styles.contestInnerLayout}>
                <div className={styles.editorAndProblemControlsWrapper}>
                    <CodeEditor />
                    <div className={styles.contestSubmitControlsWrapper}>
                        <div className={styles.executionTypeSelectors}>
                            {renderSubmissionTypesSelectorsList()}
                        </div>
                        <div>
                            <Button
                              type="primary"
                              text="Submit"
                              onClick={handleOnSubmit}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.contestTabControls}>
                    <Tabs
                      tabLabels={[ 'Problem', 'Submissions' ]}
                      tabChildren={[
                          <ProblemResources resources={currentProblem?.resources} />,
                          <SubmissionResults problemId={currentProblem?.id} />,
                      ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default ContestMainNavigation;
