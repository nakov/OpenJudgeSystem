/* eslint-disable @typescript-eslint/ban-types */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, FormControl, TextField, Typography } from '@mui/material';

import { CREATE, EDIT, ID, NAME, RECORD } from '../../../../common/labels';
import { DELETE_CONFIRMATION_MESSAGE } from '../../../../common/messages';
import { IRoleAdministrationModel } from '../../../../common/types';
import { NEW_ADMINISTRATION_PATH, ROLES_PATH } from '../../../../common/urls/administration-urls';
import { useCreateRoleMutation, useDeleteRolesMutation, useGetRoleByIdQuery, useUpdateRoleMutation } from '../../../../redux/services/admin/rolesAdminService';
import { getAndSetExceptionMessage, getAndSetSuccesfullMessages } from '../../../../utils/messages-utils';
import { renderErrorMessagesAlert, renderSuccessfullAlert } from '../../../../utils/render-utils';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';
import DeleteButton from '../../common/delete/DeleteButton';
import FormActionButton from '../../form-action-button/FormActionButton';

// eslint-disable-next-line css-modules/no-unused-class
import formStyles from '../../common/styles/FormStyles.module.scss';

interface IRoleFormProps {
    id?: string | null;
    isEditMode?: boolean;
    getRoleName?: Function;
}

const RoleForm = (props: IRoleFormProps) => {
    const { id, isEditMode = true, getRoleName } = props;
    const navigate = useNavigate();
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
            if (getRoleName) {
                getRoleName(roleData.name);
            }
        }
    }, [ getRoleName, roleData ]);

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

    const renderFormSubmitButtons = () => (
        isEditMode
            ? (
                <>
                    <FormActionButton
                      className={formStyles.buttonsWrapper}
                      buttonClassName={formStyles.button}
                      onClick={() => update(role)}
                      name={EDIT}
                    />
                    <Box sx={{ alignSelf: 'flex-end' }}>
                        <DeleteButton
                          id={Number(id!)}
                          name={RECORD}
                          onSuccess={() => navigate(`/${NEW_ADMINISTRATION_PATH}/${ROLES_PATH}`)}
                          mutation={useDeleteRolesMutation}
                          text={DELETE_CONFIRMATION_MESSAGE}
                        />
                    </Box>
                </>
            )
            : (
                <FormActionButton
                  className={formStyles.buttonsWrapper}
                  buttonClassName={formStyles.button}
                  onClick={() => create(role)}
                  name={CREATE}
                />
            )
    );

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
                {renderFormSubmitButtons()}
            </form>
        </>
    );
};
export default RoleForm;
