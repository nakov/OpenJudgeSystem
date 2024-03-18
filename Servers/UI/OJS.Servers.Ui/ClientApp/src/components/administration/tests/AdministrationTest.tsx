import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import TabsInView from '../common/tabs/TabsInView';
import TestRunsInTestView from '../test-runs/test-runs-in-tests-view/TestRunsInTestView';

import TestForm from './test-form/TestForm';

enum TESTS_LISTED_DATA {
    TEST_RUNS = 'testRuns',
}

const AdministrationTest = () => {
    const { pathname } = useLocation();
    const [ , , , testId ] = pathname.split('/');

    const [ tabName, setTabName ] = useState(TESTS_LISTED_DATA.TEST_RUNS);

    const onTabChange = (event: React.SyntheticEvent, newValue: TESTS_LISTED_DATA) => {
        setTabName(newValue);
    };

    const returnTestForm = () => (
        <TestForm id={Number(testId)} />
    );
    const returnTestRuns = (key:string) => (
        <TestRunsInTestView key={key} testId={Number(testId)} />
    );

    return (
        <TabsInView
          form={returnTestForm}
          onTabChange={onTabChange}
          tabName={tabName}
          tabs={[
              { value: TESTS_LISTED_DATA.TEST_RUNS, label: 'Test Runs', node: returnTestRuns },
          ]}
        />
    );
};

export default AdministrationTest;
