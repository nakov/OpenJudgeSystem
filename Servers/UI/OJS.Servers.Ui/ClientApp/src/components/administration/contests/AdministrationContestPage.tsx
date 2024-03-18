import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { ContestVariation } from '../../../common/contest-types';
import { useGetContestByIdQuery } from '../../../redux/services/admin/contestsAdminService';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';
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

    const { refetch: retake, data, isFetching, isLoading } = useGetContestByIdQuery({ id: Number(contestId) });

    const renderContestEdit = () => (
        <ContestEdit contestId={Number(contestId)} currentContest={data} onSuccess={retake} />
    );
    const renderProblemsInContestView = (key:string) => (
        <ProblemsInContestView
          key={key}
          contestId={Number(contestId)}
          contestType={ContestVariation[data?.type as keyof typeof ContestVariation]}
        />
    );

    const renderParticipantsInContestView = (key: string) => (
        <ParticipantsInContestView key={key} contestId={Number(contestId)} />
    );

    if (isFetching || isLoading) {
        return (<SpinningLoader />);
    }

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
