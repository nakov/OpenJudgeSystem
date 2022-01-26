import * as React from 'react';
import { useParams, useHistory } from 'react-router';
import { useEffect } from 'react';
import { setLayout } from '../shared/set-layout';
import { useContests } from '../../hooks/use-contests';

interface IContestPageParamsProps {
    contestId: string
    participationType: string
}

const ContestPage = () => {
    const { contestId } = useParams<IContestPageParamsProps>();
    const { participationType } = useParams<IContestPageParamsProps>();
    const { setCurrentContestId, startContestParticipation } = useContests();
    const history = useHistory();

    const validateParticipationType = () => {
        if (participationType === 'practice') {
            // TODO: check if contest can be practiced;
        } else if (participationType === 'compete') {
            // TODO: check if contest can be competed;
        } else {
            history.push('/');
        }
    };

    useEffect(() => {
        setCurrentContestId(Number(contestId));
    });

    useEffect(() => {
        validateParticipationType();
        startContestParticipation();
    }, [ startContestParticipation, contestId, validateParticipationType ]);

    return (
        <>
            <h1>contestId</h1>
        </>
    );
};

export default setLayout(ContestPage);
