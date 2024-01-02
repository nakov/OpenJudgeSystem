/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import FileDownloadOffIcon from '@mui/icons-material/FileDownloadOff';
import PublishIcon from '@mui/icons-material/Publish';
import QuizIcon from '@mui/icons-material/Quiz';
import ReplayIcon from '@mui/icons-material/Replay';
import { Box, IconButton, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';

import { IAdministrationContestProblems } from '../../../../../../common/types';
import { useGetContestProblemsQuery } from '../../../../../../redux/services/admin/contestsAdminService';

interface IProblemsInContestViewProps {
    contestId: number;
}
const ProblemsInContestView = (props:IProblemsInContestViewProps) => {
    const { contestId } = props;
    const [ contestProblems, setContestProblems ] = useState<Array<IAdministrationContestProblems>>([]);
    const { data: problemsData } = useGetContestProblemsQuery({ id: Number(contestId) });

    useEffect(
        () => {
            if (problemsData) {
                setContestProblems(problemsData);
            }
        },
        [ problemsData, setContestProblems ],
    );

    const onProblemEdit = (problemId: number) => console.log('edit problem with id => ', problemId);

    return (
        <Slide direction="left" in mountOnEnter unmountOnExit timeout={400}>
            <Box sx={{ marginTop: '2rem', width: '100%' }}>
                <Tooltip title="Add new problem">
                    <IconButton>
                        <AddBoxIcon sx={{ height: '40px', width: '40px' }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete all problems">
                    <IconButton>
                        <ClearIcon sx={{ height: '40px', width: '40px' }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Export in excel">
                    <IconButton>
                        <FileDownloadOffIcon sx={{ height: '40px', width: '40px' }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Submit solution">
                    <IconButton>
                        <PublishIcon sx={{ height: '40px', width: '40px' }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Copy All">
                    <IconButton>
                        <FileCopyIcon sx={{ height: '40px', width: '40px' }} />
                    </IconButton>
                </Tooltip>
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
                            {contestProblems.map((x) => (
                                <TableRow key={x.id} hover>
                                    <TableCell scope="row">{x.id}</TableCell>
                                    <TableCell scope="row">{x.name}</TableCell>
                                    <TableCell scope="row">{x.group}</TableCell>
                                    <TableCell scope="row">{x.groupType}</TableCell>
                                    <TableCell scope="row">{x.competeTests}</TableCell>
                                    <TableCell scope="row">{x.practiceTests}</TableCell>
                                    <TableCell scope="row">
                                        <Box>
                                            <Tooltip title="Edit">
                                                <IconButton>
                                                    <EditIcon onClick={() => onProblemEdit(x.id)} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Tests">
                                                <IconButton>
                                                    <QuizIcon onClick={() => onProblemEdit(x.id)} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton>
                                                    <CloseIcon onClick={() => onProblemEdit(x.id)} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Retest">
                                                <IconButton>
                                                    <ReplayIcon onClick={() => onProblemEdit(x.id)} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Copy">
                                                <IconButton>
                                                    <CopyAllIcon onClick={() => onProblemEdit(x.id)} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Slide>
    );
};

export default ProblemsInContestView;
