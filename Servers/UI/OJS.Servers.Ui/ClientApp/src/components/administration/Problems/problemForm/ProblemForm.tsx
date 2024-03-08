/* eslint-disable css-modules/no-unused-class */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Autocomplete, Button, Divider, FormControl, FormGroup, MenuItem, TextField, Typography } from '@mui/material';

import { ContestVariation } from '../../../../common/contest-types';
import { SUBMISSION_TYPES, TESTS } from '../../../../common/labels';
import { IProblemAdministration, IProblemSubmissionType, ISubmissionTypeInProblem } from '../../../../common/types';
import { PROBLEMS_PATH } from '../../../../common/urls';
import { useCreateProblemMutation, useDeleteProblemMutation, useGetProblemByIdQuery, useUpdateProblemMutation } from '../../../../redux/services/admin/problemsAdminService';
import { useGetForProblemQuery } from '../../../../redux/services/admin/submissionTypesAdminService';
import { getAndSetExceptionMessage, getAndSetSuccesfullMessages } from '../../../../utils/messages-utils';
import { renderErrorMessagesAlert, renderSuccessfullAlert } from '../../../../utils/render-utils';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';
import DeleteButton from '../../common/delete/DeleteButton';
import FileUpload from '../../common/file-upload/FileUpload';
import ProblemSubmissionTypes from '../problem-submission-types/ProblemSubmissionTypes';

import ProblemFormBasicInfo from './problem-form-basic-info.tsx/ProblemFormBasicInfo';

import formStyles from '../../common/styles/FormStyles.module.scss';

interface IProblemFormProps {
    problemId: number | null;

    isEditMode?: boolean;

    contestId: number | null;
}

const defaultMaxPoints = 100;
const defaultMemoryLimit = 16777216;
const defaultTimeLimit = 100;
const defaultSourceCodeSizeLimit = 16384;

const ProblemForm = (props: IProblemFormProps) => {
    const { problemId, isEditMode = true, contestId } = props;
    const navigate = useNavigate();

    const [ filteredSubmissionTypes, setFilteredSubmissionTypes ] = useState<Array<ISubmissionTypeInProblem>>([]);
    const [ currentProblem, setCurrentProblem ] = useState<IProblemAdministration>({
        checkerId: '1',
        contestId: contestId ?? -1,
        id: 0,
        maximumPoints: defaultMaxPoints,
        memoryLimit: defaultMemoryLimit,
        name: '',
        orderBy: 0,
        problemGroupType: 'None',
        showDetailedFeedback: false,
        showResults: false,
        sourceCodeSizeLimit: defaultSourceCodeSizeLimit,
        submissionTypes: [],
        timeLimit: defaultTimeLimit,
        tests: null,
        contestType: ContestVariation.Exercise,
        problemGroupOrderBy: -1,
    });

    const [ errorMessages, setErrorMessages ] = useState<Array<string>>([]);
    const [ successMessages, setSuccessMessages ] = useState<string | null>(null);

    const {
        data: problemData,
        isLoading: isGettingData,
        error: gettingDataError,
    } = useGetProblemByIdQuery({ id: Number(problemId) }, { skip: problemId === null });

    const { data: submissionTypes } = useGetForProblemQuery(null);

    const [ updateProblem, { data: updateData, error: updateError, isSuccess: isSuccessfullyUpdated } ] = useUpdateProblemMutation();
    const [ createProblem, { data: createData, error: createError, isSuccess: isSuccessfullyCreated } ] = useCreateProblemMutation();

    useEffect(() => {
        if (submissionTypes) {
            setFilteredSubmissionTypes(submissionTypes.filter((st) => !problemData?.submissionTypes.some((x) => x.id === st.id)));
        }
    }, [ problemData?.submissionTypes, submissionTypes ]);

    useEffect(() => {
        if (problemData) {
            setCurrentProblem(problemData);
        }
    }, [ problemData ]);

    useEffect(() => {
        getAndSetExceptionMessage([ gettingDataError, createError, updateError ], setErrorMessages);
        setSuccessMessages('');
    }, [ updateError, createError, gettingDataError ]);

    useEffect(() => {
        let successMessage: string | null = '';
        successMessage = getAndSetSuccesfullMessages([
            {
                message: updateData,
                shouldGet: isSuccessfullyUpdated,
            },
            {
                message: createData,
                shouldGet: isSuccessfullyCreated,
            },
        ]);
        setSuccessMessages(successMessage);
    }, [ updateData, createData, isSuccessfullyUpdated, isSuccessfullyCreated ]);

    const onChange = (e: any) => {
        const { target } = e;
        const { name, type, value, checked } = target;
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

    const submitForm = () => {
        const formData = new FormData();
        formData.append('name', currentProblem.name);
        formData.append('id', currentProblem.id?.toString() ?? '');
        formData.append('orderBy', currentProblem.orderBy?.toString() || '');
        formData.append('contestId', currentProblem.contestId?.toString() || '');
        formData.append('maximumPoints', currentProblem.maximumPoints?.toString() || '');
        formData.append('memoryLimit', currentProblem.memoryLimit?.toString() || '');
        formData.append('sourceCodeSizeLimit', currentProblem.sourceCodeSizeLimit?.toString() || '');
        formData.append('timeLimit', currentProblem.timeLimit?.toString() || '');
        formData.append('problemGroupType', currentProblem.problemGroupType?.toString());
        formData.append('checkerId', currentProblem.checkerId?.toString() || '');
        formData.append('showDetailedFeedback', currentProblem.showDetailedFeedback?.toString() || '');
        formData.append('showResults', currentProblem.showResults?.toString() || '');
        formData.append('problemGroupOrderBy', currentProblem.problemGroupOrderBy?.toString() || '');
        currentProblem.submissionTypes?.forEach((type, index) => {
            formData.append(`SubmissionTypes[${index}].Id`, type.id.toString());
            formData.append(`SubmissionTypes[${index}].Name`, type.name.toString());

            if (type.solutionSkeleton) {
                formData.append(
                    `SubmissionTypes[${index}].SolutionSkeleton`,
                    type?.solutionSkeleton!.toString(),
                );
            }
        });
        if (currentProblem.tests) {
            formData.append('tests', currentProblem.tests);
        }

        if (isEditMode) {
            updateProblem(formData);
        } else {
            createProblem(formData);
        }
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

    const handleFileUpload = (e: any) => {
        let { tests } = currentProblem;
        tests = e.target.files[0];
        setCurrentProblem((prevState) => ({
            ...prevState,
            tests,
        }));
    };

    const handleFileClearance = () => {
        let { tests } = currentProblem;
        tests = null;
        setCurrentProblem((prevState) => ({
            ...prevState,
            tests,
        }));
    };

    const renderButtons = () => (
        <FormGroup sx={{ display: 'flex', width: '100%' }}>
            {isEditMode
                ? (
                    <>
                        <Button
                          size="large"
                          sx={{ width: '20%', alignSelf: 'center' }}
                          onClick={() => submitForm()}
                          variant="contained"
                        >
                            Edit
                        </Button>
                        <DeleteButton
                          id={problemId!}
                          name={currentProblem.name}
                          style={{ alignSelf: 'flex-end' }}
                          onSuccess={(() => navigate(`${PROBLEMS_PATH}`))}
                          text="Are you sure you want to delete this problem."
                          mutation={useDeleteProblemMutation}
                        />
                    </>
                )
                : (
                    <Button
                      onClick={() => submitForm()}
                      size="large"
                      sx={{ width: '20%', alignSelf: 'center' }}
                      variant="contained"
                    >
                        Create
                    </Button>
                )}

        </FormGroup>
    );

    if (isGettingData) {
        return <SpinningLoader />;
    }
    return (
        <>
            {renderErrorMessagesAlert(errorMessages)}
            {renderSuccessfullAlert(successMessages)}

            <Typography className={formStyles.centralize} variant="h3">{currentProblem?.name}</Typography>
            <form className={formStyles.form}>
                <ProblemFormBasicInfo currentProblem={currentProblem} onChange={onChange} />
                <FormGroup className={formStyles.row}>
                    {!isEditMode && (
                        <>
                            <Typography className={formStyles.spacing} variant="h4">{TESTS}</Typography>
                            <Divider className={formStyles.inputRow} />
                            <FileUpload
                              handleFileUpload={handleFileUpload}
                              propName="tests"
                              setSkipDownload={() => {}}
                              uploadButtonName={currentProblem.tests?.name}
                              showDownloadButton={false}
                              disableClearButton={!currentProblem.tests}
                              onClearSelectionClicked={handleFileClearance}
                              buttonLabel={TESTS}
                            />
                        </>
                    )}
                </FormGroup>
                <FormGroup className={formStyles.inputRow}>
                    <Typography className={formStyles.dividerLabel} variant="h4">{SUBMISSION_TYPES}</Typography>
                    <Divider className={formStyles.inputRow} />
                    <FormControl className={formStyles.row}>
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
                </FormGroup>
                {
            currentProblem?.submissionTypes.map((st : IProblemSubmissionType) => (
                <ProblemSubmissionTypes
                  key={st.id}
                  onSkeletonChange={onSkeletonChange}
                  onStrategyRemoved={onStrategyRemoved}
                  strategy={st}
                />
            ))
        }
                {renderButtons()}

            </form>
        </>
    );
};

export default ProblemForm;
