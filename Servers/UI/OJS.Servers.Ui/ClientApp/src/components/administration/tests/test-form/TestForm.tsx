import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Autocomplete, Box, Checkbox, debounce, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, MenuItem, Select, TextareaAutosize, TextField, Typography } from '@mui/material';
import isNaN from 'lodash/isNaN';

import { CREATE, EDIT, HIDE_INPUT, ID, INPUT, ORDER_BY, OUTPUT, RECORD, SELECT_PROBLEM, TYPE } from '../../../../common/labels';
import { DELETE_CONFIRMATION_MESSAGE } from '../../../../common/messages';
import { ITestsDropdownData } from '../../../../common/types';
import { NEW_ADMINISTRATION_PATH, TESTS_PATH } from '../../../../common/urls/administration-urls';
import { useGetAllByNameQuery } from '../../../../redux/services/admin/problemsAdminService';
import { useCreateTestMutation, useDeleteTestMutation, useGetTestByIdQuery, useUpdateTestMutation } from '../../../../redux/services/admin/testsAdminService';
import { getAndSetExceptionMessage, getAndSetSuccesfullMessages } from '../../../../utils/messages-utils';
import { renderErrorMessagesAlert, renderSuccessfullAlert } from '../../../../utils/render-utils';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';
import DeleteButton from '../../common/delete/DeleteButton';
import FormActionButton from '../../form-action-button/FormActionButton';
import { ITestAdministration, TestTypes } from '../types';

// eslint-disable-next-line css-modules/no-unused-class
import formStyles from '../../common/styles/FormStyles.module.scss';

interface ITestFormProps {
    id?:number;
    isEditMode?: boolean;
}
const TestForm = (props: ITestFormProps) => {
    const { id = 0, isEditMode = true } = props;

    const navigate = useNavigate();
    const [ exceptionMessages, setExceptionMessages ] = useState<Array<string>>([]);
    const [ successfullMessage, setSuccessfullMessage ] = useState<string | null>(null);
    const [ searchString, setSearchString ] = useState<string>('');
    const [ dropdownData, setDropdownData ] = useState<Array<ITestsDropdownData>>([]);
    const [ test, setTest ] = useState<ITestAdministration>({
        id,
        input: '',
        output: '',
        orderBy: 0,
        retestProblem: false,
        type: Object.keys(TestTypes).filter((key) => isNaN(Number(key)))[0],
        hideInput: false,
        problemId: id,
        problemName: '',
    });

    const { data: testData, error: getTestError, isLoading: isGettingData } = useGetTestByIdQuery(id, { skip: !isEditMode });
    const { data: dropdownDataResponse, error: dropdownError } = useGetAllByNameQuery(searchString);
    const [
        editTest,
        { data: editData, error: editError, isLoading: isEditing, isSuccess: isSuccessfullyEdited },
    ] = useUpdateTestMutation();
    const [
        createTest,
        { data: createData, error: createError, isLoading: isCreating, isSuccess: isSuccessfullyCreated },
    ] = useCreateTestMutation();

    useEffect(() => {
        if (testData) {
            setTest(testData);
        }
    }, [ testData ]);

    useEffect(() => {
        getAndSetExceptionMessage([ getTestError, dropdownError, editError, createError ], setExceptionMessages);
    }, [ getTestError, dropdownError, editError, createError ]);

    useEffect(() => {
        const message = getAndSetSuccesfullMessages([
            { message: editData, shouldGet: isSuccessfullyEdited },
            { message: createData, shouldGet: isSuccessfullyCreated },
        ]);
        setSuccessfullMessage(message);
    }, [ editData, createData, isSuccessfullyEdited, isSuccessfullyCreated ]);

    useEffect(() => {
        if (dropdownDataResponse) {
            setDropdownData(dropdownDataResponse);
        }
    }, [ dropdownDataResponse ]);

    const onChange = (e: any) => {
        const { target } = e;
        const { name, type, value, checked } = target;
        setTest((prevState) => ({
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

    const handleAutocompleteChange = (problem: ITestsDropdownData | null) => {
        if (problem) {
            setTest((prevState) => ({
                ...prevState,
                problemId: problem.id,
                problemName: problem.name,
            }));
        }
    };

    const onSearchStringChange = debounce((value:string) => {
        setSearchString(value);
    }, 500);

    const renderFormSubmitButtons = () => (
        isEditMode
            ? (
                <>
                    <FormActionButton
                      className={formStyles.buttonsWrapper}
                      buttonClassName={formStyles.button}
                      onClick={() => editTest(test)}
                      name={EDIT}
                    />
                    <Box sx={{ alignSelf: 'flex-end' }}>
                        <DeleteButton
                          id={Number(id!)}
                          name={RECORD}
                          onSuccess={() => navigate(`/${NEW_ADMINISTRATION_PATH}/${TESTS_PATH}`)}
                          mutation={useDeleteTestMutation}
                          text={DELETE_CONFIRMATION_MESSAGE}
                        />
                    </Box>
                </>
            )
            : (
                <FormActionButton
                  className={formStyles.buttonsWrapper}
                  buttonClassName={formStyles.button}
                  onClick={() => createTest(test)}
                  name={CREATE}
                />
            )
    );

    if (isGettingData || isEditing || isCreating) {
        return <SpinningLoader />;
    }

    return (
        <>
            {renderSuccessfullAlert(successfullMessage)}
            {renderErrorMessagesAlert(exceptionMessages)}
            <Typography className={formStyles.centralize} variant="h4">Test administration form</Typography>
            <form className={formStyles.form}>
                <Box className={formStyles.inputRow}>
                    <FormGroup className={formStyles.inputRow}>
                        <FormControl className={formStyles.spacing}>
                            <TextField
                              variant="standard"
                              label={ID}
                              value={test?.id}
                              InputLabelProps={{ shrink: true }}
                              type="text"
                              disabled
                            />
                        </FormControl>
                        <FormControl className={formStyles.spacing}>
                            <Autocomplete
                              sx={{ width: '100%' }}
                              className={formStyles.inputRow}
                              onChange={(event, problem) => handleAutocompleteChange(problem)}
                              onInputChange={(event, value) => onSearchStringChange(value)}
                              value={dropdownData?.find((dropdDown) => dropdDown.id === test.problemId) ?? null}
                              options={dropdownData!}
                              renderInput={(params) => <TextField {...params} label={SELECT_PROBLEM} key={params.id} />}
                              getOptionLabel={(option) => option?.name}
                              renderOption={(properties, option) => (
                                  <MenuItem {...properties} key={option.id} value={option.id}>
                                      {option.name}
                                  </MenuItem>
                              )}
                            />
                        </FormControl>
                        <FormControl className={formStyles.spacing}>
                            <FormLabel>{INPUT}</FormLabel>
                            <TextareaAutosize
                              minRows={15}
                              value={test.input}
                              name="input"
                              onChange={(e) => onChange(e)}
                            />
                        </FormControl>
                        <FormControl className={formStyles.spacing}>
                            <FormLabel>{OUTPUT}</FormLabel>
                            <TextareaAutosize
                              minRows={15}
                              value={test.output}
                              name="output"
                              onChange={(e) => onChange(e)}
                            />
                        </FormControl>
                        <FormControl className={formStyles.spacing}>
                            <TextField
                              variant="standard"
                              label={ORDER_BY}
                              value={test?.orderBy}
                              InputLabelProps={{ shrink: true }}
                              type="number"
                              name="orderBy"
                              onChange={(e) => onChange(e)}
                            />
                        </FormControl>
                        <FormControl
                          className={formStyles.spacing}
                        >
                            <InputLabel id="test-type">{TYPE}</InputLabel>
                            <Select
                              sx={{ width: '100%' }}
                              variant="standard"
                              value={test.type}
                              name="type"
                              labelId="test-type"
                              onChange={(e) => onChange(e)}
                              onBlur={(e) => onChange(e)}
                            >
                                {Object.keys(TestTypes).filter((key) => isNaN(Number(key))).map((key) => (
                                    <MenuItem key={key} value={key}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {isEditMode && (
                        <FormControl className={formStyles.spacing}>
                            <FormControlLabel
                              control={<Checkbox checked={test.retestProblem ?? false} />}
                              label="Retest Problem"
                              name="retestProblem"
                              onChange={(e) => onChange(e)}
                            />
                        </FormControl>
                        )}
                        <FormControl className={formStyles.spacing}>
                            <FormControlLabel
                              control={<Checkbox checked={test.hideInput} />}
                              label={HIDE_INPUT}
                              name="hideInput"
                              onChange={(e) => onChange(e)}
                            />
                        </FormControl>
                    </FormGroup>
                </Box>
                {renderFormSubmitButtons()}
            </form>
        </>
    );
};
export default TestForm;
