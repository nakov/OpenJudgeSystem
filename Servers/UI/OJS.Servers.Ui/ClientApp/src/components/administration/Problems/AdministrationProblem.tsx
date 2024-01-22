/* eslint-disable max-len */
import React from 'react';
import { useLocation } from 'react-router';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Box, Divider, FormControl, FormGroup, FormLabel, IconButton, TextareaAutosize, TextField, Typography } from '@mui/material';

import { IProblemSubmissionType } from '../../../common/types';
import { useGetProblemByIdQuery } from '../../../redux/services/admin/problemsAdminService';

const AdministrationProblem = () => {
    const { pathname } = useLocation();
    const [ , , , problemId ] = pathname.split('/');

    console.log(problemId);
    const { data: problemData, isLoading: isGettingData, error: gettingDataError } = useGetProblemByIdQuery({ id: Number(problemId) });
    return (
        <Box>
            <Typography variant="h3">{problemData?.name}</Typography>
            <form style={{ display: 'flex', flexDirection: 'column' }}>
                <Box style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <FormGroup sx={{ width: '45%' }}>
                        <FormControl sx={{ margin: '1rem' }}>
                            <TextField variant="standard" label="Id" value={problemData?.id} InputLabelProps={{ shrink: true }} type="text" />
                        </FormControl>
                        <FormControl sx={{ margin: '1rem' }}>
                            <TextField variant="standard" label="Name" value={problemData?.name} InputLabelProps={{ shrink: true }} type="text" />
                        </FormControl>
                        <FormControl sx={{ margin: '1rem' }}>
                            <TextField variant="standard" label="Maximum Points" value={problemData?.maximumPoints} InputLabelProps={{ shrink: true }} type="number" />
                        </FormControl>
                        <FormControl sx={{ margin: '1rem' }}>
                            <TextField variant="standard" label="Source Code Size Limit" value={problemData?.sourceCodeSizeLimit} InputLabelProps={{ shrink: true }} type="number" />
                        </FormControl>
                    </FormGroup>
                    <FormGroup sx={{ width: '45%' }}>
                        <FormControl sx={{ margin: '1rem' }}>
                            <TextField variant="standard" label="Order by" value={problemData?.orderBy} InputLabelProps={{ shrink: true }} type="number" />
                        </FormControl>
                        <FormControl sx={{ margin: '1rem' }}>
                            <TextField variant="standard" label="Contest id" value={problemData?.contestId} InputLabelProps={{ shrink: true }} type="number" />
                        </FormControl>
                        <FormControl sx={{ margin: '1rem' }}>
                            <TextField variant="standard" label="Memory Limit" value={problemData?.memoryLimit} InputLabelProps={{ shrink: true }} type="number" />
                        </FormControl>
                        <FormControl sx={{ margin: '1rem' }}>
                            <TextField variant="standard" label="Time Limit" value={problemData?.timeLimit} InputLabelProps={{ shrink: true }} type="number" />
                        </FormControl>
                    </FormGroup>
                </Box>

                <FormGroup>
                    <FormControl>
                        {/* <Select></Select> */}
                    </FormControl>
                </FormGroup>

                <Divider />
                <Typography sx={{ marginTop: '1rem' }} variant="h4">Submission Types</Typography>
                {
                    problemData?.submissionTypes.map((st : IProblemSubmissionType) => (
                        <FormGroup sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', margin: '1rem' }} key={st.id}>
                            <IconButton><RemoveCircleIcon color="error" /></IconButton>
                            <FormControl sx={{ width: '25%' }}>
                                <TextField
                                  variant="standard"
                                  label="Name"
                                  value={st.name}
                                  InputLabelProps={{ shrink: true }}
                                  type="text"
                                  InputProps={{ readOnly: true }}
                                />
                            </FormControl>
                            <FormControl sx={{ width: '25%' }}>
                                <FormLabel>Description</FormLabel>
                                <TextareaAutosize
                                  placeholder="Enter skeleton here...."
                                  minRows={10}
                                  value={st.skeleton}
                                  name="description"
                                />
                            </FormControl>
                        </FormGroup>
                    ))
                }
            </form>
        </Box>
    );
};

export default AdministrationProblem;
