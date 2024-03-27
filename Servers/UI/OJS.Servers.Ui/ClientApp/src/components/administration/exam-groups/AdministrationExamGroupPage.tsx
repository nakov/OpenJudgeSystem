import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import TabsInView from '../common/tabs/TabsInView';

import ExamGroupEdit from './exam-group-edit/ExamGroupEdit';
import UsersInExamGroupView from './users-in-exam-group-view/UsersInExamGroupView';

enum EXAM_GROUPS_LISTED_DATA {
    USERS = 'Users',
}
const AdministrationExamGroupPage = () => {
    const { pathname } = useLocation();
    const [ , , , examGroupId ] = pathname.split('/');
    const [ tabName, setTabName ] = useState(EXAM_GROUPS_LISTED_DATA.USERS);

    const returnExamGroupForm = () => (
        <ExamGroupEdit examGroupId={Number(examGroupId)} />
    );

    const onTabChange = (event: React.SyntheticEvent, newValue: EXAM_GROUPS_LISTED_DATA) => {
        setTabName(newValue);
    };

    const returnUsers = (key: string) => (
        <UsersInExamGroupView key={key} examGroupId={Number(examGroupId)} />
    );

    return (
        <TabsInView
          form={returnExamGroupForm}
          onTabChange={onTabChange}
          tabName={tabName}
          tabs={[
              { value: EXAM_GROUPS_LISTED_DATA.USERS, label: 'Users', node: returnUsers },
          ]}
        />
    );
};
export default AdministrationExamGroupPage;
