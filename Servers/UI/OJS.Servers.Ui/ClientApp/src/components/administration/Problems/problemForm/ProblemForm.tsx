/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-imports */
/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Autocomplete, Box, Button, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, InputLabel, MenuItem, Select, TextareaAutosize, TextField, Typography } from '@mui/material';
import { isNaN } from 'lodash';

import { ProblemGroupTypes } from '../../../../common/enums';
import { ExceptionData, IProblemAdministration, IProblemSubmissionType, ISubmissionTypeInProblem } from '../../../../common/types';
import { useGetCheckersForProblemQuery } from '../../../../redux/services/admin/checkersAdminService';
import { useDeleteProblemMutation, useGetProblemByIdQuery, useUpdateProblemMutation } from '../../../../redux/services/admin/problemsAdminService';
import { useGetForProblemQuery } from '../../../../redux/services/admin/submissionTypesAdminService';
import { Alert, AlertHorizontalOrientation, AlertSeverity, AlertVariant, AlertVerticalOrientation } from '../../../guidelines/alert/Alert';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';
import DeleteButton from '../../common/delete/DeleteButton';

interface IProblemFormProps {
    problemId: number | null;

    isEditMode?: boolean;

    contestId: number | null;
}

const ProblemForm = (props: IProblemFormProps) => {
    const { problemId, isEditMode, contestId } = props;
    const [ filteredSubmissionTypes, setFilteredSubmissionTypes ] = useState<Array<ISubmissionTypeInProblem>>([]);
    const [ currentProblem, setCurrentProblem ] = useState<IProblemAdministration>({
        checkerId: 0,
        contestId: !isEditMode && contestId
            ? contestId
            : -1,
        id: -1,
        maximumPoints: 0,
        memoryLimit: 0,
        name: '',
        orderBy: 0,
        problemGroupType: 'None',
        showDetailedFeedback: false,
        showResults: false,
        sourceCodeSizeLimit: 0,
        submissionTypes: [],
        timeLimit: 0,
        // additionalFiles: null,
    });

    const navigate = useNavigate();
    const { data: problemData, isLoading: isGettingData, error: gettingDataError } = useGetProblemByIdQuery({ id: Number(problemId) }, { skip: problemId === null });
    const { data: submissionTypes } = useGetForProblemQuery(null);
    const { data: checkers } = useGetCheckersForProblemQuery(null);
    const [ updateProblem, { data: updateData, isSuccess: isSuccesfullyUpdated, error: updateError } ] = useUpdateProblemMutation();
    useEffect(() => {
        if (submissionTypes) {
            setFilteredSubmissionTypes(submissionTypes.filter((st) => !problemData?.submissionTypes.some((x) => x.id === st.id)));
        }
    }, [ submissionTypes ]);

    useEffect(() => {
        if (problemData) {
            setCurrentProblem(problemData);
        }
    }, [ problemData ]);

    const onChange = (e: any) => {
        const { name, type, value, checked } = e.target;
        setCurrentProblem((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox'
                ? checked
                : type === 'number'
                    ? value === ''
                        ? ''
                        : Number(value)
                    : value,
        }));
    };

    const onStrategyAdd = (submissionType: ISubmissionTypeInProblem) => {
        if (submissionType === null) {
            return;
        }
        const hasSubmissionType = filteredSubmissionTypes.some((st) => st.id === submissionType.id);

        if (hasSubmissionType) {
            const removedSubmissionType = filteredSubmissionTypes.find((st) => st.id === submissionType.id);

            let newSubmissionTypes = filteredSubmissionTypes;
            const problemSubmissionTypes = [ ...currentProblem!.submissionTypes ];
            if (removedSubmissionType) {
                problemSubmissionTypes.push({
                    id: submissionType.id,
                    name: removedSubmissionType.name,
                    solutionSkeleton: null,
                });

                newSubmissionTypes = newSubmissionTypes.filter((x) => x.id !== submissionType.id);

                setFilteredSubmissionTypes(newSubmissionTypes);
                setCurrentProblem((prevState) => ({
                    ...prevState,
                    submissionTypes: problemSubmissionTypes,
                }));
            }
        }
    };

    const onStrategyRemoved = (id: number) => {
        const hasSubmissionType = currentProblem?.submissionTypes.some((st) => st.id === id);

        if (hasSubmissionType) {
            const removedSubmissionType = currentProblem?.submissionTypes.find((st) => st.id === id);

            const newSubmissionTypes = filteredSubmissionTypes;
            let problemSubmissionTypes = currentProblem?.submissionTypes;
            if (removedSubmissionType) {
                newSubmissionTypes.push({
                    id,
                    name: removedSubmissionType.name,
                });

                problemSubmissionTypes = problemSubmissionTypes.filter((x) => x.id !== id);

                setFilteredSubmissionTypes(newSubmissionTypes);
                setCurrentProblem((prevState) => ({
                    ...prevState,
                    submissionTypes: problemSubmissionTypes,
                }));
            }
        }
    };
    const onSkeletonChange = (value: string, submissionTypeId: number) => {
        const index = currentProblem.submissionTypes.findIndex((st) => st.id === submissionTypeId);

        const newSubmissionTypes = currentProblem.submissionTypes.map((item, idx) => idx === index
            ? { ...item, solutionSkeleton: value }
            : item);

        setCurrentProblem((prevState) => ({
            ...prevState,
            submissionTypes: newSubmissionTypes,
        }));
    };
    const renderAlert = (message: string, severity:AlertSeverity) => (
        <Alert
          variant={AlertVariant.Filled}
          vertical={AlertVerticalOrientation.Top}
          horizontal={AlertHorizontalOrientation.Right}
          severity={severity}
          message={message}
        />
    );

    return (
        isGettingData
            ? <SpinningLoader />
            : (
                <>
                    {gettingDataError &&
                   renderAlert(gettingDataError.data[0].message, AlertSeverity.Error)}
                    {updateError?.data.map((x:ExceptionData) => {
                        renderAlert(x.message, AlertSeverity.Error);
                    })}
                    {
                        isSuccesfullyUpdated && renderAlert(updateData, AlertSeverity.Success)
                    }
                    <Typography sx={{ textAlign: 'center' }} variant="h3">{currentProblem?.name}</Typography>

                    <form style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ marginTop: '1rem' }} variant="h4">Basic info</Typography>
                        <Divider />
                        <Box style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                            <FormGroup sx={{ width: '45%' }}>
                                <FormControl sx={{ margin: '1rem' }}>
                                    <TextField
                                      variant="standard"
                                      label="Id"
                                      value={currentProblem?.id}
                                      InputLabelProps={{ shrink: true }}
                                      type="text"
                                      disabled
                                    />
                                </FormControl>
                                <FormControl sx={{ margin: '1rem' }}>
                                    <TextField
                                      variant="standard"
                                      label="Name"
                                      value={currentProblem?.name}
                                      InputLabelProps={{ shrink: true }}
                                      type="text"
                                      name="name"
                                      onChange={(e) => onChange(e)}
                                    />
                                </FormControl>
                                <FormControl sx={{ margin: '1rem' }}>
                                    <TextField
                                      variant="standard"
                                      label="Maximum Points"
                                      value={currentProblem?.maximumPoints}
                                      InputLabelProps={{ shrink: true }}
                                      type="number"
                                      name="maximumPoints"
                                      onChange={(e) => onChange(e)}
                                    />
                                </FormControl>
                                <FormControl sx={{ margin: '1rem' }}>
                                    <TextField
                                      variant="standard"
                                      label="Source Code Size Limit"
                                      value={currentProblem?.sourceCodeSizeLimit}
                                      InputLabelProps={{ shrink: true }}
                                      type="number"
                                      name="sourceCodeSizeLimit"
                                      onChange={(e) => onChange(e)}
                                    />
                                </FormControl>
                            </FormGroup>
                            <FormGroup sx={{ width: '45%' }}>
                                <FormControl sx={{ margin: '1rem' }}>
                                    <TextField
                                      variant="standard"
                                      label="Order by"
                                      value={currentProblem?.orderBy}
                                      InputLabelProps={{ shrink: true }}
                                      type="number"
                                      name="sourceCodeSizeLimit"
                                      onChange={(e) => onChange(e)}
                                    />
                                </FormControl>
                                <FormControl sx={{ margin: '1rem' }}>
                                    <TextField
                                      variant="standard"
                                      label="Contest id"
                                      value={currentProblem?.contestId}
                                      InputLabelProps={{ shrink: true }}
                                      type="number"
                                      name="contestId"
                                      onChange={(e) => onChange(e)}
                                      disabled
                                    />
                                </FormControl>
                                <FormControl sx={{ margin: '1rem' }}>
                                    <TextField
                                      variant="standard"
                                      label="Memory Limit"
                                      value={currentProblem?.memoryLimit}
                                      InputLabelProps={{ shrink: true }}
                                      type="number"
                                      name="memoryLimit"
                                      onChange={(e) => onChange(e)}
                                    />
                                </FormControl>
                                <FormControl sx={{ margin: '1rem' }}>
                                    <TextField
                                      variant="standard"
                                      label="Time Limit"
                                      value={currentProblem?.timeLimit}
                                      InputLabelProps={{ shrink: true }}
                                      type="number"
                                      name="timeLimit"
                                      onChange={(e) => onChange(e)}
                                    />
                                </FormControl>
                            </FormGroup>
                        </Box>
                        <FormGroup sx={{ margin: '0.5rem 0', width: '92%', alignSelf: 'center' }}>
                            <InputLabel id="problemGroupType">Problem Group Type</InputLabel>
                            <Select
                              onChange={(e) => onChange(e)}
                              onBlur={(e) => onChange(e)}
                              labelId="problemGroupType"
                              value={currentProblem.problemGroupType}
                              name="problemGroupType"
                            >
                                {Object.keys(ProblemGroupTypes).filter((key) => isNaN(Number(key))).map((key) => (
                                    <MenuItem key={key} value={key}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormGroup>
                        <FormGroup sx={{ margin: '0.5rem 0', width: '92%', alignSelf: 'center' }}>
                            <InputLabel id="problemGroupType">Checker</InputLabel>
                            <Select
                              onChange={(e) => onChange(e)}
                              onBlur={(e) => onChange(e)}
                              labelId="checkerId"
                              value={Number(currentProblem.checkerId)}
                              name="checkerId"
                            >
                                {checkers?.map((c) => (
                                    <MenuItem key={c.id} value={Number(c.id)}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormGroup>
                        <FormGroup sx={{ width: '45%' }}>
                            <FormControl>
                                <TextField
                                  type="file"
                                  label="Additional files"
                                  name="additionalFiles"
                                  variant="standard"
                                  sx={{ width: '45%', margin: '1rem' }}
                                  InputLabelProps={{ shrink: true }}
                                />
                            </FormControl>
                            {/* <FormControl>
                                <TextField
                                  type="file"
                                  label="Tests"
                                  variant="standard"
                                  sx={{ width: '45%', margin: '1rem' }}
                                  InputLabelProps={{ shrink: true }}
                                />
                            </FormControl> */}
                        </FormGroup>
                        <FormGroup sx={{ marginLeft: '4rem' }}>
                            <FormControlLabel
                              control={<Checkbox checked={currentProblem.showDetailedFeedback} />}
                              label="Show Detailed feedback"
                              name="showDetailedFeedback"
                              onChange={(e) => onChange(e)}
                            />
                            <FormControlLabel
                              control={(
                                  <Checkbox
                                    checked={currentProblem.showResults}
                                  />
                              )}
                              name="showResults"
                              onChange={(e) => onChange(e)}
                              label="Show Results"
                            />
                        </FormGroup>

                        <Typography sx={{ marginTop: '1rem' }} variant="h4">Submission Types</Typography>
                        <Divider />
                        <FormControl sx={{ margin: '3rem 0', width: '92%', alignSelf: 'center' }}>
                            <Autocomplete
                              options={filteredSubmissionTypes!}
                              renderInput={(params) => <TextField {...params} label="Select submission type" key={params.id} />}
                              onChange={(event, newValue) => onStrategyAdd(newValue!)}
                              value={null}
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              getOptionLabel={(option) => option?.name}
                              renderOption={(properties, option) => (
                                  <MenuItem {...properties} key={option.id} value={option.id}>
                                      {option.name}
                                  </MenuItem>
                              )}
                            />
                        </FormControl>

                        {
            currentProblem?.submissionTypes.map((st : IProblemSubmissionType) => (
                <FormGroup
                  sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      margin: '1rem',
                  }}
                  key={st.id}
                >
                    <IconButton
                      sx={{ width: '5%' }}
                      onClick={() => onStrategyRemoved(st.id)}
                    >
                        <RemoveCircleIcon color="error" />
                    </IconButton>
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
                    <FormControl sx={{ width: '60%' }}>
                        <FormLabel>Description</FormLabel>
                        <TextareaAutosize
                          placeholder="Enter skeleton here...."
                          minRows={10}
                          value={st.solutionSkeleton ?? ''}
                          name="description"
                          onChange={(e) => onSkeletonChange(e.target.value, st.id)}
                        />
                    </FormControl>
                </FormGroup>
            ))
        }
                        <FormGroup sx={{ display: 'flex', width: '100%' }}>
                            {isEditMode
                                ? (
                                    <>
                                        <Button size="large" sx={{ width: '20%', alignSelf: 'center' }} onClick={() => updateProblem(currentProblem)} variant="contained">Edit</Button>
                                        <DeleteButton
                                          id={problemId!}
                                          name={currentProblem.name}
                                          style={{ alignSelf: 'flex-end' }}
                                          onSuccess={(() => navigate('/administration-new/problems'))}
                                          text="Are you sure you want to delete this problem."
                                          mutation={useDeleteProblemMutation}
                                        />
                                    </>
                                )
                                : <Button size="large" sx={{ width: '20%', alignSelf: 'center' }} variant="contained">Create</Button>}

                        </FormGroup>

                    </form>
                </>
            )
    );
};

export default ProblemForm;
