import React, { useState } from 'react';
import { useLocation } from 'react-router';

import TabsInView from '../common/tabs/TabsInView';

import ResourcesInProblemView from './problem-resources/problem-resources-in-problem-view/ResourcesInProblemView';
import ProblemForm from './problemForm/ProblemForm';
import TestsInProblemView from './tests-in-problem-view/TestsInProblemView';

enum PROBLEM_LISTED_DATA {
    TESTS = 'tests',
    RESOURCES = 'resources'
}
const AdministrationProblem = () => {
    const { pathname } = useLocation();
    const [ , , , problemId ] = pathname.split('/');
    const [ tabName, setTabName ] = useState(PROBLEM_LISTED_DATA.RESOURCES);

    const onTabChange = (event: React.SyntheticEvent, newValue: PROBLEM_LISTED_DATA) => {
        setTabName(newValue);
    };

    const returnProblemForm = () => (
        <ProblemForm problemId={Number(problemId)} isEditMode contestId={null} />
    );

    const returnResourceInProblemView = (key:string) => (
        <ResourcesInProblemView key={key} problemId={Number(problemId)} />
    );

    const returnTests = (key: string) => (
        <TestsInProblemView key={key} problemId={Number(problemId)} />
    );
    return (
        <TabsInView
          form={returnProblemForm}
          onTabChange={onTabChange}
          tabName={tabName}
          tabs={[
              { value: PROBLEM_LISTED_DATA.RESOURCES, label: 'Resources', node: returnResourceInProblemView },
              { value: PROBLEM_LISTED_DATA.TESTS, label: 'Tests', node: returnTests },
          ]}
        />
    );
};

export default AdministrationProblem;
