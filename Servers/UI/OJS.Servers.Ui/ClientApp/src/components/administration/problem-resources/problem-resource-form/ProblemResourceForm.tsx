/* eslint-disable react/no-array-index-key */
/* eslint-disable css-modules/no-unused-class */
import React, { useEffect, useState } from 'react';
import { Divider, FormControl, FormGroup, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import isNaN from 'lodash/isNaN';

import { ProblemResourceType } from '../../../../common/enums';
import { CREATE, EDIT, FILE_EXTENSION, ID, LINK, NAME, ORDER_BY, TYPE } from '../../../../common/labels';
import { IProblemResourceAdministrationModel } from '../../../../common/types';
import { useCreateProblemResourceMutation, useDownloadResourceQuery, useGetProblemResourceByIdQuery, useUpdateProblemResourceMutation } from '../../../../redux/services/admin/problemResourcesAdminService';
import downloadFile from '../../../../utils/file-download-utils';
import { getAndSetExceptionMessage, getAndSetSuccesfullMessages } from '../../../../utils/messages-utils';
import { renderErrorMessagesAlert, renderSuccessfullAlert } from '../../../../utils/render-utils';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';
import FileUpload from '../../common/file-upload/FileUpload';
import FormActionButton from '../../form-action-button/FormActionButton';

import formStyles from '../../common/styles/FormStyles.module.scss';

interface IProblemResourceFormProps {
    id: number;
    isEditMode?: boolean;
}
const ProblemResourceForm = (props :IProblemResourceFormProps) => {
    const { id, isEditMode = true } = props;

    const [ currentResource, setCurrentResource ] = useState<IProblemResourceAdministrationModel>({
        id: 0,
        link: '',
        name: '',
        orderBy: 0,
        type: '',
        fileExtension: '',
        file: null,
        hasFile: false,
    });
    const [ skipDownload, setSkipDownload ] = useState<boolean>(true);
    const [ exceptionMessages, setExceptionMessages ] = useState<Array<string>>([]);
    const [ successMessage, setSuccessMessages ] = useState<string | null>(null);

    const { data: resourceData, error: resourceError, isLoading: isGetting } = useGetProblemResourceByIdQuery(id);
    const [
        create,
        {
            data: createData,
            error: createErrorData,
            isSuccess: isSuccessfullyCreated,
            isLoading: isCreating,
        },
    ] = useCreateProblemResourceMutation();

    const [
        update,
        {
            data: updateData,
            error: updateErrorData,
            isSuccess: isSuccessfullyUpdated,
            isLoading: isUpdating,
        } ] = useUpdateProblemResourceMutation();

    const {
        data: downloadData,
        isLoading: isDownloadingFiles,
        error: downloadError,
    } = useDownloadResourceQuery(Number(id), { skip: skipDownload });

    useEffect(() => {
        if (resourceData) {
            setCurrentResource(resourceData);
        }
    }, [ resourceData ]);

    useEffect(() => {
        getAndSetExceptionMessage([ downloadError, createErrorData, updateErrorData, resourceError ], setExceptionMessages);
    }, [ createErrorData, downloadError, resourceError, updateErrorData ]);

    useEffect(() => {
        const message = getAndSetSuccesfullMessages([
            { message: createData, shouldGet: isSuccessfullyCreated },
            { message: updateData, shouldGet: isSuccessfullyUpdated },
        ]);

        setSuccessMessages(message);
    }, [ createData, isSuccessfullyCreated, isSuccessfullyUpdated, updateData ]);

    useEffect(() => {
        if (downloadData?.blob) {
            downloadFile(downloadData.blob, downloadData.filename);
        }
    }, [ downloadData ]);

    const handleFileUpload = (e: any) => {
        let { file } = currentResource;
        file = e.target.files[0];
        setCurrentResource((prevState) => ({
            ...prevState,
            file,
        }));
    };

    const handleFileClearance = () => {
        let { file } = currentResource;
        file = null;
        setCurrentResource((prevState) => ({
            ...prevState,
            file,
        }));
    };
    const onChange = (e: any) => {
        const { target } = e;
        const { name, type, value, checked } = target;
        setCurrentResource((prevState) => ({
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
        formData.append('name', currentResource.name);
        formData.append('id', currentResource.id?.toString() ?? '');
        formData.append('orderBy', currentResource.orderBy?.toString() || '');
        formData.append('link', currentResource.link);
        formData.append('fileExtension', currentResource.fileExtension);
        formData.append('type', currentResource.type);

        if (currentResource.file) {
            formData.append('file', currentResource.file);
        }
        if (isEditMode) {
            update(formData);
        } else {
            create(formData);
        }
    };

    const renderFormSubmitButtons = () => (
        isEditMode
            ? (
                <FormActionButton
                  className={formStyles.buttonsWrapper}
                  buttonClassName={formStyles.button}
                  onClick={() => submitForm()}
                  name={EDIT}
                />
            )
            : (
                <FormActionButton
                  className={formStyles.buttonsWrapper}
                  buttonClassName={formStyles.button}
                  onClick={() => submitForm()}
                  name={CREATE}
                />
            )
    );

    if (isDownloadingFiles || isUpdating || isCreating || isGetting) {
        return <SpinningLoader />;
    }

    return (
        <>
            {renderSuccessfullAlert(successMessage)}
            {renderErrorMessagesAlert(exceptionMessages)}
            <form className={formStyles.form}>
                <Typography variant="h4" className="centralize">
                    Problem Resource Administration Form
                </Typography>
                <FormControl sx={{ margin: '0.5rem 0', width: '92%', alignSelf: 'center' }}>
                    <TextField
                      variant="standard"
                      label={ID}
                      value={id}
                      InputLabelProps={{ shrink: true }}
                      type="text"
                      disabled
                    />
                </FormControl>
                <FormControl sx={{ margin: '0.5rem 0', width: '92%', alignSelf: 'center' }}>
                    <TextField
                      variant="standard"
                      label={NAME}
                      name="name"
                      value={currentResource?.name}
                      InputLabelProps={{ shrink: true }}
                      type="text"
                      onChange={(e) => onChange(e)}
                    />
                </FormControl>
                <FormGroup sx={{ margin: '0.5rem 0', width: '92%', alignSelf: 'center' }}>
                    <InputLabel id="problemGroupType">{TYPE}</InputLabel>
                    <Select
                      onChange={(e) => onChange(e)}
                      onBlur={(e) => onChange(e)}
                      labelId="problemGroupType"
                      value={currentResource.type || 'None'}
                      name="type"
                    >
                        {Object.keys(ProblemResourceType).filter((key) => isNaN(Number(key))).map((key, i: number) => (
                            <MenuItem key={i} value={key}>
                                {key}
                            </MenuItem>
                        ))}
                    </Select>
                </FormGroup>
                <FormControl sx={{ margin: '0.5rem 0', width: '92%', alignSelf: 'center' }}>
                    <TextField
                      variant="standard"
                      label={FILE_EXTENSION}
                      value={currentResource.fileExtension}
                      name="fileExtension"
                      InputLabelProps={{ shrink: true }}
                      type="text"
                      onChange={(e) => onChange(e)}
                    />
                </FormControl>
                <FormControl sx={{ margin: '0.5rem 0', width: '92%', alignSelf: 'center' }}>
                    <TextField
                      variant="standard"
                      label={LINK}
                      value={currentResource.link}
                      InputLabelProps={{ shrink: true }}
                      type="text"
                      name="link"
                      onChange={(e) => onChange(e)}
                    />
                </FormControl>
                <FormControl sx={{ margin: '0.5rem 0', width: '92%', alignSelf: 'center' }}>
                    <TextField
                      variant="standard"
                      label={ORDER_BY}
                      value={currentResource.orderBy}
                      InputLabelProps={{ shrink: true }}
                      type="text"
                      name="orderBy"
                      onChange={(e) => onChange(e)}
                    />
                </FormControl>
                <FormControl sx={{ margin: '0.5rem 0', width: '92%', alignSelf: 'center' }}>
                    <Typography variant="h4">File</Typography>
                    <Divider />
                    <FileUpload
                      handleFileUpload={handleFileUpload}
                      propName="file"
                      setSkipDownload={setSkipDownload}
                      uploadButtonName={currentResource.file?.name}
                      showDownloadButton={currentResource.hasFile}
                      onClearSelectionClicked={handleFileClearance}
                      disableClearButton={currentResource.file === null}
                    />
                </FormControl>
                {renderFormSubmitButtons()}
            </form>
        </>
    );
};
export default ProblemResourceForm;
