import { useEffect, useState } from 'react';
import { FormControl, TextField, Typography } from '@mui/material';

import { ID, NAME } from '../../../../common/labels';
import { IRoleAdministrationModel } from '../../../../common/types';
import { useCreateRoleMutation, useGetRoleByIdQuery, useUpdateRoleMutation } from '../../../../redux/services/admin/rolesAdminService';
import { getAndSetExceptionMessage, getAndSetSuccesfullMessages } from '../../../../utils/messages-utils';
import { renderErrorMessagesAlert, renderSuccessfullAlert } from '../../../../utils/render-utils';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';
import AdministrationFormButtons from '../../common/administration-form-buttons/AdministrationFormButtons';

// eslint-disable-next-line css-modules/no-unused-class
import formStyles from '../../common/styles/FormStyles.module.scss';

interface IRoleFormProps {
    id?: string | null;
    isEditMode?: boolean;
}

const RoleForm = (props: IRoleFormProps) => {
    const { id, isEditMode = true } = props;
    const [ exceptionMessages, setExceptionMessages ] = useState<Array<string>>([]);
    const [ successfullMessage, setSuccessfullMessage ] = useState<string | null>(null);

    const [ role, setRole ] = useState<IRoleAdministrationModel>({
        id: null,
        name: '',
    });

    const {
        data: roleData,
        error: getError,
        isLoading: isGettingRole,
    } = useGetRoleByIdQuery(id!, { skip: !isEditMode });

    const [
        create,
        {
            data: createData,
            isSuccess: isSuccessfullyCreated,
            error: createError,
            isLoading: isCreating,
        },
    ] = useCreateRoleMutation();

    const [
        update,
        {
            data: updateData,
            isSuccess: isSuccessfullyUpdated,
            error: updateError,
            isLoading: isUpdating,
        },
    ] = useUpdateRoleMutation();

    useEffect(() => {
        if (roleData) {
            setRole(roleData);
        }
    }, [ roleData ]);

    useEffect(() => {
        getAndSetExceptionMessage([ getError, updateError, createError ], setExceptionMessages);
    }, [ getError, updateError, createError ]);

    useEffect(() => {
        const message = getAndSetSuccesfullMessages([
            { message: createData, shouldGet: isSuccessfullyCreated },
            { message: updateData, shouldGet: isSuccessfullyUpdated },
        ]);

        setSuccessfullMessage(message);
    }, [ createData, isSuccessfullyCreated, isSuccessfullyUpdated, updateData ]);

    const onChange = (e: any) => {
        const { target } = e;
        const { name, value } = target;
        setRole((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    if (isGettingRole || isCreating || isUpdating) {
        return <SpinningLoader />;
    }

    return (
        <>
            {renderSuccessfullAlert(successfullMessage)}
            {renderErrorMessagesAlert(exceptionMessages)}
            <Typography className={formStyles.centralize} variant="h4">Role administration form</Typography>
            <form className={formStyles.form}>
                {isEditMode && (
                <FormControl className={formStyles.inputRow}>
                    <TextField
                      variant="standard"
                      label={ID}
                      value={role?.id ?? ''}
                      InputLabelProps={{ shrink: true }}
                      type="text"
                      disabled
                    />
                </FormControl>
                )}

                <FormControl className={formStyles.inputRow}>
                    <TextField
                      variant="standard"
                      label={NAME}
                      value={role?.name ?? ''}
                      InputLabelProps={{ shrink: true }}
                      type="text"
                      name="name"
                      onChange={(e) => onChange(e)}
                    />
                </FormControl>
                <AdministrationFormButtons
                  isEditMode={isEditMode}
                  onCreateClick={() => create(role)}
                  onEditClick={() => update(role)}
                />
            </form>
        </>
    );
};
export default RoleForm;
