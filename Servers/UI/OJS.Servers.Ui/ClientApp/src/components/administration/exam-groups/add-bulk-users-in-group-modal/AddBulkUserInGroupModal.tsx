import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';

import {
    ExceptionData,
    IExamGroupAdministration,
} from '../../../../common/types';
import {
    useAddBulkUsersInExamGroupByIdMutation,
    useGetExamGroupByIdQuery,
} from '../../../../redux/services/admin/examGroupsAdminService';
import isNilOrEmpty from '../../../../utils/check-utils';
import { Alert, AlertHorizontalOrientation, AlertSeverity, AlertVariant, AlertVerticalOrientation } from '../../../guidelines/alert/Alert';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';

// eslint-disable-next-line css-modules/no-unused-class
import styles from './AddBulkUsersInGroupModal.module.scss';

interface IAddUsersInExamGroupProps {
    examGroupId: number;
}

interface IAddUserInExamGroupUrlParams {
    examGroupId: number;
    userNamesText: string;
}

const AddBulkUsersInGroupModal = (props:IAddUsersInExamGroupProps) => {
    const { examGroupId } = props;

    const [ errorMessages, setErrorMessages ] = useState<Array<ExceptionData>>([]);
    const [ successMessage, setSuccessMessage ] = useState<string | null>(null);
    const [ isValidForm, setIsValidForm ] = useState<boolean>(false);
    const [ addBulkUsersInGroupUrlParams, setAddBulkUsersInGroupUrlParams ] = useState<IAddUserInExamGroupUrlParams>({
        examGroupId,
        userNamesText: '',
    });
    const [ examGroup, setExamGroup ] = useState<IExamGroupAdministration>({
        id: 0,
        name: '',
        contestName: '',
        contestId: 0,
        externalAppId: '',
        externalExamGroupId: 0,
    });

    const { data, isFetching, isLoading } = useGetExamGroupByIdQuery({ id: Number(examGroupId) });

    const [
        addBulkUsersInExamGroup, {
            data: addingData,
            isSuccess: isSuccessfullyAdded,
            error: addingError,
            isLoading: isAdding,
        } ] = useAddBulkUsersInExamGroupByIdMutation();

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
            setSuccessMessage(addingData as string);
            setErrorMessages([]);
        }
    }, [ addingData, isSuccessfullyAdded ]);

    useEffect(() => {
        if (addingError && !isSuccessfullyAdded) {
            setSuccessMessage(null);
            setErrorMessages(addingError as Array<ExceptionData>);
        } else {
            setErrorMessages([]);
        }
    }, [ addingError, isSuccessfullyAdded ]);

    const add = () => {
        if (isValidForm) {
            addBulkUsersInExamGroup(addBulkUsersInGroupUrlParams);
        }
    };

    const onChange = (e: any) => {
        /* eslint-disable prefer-destructuring */
        const { value } = e.target;

        const usernames = value;
        setIsValidForm(!isNilOrEmpty(usernames));
        setAddBulkUsersInGroupUrlParams((prevState) => ({
            ...prevState,
            examGroupId,
            userNamesText: usernames,
        }));
    };

    return (
        !data || isFetching || isLoading || isAdding
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
                        Add multiple users in exam group
                    </Typography>
                    <form className={`${styles.form}`}>
                        <TextField
                          className={styles.inputRow}
                          label="Exam group"
                          variant="standard"
                          name="examgroup"
                          value={examGroup.name}
                        />
                        <TextField
                          className={styles.multilineTextFiled}
                          label="Add users"
                          variant="filled"
                          name="usernames"
                          onChange={(e) => onChange(e)}
                          multiline
                          rows={15}
                        />
                    </form>
                    <div className={styles.buttonsWrapper}>
                        <Button
                          variant="contained"
                          onClick={() => add()}
                          className={styles.button}
                          disabled={!isValidForm}
                        >
                            Add
                        </Button>
                    </div>
                </div>
            )
    );
};

export default AddBulkUsersInGroupModal;
