/* eslint-disable max-len */
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import TabsInView from '../common/tabs/TabsInView';

import ContestEdit from './contest-edit/ContestEdit';
import ParticipantsInContestView from './participants-in-contest-view/ParticipantsInContestView';
import ProblemsInContestView from './problems-in-contest-view/ProblemsInContestView';

enum CONTEST_LISTED_DATA {
    PROBLEMS = 'problems',
    PARTICIPANTS = 'participants'
}

const AdministrationContestPage = () => {
    const { pathname } = useLocation();
    const [ , , , contestId ] = pathname.split('/');
    const [ tabName, setTabName ] = useState(CONTEST_LISTED_DATA.PROBLEMS);

    const onTabChange = (event: React.SyntheticEvent, newValue: CONTEST_LISTED_DATA) => {
        setTabName(newValue);
    };

    const renderContestEdit = () => (
        <ContestEdit contestId={Number(contestId)} />
    );
    const renderProblemsInContestView = (key:string) => (
        <ProblemsInContestView key={key} contestId={Number(contestId)} />
    );

    const renderParticipantsInContestView = (key: string) => (
        <ParticipantsInContestView key={key} contestId={Number(contestId)} />
    );

    return (
        <TabsInView
          form={renderContestEdit}
          onTabChange={onTabChange}
          tabName={tabName}
          tabs={[
              { value: CONTEST_LISTED_DATA.PROBLEMS, label: 'Problems', node: renderProblemsInContestView },
              { value: CONTEST_LISTED_DATA.PARTICIPANTS, label: 'Participants', node: renderParticipantsInContestView },
          ]}
        />
    );
};
export default AdministrationContestPage;
