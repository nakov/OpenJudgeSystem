/* eslint-disable css-modules/no-unused-class */
import React, { useEffect, useState } from 'react';
import { Divider, FormControl, TextField, Typography } from '@mui/material';

import { CREATE, EDIT, FILE_EXTENSION, ID, LINK, NAME, ORDER_BY, PROBLEM } from '../../../../common/labels';
import { IProblemResourceAdministrationModel } from '../../../../common/types';
import { useCreateProblemResourceMutation, useDownloadResourceQuery, useGetProblemResourceByIdQuery, useUpdateProblemResourceMutation } from '../../../../redux/services/admin/problemResourcesAdminService';
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
        problemName: '',
        type: '',
        fileExtension: '',
        file: null,
        hasFile: false,
    });
    const [ skipDownload, setSkipDownload ] = useState<boolean>(true);

    const { data: resourceData, error: resourceError, isSuccess: isSuccessfullyGetted } = useGetProblemResourceByIdQuery(id);
    const [ create, { data: createData, error: createErrorData, isSuccess: isSuccessfullyCreated } ] = useCreateProblemResourceMutation();
    const [ update, { data: updateData, error: updateErrorData, isSuccess: isSuccessfullyUpdated } ] = useUpdateProblemResourceMutation();
    const {
        data: downloadData,
        isLoading: isDownloadingFiles,
        isSuccess: isSuccesfullyDownloaded,
        error: downloadError,
        isError: isDownloadError,
    } = useDownloadResourceQuery(Number(id), { skip: skipDownload });

    useEffect(() => {
        if (resourceData) {
            setCurrentResource(resourceData);
        }
    }, [ resourceData ]);

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

    const renderFormSubmitButtons = () => (
        isEditMode
            ? (
                <FormActionButton
                  className={formStyles.buttonsWrapper}
                  buttonClassName={formStyles.button}
                  onClick={() => update(currentResource)}
                  name={EDIT}
                />
            )
            : (
                <FormActionButton
                  className={formStyles.buttonsWrapper}
                  buttonClassName={formStyles.button}
                  onClick={() => create(currentResource)}
                  name={CREATE}
                />
            )
    );

    return (
        <form className={formStyles.form}>
            <Typography variant="h4" className="centralize">
                Problem Resource Administration Form
            </Typography>
            <FormControl sx={{ margin: '0.5rem 0', width: '92%', alignSelf: 'center' }}>
                <TextField
                  variant="standard"
                  label={ID}
                  value={currentResource?.id}
                  InputLabelProps={{ shrink: true }}
                  type="text"
                  disabled
                />
            </FormControl>
            <FormControl sx={{ margin: '0.5rem 0', width: '92%', alignSelf: 'center' }}>
                <TextField
                  variant="standard"
                  label={NAME}
                  value={currentResource?.name}
                  InputLabelProps={{ shrink: true }}
                  type="text"
                />
            </FormControl>
            ......
            <FormControl sx={{ margin: '0.5rem 0', width: '92%', alignSelf: 'center' }}>
                <TextField
                  variant="standard"
                  label={FILE_EXTENSION}
                  value={currentResource.fileExtension}
                  InputLabelProps={{ shrink: true }}
                  type="text"
                />
            </FormControl>
            <FormControl sx={{ margin: '0.5rem 0', width: '92%', alignSelf: 'center' }}>
                <TextField
                  variant="standard"
                  label={LINK}
                  value={currentResource.link}
                  InputLabelProps={{ shrink: true }}
                  type="text"
                />
            </FormControl>
            <FormControl sx={{ margin: '0.5rem 0', width: '92%', alignSelf: 'center' }}>
                <TextField
                  variant="standard"
                  label={ORDER_BY}
                  value={currentResource.orderBy}
                  InputLabelProps={{ shrink: true }}
                  type="text"
                />
            </FormControl>
            <FormControl sx={{ margin: '0.5rem 0', width: '92%', alignSelf: 'center' }}>
                <TextField
                  variant="standard"
                  label={PROBLEM}
                  value={currentResource.problemName}
                  InputLabelProps={{ shrink: true }}
                  type="text"
                  disabled
                />
            </FormControl>
            <FormControl sx={{ margin: '0.5rem 0', width: '92%', alignSelf: 'center' }}>
                <Typography variant="h4">File</Typography>
                <Divider />
                <FileUpload
                  handleFileUpload={handleFileUpload}
                  propName="additionalFiles"
                  setSkipDownload={setSkipDownload}
                  uploadButtonName={currentResource.file?.name}
                  showDownloadButton={currentResource.hasFile}
                  onClearSelectionClicked={handleFileClearance}
                  disableClearButton={currentResource.file === null}
                />
            </FormControl>
            {renderFormSubmitButtons()}
        </form>
    );
};
export default ProblemResourceForm;
