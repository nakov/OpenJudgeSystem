import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import TabsInView from '../common/tabs/TabsInView';

import ProblemGroupForm from './problem-group-form/ProblemGroupForm';
import ProblemsInProblemGroupView from './problems-in-problem-group-view/ProblemsInProblemGroupView';

enum PROBLEM_GROUP_LISTED_DATA {
    PROBLEMS = 'problems',
}

const AdministrationProblemGroup = () => {
    const { pathname } = useLocation();
    const [ , , , problemGroupId ] = pathname.split('/');

    const [ tabName, setTabName ] = useState(PROBLEM_GROUP_LISTED_DATA.PROBLEMS);

    const onTabChange = (event: React.SyntheticEvent, newValue: PROBLEM_GROUP_LISTED_DATA) => {
        setTabName(newValue);
    };

    const returnProblemGroupForm = () => (
        <ProblemGroupForm id={Number(problemGroupId)} />
    );

    const returnProblems = (key:string) => (
        <ProblemsInProblemGroupView key={key} problemGroupId={Number(problemGroupId)} />
    );

    return (
        <TabsInView
          form={returnProblemGroupForm}
          onTabChange={onTabChange}
          tabName={tabName}
          tabs={[
              { value: PROBLEM_GROUP_LISTED_DATA.PROBLEMS, label: 'Resources', node: returnProblems },
          ]}
        />
    );
};
export default AdministrationProblemGroup;
