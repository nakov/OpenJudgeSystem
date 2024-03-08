import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { Typography } from '@mui/material';

import TabsInView from '../common/tabs/TabsInView';

import ResourcesInProblemView from './problem-resources/problem-resources-in-problem-view/ResourcesInProblemView';
import ProblemForm from './problemForm/ProblemForm';

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
        <Typography key={key} variant="h1">Not implemented</Typography>
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
