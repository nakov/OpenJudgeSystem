import * as React from 'react';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { setLayout } from '../shared/set-layout';
import { useContests } from '../../hooks/use-contests';

interface IContestPageParamsProps {
    contestId: string
    participationType: string
}

const ContestPage = () => {
    const { contestId } = useParams<IContestPageParamsProps>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { participationType } = useParams<IContestPageParamsProps>();
    const { startContestParticipation } = useContests();

    useEffect(() => {
        (async () => {
            await startContestParticipation(Number(contestId), participationType === 'compete');
        })();
    }, []);

    return (
        <>
            <h1>contestId</h1>
        </>
    );
};

export default setLayout(ContestPage);
