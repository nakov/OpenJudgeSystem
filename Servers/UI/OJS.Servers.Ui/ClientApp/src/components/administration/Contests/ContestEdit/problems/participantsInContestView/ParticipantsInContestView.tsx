import React from 'react';

import { useGetContestParticipantsQuery } from '../../../../../../redux/services/admin/contestsAdminService';

interface IParticipantsInContestView {
    contestId: number;
}

const ParticipantsInContestView = (props: IParticipantsInContestView) => {
    const { contestId } = props;
    const { data } = useGetContestParticipantsQuery({ id: Number(contestId) });

    console.log('data => ', data);

    return (<div>participants in contest</div>);
};

export default ParticipantsInContestView;
