import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useContests } from '../../../hooks/contests/use-contests';
import Heading from '../../guidelines/headings/Heading';
import List from '../../guidelines/lists/List';
import { IProblemType } from '../../../hooks/submissions/types';
import Tabs from '../../guidelines/tabs/Tabs';
import styles from './Contest.module.scss';

const Contest = () => {
    const { currentContest } = useContests();

    const renderTask = (problem: IProblemType) => (
        <li key={problem.id} className={styles.taskSideNavigationItem}>
            {problem.name}
        </li>
    );

    const renderTasksList = () => (
        currentContest == null
            ? null
            : (
                <List
                  values={currentContest.problems.sort((a, b) => a.orderBy - b.orderBy)}
                  itemFunc={renderTask}
                  className={styles.tasksListSideNavigation}
                />
            )
    );

    const onNewCode = (newValue: string, e: any) => {
        console.log('onChange', newValue, e);
    };

    const code = 'Write your code here';

    return (
        <div className={styles.contestWrapper}>
            <div className={styles.tasksSideNavigation}>
                <Heading type="secondary">Tasks</Heading>
                {renderTasksList()}
            </div>
            <div className={styles.contestMainWrapper}>
                <Heading type="primary">{currentContest?.name}</Heading>
                <div className={styles.contestInnerLayout}>
                    <div>
                        <MonacoEditor
                          width="600"
                          height="400"
                          language="javascript"
                          theme="vs-dark"
                          value={code}
                          options={{
                              selectOnLineNumbers: true,
                              minimap: { enabled: false },
                              automaticLayout: true,
                              hideCursorInOverviewRuler: true,
                              lineHeight: 20,
                              scrollbar: {
                                  horizontal: 'hidden',
                                  vertical: 'hidden',
                              },
                          }}
                          onChange={onNewCode}
                        />
                    </div>
                    <div>
                        <Tabs
                          tabLabels={[ 'Problem', 'Submissions' ]}
                          tabChildren={[ <p>Problem Description</p>, <p>Submissions</p> ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contest;
