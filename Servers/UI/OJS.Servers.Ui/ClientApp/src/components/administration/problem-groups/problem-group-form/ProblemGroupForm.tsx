import React, { useEffect, useState } from 'react';
import { Autocomplete, debounce, FormControl, FormGroup, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import isNaN from 'lodash/isNaN';

import { ProblemGroupTypes } from '../../../../common/enums';
import { CREATE, EDIT, ID, ORDER_BY, TYPE } from '../../../../common/labels';
import { IContestAutocomplete } from '../../../../common/types';
import { useGetCopyAllQuery } from '../../../../redux/services/admin/contestsAdminService';
import { useCreateProblemGroupMutation, useGetProblemGroupByIdQuery, useUpdateProblemGroupMutation } from '../../../../redux/services/admin/problemGroupsAdminService';
import { getAndSetExceptionMessage, getAndSetSuccesfullMessages } from '../../../../utils/messages-utils';
import { renderErrorMessagesAlert, renderSuccessfullAlert } from '../../../../utils/render-utils';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';
import FormActionButton from '../../form-action-button/FormActionButton';
import { IProblemGroupAdministrationModel } from '../types';

// The classes are used in multiple files. But not all of them are used in single file
// eslint-disable-next-line css-modules/no-unused-class
import formStyles from '../../common/styles/FormStyles.module.scss';

interface IProblemFormProps {
    id?:number;
    isEditMode?: boolean;
}

const ProblemGroupForm = (props: IProblemFormProps) => {
    const { id = null, isEditMode = true } = props;
    const [ currentProblemGroup, setCurrentProblemGroup ] = useState<IProblemGroupAdministrationModel>({
        id: 0,
        orderBy: 0,
        type: '',
        contest: {
            id: 0,
            name: '',
        } as IContestAutocomplete,
    });
    const [ contestsData, setContestsData ] = useState <Array<IContestAutocomplete>>([]);
    const [ contestSearchString, setContestSearchString ] = useState<string>('');
    const [ errorMessages, setErrorMessages ] = useState<Array<string>>([]);
    const [ successMessages, setSuccessMessages ] = useState<string>('');

    const { data: contestsAutocompleteData, error: getContestDataError } = useGetCopyAllQuery(contestSearchString);
    const {
        data: problemGroupData,
        error: getProblemGroupError,
        isLoading: isGettingProblemGroupData,
    } = useGetProblemGroupByIdQuery(id!, { skip: !isEditMode || !id });
    const [
        updateProblemGroup,
        {
            data: updateData,
            error: updateError,
            isLoading: isUpdating,
            isSuccess: isSuccessfullyUpdated,
        } ] = useUpdateProblemGroupMutation();

    const [
        createProblemGroup,
        {
            data: createData,
            isLoading: isCreating,
            error: createError,
            isSuccess: isSuccessfullyCreated,
        } ] = useCreateProblemGroupMutation();

    useEffect(() => {
        if (contestsAutocompleteData) {
            if (problemGroupData) {
                const actualContestData = [ problemGroupData?.contest ] as Array<IContestAutocomplete>;
                setContestsData(contestsAutocompleteData.concat(actualContestData));
            }
            setContestsData(contestsAutocompleteData);
        }
    }, [ contestsAutocompleteData, problemGroupData ]);

    useEffect(() => {
        if (problemGroupData) {
            setCurrentProblemGroup(problemGroupData);
        }
    }, [ problemGroupData ]);

    useEffect(() => {
        const successMessage = getAndSetSuccesfullMessages([
            {
                message: updateData,
                shouldGet: isSuccessfullyUpdated,
            },
            {
                message: createData,
                shouldGet: isSuccessfullyCreated,
            },
        ]);

        if (successMessage) {
            setSuccessMessages(successMessage);
        }
    }, [ updateData, createData, isSuccessfullyUpdated, isSuccessfullyCreated ]);

    useEffect(() => {
        getAndSetExceptionMessage([ getContestDataError, createError, updateError, getProblemGroupError ], setErrorMessages);
        setSuccessMessages('');
    }, [ updateError, createError, getContestDataError, getProblemGroupError ]);

    const onAutocompleteChange = debounce((e: any) => {
        if (!e) {
            return;
        }
        setContestSearchString(e.target.value || '');
    }, 300);

    const onChange = (e: any) => {
        const { target } = e;
        const { name, type, value, checked } = target;
        setCurrentProblemGroup((prevState) => ({
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

    const onSelect = (contest: IContestAutocomplete) => {
        setCurrentProblemGroup((prevState) => ({
            ...prevState,
            contest,
        }));
    };

    const renderFormSubmitButtons = () => (
        isEditMode
            ? (
                <FormActionButton
                  className={formStyles.buttonsWrapper}
                  buttonClassName={formStyles.button}
                  onClick={() => updateProblemGroup(currentProblemGroup)}
                  name={EDIT}
                />
            )
            : (
                <FormActionButton
                  className={formStyles.buttonsWrapper}
                  buttonClassName={formStyles.button}
                  onClick={() => createProblemGroup(currentProblemGroup)}
                  name={CREATE}
                />
            )
    );

    if (isGettingProblemGroupData || isUpdating || isCreating) {
        return <SpinningLoader />;
    }

    return (
        <>
            {renderErrorMessagesAlert(errorMessages)}
            {renderSuccessfullAlert(successMessages)}
            <form className={formStyles.form}>
                <Typography variant="h4" className="centralize">
                    Problem Group Administration Form
                </Typography>
                <FormControl className={formStyles.inputRow}>
                    <TextField
                      variant="standard"
                      label={ID}
                      value={currentProblemGroup?.id}
                      InputLabelProps={{ shrink: true }}
                      type="text"
                      disabled
                    />
                </FormControl>
                <FormControl className={formStyles.inputRow}>
                    <TextField
                      variant="standard"
                      label={ORDER_BY}
                      value={currentProblemGroup?.orderBy}
                      InputLabelProps={{ shrink: true }}
                      type="number"
                      name="orderBy"
                      onChange={(e) => onChange(e)}
                    />
                </FormControl>
                <FormGroup className={formStyles.inputRow}>
                    <InputLabel id="problemGroupType">{TYPE}</InputLabel>
                    <Select
                      onChange={(e) => onChange(e)}
                      onBlur={(e) => onChange(e)}
                      labelId="problemGroupType"
                      value={currentProblemGroup.type || 'None'}
                      name="type"
                    >
                        {Object.keys(ProblemGroupTypes).filter((key) => isNaN(Number(key))).map((key) => (
                            <MenuItem key={key} value={key}>
                                {key}
                            </MenuItem>
                        ))}
                    </Select>
                </FormGroup>
                <FormControl className={formStyles.inputRow}>
                    <Autocomplete
                      options={contestsData!}
                      renderInput={(params) => <TextField {...params} label="Select Contest" key={params.id} />}
                      onChange={(event, newValue) => onSelect(newValue!)}
                      onInputChange={(event) => onAutocompleteChange(event)}
                      value={currentProblemGroup.contest.id
                          ? currentProblemGroup.contest
                          : null}
                      isOptionEqualToValue={(option, value) => option.id === value.id && option.name === value.name}
                      getOptionLabel={(option) => option?.name}
                      renderOption={(properties, option) => (
                          <MenuItem {...properties} key={option.id} value={option.id}>
                              {option.name}
                          </MenuItem>
                      )}
                    />
                </FormControl>
                {renderFormSubmitButtons()}
            </form>
        </>

    );
};

export default ProblemGroupForm;
