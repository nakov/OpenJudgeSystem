import * as React from 'react';
import { useContests } from '../../../hooks/contests/use-contests';
import Heading from '../../guidelines/headings/Heading';
import CodeEditor from '../../code-editor/CodeEditor';
import Tabs from '../../guidelines/tabs/Tabs';
import ExecutionTypeSelector from '../execution-type-selector/ExecutionTypeSelector';
import List from '../../guidelines/lists/List';
import { ISubmissionTypeType } from '../../../hooks/contests/types';
import { Button } from '../../guidelines/buttons/Button';
import styles from './ContestMainNavigation.module.scss';

const ContestMainNavigation = () => {
    const { currentProblem, setSubmissionType } = useContests();

    const renderSubmissionTypesSelectors = (submissionType: ISubmissionTypeType) => {
        // eslint-disable-next-line eqeqeq
        const isSelected = currentProblem?.allowedSubmissionTypes.length == 1
            ? true
            : submissionType.isSelectedByDefault;

        return (
            <ExecutionTypeSelector
              id={submissionType.id}
              value={submissionType.name}
              isSelected={isSelected}
              onSelect={() => setSubmissionType(submissionType.id)}
            />
        );
    };

    const renderSubmissionTypesSelectorsList = () => (currentProblem == null
        ? null
        : (
            <List
              values={currentProblem.allowedSubmissionTypes}
              itemFunc={renderSubmissionTypesSelectors}
              orientation="horizontal"
            />
        ));

    return (
        <div className={styles.contestMainWrapper}>
            <Heading type="secondary">{currentProblem?.name}</Heading>
            <div className={styles.contestInnerLayout}>
                <div className={styles.editorAndProblemControlsWrapper}>
                    <CodeEditor />
                    <div className={styles.contestTabControls}>
                        <Tabs
                          tabLabels={[ 'Problem', 'Submissions' ]}
                          tabChildren={[ <p>Problem Description</p>, <p>Submissions</p> ]}
                        />
                    </div>
                </div>
                <div className={styles.contestSubmitControlsWrapper}>
                    <div className={styles.executionTypeSelectors}>
                        {renderSubmissionTypesSelectorsList()}
                    </div>
                    <div><Button type="primary" text="Submit" onClick={() => {}} /></div>
                </div>
            </div>
        </div>
    );
};

export default ContestMainNavigation;
