/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import EditIcon from '@mui/icons-material/Edit';
import QuizIcon from '@mui/icons-material/Quiz';
import ReplayIcon from '@mui/icons-material/Replay';
import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { IAdministrationContestProblems } from '../../../../../../common/types';
import { useGetContestProblemsQuery } from '../../../../../../redux/services/admin/contestsAdminService';

interface IProblemsInContestViewProps {
    contestId: number;
}
export const ProblemsInContestView = (props:IProblemsInContestViewProps) => {
    const [ contestProblems, setContestProblems ] = useState<Array<IAdministrationContestProblems>>([]);
    const { data: problemsData } = useGetContestProblemsQuery({ id: Number(props.contestId) });

    useEffect(
        () => {
            if (problemsData) {
                setContestProblems(problemsData);
            }
        },
        [ problemsData, setContestProblems ],
    );

    const onProblemEdit = (problemId: number) => {};

    return (
        <Box sx={{ marginTop: '2rem', width: '80%' }}>
            <TableContainer
              className="mt-1"
              sx={{
                  border: '1px solid rgba(128,128,128,0.4)',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  borderRadius: 2,
              }}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell scope="head" variant="head">Problem Id</TableCell>
                            <TableCell scope="head" variant="head">Name</TableCell>
                            <TableCell scope="head" variant="head">Group</TableCell>
                            <TableCell scope="head" variant="head">Group Type</TableCell>
                            <TableCell scope="head" variant="head">Compete Tests</TableCell>
                            <TableCell scope="head" variant="head">Practice Tests</TableCell>
                            <TableCell scope="head" variant="head">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contestProblems.map((x, i) => (
                            <TableRow key={x.id} hover>
                                <TableCell scope="row">{x.id}</TableCell>
                                <TableCell scope="row">{x.name}</TableCell>
                                <TableCell scope="row">{x.group}</TableCell>
                                <TableCell scope="row">{x.groupType}</TableCell>
                                <TableCell scope="row">{x.competeTests}</TableCell>
                                <TableCell scope="row">{x.practiceTests}</TableCell>
                                <TableCell scope="row">
                                    <Box>
                                        <IconButton><EditIcon onClick={() => onProblemEdit(x.id)} /></IconButton>
                                        <IconButton><QuizIcon onClick={() => onProblemEdit(x.id)} /></IconButton>
                                        <IconButton><CloseIcon onClick={() => onProblemEdit(x.id)} /></IconButton>
                                        <IconButton><ReplayIcon onClick={() => onProblemEdit(x.id)} /></IconButton>
                                        <IconButton><CopyAllIcon onClick={() => onProblemEdit(x.id)} /></IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
