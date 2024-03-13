/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, Box, Button, FormControl, MenuItem, TextField, Typography } from '@mui/material';
import debounce from 'lodash/debounce';

import {
    ExceptionData,
    IExamGroupAdministration,
    IUserAutocomplete,
} from '../../../../common/types';
import {
    useAddUserInExamGroupByIdMutation,
    useDeleteExamGroupMutation,
    useGetExamGroupByIdQuery,
} from '../../../../redux/services/admin/examGroupsAdminService';
import { useGetUsersForDropdownQuery } from '../../../../redux/services/admin/usersAdminService';
import isNilOrEmpty from '../../../../utils/check-utils';
import { Alert, AlertHorizontalOrientation, AlertSeverity, AlertVariant, AlertVerticalOrientation } from '../../../guidelines/alert/Alert';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';
import DeleteButton from '../../common/delete/DeleteButton';

import styles from './AddUserInGroupModal.module.scss';

interface IAddUserInExamGroupProps {
    examGroupId: number;
}

interface IAddUserInExamGroupUrlParams {
    groupId: number;
    userId: string;
}

const AddUserInGroupModal = (props:IAddUserInExamGroupProps) => {
    const { examGroupId } = props;

    const navigate = useNavigate();
    const [ errorMessages, setErrorMessages ] = useState<Array<ExceptionData>>([]);
    const [ successMessage, setSuccessMessage ] = useState<string | null>(null);
    const [ isValidForm, setIsValidForm ] = useState<boolean>(false);
    const [ userId, setUserId ] = useState<string>('');
    const [ userSearchString, setUserSearchString ] = useState<string>('');
    const [ addUserInGroupUrlParams, setAddUserInGroupUrlParams ] = useState<IAddUserInExamGroupUrlParams>({
        groupId: examGroupId,
        userId,
    });
    const [ examGroup, setExamGroup ] = useState<IExamGroupAdministration>({
        id: 0,
        name: '',
        contest: '',
        contestId: 0,
        externalAppId: '',
        externalExamGroupId: 0,
    });

    const { data, isFetching, isLoading } = useGetExamGroupByIdQuery({ id: Number(examGroupId) });
    const { data: usersForDropdown } = useGetUsersForDropdownQuery(userSearchString);

    const [
        addUserToExamGroup, {
            data: createData,
            isSuccess: isSuccessfullyAdded,
            error: createError,
            isLoading: isCreating,
        } ] = useAddUserInExamGroupByIdMutation();

    useEffect(
        () => {
            if (data) {
                setExamGroup(data);
            }
        },
        [ data ],
    );

    useEffect(() => {
        setErrorMessages([]);
        if (isSuccessfullyAdded) {
            setSuccessMessage(createData as string);
            setErrorMessages([]);
        }
    }, [ createData, isSuccessfullyAdded ]);

    useEffect(() => {
        if (createError && !isSuccessfullyAdded) {
            setSuccessMessage(null);
            setErrorMessages(createError as Array<ExceptionData>);
        } else {
            setErrorMessages([]);
        }
    }, [ createError, isSuccessfullyAdded ]);

    const handleAutocompleteChange = (user: IUserAutocomplete) => {
        const selectedUser = usersForDropdown?.find((u) => u.id === user.id);
        if (selectedUser) {
            setIsValidForm(true);
            setUserId(user.id);
            setAddUserInGroupUrlParams({ ...addUserInGroupUrlParams, userId: selectedUser.id });
        }
        setIsValidForm(false);
    };

    const handleOnInputChange = debounce((e: any) => {
        setUserSearchString(e.target.value);
    }, 300);

    const create = () => {
        if (isValidForm || userId !== null) {
            addUserToExamGroup(addUserInGroupUrlParams);
        }
    };

    return (
        !data || isFetching || isLoading || isCreating
            ? <SpinningLoader />
            : (
                <div className={`${styles.flex}`}>
                    {errorMessages.map((x, i) => (
                        <Alert
                          key={x.name}
                          variant={AlertVariant.Filled}
                          vertical={AlertVerticalOrientation.Top}
                          horizontal={AlertHorizontalOrientation.Right}
                          severity={AlertSeverity.Error}
                          message={x.message}
                          styles={{ marginTop: `${i * 4}rem` }}
                        />
                    ))}
                    {successMessage && (
                        <Alert
                          variant={AlertVariant.Filled}
                          autoHideDuration={3000}
                          vertical={AlertVerticalOrientation.Top}
                          horizontal={AlertHorizontalOrientation.Right}
                          severity={AlertSeverity.Success}
                          message={successMessage}
                        />
                    )}
                    <Typography className={styles.centralize} variant="h4">
                        Add new user in exam group
                    </Typography>
                    <form className={`${styles.form}`}>
                        <TextField
                          className={styles.inputRow}
                          label="Exam group"
                          variant="standard"
                          name="examgroup"
                          value={examGroup.name}
                        />
                        <FormControl className={styles.textArea} sx={{ margin: '20px 0' }}>
                            <Autocomplete
                              sx={{ width: '100%' }}
                              className={styles.inputRow}
                              options={usersForDropdown!}
                              renderInput={(params) => <TextField {...params} label="User" key={params.id} />}
                              onChange={(event, newValue) => handleAutocompleteChange(newValue!)}
                              onInputChange={(event) => handleOnInputChange(event)}
                              value={null}
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              getOptionLabel={(option) => option?.userName}
                              renderOption={(properties, option) => (
                                  <MenuItem {...properties} key={option.id} value={option.id}>
                                      {option.userName}
                                  </MenuItem>
                              )}
                            />
                        </FormControl>
                    </form>
                    <div className={styles.buttonsWrapper}>
                        <Button
                          variant="contained"
                          onClick={() => create()}
                          className={styles.button}
                          disabled={isNilOrEmpty(addUserInGroupUrlParams.userId)}
                        >
                            Add
                        </Button>
                    </div>
                    <Box sx={{ alignSelf: 'flex-end' }}>
                        <DeleteButton
                          id={Number(userId!)}
                          name={userId}
                          onSuccess={() => navigate(`/administration-new/examGroups/${examGroupId}`)}
                          mutation={useDeleteExamGroupMutation}
                          text="Are you sure that you want to delete the user from exam group?"
                        />
                    </Box>
                </div>
            )
    );
};

export default AddUserInGroupModal;
