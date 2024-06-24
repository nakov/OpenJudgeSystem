import { AiOutlineSolution } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';

import { getContestsSolutionSubmitPageUrl } from '../../../../common/urls/compose-client-urls';

interface ISubmitSolutionProps {
    contestId: number;
    contestName?: string;
    canBeCompeted: boolean;
    problemOrderBy?: number;
}
const SubmitSolution = (props:ISubmitSolutionProps) => {
    const { contestId, contestName, canBeCompeted, problemOrderBy = 1 } = props;

    return (
        <Tooltip title="Submit Solution">
            <IconButton>
                <Link
                  to={getContestsSolutionSubmitPageUrl({ isCompete: canBeCompeted, contestId, contestName, problemId: problemOrderBy })}
                  target="_blank"
                >
                    <AiOutlineSolution style={{ width: '40px', height: '40px', color: 'rgb(25,118,210)' }} color="primary" />
                </Link>
            </IconButton>
        </Tooltip>
    );
};
export default SubmitSolution;
