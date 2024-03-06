import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, MenuItem, TextField, Typography } from '@mui/material';

import {
    ExceptionData,
    IContestCategories,
    IContestCategoryAdministration,
} from '../../../../common/types';
import { CONTEST_CATEGORIES_PATH } from '../../../../common/urls';
import {
    useCreateContestCategoryMutation,
    useDeleteContestCategoryMutation,
    useGetCategoriesQuery,
    useGetContestCategoryByIdQuery, useUpdateContestCategoryByIdMutation,
} from '../../../../redux/services/admin/contestCategoriesAdminService';
import { Alert, AlertHorizontalOrientation, AlertSeverity, AlertVariant, AlertVerticalOrientation } from '../../../guidelines/alert/Alert';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';
import DeleteButton from '../../common/buttons/delete/DeleteButton';

import styles from './CategoryEdit.module.scss';

interface IContestCategoryEditProps {
    contestCategoryId: number | null;
    isEditMode?: boolean;
}

const initialState : IContestCategoryAdministration = {
    id: 0,
    name: '',
    parent: '',
    parentId: 0,
    isDeleted: false,
    isVisible: false,
    orderBy: 0,
    deletedOn: null,
    modifiedOn: null,
};

const ContestCategoryEdit = (props:IContestCategoryEditProps) => {
    const { contestCategoryId, isEditMode = true } = props;

    const navigate = useNavigate();
    const [ errorMessages, setErrorMessages ] = useState<Array<ExceptionData>>([]);
    const [ successMessage, setSuccessMessage ] = useState<string | null>(null);
    const [ isValidForm, setIsValidForm ] = useState<boolean>(!!isEditMode);

    const [ contestCategory, setContestCategory ] = useState<IContestCategoryAdministration>(initialState);

    const [ contestCategoryValidations, setContestCategoryValidations ] = useState({
        isNameTouched: false,
        isNameValid: !!isEditMode,
        isOrderByTouched: false,
        isOrderByValid: true,
    });

    const { data, isFetching, isLoading } = useGetContestCategoryByIdQuery({ id: Number(contestCategoryId) }, { skip: !isEditMode });
    const { isFetching: isGettingCategories, data: contestCategories } = useGetCategoriesQuery(null);

    const [
        updateContestCategory, {
            data: updateData,
            isLoading: isUpdating,
            isSuccess:
                isSuccesfullyUpdated,
            error: updateError,
        } ] = useUpdateContestCategoryByIdMutation();

    const [
        createContestCategory, {
            data: createData,
            isSuccess: isSuccesfullyCreated,
            error: createError,
            isLoading: isCreating,
        } ] = useCreateContestCategoryMutation();

    useEffect(
        () => {
            if (data) {
                setContestCategory(data);
            }
        },
        [ data ],
    );

    useEffect(() => {
        setErrorMessages([]);
        if (isSuccesfullyUpdated) {
            setSuccessMessage(updateData as string);
            setErrorMessages([]);
        }
        if (isSuccesfullyCreated) {
            setSuccessMessage(createData as string);
            setErrorMessages([]);
        }
    }, [ createData, isSuccesfullyCreated, isSuccesfullyUpdated, updateData ]);

    useEffect(() => {
        if (updateError && !isSuccesfullyUpdated) {
            setSuccessMessage(null);
            setErrorMessages(updateError as Array<ExceptionData>);
        } else if (createError && !isSuccesfullyCreated) {
            setSuccessMessage(null);
            setErrorMessages(createError as Array<ExceptionData>);
        } else {
            setErrorMessages([]);
        }
    }, [ createError, isSuccesfullyCreated, isSuccesfullyUpdated, updateError ]);

    const validateForm = () => {
        const isValid = contestCategoryValidations.isNameValid &&
            contestCategoryValidations.isOrderByValid;

        setIsValidForm(isValid);
    };

    const onChange = (e: any) => {
        const { name, value, checked } = e.target;
        let {
            name: contestCategoryName,
            parentId,
            parent,
            isVisible,
            orderBy,
        } = contestCategory;
        const contestCategoryValidations1 = contestCategoryValidations;
        // eslint-disable-next-line default-case
        switch (name) {
        case 'name':
            contestCategoryName = value;
            contestCategoryValidations1.isNameTouched = true;
            contestCategoryValidations1.isNameValid = true;
            if (value.length < 2 || value.length > 100) {
                contestCategoryValidations1.isNameValid = false;
            }
            break;
        case 'orderBy':
            contestCategoryValidations1.isOrderByTouched = true;
            contestCategoryValidations1.isOrderByValid = true;
            orderBy = value;
            if (value < 0) {
                contestCategoryValidations1.isOrderByValid = false;
            }
            break;
        case 'isVisible':
            isVisible = checked;
            break;
        case 'parent': {
            const category = contestCategories?.find((cc) => cc.id === value);
            if (category) {
                const { id, name: parentName } = category;
                parentId = id;
                parent = parentName;
            }
            break;
        }
        }
        setContestCategoryValidations(contestCategoryValidations1);
        setContestCategory((prevState) => ({
            ...prevState,
            name: contestCategoryName,
            parent,
            parentId,
            isVisible,
            orderBy,
        }));
        validateForm();
    };

    const handleAutocompleteChange = (name: string, newValue:IContestCategories) => {
        const event = {
            target: {
                name,
                value: newValue?.id,
            },
        };
        onChange(event);
    };

    const edit = () => {
        if (isValidForm) {
            updateContestCategory(contestCategory);
        }
    };

    const create = () => {
        if (isValidForm) {
            createContestCategory(contestCategory);
        }
    };

    return (
        isFetching || isLoading || isGettingCategories || isCreating || isUpdating
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
                        {isEditMode
                            ? contestCategory.name
                            : 'Contest Category form'}
                    </Typography>
                    <form className={`${styles.form}`}>
                        <Box>
                            <TextField
                              className={styles.inputRow}
                              label="Name"
                              variant="standard"
                              name="name"
                              onChange={(e) => onChange(e)}
                              value={contestCategory.name}
                              color={contestCategoryValidations.isNameValid && contestCategoryValidations.isNameTouched
                                  ? 'success'
                                  : 'primary'}
                              error={(contestCategoryValidations.isNameTouched && !contestCategoryValidations.isNameValid)}
                                    // eslint-disable-next-line max-len
                              helperText={(contestCategoryValidations.isNameTouched && !contestCategoryValidations.isNameValid) && 'Category name length must be between 2 and 100 characters long'}
                            />
                            <TextField
                              className={styles.inputRow}
                              type="number"
                              label="Order By"
                              variant="standard"
                              value={contestCategory.orderBy}
                              onChange={(e) => onChange(e)}
                              InputLabelProps={{ shrink: true }}
                              name="orderBy"
                              color={contestCategoryValidations.isOrderByValid && contestCategoryValidations.isOrderByTouched
                                  ? 'success'
                                  : 'primary'}
                              error={(contestCategoryValidations.isOrderByTouched && !contestCategoryValidations.isOrderByValid)}
                                    // eslint-disable-next-line max-len
                              helperText={(contestCategoryValidations.isOrderByTouched && !contestCategoryValidations.isOrderByValid) && 'Order by cannot be less than 0'}
                            />
                            <FormControlLabel
                              sx={{ marginTop: '1rem' }}
                              control={<Checkbox checked={contestCategory.isVisible} />}
                              label="IsVisible"
                              name="isVisible"
                              onChange={(e) => onChange(e)}
                            />
                            <FormControl className={styles.textArea} sx={{ margin: '15px 0' }}>
                                <Autocomplete
                                  sx={{ width: '100%' }}
                                  className={styles.inputRow}
                                  onChange={(event, newValue) => handleAutocompleteChange('parent', newValue!)}
                                  value={contestCategories?.find((category) => category.id === contestCategory.parentId) ?? null}
                                  options={contestCategories!}
                                  renderInput={(params) => <TextField {...params} label="Parent Category" key={params.id} />}
                                  getOptionLabel={(option) => option?.name}
                                  renderOption={(properties, option) => (
                                      <MenuItem {...properties} key={option.id} value={option.id}>
                                          {option.name}
                                      </MenuItem>
                                  )}
                                />
                            </FormControl>
                        </Box>
                    </form>
                    {isEditMode
                        ? (
                            <div className={styles.buttonsWrapper}>
                                <Button
                                  variant="contained"
                                  onClick={() => edit()}
                                  className={styles.button}
                                  disabled={!isValidForm}
                                >
                                    Edit
                                </Button>
                            </div>
                        )
                        : (
                            <div className={styles.buttonsWrapper}>
                                <Button
                                  variant="contained"
                                  onClick={() => create()}
                                  className={styles.button}
                                  disabled={!isValidForm}
                                >
                                    Create
                                </Button>
                            </div>
                        )}
                    <Box sx={{ alignSelf: 'flex-end' }}>
                        <DeleteButton
                          id={Number(contestCategoryId!)}
                          name={contestCategory.name}
                          onSuccess={() => navigate(`${CONTEST_CATEGORIES_PATH}`)}
                          mutation={useDeleteContestCategoryMutation}
                          text="Are you sure that you want to delete the contest category?"
                        />
                    </Box>
                </div>
            )
    );
};

export default ContestCategoryEdit;
